// src/redux/optionSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Option = {
  id: string;
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
        // Replace the item immutably to trigger UI updates
        state.arr = [
          ...state.arr.slice(0, index),
          action.payload,
          ...state.arr.slice(index + 1)
        ];
      } else {
        // Add new item immutably
        state.arr = [...state.arr, action.payload];
      }
    },
  },
});

export const { updateOption } = optionSlice.actions;
export default optionSlice.reducer;
