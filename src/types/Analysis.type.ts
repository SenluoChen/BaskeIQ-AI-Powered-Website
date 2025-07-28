export interface Advice {
  title: string;
  text: string;
  comment: string;
  tag: string[];
}

export interface MatchAnalysisResult {
  mainAdvice: Advice;
  secondaryAdvices: Advice[];
}

export interface MatchAnalysis {
  "user_id#timestamp": string;
  phase: string;
  timestamp: number;
  shots: number;
  turnovers: number;
  assists: number;
  rebounds: number;
  points: number;
  result: MatchAnalysisResult;
}

export interface AnalyzeMatchInput {
  timestamp: number;
  phase: string;
  shots: number;
  turnovers: number;
  assists: number;
  rebounds: number;
  points: number;
}