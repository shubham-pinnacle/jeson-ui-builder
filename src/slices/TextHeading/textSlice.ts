import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TextState {
  value: string;
}

const initialState: TextState = {
  value: '',
};

const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    setText: (state, action: PayloadAction<string>) => {
      state.value = action.payload; // Replace full text with input
    },
  },
});

export const { setText } = textSlice.actions;
export default textSlice.reducer;
