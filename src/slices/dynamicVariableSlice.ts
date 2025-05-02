import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DynamicVariable } from '../components/Settings/AddDynamicVariableDialog';

interface DynamicVariableState {
  variables: DynamicVariable[];
}

// Sample data to match the reference images
const initialSampleData: DynamicVariable[] = [
  {
    name: 'nameq',
    type: 'String',
    screen: 'WELCOME',
    sample: 'sdasdasd asdasdasd asdasd asdasd',
    value: 'sdasdasd asdasdasd a...'
  },
  {
    name: 'asdasd',
    type: 'Boolean',
    screen: 'WELCOME',
    booleanValue: true,
    value: 'true'
  },
  {
    name: 'asdasd',
    type: 'Number',
    screen: 'WELCOME',
    numberValue: 1,
    value: '1'
  },
  {
    name: 'asdasd',
    type: 'Array',
    screen: 'WELCOME',
    arraySamples: [
      {
        id: '1',
        title: 't1',
        description: 'des1',
        metadata: 'm2'
      },
      {
        id: 'id2',
        title: 't2',
        description: 'd2',
        metadata: 'meta2'
      }
    ],
    value: '[{"id":"asdasd","ti...'
  }
];

const initialState: DynamicVariableState = {
  variables: initialSampleData
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
