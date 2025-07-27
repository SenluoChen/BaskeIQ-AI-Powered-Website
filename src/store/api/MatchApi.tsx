import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../utils/api';
import {
  PostMatchBody,
  PostMatchResponse,
  GetMatchesResponse,
  DeleteMatchBody,
  DeleteMatchResponse,
  PutMatchBody,
  PutMatchResponse
} from '../../types/Match.type';

export const matchApi = createApi({
  reducerPath: 'matchApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getMatches: builder.query<GetMatchesResponse, void>({
      query: () => ({
        url: '/match',
        method: 'GET',
      }),
    }),

    postMatch: builder.mutation<PostMatchResponse, PostMatchBody>({
      query: (body) => ({
        url: '/match',
        method: 'POST',
        body,
      }),
    }),

    putMatch: builder.mutation<PutMatchResponse, PutMatchBody>({
      query: (body) => ({
        url: '/match',
        method: 'PUT',
        body,
      }),
    }),

    deleteMatch: builder.mutation<DeleteMatchResponse, DeleteMatchBody>({
      query: (body) => ({
        url: '/match',
        method: 'DELETE',
        body,
      }),
    }),
  }),
});

export const {
  useGetMatchesQuery,
  useLazyGetMatchesQuery,
  usePostMatchMutation,
  usePutMatchMutation,
  useDeleteMatchMutation,
} = matchApi;
