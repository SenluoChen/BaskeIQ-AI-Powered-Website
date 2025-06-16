import React from 'react';
import { useNavigate } from 'react-router';
import { Box, IconButton, Typography } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Error: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
      }}>
      <IconButton
        aria-label="delete"
        size="large"
        onClick={() => {
          navigate(0);
        }}>
        <Refresh fontSize="large" />
      </IconButton>
      <Typography variant="subtitle1" component="div">
        {t('error.errorTryAgain') as string}
      </Typography>
    </Box>
  );
};

export default Error;
