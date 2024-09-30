import { AutocompleteSnippet } from "../util/ranking";

export function shouldConsiderSnippet(
  snippet: AutocompleteSnippet,
  filePrefix: string,
  fileSuffix: string,
): boolean {
  return (
    snippet.contents.trim() !== "" &&
    !(filePrefix + fileSuffix).includes(snippet.contents.trim())
  );
}
