export const DOUBLE_NEWLINE = "\n\n";
export const WINDOWS_DOUBLE_NEWLINE = "\r\n\r\n";
export const SRC_DIRECTORY = "/src/";
// Starcoder2 tends to output artifacts starting with the letter "t"
export const STARCODER2_T_ARTIFACTS = ["t.", "\nt", "<file_sep>"];
export const PYTHON_ENCODING = "#- coding: utf-8";
export const CODE_BLOCK_END = "```";

export const multilineStops: string[] = [
  DOUBLE_NEWLINE,
  WINDOWS_DOUBLE_NEWLINE,
];
export const commonStops = [SRC_DIRECTORY, PYTHON_ENCODING, CODE_BLOCK_END];

// Errors that can be expected on occasion even during normal functioning should not be shown.
// Not worth disrupting the user to tell them that a single autocomplete request didn't go through
export const ERRORS_TO_IGNORE = [
  // From Ollama
  "unexpected server status",
];
