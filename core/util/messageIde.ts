import {
  GetGhTokenArgs,
  ToIdeFromWebviewOrCoreProtocol,
} from "../protocol/ide.js";
import { FromIdeProtocol } from "../protocol/index.js";

import type {
  ContinueRcJson,
  FileType,
  IDE,
  IdeInfo,
  IdeSettings,
  IndexTag,
  Location,
  Problem,
  Range,
  RangeInFile,
  Thread,
} from "../index.js";

export class MessageIde implements IDE {
  constructor(
    private readonly request: <T extends keyof ToIdeFromWebviewOrCoreProtocol>(
      messageType: T,
      data: ToIdeFromWebviewOrCoreProtocol[T][0],
    ) => Promise<ToIdeFromWebviewOrCoreProtocol[T][1]>,
    private readonly on: <T extends keyof FromIdeProtocol>(
      messageType: T,
      callback: (data: FromIdeProtocol[T][0]) => FromIdeProtocol[T][1],
    ) => void,
  ) {}

  pathSep(): Promise<string> {
    return this.request("pathSep", undefined);
  }
  fileExists(uri: string): Promise<boolean> {
    return this.request("fileExists", { uri });
  }
  async gotoDefinition(location: Location): Promise<RangeInFile[]> {
    return this.request("gotoDefinition", { location });
  }
  onDidChangeActiveTextEditor(callback: (uri: string) => void): void {
    this.on("didChangeActiveTextEditor", (data) => callback(data.uri));
  }

  getIdeSettings(): Promise<IdeSettings> {
    return this.request("getIdeSettings", undefined);
  }
  getGitHubAuthToken(args: GetGhTokenArgs): Promise<string | undefined> {
    return this.request("getGitHubAuthToken", args);
  }
  getLastModified(files: string[]): Promise<{ [uri: string]: number }> {
    return this.request("getLastModified", { files });
  }
  getGitRootDirUri(dir: string): Promise<string | undefined> {
    return this.request("getGitRootDirUri", { dir });
  }
  listDir(dir: string): Promise<[string, FileType][]> {
    return this.request("listDir", { dir });
  }

  showToast: IDE["showToast"] = (...params) => {
    return this.request("showToast", params);
  };

  getRepoName(dir: string): Promise<string | undefined> {
    return this.request("getRepoName", { dir });
  }

  getDebugLocals(threadIndex: number): Promise<string> {
    return this.request("getDebugLocals", { threadIndex });
  }

  getTopLevelCallStackSources(
    threadIndex: number,
    stackDepth: number,
  ): Promise<string[]> {
    return this.request("getTopLevelCallStackSources", {
      threadIndex,
      stackDepth,
    });
  }

  getAvailableThreads(): Promise<Thread[]> {
    return this.request("getAvailableThreads", undefined);
  }

  getTags(artifactId: string): Promise<IndexTag[]> {
    return this.request("getTags", artifactId);
  }

  getIdeInfo(): Promise<IdeInfo> {
    return this.request("getIdeInfo", undefined);
  }

  readRangeInFile(uri: string, range: Range): Promise<string> {
    return this.request("readRangeInFile", { uri, range });
  }

  isTelemetryEnabled(): Promise<boolean> {
    return this.request("isTelemetryEnabled", undefined);
  }

  getUniqueId(): Promise<string> {
    return this.request("getUniqueId", undefined);
  }

  getWorkspaceConfigs(): Promise<ContinueRcJson[]> {
    return this.request("getWorkspaceConfigs", undefined);
  }

  async getDiff(includeUnstaged: boolean) {
    return await this.request("getDiff", { includeUnstaged });
  }

  async getClipboardContent(): Promise<{ text: string; copiedAt: string }> {
    return {
      text: "",
      copiedAt: new Date().toISOString(),
    };
  }

  async getTerminalContents() {
    return await this.request("getTerminalContents", undefined);
  }

  async getWorkspaceDirs(): Promise<string[]> {
    return await this.request("getWorkspaceDirs", undefined);
  }

  async showLines(
    uri: string,
    startLine: number,
    endLine: number,
  ): Promise<void> {
    return await this.request("showLines", { uri, startLine, endLine });
  }

  async listFolders(): Promise<string[]> {
    return await this.request("listFolders", undefined);
  }

  _continueDir: string | null = null;

  async getContinueDir(): Promise<string> {
    if (this._continueDir) {
      return this._continueDir;
    }
    const dir = await this.request("getContinueDir", undefined);
    this._continueDir = dir;
    return dir;
  }

  async writeFile(uri: string, contents: string): Promise<void> {
    await this.request("writeFile", { uri, contents });
  }

  async showVirtualFile(title: string, contents: string): Promise<void> {
    await this.request("showVirtualFile", { name: title, content: contents });
  }

  async openFile(uri: string): Promise<void> {
    await this.request("openFile", { uri });
  }

  async openUrl(url: string): Promise<void> {
    await this.request("openUrl", url);
  }

  async runCommand(command: string): Promise<void> {
    await this.request("runCommand", { command });
  }

  async saveFile(uri: string): Promise<void> {
    await this.request("saveFile", { uri });
  }
  async readFile(uri: string): Promise<string> {
    return await this.request("readFile", { uri });
  }
  async showDiff(
    uri: string,
    newContents: string,
    stepIndex: number,
  ): Promise<void> {
    await this.request("showDiff", { uri, newContents, stepIndex });
  }

  getOpenFiles(): Promise<string[]> {
    return this.request("getOpenFiles", undefined);
  }

  getCurrentFile() {
    return this.request("getCurrentFile", undefined);
  }

  getPinnedFiles(): Promise<string[]> {
    return this.request("getPinnedFiles", undefined);
  }

  getSearchResults(query: string): Promise<string> {
    return this.request("getSearchResults", { query });
  }

  getProblems(uri: string): Promise<Problem[]> {
    return this.request("getProblems", { uri });
  }

  subprocess(command: string, cwd?: string): Promise<[string, string]> {
    return this.request("subprocess", { command, cwd });
  }

  async getBranch(dir: string): Promise<string> {
    return this.request("getBranch", { dir });
  }
}
