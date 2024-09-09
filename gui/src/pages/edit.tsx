import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { JSONContent } from "@tiptap/core";
import { InputModifiers } from "core";
import { getBasename } from "core/util";
import { usePostHog } from "posthog-js/react";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import FileIcon from "../components/FileIcon";
import resolveEditorContent from "../components/mainInput/resolveInput";
import TipTapEditor from "../components/mainInput/TipTapEditor";
import { IdeMessengerContext } from "../context/IdeMessenger";
import { RootState } from "../redux/store";
import { NewSessionButton } from "./chat";

const TopDiv = styled.div`
  overflow-y: auto;
  height: 100%;
  scrollbar-width: none;

  padding-top: 4px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

function Edit() {
  const posthog = usePostHog();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ideMessenger = useContext(IdeMessengerContext);

  const editModeState = useSelector((state: RootState) => state.editModeState);

  useEffect(() => {}, []);

  return (
    <>
      <TopDiv>
        <div className="max-w-3xl m-auto">
          <div className="flex px-2 relative">
            <FileIcon
              filename={editModeState.highlightedCode.filepath}
              height={"18px"}
              width={"18px"}
            ></FileIcon>
            {getBasename(editModeState.highlightedCode.filepath)}
            <TipTapEditor
              toolbarOptions={{
                hideAddContext: true,
                hideImageUpload: true,
                hideUseCodebase: true,
                enterText: "Edit",
              }}
              placeholder="Enter instructions for edit"
              border={`1px solid #aa0`}
              availableContextProviders={[]}
              availableSlashCommands={[]}
              isMainInput={true}
              onEnter={async function (
                editorState: JSONContent,
                modifiers: InputModifiers,
              ): Promise<void> {
                const [_, __, prompt] = await resolveEditorContent(
                  editorState,
                  {
                    noContext: true,
                    useCodebase: false,
                  },
                  ideMessenger,
                  [],
                );
                ideMessenger.request("edit/sendPrompt", {
                  prompt,
                  range: editModeState.highlightedCode,
                });
              }}
            ></TipTapEditor>
          </div>
        </div>

        <div className="mt-2">
          <NewSessionButton
            onClick={async () => {
              navigate("/");
            }}
            className="mr-auto flex items-center gap-2"
          >
            <ArrowLeftIcon width="11px" height="11px" />
            Back to chat
          </NewSessionButton>
        </div>
      </TopDiv>
    </>
  );
}

export default Edit;
