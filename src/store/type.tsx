import { Match } from '../types/Match.type';
import { User } from '../types/User.type';

export type UserState = {
  userProfile: User | undefined;
  authenticated: boolean;
}

export type ErrorState = {
  error: string;
};

export type MatchState = {
  matches: Match[];
};

export type RootState = {
  user: UserState;
  error: ErrorState;
  match: MatchState;
};