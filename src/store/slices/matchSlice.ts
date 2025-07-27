import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Match } from '../../types/Match.type';
import { MatchState } from '../type';

const initialState: MatchState = {
  matches: [],
};

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setMatched(state, action: PayloadAction<Match[]>) {
      state.matches = action.payload;
    },
    addMatch(state, action: PayloadAction<Match>) {
      state.matches.push(action.payload);
    },
    removeMatch(state, action: PayloadAction<string>) {
      state.matches = state.matches.filter(match => match.id !== action.payload);
    },
    updateMatch(state, action: PayloadAction<Match>) {
      const index = state.matches.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.matches[index] = action.payload;
      }
    },
  },
});

export const { setMatched, addMatch, removeMatch, updateMatch } = matchSlice.actions;

export const matchReducer = matchSlice.reducer;
