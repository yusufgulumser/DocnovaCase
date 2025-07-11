import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import invoiceSlice from './invoiceSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    invoices: invoiceSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store; 