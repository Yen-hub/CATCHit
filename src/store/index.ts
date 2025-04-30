import { configureStore } from "@reduxjs/toolkit";
import scanReducer from "./scanSlice";

export const store = configureStore({
  reducer: {
    scan: scanReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for File objects
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
