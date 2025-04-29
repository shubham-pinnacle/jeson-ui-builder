import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CheckboxOption = {
  id: string;
  title: string;
  description: string;
  metadata: string;
};

interface CheckboxOptionState {
  arr: CheckboxOption[];
}

const initialState: CheckboxOptionState = {
  arr: [],
};

const checkboxOptionSlice = createSlice({
  name: 'checkboxOption',
  initialState,
  reducers: {
    // Merge incoming fields into existing option, or add new
    updateCheckboxOption: (state, action: PayloadAction<CheckboxOption>) => {
      const payload = action.payload;
      const index = state.arr.findIndex(item => item.id === payload.id);
      if (index !== -1) {
        // Merge existing and new so we don't lose unspecified fields
        state.arr[index] = {
          ...state.arr[index],
          ...payload,
        };
      } else {
        state.arr.push(payload);
      }
    },
  },
});

export const { updateCheckboxOption } = checkboxOptionSlice.actions;
export default checkboxOptionSlice.reducer;
