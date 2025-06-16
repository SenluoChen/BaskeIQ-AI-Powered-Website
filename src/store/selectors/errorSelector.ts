import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../type';

export const errorSelector = (state: RootState) => state.error;

export const isErrorSelector = createSelector(errorSelector, (state) => state);
