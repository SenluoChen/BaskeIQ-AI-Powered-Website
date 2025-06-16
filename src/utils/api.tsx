import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { store } from '../store/store';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { logoutAll } from '../store/actions';
import { setError } from '../store/slices/errorSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  prepareHeaders: async (headers) => {
    let accessToken = '';
    try {
      const { tokens } = await fetchAuthSession({ forceRefresh: true });
      accessToken = tokens?.accessToken?.toString() ?? '';
    } catch (error) {
      accessToken = '';
      await signOut();
      store.dispatch(logoutAll());
      store.dispatch(setError('FailedToAuth'));
      throw new Error('FailedToAuth');
    }
    headers.set('Authorization', `Bearer ${accessToken}`);
    return headers;
  },
});
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    store.dispatch(setError('ErrorOccured'));
    throw new Error('ErrorOccured');
  }
  return result;
};
