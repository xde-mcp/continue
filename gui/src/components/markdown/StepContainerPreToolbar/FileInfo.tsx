import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { getBasename } from "core/util";
import FileIcon from "../../FileIcon";
import { useContext } from "react";
import { IdeMessengerContext } from "../../../context/IdeMessenger";

export interface FileInfoProps {
  fileUri: string;
  range?: string;
}

const FileInfo = ({ fileUri, range }: FileInfoProps) => {
  const ideMessenger = useContext(IdeMessengerContext);

  function onClickFileName() {
    ideMessenger.post("showFile", {
      fileUri,
    });
  }

  return (
    <div className="flex w-full min-w-0 items-center">
      <div
        className="mr-0.5 flex w-full min-w-0 cursor-pointer items-center gap-0.5"
        onClick={onClickFileName}
      >
        <FileIcon height="20px" width="20px" filename={fileUri} />
        <span className="w-full truncate hover:underline">
          {getBasename(fileUri)}
          {range && ` ${range}`}
        </span>
      </div>
    </div>
  );
};

export default FileInfo;
