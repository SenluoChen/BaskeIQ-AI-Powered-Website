import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AnalysisState } from '../type';
import { MatchAnalysis } from '../../types/Analysis.type';

const initialState: AnalysisState = {
  analyzes: [],
};

export const analysisSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAnalyzes(state, action: PayloadAction<MatchAnalysis[]>) {
      state.analyzes = action.payload;
    },
    logoutAnalysis(state) {
      state.analyzes = [];
    },
  },
});

export const { setAnalyzes, logoutAnalysis } = analysisSlice.actions;

export const analysisReducer = analysisSlice.reducer;
