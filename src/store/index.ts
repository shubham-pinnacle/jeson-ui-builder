import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../slices/uiSlice';
import optionReducer from "../slices/optionSlice";
import textReducer from '../slices/TextHeading/textSlice';
import checkboxOptionReducer from '../slices/checkboxOptionSlice';
import componentOptionsReducer from '../slices/componentOptionsSlice';
import dynamicVariableReducer from '../slices/dynamicVariableSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    option: optionReducer,
    text: textReducer,
    checkboxOption: checkboxOptionReducer,
    componentOptions: componentOptionsReducer,
    dynamicVariables: dynamicVariableReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;