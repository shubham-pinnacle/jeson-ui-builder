// src/redux/optionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Option = {
  id: string; // use appropriate types (e.g., string or number)
  title: string;
  description: string;
  metadata: string;
};

interface OptionState {
  arr: Option[];
}

const initialState: OptionState = {
  arr: [],
};

const optionSlice = createSlice({
  name: 'option',
  initialState,
  reducers: {
    // Update if the option exists; otherwise, add a new option.
    updateOption: (state, action: PayloadAction<Option>) => {
      const index = state.arr.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        // Option exists, so update its fields.
        state.arr[index] = action.payload;
      } else {
        // Option doesn't exist, so add it.
        state.arr.push(action.payload);
      }
    },
  },
});

export const { updateOption } = optionSlice.actions;
export default optionSlice.reducer;
