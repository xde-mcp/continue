import * as vscode from "vscode";
import InlineEdit from "./AboveLineTextInput";

class InlineEditManager {
  private edits: Map<vscode.TextEditor, InlineEdit> = new Map();

  new() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const inlineEdit = new InlineEdit(editor);
    this.edits.set(editor, inlineEdit);
  }

  count() {
    return this.edits.size;
  }

  remove(editor?: vscode.TextEditor) {
    if (!editor) {
      return;
    }
    this.edits.get(editor)?.dispose();
    this.edits.delete(editor);
  }
}

const inlineEditManager = new InlineEditManager();

export default inlineEditManager;
