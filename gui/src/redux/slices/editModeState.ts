import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RangeInFileWithContents } from "core/commands/util";
import { EditModeArgs } from "core/protocol/ideWebview";

type EditStatus = "not-started" | "streaming" | "accepting" | "done";

interface EditModeState {
  highlightedCode: RangeInFileWithContents | null;
  editStatus: EditStatus;
}

const initialState: EditModeState = {
  highlightedCode: null,
  editStatus: "not-started",
};

export const editModeStateSlice = createSlice({
  name: "editModeState",
  initialState,
  reducers: {
    startEditMode: (state, { payload }: PayloadAction<EditModeArgs>) => {
      state.highlightedCode = payload.highlightedCode;
      state.editStatus = "not-started";
    },
  },
});

export const { startEditMode } = editModeStateSlice.actions;
export default editModeStateSlice.reducer;
