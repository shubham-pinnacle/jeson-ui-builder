import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ComponentType, UIState } from '../types';

const initialState: UIState = {
  components: [],
  selectedComponent: null,
  jsonOutput: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addComponent: (state, action: PayloadAction<ComponentType>) => {
      state.components.push(action.payload);
      state.jsonOutput = JSON.stringify(state.components, null, 2);
    },
    updateComponent: (state, action: PayloadAction<ComponentType>) => {
      const index = state.components.findIndex(comp => comp.id === action.payload.id);
      if (index !== -1) {
        state.components[index] = action.payload;
        state.jsonOutput = JSON.stringify(state.components, null, 2);
      }
    },
    removeComponent: (state, action: PayloadAction<string>) => {
      state.components = state.components.filter(comp => comp.id !== action.payload);
      state.jsonOutput = JSON.stringify(state.components, null, 2);
    },
    setSelectedComponent: (state, action: PayloadAction<ComponentType | null>) => {
      state.selectedComponent = action.payload;
    },
    setJsonOutput: (state, action: PayloadAction<string>) => {
      try {
        const parsed = JSON.parse(action.payload);
        state.components = parsed;
        state.jsonOutput = action.payload;
      } catch (e) {
        console.error('Invalid JSON');
      }
    },
  },
});

export const {
  addComponent,
  updateComponent,
  removeComponent,
  setSelectedComponent,
  setJsonOutput,
} = uiSlice.actions;

export default uiSlice.reducer; 