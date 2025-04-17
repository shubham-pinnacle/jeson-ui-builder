import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../slices/uiSlice';
import optionReducer from "../slices/optionSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    option: optionReducer,},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 