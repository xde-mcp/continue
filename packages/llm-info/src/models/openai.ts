import { LLMSpec, ModelCreator } from "../types.js";

const openAiIconPath = "openai.png";

export const openAiCreator: ModelCreator = {
  displayName: "OpenAI",
  extensionIconPath: "openai.png",
  description: "Use gpt-4, gpt-3.5-turbo, or any other OpenAI model",
  // docsUrl
  // homeUrl
  // remoteIconUrl
};

export const gtp3_5Turbo: LLMSpec = {
  creator: openAiCreator,
  displayName: "GPT-4o",
  description: "",
  extensionIconPath: openAiIconPath,
  remoteIconUrl: "",

  //
  homeUrl: "",
  docsUrl: "",
  downloadUrl: "",
  isFree: false,
  isOpenSource: false,
  supportsFim: false,
  isReasoningModel: false,
  isReasoningExposed: false,

  recommendedRoles: ["chat"],

  //
  contextLength: 128_000,
  defaultCompletionOptions: {
    maxTokens: 4096,
  },
  defaultRequestOptions: {},

  supportsStreaming: true,

  supportsPrediction: true,
  supportsPrefill: false,
  supportsCompletions: false,
  supportsTools: false,
  supportsTextInput: false,
  supportsTextOutput: false,
  supportsVideoInput: false,
  supportsVideoOutput: false,
  supportsAudioInput: false,
  supportsAudioOutput: false,
  supportsImageInput: false,
  supportsImageOutput: false,
};

export const gpt4o: LLMSpec = {
  creator: openAiCreator,
  displayName: "GPT-4o",
  description: "",
  extensionIconPath: openAiIconPath,
  remoteIconUrl: "",

  //
  homeUrl: "",
  docsUrl: "",
  downloadUrl: "",
  isFree: false,
  isOpenSource: false,
  supportsFim: false,
  isReasoningModel: false,
  isReasoningExposed: false,

  recommendedRoles: ["chat"],

  //
  contextLength: 128_000,
  defaultCompletionOptions: {
    maxTokens: 4096,
  },
  defaultRequestOptions: {},

  supportsStreaming: true,

  supportsPrediction: true,
  supportsPrefill: false,
  supportsCompletions: false,
  supportsTools: false,
  supportsTextInput: false,
  supportsTextOutput: false,
  supportsVideoInput: false,
  supportsVideoOutput: false,
  supportsAudioInput: false,
  supportsAudioOutput: false,
  supportsImageInput: false,
  supportsImageOutput: false,
};
