import { createApi } from '@reduxjs/toolkit/query/react';
import { MatchAnalysis, AnalyzeMatchInput } from '../../types/Analysis.type';
import { baseQueryWithReauth } from '../../utils/api';

export const analysisApi = createApi({
  reducerPath: 'analysisApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    postAnalyzeMatchResult: builder.mutation<
      { advice: MatchAnalysis; message: string },
      AnalyzeMatchInput
    >({
      query: (body) => ({
        url: '/analyze',
        method: 'POST',
        body,
      }),
    }),
    getAnalyzes: builder.query<
      { items: MatchAnalysis[]; message: string },
      string
    >({
      query: (timestamp) => `/analyze?timestamp=${timestamp}`,
    }),
  }),
});

export const {
  usePostAnalyzeMatchResultMutation,
  useGetAnalyzesQuery,
} = analysisApi;
