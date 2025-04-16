import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isPreviewVisible: boolean;
  isDragging: boolean;
  selectedComponentId: string | null;
}

const initialState: UiState = {
  isPreviewVisible: false,
  isDragging: false,
  selectedComponentId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    togglePreview: (state) => {
      state.isPreviewVisible = !state.isPreviewVisible;
    },
    setDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },
    setSelectedComponentId: (state, action: PayloadAction<string | null>) => {
      state.selectedComponentId = action.payload;
    },
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
  },
});

export const {
  togglePreview,
  setDragging,
  setSelectedComponentId,
} = uiSlice.actions;

export default uiSlice.reducer;