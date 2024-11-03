import { DiffLine } from "core";
import * as fs from "fs";
import * as path from "path";
import satori from "satori";
import * as vscode from "vscode";

function svgToDataUrl(svgString: string) {
  const urlString = "data:text/javascript;base64," + btoa(svgString);
  return vscode.Uri.parse(urlString);
}

function uriToDecorationType(uri: vscode.Uri) {
  return vscode.window.createTextEditorDecorationType({
    after: {
      margin: "0 0 0 0px",
      contentIconPath: uri,
    },
  });
}

const fontFile = fs.readFileSync(
  "/Users/natesesti/Desktop/continue/extensions/vscode/media/CourierPrime-Regular.ttf",
);

function greenDiffLine(text: string) {
  return (
    <div
      style={{
        backgroundColor: "#00ff0044",
      }}
    >
      {text}
    </div>
  );
}

function redDiffLine(text: string) {
  return (
    <div
      style={{
        backgroundColor: "#ff000044",
      }}
    >
      {text}
    </div>
  );
}

function diffLines(diff: DiffLine[]) {
  return diff.map((line) => {
    switch (line.type) {
      case "new":
        return greenDiffLine(line.line);
      case "old":
        return redDiffLine(line.line);
      default:
        return <div>{line.line}</div>;
    }
  });
}

async function createSvg(diff: DiffLine[]) {
  const svg = await satori(
    <div
      style={{
        backgroundColor: "transparent",
        color: "white",
        margin: "4px",
        border: "0.5px solid #8888",
        borderRadius: "2px",
        width: "100px",
        minHeight: "1.8rem",
        display: "flex",
        flexDirection: "column",
        fontSize: "13px",
      }}
    >
      {diffLines(diff)}
    </div>,
    {
      width: 600,
      height: 400,
      fonts: [
        {
          name: "Roboto",
          // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
          data: fontFile,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
  return svg;
}

export async function createSvgAndSaveDecorationType(diff: DiffLine[]) {
  const svg = await createSvg(diff);
  const svgPath = path.join(__dirname, "..", "media", "temp.svg");
  fs.writeFileSync(svgPath, svg);

  return uriToDecorationType(vscode.Uri.file(svgPath));
}
