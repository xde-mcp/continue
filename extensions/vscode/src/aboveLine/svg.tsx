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
    before: {
      margin: "0 0 0 0px",
      // contentText: "",
      contentIconPath: uri,
    },
    // border: "solid 1px #888",
    // backgroundColor: "#eee2",
    // borderRadius: "2em",
    isWholeLine: true,
    color: "#ddd",
    fontWeight: "light",
  });
}

const fontFile = fs.readFileSync(
  "/Users/natesesti/Desktop/continue/extensions/vscode/media/Lexend/static/Lexend-Regular.ttf"
);

function oldCreateSvgDecorationType(lineCount: number, focused: boolean) {
  if (lineCount > 2) {
    lineCount = 2;
  } else if (lineCount < 1) {
    lineCount = 1;
  }
  return uriToDecorationType(
    vscode.Uri.file(
      path.join(
        __dirname,
        "..",
        "media",
        "boxes",
        `box${lineCount}${focused ? "_focus" : ""}.svg`
      )
    )
  );
}

export async function createSvgDecorationType(
  lineCount: number,
  focused: boolean
) {
  const svg = await satori(
    <div
      style={{
        backgroundColor: "transparent",
        color: "white",
        padding: "4px 8px",
        margin: "4px",
        border: "1px solid gray",
        borderRadius: "5px",
        width: "400px",
        minHeight: "1.8rem",
        boxShadow: "0px 0px 6px 0px gray",
        display: "flex",
        flexDirection: "column",
        fontSize: "18px",
      }}
    >
      Write comments for this function
      <div
        style={{
          display: "flex",
          marginTop: "8px",
          fontSize: "14px",
        }}
      >
        <div
          style={{
            color: "gray",
          }}
        >
          Esc to cancel
        </div>

        <div
          style={{
            marginLeft: "auto",
          }}
        >
          Enter
        </div>
      </div>
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
    }
  );
  return uriToDecorationType(svgToDataUrl(svg));
}
