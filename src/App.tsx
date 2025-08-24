import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import { Provider } from 'react-redux';
import {
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ThemeProvider,
} from '@mui/material';
import { ResourcesConfig, Amplify } from 'aws-amplify';
import {
  cognitoUserPoolsTokenProvider,
  getCurrentUser,
} from 'aws-amplify/auth/cognito';
import { defaultStorage } from 'aws-amplify/utils';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { store } from './store/store';
import './i18n';
import { router } from './routes/router';
import ApiErrorHandler from './components/error/ApiErrorHandler';
import { AppContext } from './components/authentication/account';
import { MatchProvider } from './contexts/MatchContext';
import { Colors } from './styles/Colors';

const GOOGLE_LIBRARIES: (
  | 'places'
  | 'drawing'
  | 'geometry'
  | 'visualization'
)[] = ['places'];

const authConfig: ResourcesConfig['Auth'] = {
  Cognito: {
    userPoolId: process.env.REACT_APP_USER_POOL_ID_ADMIN || 'test',
    userPoolClientId: process.env.REACT_APP_CLIENT_ID_ADMIN || 'test',
  },
};

Amplify.configure({ Auth: authConfig });
cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);


const theme = createTheme({
  typography: {
    fontFamily: 'Muli, Arial, sans-serif',
    h1: { fontFamily: 'Muli-Bold' },
    h2: { fontFamily: 'Muli-Bold' },
    h3: { fontFamily: 'Muli-SemiBold' },
    h4: { fontFamily: 'Muli-SemiBold' },
    h5: { fontFamily: 'Muli-SemiBold' },
    h6: { fontFamily: 'Muli-Light' },
    subtitle1: { fontFamily: 'Muli-Italic' },
    subtitle2: { fontFamily: 'Muli-Italic' },
    body1: { fontFamily: 'Muli' },
    body2: { fontFamily: 'Muli' },
    button: { fontFamily: 'Muli-Bold' },
  },
  palette: {
   
    primary: {
      main: "#0B0F19",
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#FFFFFF',   // 全域主要文字白色
      secondary: '#CCCCCC', // 次要文字淡灰
    },
    background: {
      default: '#0B0F19',   // 全域背景 → 深色
      paper: '#121212',     // 卡片底色（可以透明也行）
    },
    
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Muli-Bold',
          textTransform: 'none',
        },
        containedPrimary: {
          backgroundColor: Colors.primary,
          '&:hover': {
            backgroundColor: Colors.primaryHover,
          },
        },
        outlinedPrimary: {
          borderColor: Colors.primary,
          '&:hover': {
            borderColor: Colors.primaryHover,
            backgroundColor: Colors.secondDarkGrey,
          },
        },
        containedSecondary: {
          color: Colors.secondary,
          backgroundColor: Colors.third,
          '&:hover': {
            backgroundColor: Colors.third,
          },
        },
        outlinedSecondary: {
          borderColor: Colors.third,
          '&:hover': {
            borderColor: Colors.third,
            backgroundColor: Colors.brightBlue,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Muli-Bold',
          color: Colors.white,
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: Colors.darkGrey,
          },
          '&.Mui-disabled': {
            backgroundColor: Colors.secondDarkGrey,
            color: Colors.white,
          },
        },
        colorPrimary: {
          color: Colors.white,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: 'Muli',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: 'Muli-SemiBold',
          textDecoration: 'none',
          color: '#0077cc',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // PWA 安裝提示
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      if (!localStorage.getItem('pwaInstallPrompted')) {
        setDeferredPrompt(e);
        setShowInstallButton(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      localStorage.setItem('pwaInstallPrompted', 'true');
    }
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  // 初次載入：檢查登入狀態
  useEffect(() => {
    const init = async () => {
      try {
        const user = await getCurrentUser();
        console.log('User loaded:', user);
        userHasAuthenticated(true);
      } catch (error) {
        console.warn('User not authenticated:', error);
        userHasAuthenticated(false);
      } finally {
        setIsAuthenticating(false);
      }
    };
    init();
  }, []);

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_API_GOOGLE_MAP_KEY ?? 'test'}
      libraries={GOOGLE_LIBRARIES}
    >



      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <AppContext.Provider
            value={{
              isAuthenticating,
              isAuthenticated,
              isLoading,
              isError,
              userHasAuthenticated,
              setIsLoading,
              setIsError,
            }}
          >
            <MatchProvider>
              <ApiErrorHandler />
              <RouterProvider router={router} />

              {/* PWA 安裝提示 Dialog */}
              <Dialog open={showInstallButton} onClose={() => setShowInstallButton(false)}>
                <DialogTitle>📲 Installer l&apos;application ?</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Vous pouvez installer cette application sur votre appareil pour un accès plus rapide, même hors ligne.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => {
                      localStorage.setItem('pwaInstallPrompted', 'true');
                      setShowInstallButton(false);
                    }}
                  >
                    Plus tard
                  </Button>
                  <Button variant="contained" onClick={handleInstallClick} autoFocus>
                    Installer
                  </Button>
                </DialogActions>
              </Dialog>
            </MatchProvider>
          </AppContext.Provider>
        </Provider>
      </ThemeProvider>
    </LoadScript>
  );
}

export default App;
