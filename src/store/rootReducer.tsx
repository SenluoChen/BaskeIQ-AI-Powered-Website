import { combineReducers } from '@reduxjs/toolkit';
import { userReducer } from './slices/userSlice';
import { userApi } from './api/UserApi';
import { errorReducer } from './slices/errorSlice';
import { matchReducer } from './slices/matchSlice';
import { matchApi } from './api/MatchApi';
import { analysisReducer } from './slices/analysisSlice';
import { analysisApi } from './api/AnalyseApi';

const rootReducer = combineReducers({
  user: userReducer,
  error: errorReducer,
  match: matchReducer,
  analyse: analysisReducer,
  [userApi.reducerPath]: userApi.reducer,
  [matchApi.reducerPath]: matchApi.reducer,
  [analysisApi.reducerPath]: analysisApi.reducer,
});

export default rootReducer;

