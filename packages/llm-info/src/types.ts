import z from "zod";

export const modelCreatorSchema = z.object({
  displayName: z.string(),
  description: z.string().optional(),
  homeUrl: z.string().url().optional(),
  docsUrl: z.string().url().optional(),
  extensionIconPath: z.string(), // for icons stored in extension resources
  remoteIconUrl: z.string().url().optional(), // Backup if no icon in resources
});
export type ModelCreator = z.infer<typeof modelCreatorSchema>;

// TODO ///////////////////////////////////////////////////
// Duplicates of in config-yaml package
///////////////////////////////////////////////////////////
export const clientCertificateOptionsSchema = z.object({
  cert: z.string(),
  key: z.string(),
  passphrase: z.string().optional(),
});
export type ClientCertificateOptions = z.infer<
  typeof clientCertificateOptionsSchema
>;
export const requestOptionsSchema = z.object({
  timeout: z.number().optional(),
  verifySsl: z.boolean().optional(),
  caBundlePath: z.union([z.string(), z.array(z.string())]).optional(),
  proxy: z.string().optional(),
  headers: z.record(z.string()).optional(),
  extraBodyProperties: z.record(z.any()).optional(),
  noProxy: z.array(z.string()).optional(),
  clientCertificate: clientCertificateOptionsSchema.optional(),
});
export type RequestOptions = z.infer<typeof requestOptionsSchema>;
export const modelRolesSchema = z.enum([
  "chat",
  "autocomplete",
  "embed",
  "rerank",
  "edit",
  "apply",
  "summarize",
]);
export type ModelRole = z.infer<typeof modelRolesSchema>;

export const completionOptionsSchema = z.object({
  contextLength: z.number().optional(),
  maxTokens: z.number().optional(),
  temperature: z.number().optional(),
  topP: z.number().optional(),
  topK: z.number().optional(),
  stop: z.array(z.string()).optional(),
  n: z.number().optional(),
});
export type CompletionOptions = z.infer<typeof completionOptionsSchema>;

// export const modelSchema = z.object({
//   name: z.string(),
//   provider: z.string(),
//   model: z.string(),
//   roles: modelRolesSchema.array().optional(),
//   defaultCompletionOptions: completionOptionsSchema.optional(),
//   requestOptions: requestOptionsSchema.optional(),
// });

// export type ModelConfig = z.infer<typeof modelSchema>;
///////////////////////////////////////////////////////////

// Parameters that
export const llmApiSupportSchema = z.object({
  supportsStreaming: z.boolean().optional(),

  supportsPrediction: z.boolean().optional(),
  supportsPrefill: z.boolean().optional(),
  supportsCompletions: z.boolean().optional(),

  supportsTextInput: z.boolean().optional(),
  supportsTextOutput: z.boolean().optional(),
  supportsVideoInput: z.boolean().optional(),
  supportsVideoOutput: z.boolean().optional(),
  supportsAudioInput: z.boolean().optional(),
  supportsAudioOutput: z.boolean().optional(),
  supportsImageInput: z.boolean().optional(),
  supportsImageOutput: z.boolean().optional(),
  supportsTools: z.boolean().optional(),

  extensionIconPath: z.string(), // for icons stored in extension resources
  remoteIconUrl: z.string().url().optional(), // Backup if no icon in resources
});
export type LLMApiSupport = z.infer<typeof llmApiSupportSchema>;

export const llmInfoSchema = llmApiSupportSchema.extend({
  displayName: z.string().optional(),
  description: z.string().optional(),
  creator: modelCreatorSchema.optional(),

  //
  homeUrl: z.string().url().optional(),
  docsUrl: z.string().url().optional(),
  downloadUrl: z.string().optional(),
  isFree: z.boolean().optional(),
  isOpenSource: z.boolean().optional(),
  supportsFim: z.boolean().optional(),
  isReasoningModel: z.boolean().optional(),
  isReasoningExposed: z.boolean().optional(),

  recommendedRoles: modelRolesSchema.array(),

  //
  contextLength: z.number(),
  defaultCompletionOptions: completionOptionsSchema.optional(),
  defaultRequestOptions: requestOptionsSchema.optional(),

  // defaultTemplates: {
  //   chat: ChatTemplate,
  //   edit: EditTemplate,
  //   autocomplete: AutocompleteTemplate
  // },
  // cacheBehavior:
  // systemMessage: Optional system message in all three
});
export type LLMSpec = z.infer<typeof llmInfoSchema>;

// Model hosted by Provider
const providerLlmSchema = llmInfoSchema.extend({
  model: z.string(), // The name passed to the provider's API as "model"
});
export type ProviderModel = z.infer<typeof providerLlmSchema>;

export const llmProviderSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  description: z.string(),
  longDescription: z.string().optional(),
  dashboardUrl: z.string().url().optional(),
  apiKeyUrl: z.string().url().optional(),
  docsUrl: z.string().url().optional(),

  defaultApiBaseUrl: z.string().url().optional(),

  // MODELS!!!
  models: z.array(providerLlmSchema),

  // Support unique to providers
  isOpenAICompatible: z.boolean().optional(),
  handlesTemplating: z.boolean().optional(),
  noApiKey: z.boolean().optional(),
  isLocal: z.boolean().optional(),
  supportsParallelGeneration: z.boolean().optional(),

  extensionIconPath: z.string(), // for icons stored in extension resources
  remoteIconUrl: z.string().url().optional(), // Backup if no icon in resources
});
export type ModelProvider = z.infer<typeof llmProviderSchema>;
