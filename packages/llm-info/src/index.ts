// import { Anthropic } from "./providers/anthropic.js";
// import { Azure } from "./providers/azure.js";
// import { Bedrock } from "./providers/bedrock.js";
// import { Cohere } from "./providers/cohere.js";
// import { Gemini } from "./providers/gemini.js";
// import { Mistral } from "./providers/mistral.js";
// import { Ollama } from "./providers/ollama.js";
// import { OpenAi } from "./providers/openai.js";
// import { Vllm } from "./providers/vllm.js";
// import { Voyage } from "./providers/voyage.js";
// import { xAI } from "./providers/xAI.js";
// import { LLMInfo, ModelProvider } from "./types.js";

import { allProviders } from "./providers/index.js";
import { LLMSpec } from "./types.js";

// export const allModelProviders: ModelProvider[] = [
//   OpenAi,
//   Gemini,
//   Anthropic,
//   Mistral,
//   Voyage,
//   Azure,
//   Ollama,
//   Vllm,
//   Bedrock,
//   Cohere,
//   xAI,
// ];

function findProviderLlmSpec(
  providerId: string,
  providerModelName: string,
): LLMSpec | undefined {
  return allProviders[providerId]?.models.find(
    (providerLlm) => providerLlm.model === providerModelName,
  );
}

export { findProviderLlmSpec, allProviders };
