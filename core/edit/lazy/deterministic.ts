import Parser from "web-tree-sitter";
import { IDE } from "../..";
import { getAst } from "../../autocomplete/ast";
import { UNCHANGED_CODE } from "./prompts";

export async function applyLazyCodeDeterministically(
  newCode: string,
  oldFilePath: string,
  ide: IDE,
): Promise<string> {
  // Read the old file contents
  const oldCode = await ide.readFile(oldFilePath);

  // Parse both old and new code into ASTs
  const oldAst = await getAst(oldFilePath, oldCode);
  const newAst = await getAst(oldFilePath, newCode);

  if (!oldAst || !newAst) {
    throw new Error("Failed to parse ASTs");
  }

  // Merge the ASTs
  const mergedAst = mergeAsts(oldAst.rootNode, newAst.rootNode);

  // Convert the merged AST back to code
  return astToCode(mergedAst);
}

function mergeAsts(
  oldNode: Parser.SyntaxNode,
  newNode: Parser.SyntaxNode,
): Parser.SyntaxNode {
  // If the new node is a comment containing "UNCHANGED CODE", use the old node
  if (newNode.type === "comment" && newNode.text.includes(UNCHANGED_CODE)) {
    return oldNode;
  }

  // If the signatures match, merge children
  if (nodesHaveSameSignature(oldNode, newNode)) {
    const mergedChildren = newNode.children.map((newChild, index) => {
      const oldChild = oldNode.children[index];
      return oldChild ? mergeAsts(oldChild, newChild) : newChild;
    });

    return {
      ...newNode,
      children: mergedChildren,
    };
  }

  // If signatures don't match, use the new node
  return newNode;
}

function nodesHaveSameSignature(
  node1: Parser.SyntaxNode,
  node2: Parser.SyntaxNode,
): boolean {
  return (
    node1.type === node2.type &&
    node1.startPosition === node2.startPosition &&
    node1.endPosition === node2.endPosition
  );
}

function astToCode(node: Parser.SyntaxNode): string {
  if (node.children.length === 0) {
    return node.text;
  }

  return node.children.map(astToCode).join("");
}
