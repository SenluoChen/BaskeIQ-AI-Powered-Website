import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../utils/api';
import { User, PostUserResponse, PostUser, PutUserResponse, PutUser } from '../../types/User.type';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUser: builder.mutation<User, void>({
      query: () => `/user`,
    }),
 

    postUser: builder.mutation<PostUserResponse, PostUser>({
      query: (body) => {
        return {
          url: '/user',
          method: 'POST',
          body,
        };
      },
    }),
    putUser: builder.mutation<PutUserResponse, PutUser>({
      query: (body) => {
        return {
          url: '/user',
          method: 'POST',
          body,
        };
      },
    }),
  }),
});

export const {
  useGetUserMutation,
  usePostUserMutation,
  usePutUserMutation,
} = userApi;
