import { LLMSpec, ModelCreator } from "../types.js";

export const anthropicAiCreator: ModelCreator = {
  displayName: "Anthropic",
  extensionIconPath: "anthropic.png",
  description: "Use gpt-4, gpt-3.5-turbo, or any other OpenAI model",
  // docsUrl
  // homeUrl
  // remoteIconUrl
};

export const claude3_5SonnetLatest: LLMSpec = {
  displayName: "Claude 3.5 Sonnet",
  description:
    "Most intelligent model with the highest level of intelligence and capability.",
  creator: anthropicAiCreator,

  //       model: "claude-3-5-sonnet-latest",
  recommendedRoles: ["chat"],

  homeUrl: "",
  docsUrl: "",
  downloadUrl: "",
  isFree: false,
  isOpenSource: false,
  supportsFim: false,

  contextLength: 200_000,
  defaultCompletionOptions: {
    maxTokens: 8192,
  },
  defaultRequestOptions: {},

  supportsStreaming: false,

  supportsPrediction: false,
  supportsPrefill: false,
  supportsCompletions: false,

  supportsTextInput: false,
  supportsTextOutput: false,
  supportsVideoInput: false,
  supportsVideoOutput: false,
  supportsAudioInput: false,
  supportsAudioOutput: false,
  supportsImageInput: false,
  supportsImageOutput: false,
  supportsTools: false,

  extensionIconPath: anthropicAiCreator.extensionIconPath,
  remoteIconUrl: "",
};
