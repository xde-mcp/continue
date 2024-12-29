import { LLMSpec } from "../types.js";

const TEXT_ONLY_SUPPORT: Partial<LLMSpec> = {
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

const TEXT_AND_IMAGE_SUPPORT: Partial<LLMSpec> = {};
