import { TabAutocompleteOptions } from "../..";
import { AutocompleteLanguageInfo } from "../languages";
import { findMatchingRange, RecentlyEditedRange } from "../recentlyEdited";
import { ImportDefinitionsService } from "../services/ImportDefinitionsService";
import { RootPathContextService } from "../services/RootPathContextService";
import { AstPath } from "../util/ast";
import { AutocompleteSnippet, getSymbolsForSnippet } from "../util/ranking";

export async function retrieveAutocompleteSnippets(
  filepath: string,
  prefix: string,
  fullPrefix: string,
  fullSuffix: string,
  options: TabAutocompleteOptions,
  language: AutocompleteLanguageInfo,
  treePath: AstPath | undefined,
  recentlyEditedRanges: RecentlyEditedRange[],
  importDefinitionsService: ImportDefinitionsService,
  rootPathContextService: RootPathContextService,
): Promise<AutocompleteSnippet[]> {
  let snippets: AutocompleteSnippet[] = [];

  // This was much too slow, and not super useful
  // const slidingWindowMatches = await slidingWindowMatcher(
  //   recentlyEditedFiles,
  //   windowAroundCursor,
  //   3,
  //   options.slidingWindowSize,
  // );
  // snippets.push(...slidingWindowMatches);

  // snippets.push(
  //   ...recentlyEditedRanges.map((r) => ({
  //     ...r,
  //     contents: r.lines.join("\n"),
  //   })),
  // );

  if (options.useRecentlyEdited) {
    const currentLinePrefix = prefix.trim().split("\n").slice(-1)[0];
    if (currentLinePrefix?.length > options.recentLinePrefixMatchMinLength) {
      const matchingRange = findMatchingRange(
        recentlyEditedRanges,
        currentLinePrefix,
      );
      if (matchingRange) {
        snippets.push({
          ...matchingRange,
          contents: matchingRange.lines.join("\n"),
          score: 0.8,
        });
      }
    }
  }

  // Use imports
  if (options.useImports) {
    const importSnippets = [];
    const fileInfo = importDefinitionsService.get(filepath);
    if (fileInfo) {
      const { imports } = fileInfo;
      // Look for imports of any symbols around the current range
      const textAroundCursor =
        fullPrefix.split("\n").slice(-5).join("\n") +
        fullSuffix.split("\n").slice(0, 3).join("\n");
      const symbols = Array.from(getSymbolsForSnippet(textAroundCursor)).filter(
        (symbol) => !language.topLevelKeywords.includes(symbol),
      );
      for (const symbol of symbols) {
        const rifs = imports[symbol];
        if (Array.isArray(rifs)) {
          importSnippets.push(...rifs);
        }
      }
    }
    snippets.push(...importSnippets);
  }

  if (options.useHierarchicalContext && treePath) {
    const ctx = await rootPathContextService.getContextForPath(
      filepath,
      treePath,
    );
    snippets.push(...ctx);
  }

  return snippets;
}
