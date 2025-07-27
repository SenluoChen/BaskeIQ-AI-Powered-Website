import { MatchType } from '../pages/DashboardPage';
import { User } from '../types/User.type';

export type UserState = {
  userProfile: User | undefined;
  authenticated: boolean;
}

export type ErrorState = {
  error: string;
};

export interface MatchState {
  matches: MatchType[];
}

export type RootState = {
  user: UserState;
  error: ErrorState;
  match: MatchState;
};