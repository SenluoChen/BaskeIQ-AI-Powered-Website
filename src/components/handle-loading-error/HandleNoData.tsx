import React from 'react';
import { Box, Typography } from '@mui/material';
import { ReportGmailerrorred } from '@mui/icons-material';

type HandleNoDataProps = {
  isEmpty: boolean;
  children: React.ReactNode;
};

const HandleNoData: React.FC<HandleNoDataProps> = ({ isEmpty, children }) => {
  if (isEmpty) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
          color: 'red',
        }}>
        <ReportGmailerrorred sx={{ fontSize: 75 }} />
        <Typography variant="h5">Pas de données</Typography>
      </Box>
    );
  } else {
    return <>{children}</>;
  }
};

export default HandleNoData;
