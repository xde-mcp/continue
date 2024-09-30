import { RangeInFileWithContents } from "../commands/util.js";
import { TabAutocompleteOptions } from "../index.js";

import {
  countTokens,
  pruneLinesFromBottom,
  pruneLinesFromTop,
} from "../llm/countTokens.js";
import { shouldCompleteMultiline } from "./classifyMultiline.js";
import { AutocompleteLanguageInfo } from "./languages.js";
import { RecentlyEditedRange } from "./recentlyEdited.js";
import { retrieveAutocompleteSnippets } from "./retrieval/index.js";
import { shouldConsiderSnippet } from "./retrieval/shouldConsiderSnippet.js";
import { ImportDefinitionsService } from "./services/ImportDefinitionsService.js";
import { RootPathContextService } from "./services/RootPathContextService.js";
import { calculateRootPathToCursor } from "./util/ast.js";
import {
  fillPromptWithSnippets,
  rankSnippets,
  removeRangeFromSnippets,
  type AutocompleteSnippet,
} from "./util/ranking.js";

export async function constructAutocompletePrompt(
  filepath: string,
  cursorLine: number,
  fullPrefix: string,
  fullSuffix: string,
  clipboardText: string,
  language: AutocompleteLanguageInfo,
  options: TabAutocompleteOptions,
  recentlyEditedRanges: RecentlyEditedRange[],
  recentlyEditedFiles: RangeInFileWithContents[],
  modelName: string,
  extraSnippets: AutocompleteSnippet[],
  importDefinitionsService: ImportDefinitionsService,
  rootPathContextService: RootPathContextService,
): Promise<{
  prefix: string;
  suffix: string;
  useFim: boolean;
  completeMultiline: boolean;
  snippets: AutocompleteSnippet[];
}> {
  // Construct basic prefix
  const maxPrefixTokens = options.maxPromptTokens * options.prefixPercentage;
  const prefix = pruneLinesFromTop(fullPrefix, maxPrefixTokens, modelName);

  // Construct suffix
  const maxSuffixTokens = Math.min(
    options.maxPromptTokens - countTokens(prefix, modelName),
    options.maxSuffixPercentage * options.maxPromptTokens,
  );
  const suffix = pruneLinesFromBottom(fullSuffix, maxSuffixTokens, modelName);

  // Calculate AST Root Path
  const treePath = await calculateRootPathToCursor(
    filepath,
    fullPrefix + fullSuffix,
    fullPrefix.length,
  );

  let snippets: AutocompleteSnippet[] = [];

  if (options.useOtherFiles) {
    // Find external snippets
    snippets.push(...extraSnippets);
    snippets = await retrieveAutocompleteSnippets(
      filepath,
      prefix,
      fullPrefix,
      fullSuffix,
      options,
      language,
      treePath,
      recentlyEditedRanges,
      importDefinitionsService,
      rootPathContextService,
    );

    // Filter out empty snippets and ones that are already in the prefix/suffix
    snippets = snippets
      .map((snippet) => ({ ...snippet }))
      .filter((s) => shouldConsiderSnippet(s, prefix, suffix));

    // Rank / order the snippets
    // Window around cursor used for comparison
    const windowAroundCursor =
      fullPrefix.slice(
        -options.slidingWindowSize * options.slidingWindowPrefixPercentage,
      ) +
      fullSuffix.slice(
        options.slidingWindowSize * (1 - options.slidingWindowPrefixPercentage),
      );
    const scoredSnippets = rankSnippets(snippets, windowAroundCursor);

    // Fill maxSnippetTokens with snippets
    const maxSnippetTokens =
      options.maxPromptTokens * options.maxSnippetPercentage;

    // Remove prefix range from snippets
    const prefixLines = prefix.split("\n").length;
    const suffixLines = suffix.split("\n").length;
    const buffer = 8;
    const prefixSuffixRangeWithBuffer = {
      start: {
        line: cursorLine - prefixLines - buffer,
        character: 0,
      },
      end: {
        line: cursorLine + suffixLines + buffer,
        character: 0,
      },
    };
    let finalSnippets = removeRangeFromSnippets(
      scoredSnippets,
      filepath.split("://").slice(-1)[0],
      prefixSuffixRangeWithBuffer,
    );

    // Filter snippets for those with best scores (must be above threshold)
    finalSnippets = finalSnippets.filter(
      (snippet) => snippet.score >= options.recentlyEditedSimilarityThreshold,
    );
    finalSnippets = fillPromptWithSnippets(
      scoredSnippets,
      maxSnippetTokens,
      modelName,
    );

    snippets = finalSnippets;
  }

  return {
    prefix,
    suffix,
    useFim: true,
    completeMultiline: await shouldCompleteMultiline(
      treePath,
      fullPrefix,
      fullSuffix,
      language,
    ),
    snippets,
  };
}
