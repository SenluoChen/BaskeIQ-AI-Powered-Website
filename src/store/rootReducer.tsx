import { combineReducers } from '@reduxjs/toolkit';
import { userReducer } from './slices/userSlice';
import { userApi } from './api/UserApi';
import { errorReducer } from './slices/errorSlice';
import { matchReducer } from './slices/matchSlice';
import { matchApi } from './api/MatchApi';

const rootReducer = combineReducers({
  user: userReducer,
  error: errorReducer,
  match: matchReducer,
  [userApi.reducerPath]: userApi.reducer,
  [matchApi.reducerPath]: matchApi.reducer,
});

export default rootReducer;

