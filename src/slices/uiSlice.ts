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
        if (Array.isArray(parsed)) {
          // Keep track of existing components that are not in the new JSON
          const existingComponents = state.components;
          const newComponentIds = parsed.map(comp => comp.id);
          const missingComponents = existingComponents.filter(
            comp => !newComponentIds.includes(comp.id) && comp.type === 'datepicker'
          );

          // Combine new components with preserved datepicker components
          const updatedComponents = [...parsed];

          // Add back any missing datepicker components
          missingComponents.forEach(comp => {
            if (!updatedComponents.find(c => c.id === comp.id)) {
              updatedComponents.push(comp);
            }
          });

          // Process each component
          state.components = updatedComponents.map(newComp => {
            if (newComp.type === 'datepicker') {
              const defaultProps = {
                label: '',
                outputVariable: '',
                initValue: '',
                minDate: '',
                maxDate: '',
                unavailableDates: ''
              };
              
              // Find existing component
              const existingComp = existingComponents.find(comp => comp.id === newComp.id);
              
              return {
                ...newComp,
                properties: {
                  ...defaultProps,
                  ...(existingComp?.properties || {}),
                  ...(newComp.properties || {})
                }
              };
            }
            return newComp;
          });

          // Update JSON output to reflect the preserved components
          state.jsonOutput = JSON.stringify(state.components, null, 2);
        } else {
          state.jsonOutput = action.payload;
        }
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