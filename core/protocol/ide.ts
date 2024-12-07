import { ControlPlaneSessionInfo } from "../control-plane/client";

import type {
  ContinueRcJson,
  DiffLine,
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
} from "../";

export interface GetGhTokenArgs {
  force?: boolean;
}

export type ToIdeFromWebviewOrCoreProtocol = {
  // Methods from IDE type
  getIdeInfo: [undefined, IdeInfo];
  getWorkspaceDirs: [undefined, string[]];
  listFolders: [undefined, string[]];
  writeFile: [{ uri: string; contents: string }, void];
  showVirtualFile: [{ name: string; content: string }, void];
  getContinueDir: [undefined, string];
  openFile: [{ uri: string }, void];
  openUrl: [string, void];
  runCommand: [{ command: string }, void];
  getSearchResults: [{ query: string }, string];
  subprocess: [{ command: string; cwd?: string }, [string, string]];
  saveFile: [{ uri: string }, void];
  fileExists: [{ uri: string }, boolean];
  readFile: [{ uri: string }, string];
  showDiff: [
    { uri: string; newContents: string; stepIndex: number },
    void,
  ];
  diffLine: [
    {
      diffLine: DiffLine;
      uri: string;
      startLine: number;
      endLine: number;
    },
    void,
  ];
  getProblems: [{ uri: string }, Problem[]];
  getOpenFiles: [undefined, string[]];
  getCurrentFile: [
    undefined,
    (
      | undefined
      | {
          isUntitled: boolean;
          uri: string;
          contents: string;
        }
    ),
  ];
  getPinnedFiles: [undefined, string[]];
  showLines: [{ uri: string; startLine: number; endLine: number }, void];
  readRangeInFile: [{ uri: string; range: Range }, string];
  getDiff: [{ includeUnstaged: boolean }, string[]];
  getWorkspaceConfigs: [undefined, ContinueRcJson[]];
  getTerminalContents: [undefined, string];
  getDebugLocals: [{ threadIndex: number }, string];
  getTopLevelCallStackSources: [
    { threadIndex: number; stackDepth: number },
    string[],
  ];
  getAvailableThreads: [undefined, Thread[]];
  isTelemetryEnabled: [undefined, boolean];
  getUniqueId: [undefined, string];
  getTags: [string, IndexTag[]];
  // end methods from IDE type

  getIdeSettings: [undefined, IdeSettings];

  // Git
  getBranch: [{ dir: string }, string];
  getRepoName: [{ dir: string }, string | undefined];

  showToast: [
    Parameters<IDE["showToast"]>,
    Awaited<ReturnType<IDE["showToast"]>>,
  ];
  getGitRootDirUri: [{ dir: string }, string | undefined];
  listDir: [{ dir: string }, [string, FileType][]];
  getLastModified: [{ files: string[] }, { [uri: string]: number }];

  gotoDefinition: [{ location: Location }, RangeInFile[]];

  getGitHubAuthToken: [GetGhTokenArgs, string | undefined];
  getControlPlaneSessionInfo: [
    { silent: boolean },
    ControlPlaneSessionInfo | undefined,
  ];
  logoutOfControlPlane: [undefined, void];
  pathSep: [undefined, string];
};

export type ToWebviewOrCoreFromIdeProtocol = {
  didChangeActiveTextEditor: [{ uri: string }, void];
  didChangeControlPlaneSessionInfo: [
    { sessionInfo: ControlPlaneSessionInfo | undefined },
    void,
  ];
  didChangeIdeSettings: [{ settings: IdeSettings }, void];
};
