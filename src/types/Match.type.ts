export type QuarterStats = {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
};

export type Shot = {
  x: number;
  y: number;
  type: 'success' | 'failed';
};

export type Match = {
  id: string;
  user_id: string;
  title: string;
  timestamp: number;
  shots?: Shot[];
  assists?: QuarterStats;
  rebounds?: QuarterStats;
  turnovers?: QuarterStats;
  points?: QuarterStats;
};

export type PostMatchBody = {
  title: string;
};

export type PostMatchResponse = {
  message: string;
  match: Match;
};

export type GetMatchesResponse = {
  message: string;
  matches: Match[];
};

export type DeleteMatchBody = {
  timestamp: number;
};

export type DeleteMatchResponse = {
  message: string;
};

export type PutMatchBody = {
  timestamp: number;
  title?: string;
  date?: number;
  shots?: Shot[];
  assists?: QuarterStats;
  rebounds?: QuarterStats;
  turnovers?: QuarterStats;
  points?: QuarterStats;
};

export type PutMatchResponse = {
  message: string;
  updatedFields: Partial<Match>;
};
