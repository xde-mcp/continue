import { ModelProvider } from "../types.js";
import { openAiProvider } from "./openai.js";

export const allProviders: Record<string, ModelProvider> = {
  openai: openAiProvider,
};
