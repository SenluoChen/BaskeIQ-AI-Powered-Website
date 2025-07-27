import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User.type';
import { UserState } from '../type';

const initialState: UserState = {
  userProfile: undefined,
  authenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.authenticated = action.payload;
    },
    setUser(state, action: PayloadAction<User>) {
      state.userProfile = action.payload;
    },
    logoutUser(state) {
      state.userProfile = undefined;
      state.authenticated = false;
    },
  },
});

export const { setAuthenticated, setUser, logoutUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
