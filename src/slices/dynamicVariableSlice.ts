import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DynamicVariable } from '../components/Settings/AddDynamicVariableDialog';

interface DynamicVariableState {
  variables: DynamicVariable[];
}

const initialState: DynamicVariableState = {
  variables: []
};

export const dynamicVariableSlice = createSlice({
  name: 'dynamicVariables',
  initialState,
  reducers: {
    addDynamicVariable: (state, action: PayloadAction<DynamicVariable>) => {
      state.variables.push(action.payload);
    },
    removeDynamicVariable: (state, action: PayloadAction<{ name: string, screen: string, type: string }>) => {
      state.variables = state.variables.filter(
        variable => !(
          variable.name === action.payload.name && 
          variable.screen === action.payload.screen &&
          variable.type === action.payload.type
        )
      );
    },
    clearDynamicVariables: (state) => {
      state.variables = [];
    },
  },
});

export const { addDynamicVariable, removeDynamicVariable, clearDynamicVariables } = dynamicVariableSlice.actions;

export default dynamicVariableSlice.reducer;
