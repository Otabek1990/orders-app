import { configureStore } from '@reduxjs/toolkit';
import { orderApi } from '../services/orderApi'; // Import API

export const store = configureStore({
  reducer: {
    [orderApi.reducerPath]: orderApi.reducer, // RTK Query reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(orderApi.middleware), // RTK Query middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
