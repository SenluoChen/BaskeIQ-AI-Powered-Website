import { createContext, useContext } from 'react';

export interface AppContextType {
  isAuthenticating: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  userHasAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType>({
  isAuthenticating: false,
  isAuthenticated: false,
  isLoading: false,
  isError: false,
  userHasAuthenticated: useAppContext,
  setIsLoading: useAppContext,
  setIsError: useAppContext,
});

export function useAppContext() {
  return useContext(AppContext);
}
