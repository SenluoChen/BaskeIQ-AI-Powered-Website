import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { MatchType } from '../../pages/DashboardPage';
import { MatchState } from '../type';

const initialState: MatchState = {
  matches: [],
};

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setMatched(state, action: PayloadAction<MatchType[]>) {
      state.matches = action.payload;
    },
  },
});

export const { setMatched } = matchSlice.actions;

export const matchReducer = matchSlice.reducer;
