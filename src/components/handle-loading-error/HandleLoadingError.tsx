import React from 'react';
import Error from '../error/error';
import { Box, CircularProgress, Typography } from '@mui/material';

type HandleLoadingErrorProps = {
  isError: boolean;
  isLoading: boolean;
  isAvailable?: boolean;
  children: React.ReactNode;
};

const HandleLoadingError: React.FC<HandleLoadingErrorProps> = ({
  isError,
  isLoading,
  isAvailable,
  children,
}) => {
  if (isError) {
    return <Error />;
  } else if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          minHeight: '100vh'
        }}>
        <CircularProgress color="primary" />
      </Box>
    );
  } else if (isAvailable) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}>
        <Typography variant="h6">
          Pas disponible avec votre abonnement
        </Typography>
      </Box>
    );
  } else {
    return <>{children}</>;
  }
};

export default HandleLoadingError;
