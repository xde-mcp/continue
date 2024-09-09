import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RangeInFileWithContents } from "core/commands/util";
import { EditModeArgs, EditStatus } from "core/protocol/ideWebview";

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
    setEditStatus: (state, { payload }: PayloadAction<EditStatus>) => {
      state.editStatus = payload;
    },
  },
});

export const { startEditMode, setEditStatus } = editModeStateSlice.actions;
export default editModeStateSlice.reducer;
