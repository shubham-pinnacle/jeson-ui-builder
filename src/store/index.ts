import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../slices/uiSlice';
import optionReducer from "../slices/optionSlice";
import textReducer from '../slices/TextHeading/textSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    option: optionReducer,
    text: textReducer,},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 