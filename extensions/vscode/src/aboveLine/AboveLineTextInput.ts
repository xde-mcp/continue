import * as vscode from "vscode";
import { ideProtocolClient } from "../activation/activate";
import { addHighlightedCodeToContext } from "../commands";
import { createSvgDecorationType } from "./svg";

class InlineEdit extends vscode.Disposable {
  private autocompleteWasEnabled: boolean | undefined;
  public startLine: number;
  public previousFileContents: string;
  public disposables: vscode.Disposable[] = [];
  public lineCount: number;
  public focused: boolean;

  public highlightDecorationType: vscode.TextEditorDecorationType;
  public svgDecorationType?: vscode.TextEditorDecorationType;
  public endLineDecorationType: vscode.TextEditorDecorationType;

  get decorationTypes() {
    return [
      this.highlightDecorationType,
      this.svgDecorationType,
      this.endLineDecorationType,
    ];
  }

  private static _setAutocompleteEnabled(
    enabled: boolean | undefined
  ): boolean | undefined {
    const config = vscode.workspace.getConfiguration("github.copilot");
    const wasEnabled = config.get<boolean>("editor.enableAutoCompletions");
    config.update(
      "editor.enableAutoCompletions",
      enabled,
      vscode.ConfigurationTarget.Global
    );
    return wasEnabled;
  }

  constructor(public editor: vscode.TextEditor) {
    super(() => {
      this.customDispose();
    });
    // Disable GH Copilot while inside the edit box
    this.autocompleteWasEnabled = InlineEdit._setAutocompleteEnabled(false);
    this.lineCount = 1;
    this.focused = true;
    this.previousFileContents = editor.document.getText();

    // Highlight the selected range with a decoration
    const originalRange = editor.selection;
    this.highlightDecorationType = vscode.window.createTextEditorDecorationType(
      {
        backgroundColor: "#eee2",
        isWholeLine: true,
      }
    );
    if (!editor.selection.isEmpty) {
      editor.setDecorations(this.highlightDecorationType, [originalRange]);
    }

    // Select as context item
    addHighlightedCodeToContext(true);

    // Add a `` and insert the cursor in the middle
    const startOfLine = new vscode.Position(editor.selection.start.line, 0);
    editor.edit((editBuilder) => {
      editBuilder.insert(startOfLine, "`\n  \n`;\n");
    });
    let position = startOfLine.translate(1, 2);
    editor.selection = new vscode.Selection(position, position);

    // Add text via a decoration
    createSvgDecorationType(1, true).then((dt) => {
      this.svgDecorationType = dt;
      editor.setDecorations(this.svgDecorationType, [
        new vscode.Range(position.translate(-1, 0), position.translate(0, 0)),
      ]);
    });

    this.endLineDecorationType = vscode.window.createTextEditorDecorationType({
      before: {
        // contentText: "⌘ ⇧ ⏎ to edit, esc to cancel",
        margin: "0 0 4em 0",
        color: "#8888",
      },
      isWholeLine: true,
      color: "transparent",
    });
    editor.setDecorations(this.endLineDecorationType, [
      new vscode.Range(position.translate(1, 0), position.translate(1, 0)),
    ]);

    this.startLine = position.line - 1;

    // Add a listener to revert any edits made to the boundary lines
    // Timeout so the initial creation of the zone isn't counted
    setTimeout(() => {
      const editListener = vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document !== editor.document) {
          return;
        }

        for (const change of e.contentChanges) {
          // The editBuilder.replace will trigger another onDidChangeTextDocument event, so we need to filter these out
          // False positives are okay
          if (change.text === "`" || change.text === "`;") {
            continue;
          }

          // Check if the boundary line is included in the edit at all
          const start = change.range.start;
          const end = change.range.end;
          if (start.line <= this.startLine && end.line >= this.startLine) {
            // Revert the start line to its original state
            editor.edit((editBuilder) => {
              editBuilder.replace(
                new vscode.Range(this.startLine, 0, this.startLine, 1000),
                "`"
              );
            });
          }

          // TODO: Need to truly keep track of the endline and startline, because they BOTH could move (just more often a problem with the endline)
          // if (start.line <= endLine && end.line >= endLine) {
          //   // Revert the end line to its original state
          //   editor.edit((editBuilder) => {
          //     editBuilder.replace(
          //       new vscode.Range(endLine, 0, endLine, 1000),
          //       "`;"
          //     );
          //   });
          // }
        }
        const contentsOfFirstLine = editor.document.lineAt(
          this.startLine + 1
        ).text;
        if (contentsOfFirstLine === "" || contentsOfFirstLine === " ") {
          // If the space was removed from the start of the line, put it back
          editor.edit((editBuilder) => {
            editBuilder.insert(
              new vscode.Position(this.startLine + 1, 0),
              "  "
            );
          });
        }
      });

      const disposables = [editListener];
    });

    const lineCountListener = vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document !== this.editor.document) {
        return;
      }

      // Add listener for when number of lines changes
      const range = this.findRange();
      const lineCount = range.end.line - range.start.line - 2;

      if (lineCount !== this.lineCount) {
        // Update the decoration
        this.updateSvgDecorationType(lineCount, true);
      }
    });

    this.disposables.push(lineCountListener);

    const cursorListener = vscode.window.onDidChangeTextEditorSelection((e) => {
      if (e.textEditor !== this.editor) {
        return;
      }

      // Add listener for when the user puts their cursor on a boundary line (and move back to middle)
      const selection = e.selections[0];
      const range = this.findRange();
      if (
        selection.active.line === range.start.line ||
        selection.active.line === range.end.line - 1
      ) {
        // Move the cursor back to the middle
        const position = range.start.translate(1, 2);
        this.editor.selection = new vscode.Selection(position, position);
      }

      // If cursor is in the margins, move it to the fake start of the line
      if (
        range.contains(selection.active) &&
        selection.isEmpty &&
        selection.active.character < 2
      ) {
        // Read the active line
        const activeLineContents = this.editor.document.lineAt(
          selection.active.line
        ).text;

        if (
          activeLineContents === "" &&
          range.start.line !== selection.active.line
        ) {
          // Deletion, remove the line and move to the above
          editor.edit((editBuilder) => {
            editBuilder.delete(
              new vscode.Range(
                selection.active.line,
                0,
                selection.active.line + 1,
                0
              )
            );
          });
          const lineAboveLength = this.editor.document.lineAt(
            selection.active.line - 1
          ).text.length;
          this.editor.selection = new vscode.Selection(
            selection.active.line - 1,
            lineAboveLength,
            selection.active.line - 1,
            lineAboveLength
          );
        } else {
          // Cursor just moved, move it to start of the line
          if (selection.active.line !== range.end.line - 1) {
            const position = selection.active.translate(
              0,
              2 - selection.active.character
            );
            this.editor.selection = new vscode.Selection(position, position);
          }
        }
      }

      // Also listen for when the box is focused / blurred
      const focused = this.findRange().contains(selection.active);
      if (focused !== this.focused) {
        this.updateSvgDecorationType(this.lineCount, focused);
      }
    });

    this.disposables.push(cursorListener);

    // Disable tab-autocomplete
    const config = vscode.workspace.getConfiguration("github.copilot");
    const enabled = config.get<string[]>("editor.enableAutoCompletions");
    config.update(
      "editor.enableAutoCompletions",
      false,
      vscode.ConfigurationTarget.Global
    );
  }

  findRange() {
    const startPos = new vscode.Position(this.startLine, 0);

    // Find the end line
    let endPos = startPos;
    while (
      endPos.line < this.editor.document.lineCount &&
      this.editor.document.lineAt(endPos.line).text !== "`;"
    ) {
      endPos = endPos.translate(1, 0);
    }
    endPos = endPos.translate(1, 0);

    return new vscode.Range(startPos, endPos);
  }

  customDispose() {
    InlineEdit._setAutocompleteEnabled(this.autocompleteWasEnabled);

    for (const decorationType of this.decorationTypes) {
      if (!decorationType) {
        continue;
      }
      this.editor.setDecorations(decorationType, []);
      decorationType.dispose();
    }

    this.editor.setDecorations(this.highlightDecorationType, []);

    // Remove the inserted text
    this.editor.edit((editBuilder) => {
      editBuilder.delete(this.findRange());
    });

    // If the file contents are the same as original, save the file, because it's annoying to have to save it manually
    setTimeout(() => {
      const fileContents = this.editor.document.getText();
      if (fileContents === this.previousFileContents) {
        this.editor.document.save();
      }
    }, 100);

    // Dispose of the listeners
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
    super.dispose();
  }

  async enter() {
    // Get the text
    const fullRange = this.findRange();
    const range = new vscode.Range(
      fullRange.start.translate(1, 0),
      fullRange.end.translate(-1, 0)
    );
    const text = this.editor.document.getText(range).trim();
    ideProtocolClient.sendMainUserInput("/edit " + text);

    this.dispose();
  }

  async updateSvgDecorationType(lineCount: number, focused: boolean) {
    if (this.svgDecorationType) {
      this.editor.setDecorations(this.svgDecorationType, []);
    }
    const range = this.findRange();
    this.svgDecorationType = await createSvgDecorationType(lineCount, focused);
    this.editor.setDecorations(this.svgDecorationType, [
      new vscode.Range(range.start, range.start.translate(lineCount, 0)),
    ]);
    this.lineCount = lineCount;
    this.focused = focused;
  }
}

export default InlineEdit;
