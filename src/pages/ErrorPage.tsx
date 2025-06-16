import React from 'react';
import { useRouteError } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

interface RouteError {
  statusText?: string;
  message?: string;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        justifyContent: 'center',
      }}>
      <h1>{t('page.error.title')}</h1>
      <p>{t('page.error.description')}</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </Box>
  );
}
