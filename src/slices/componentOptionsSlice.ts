import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of an individual option
export interface Option {
  id: string;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
}

// Define the shape of a property option (for the form fields)
export interface PropertyOption {
  title: string;
  type: string;
  required?: boolean;
}

// Define the component-specific state
interface ComponentState {
  options: Option[];
  selectedProperties: PropertyOption[];
}

// The slice state: keys are component IDs, values are ComponentState objects
type ComponentOptionsState = Record<string, ComponentState>;

// Initial state is an empty object (no data for any component yet)
const initialState: ComponentOptionsState = {};

// Create a slice that manages options per component ID
const componentOptionsSlice = createSlice({
  name: 'componentOptions',
  initialState,
  reducers: {
    // Initialize a component's state if it doesn't exist
    initComponentState: (state, action: PayloadAction<{ componentId: string }>) => {
      const { componentId } = action.payload;
      if (!state[componentId]) {
        state[componentId] = {
          options: [],
          selectedProperties: [] // Default to empty array, so only selected options show up
        };
      }
    },

    // Add a new option to a specific component's array
    addOption: (state, action: PayloadAction<{ componentId: string; option: Option }>) => {
      const { componentId, option } = action.payload;
      // Ensure the component state exists
      if (!state[componentId]) {
        state[componentId] = {
          options: [],
          selectedProperties: [] // Default to empty array
        };
      }
      // Push the new option
      state[componentId].options.push(option);
    },
    
    // Update an existing option for a specific component
    updateOption: (state, action: PayloadAction<{ componentId: string; option: Option }>) => {
      const { componentId, option } = action.payload;
      if (state[componentId]) {
        const opts = state[componentId].options;
        const index = opts.findIndex(o => o.id === option.id);
        if (index >= 0) {
          // Overwrite the existing option object
          opts[index] = option;
        }
      }
    },
    
    // Remove an option by its ID for a specific component
    removeOption: (state, action: PayloadAction<{ componentId: string; optionId: string }>) => {
      const { componentId, optionId } = action.payload;
      if (state[componentId]) {
        state[componentId].options = state[componentId].options.filter(opt => opt.id !== optionId);
      }
    },
    
    // Set all options for a component (useful for initialization)
    setOptions: (state, action: PayloadAction<{ componentId: string; options: Option[] }>) => {
      const { componentId, options } = action.payload;
      // Ensure the component state exists
      if (!state[componentId]) {
        state[componentId] = {
          options: options,
          selectedProperties: [] // Default to empty array
        };
      } else {
        // Just update the options
        state[componentId].options = options;
      }
    },

    // Set the selected properties for a component
    setSelectedProperties: (state, action: PayloadAction<{ componentId: string; properties: PropertyOption[] }>) => {
      const { componentId, properties } = action.payload;
      // Ensure the component state exists
      if (!state[componentId]) {
        state[componentId] = {
          options: [],
          selectedProperties: properties
        };
      } else {
        // Update the selected properties
        state[componentId].selectedProperties = properties;
      }
    }
  }
});

export const { initComponentState, addOption, updateOption, removeOption, setOptions, setSelectedProperties } = componentOptionsSlice.actions;
export default componentOptionsSlice.reducer;
