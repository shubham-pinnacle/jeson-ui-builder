import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DialogState {
  dynamicVariableDialogOpen: boolean;
}

const initialState: DialogState = {
  dynamicVariableDialogOpen: false
};

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    setDynamicVariableDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.dynamicVariableDialogOpen = action.payload;
    },
  },
});

export const { setDynamicVariableDialogOpen } = dialogSlice.actions;

export default dialogSlice.reducer;
