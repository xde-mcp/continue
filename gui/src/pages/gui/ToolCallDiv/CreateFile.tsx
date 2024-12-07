import { getMarkdownLanguageTagForFile } from "core/util";
import StyledMarkdownPreview from "../../../components/markdown/StyledMarkdownPreview";

interface CreateFileToolCallProps {
  fileUri: string;
  fileContents: string;
}

export function CreateFile(props: CreateFileToolCallProps) {
  const src = `\`\`\`${getMarkdownLanguageTagForFile(props.fileUri ?? "test.txt")} ${props.fileUri}\n${props.fileContents ?? ""}\n\`\`\``;

  return props.fileUri ? (
    <StyledMarkdownPreview isRenderingInStepContainer={true} source={src} />
  ) : null;
}
