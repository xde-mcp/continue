import { Chunk } from "../../../index.js";
import { deduplicateChunks } from "../util.js";
import BaseRetrievalPipeline, {
  RetrievalPipelineRunArguments,
} from "./BaseRetrievalPipeline.js";

export default class NoRerankerRetrievalPipeline extends BaseRetrievalPipeline {
  async run(args: RetrievalPipelineRunArguments): Promise<Chunk[]> {
    const { nFinal } = this.options;

    // We give 1/4 weight to recently edited files, 1/4 to full text search,
    // and the remaining 1/2 to embeddings
    const recentlyEditedNFinal = nFinal * 0.25;
    const ftsNFinal = nFinal * 0.25;
    const embeddingsNFinal = nFinal - recentlyEditedNFinal - ftsNFinal;

    const retrievalResults: Chunk[] = [];

    const ftsChunks = await this.retrieveFts(args, ftsNFinal);

    const embeddingsChunks = await this.retrieveEmbeddings(
      args,
      embeddingsNFinal,
    );

    const recentlyEditedFilesChunks =
      await this.retrieveAndChunkRecentlyEditedFiles(recentlyEditedNFinal);

    retrievalResults.push(
      ...recentlyEditedFilesChunks,
      ...ftsChunks,
      ...embeddingsChunks,
    );

    const deduplicatedRetrievalResults: Chunk[] =
      deduplicateChunks(retrievalResults);

    return deduplicatedRetrievalResults;
  }
}
