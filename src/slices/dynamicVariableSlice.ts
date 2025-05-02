import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DynamicVariable } from '../components/Settings/AddDynamicVariableDialog';

interface DynamicVariableState {
  variables: DynamicVariable[];
}

const initialState: DynamicVariableState = {
  variables: [],
};

export const dynamicVariableSlice = createSlice({
  name: 'dynamicVariable',
  initialState,
  reducers: {
    addDynamicVariable: (state, action: PayloadAction<DynamicVariable>) => {
      state.variables.push(action.payload);
    },
    removeDynamicVariable: (state, action: PayloadAction<string>) => {
      state.variables = state.variables.filter(
        (variable) => variable.name !== action.payload
      );
    },
    updateDynamicVariable: (state, action: PayloadAction<DynamicVariable>) => {
      const index = state.variables.findIndex(
        (variable) => variable.name === action.payload.name
      );
      if (index !== -1) {
        state.variables[index] = action.payload;
      }
    },
    clearDynamicVariables: (state) => {
      state.variables = [];
    },
  },
});

export const {
  addDynamicVariable,
  removeDynamicVariable,
  updateDynamicVariable,
  clearDynamicVariables,
} = dynamicVariableSlice.actions;

export default dynamicVariableSlice.reducer;
