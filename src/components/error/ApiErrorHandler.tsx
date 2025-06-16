import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useTranslation } from 'react-i18next';
import { Snackbar } from '@mui/material';
import { isErrorSelector } from '../../store/selectors/errorSelector';
import { useSelector } from 'react-redux';

const ApiErrorHandler: React.FC = () => {
  const error = useSelector(isErrorSelector).error;
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const [message, setMessage] = useState<string>('');

  const openStack = (message: string) => {
    setMessage(message);
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    if (error) {
      switch (error) {
      case 'ExpiredSession':
        openStack(t('error.errorExpiredSession') as string);
        break;
      case 'FailedToAuth':
        openStack(t('error.errorExpiredSession') as string);
        break;
      case 'ErrorOccured':
        openStack(t('error.errorTryAgain') as string);
        break;
      default:
        openStack(t('error.errorContactSupport') as string);
        break;
      }
    }
  }, [error, t]);

  return error ? (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={20000}
      onClose={handleClose}>
      <Alert severity="error" onClose={() => setOpen(false)}>
        <AlertTitle>{t('error.error')}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  ) : (
    <></>
  );
};

export default ApiErrorHandler;
