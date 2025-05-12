import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TextState {
  value: string;
  componentsText: Record<string, string>; // Store text for each component by ID
  currentComponentId: string | null; // Track the currently active component
}

const initialState: TextState = {
  value: '',
  componentsText: {},
  currentComponentId: null,
};

const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    setText: (state, action: PayloadAction<string | { text: string; componentId: string }>) => {
      console.log('TextSlice - setText called with payload:', action.payload);
      
      // Handle both string and object payloads
      if (typeof action.payload === 'string') {
        // Legacy format - just a string
        state.value = action.payload; // Update global text value
        
        // Update component-specific value if we have an active component
        if (state.currentComponentId) {
          state.componentsText[state.currentComponentId] = action.payload;
          console.log('TextSlice - Updated component text for ID:', state.currentComponentId);
        }
      } else {
        // New format with componentId
        const { text, componentId } = action.payload;
        
        // Update the component-specific text
        state.componentsText[componentId] = text;
        console.log('TextSlice - Updated component text for ID:', componentId, 'with text:', text);
        
        // If this is the active component, update the global value too
        if (state.currentComponentId === componentId) {
          state.value = text;
        } else {
          // Set this as the active component
          state.currentComponentId = componentId;
          state.value = text;
          console.log('TextSlice - Set new active component:', componentId);
        }
      }
    },
    setActiveComponent: (state, action: PayloadAction<string>) => {
      state.currentComponentId = action.payload;
      // When selecting a component, initialize its text value if not present
      if (!state.componentsText[action.payload]) {
        state.componentsText[action.payload] = state.value;
      } else {
        // Update global value to match the component-specific value
        state.value = state.componentsText[action.payload];
      }
    },
    // Add component text explicitly with componentId
    setComponentText: (state, action: PayloadAction<{componentId: string, text: string}>) => {
      const { componentId, text } = action.payload;
      state.componentsText[componentId] = text;
      
      // Update global value if this is the active component
      if (state.currentComponentId === componentId) {
        state.value = text;
      }
    }
  },
});

export const { setText, setActiveComponent, setComponentText } = textSlice.actions;
export default textSlice.reducer;
