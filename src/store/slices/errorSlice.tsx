import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorState } from '../type';

const errorSlice = createSlice({
  name: 'user',
  initialState: {
    error: '',
  } as ErrorState,
  reducers: {
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    logoutError(state) {
      state.error = '';
    },
  },
});

export const { setError, logoutError } = errorSlice.actions;

export const errorReducer = errorSlice.reducer;
