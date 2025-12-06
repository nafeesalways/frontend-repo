
import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import authReducer from './features/authSlice';

export const store = configureStore({
  reducer: {
   //API slice
    [baseApi.reducerPath]: baseApi.reducer,
  //authentication slice
    auth: authReducer,
  },
  // need middleware for caching and listener of RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
