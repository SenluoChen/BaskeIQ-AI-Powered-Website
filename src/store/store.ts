import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { userApi } from './api/UserApi';
import { matchApi } from './api/MatchApi';
import { analysisApi } from './api/AnalyseApi';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(
      userApi.middleware,
      matchApi.middleware,
      analysisApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
