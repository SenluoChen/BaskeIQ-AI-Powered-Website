import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate, useLocation } from 'react-router-dom';
import { CognitoErrorHandler } from '../components/error/CognitoErrorHandler';
import { useTranslation } from 'react-i18next';
import {
  confirmResetPassword,
  confirmSignIn,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  signIn,
  signUp,
} from 'aws-amplify/auth/cognito';
import { useAppContext } from '../components/authentication/account';
import { useState } from 'react';
import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material';

const validatePassword = (password: string): string | undefined => {
  const hasNumber = /\d/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  if (!isLongEnough) return 'Le mot de passe doit contenir au moins 8 caractères.';
  if (!hasNumber || !hasLowercase || !hasUppercase || !hasSpecialChar) {
    return 'Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial.';
  }
  return undefined;
};

export default function WelcomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [pageType, setPageType] = React.useState<
'signIn' | 'forgotPassword' | 'signUp' |'confirmSignUp' | 'confirmSignIn'
  >('signIn');

  const { userHasAuthenticated } = useAppContext();
  const [mailError, setMailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [codeSent, setCodeSent] = React.useState(false);
  const [codeError, setCodeError] = React.useState('');
  const [isLoadingResendCode, setIsLoadingResendCode] = React.useState(false);
  const [isLoadingConfirmSignUp, setIsLoadingConfirmSignUp] = React.useState(false);
  const [isLoadingConfirmSignIn, setIsLoadingConfirmSignIn] = React.useState(false);
  const [isLoadingConfirmPassword, setIsLoadingConfirmPassword] = React.useState(false);
  const [isLoadingSignUp, setIsLoadingSignUp] = React.useState(false);
  const [isLoadingSignIn, setIsLoadingSignIn] = React.useState(false);
  const [errorResendCode, setErrorResendCode] = React.useState('');
  const [errorConfirmSignUp, setErrorConfirmSignUp] = React.useState('');
  const [errorConfirmSignIn, setErrorConfirmSignIn] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmitSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try{
      setIsLoadingSignUp(true);
    
      const errors: { [key: string]: string } = {};

      Object.keys(formValues).forEach((key) => {
        if (key !== 'termsAccepted' && formValues[key as keyof typeof formValues] === '') {
          errors[key] = 'Ce champ est requis.';
        }
      });

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formValues.email && !emailRegex.test(formValues.email)) {
        errors.email = 'Adresse e-mail invalide.';
      }

      const passwordError = validatePassword(formValues.password);
      if (passwordError) {
        errors.password = passwordError;
      }

      if (formValues.password !== formValues.confirmPassword) {
        errors.confirmPassword = 'Les mots de passe ne correspondent pas.';
      }

      if (!formValues.termsAccepted) {
        errors.termsAccepted = "Vous devez accepter les conditions d'utilisation.";
      }
      setFormErrors(errors);

      if (Object.keys(errors).length === 0) {
      
        const { nextStep } = await signUp({
          username: formValues['email'].toLocaleLowerCase(),
          password: formValues['password'],
          options: {
            userAttributes: {
              email: formValues['email'].toLowerCase() as string,
            },
          },
        });
        const signInStep = nextStep?.signUpStep;
        if (signInStep === 'CONFIRM_SIGN_UP') {
          setPassword(formValues['password'])
          setEmail(formValues['email'].toLocaleLowerCase());
          setPageType('confirmSignUp')
        } else {
          const origin = location.state?.from?.pathname || '/root/dashboard';
          userHasAuthenticated(true);
          navigate(origin === '/' ? '/root/dashboard' : origin);
        }
      }
    } catch (error: any) {
      setFormErrors({email: CognitoErrorHandler(error, t)});
    } finally {
      setIsLoadingSignUp(false);
    }
  };

  const handleSubmitSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsLoadingSignIn(true);
      resetError();
      const data = new FormData(event.currentTarget);
      const mail = data.get('mail');
      const password = data.get('password');
      if (!mail) {
        setMailError(t('error.missing.mail') as string);
      }
      if (!password) {
        setPasswordError(t('error.missing.password') as string);
      }

      if (mail && password) {
        const signInResult = await signIn({
          username: (mail as string).toLocaleLowerCase(),
          password: password as string,
        });
        const signInStep = signInResult.nextStep?.signInStep;
        if (signInStep === 'CONFIRM_SIGN_UP') {
          setPassword(password as string)
          setEmail(mail as string);
          setPageType('confirmSignUp')
        } if (signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          setPassword(password as string)
          setEmail(mail as string);
          setPageType('confirmSignIn')
        } else {
          const origin = location.state?.from?.pathname || '/root/dashboard';
          userHasAuthenticated(true);
          navigate(origin === '/' ? '/root/dashboard' : origin);
        }
      }
    } catch (error: any) {
      setMailError(CognitoErrorHandler(error, t));
    } finally {
      setIsLoadingSignIn(false);
    }
  };

  const resetError = () => {
    setMailError('');
    setCodeError('');
    setPasswordError('');
    setConfirmPasswordError('');
  };

  const handleSubmitForgotPassword = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    resetError();
    const form = event.currentTarget;
    const data = new FormData(event.currentTarget);
    const mail = data.get('mail');
    if (!mail) {
      setMailError(t('error.missing.mail') as string);
    }
    if (mail) {
      (async () => {
        try {
          await resetPassword({
            username: (mail as string).trim().toLocaleLowerCase(),
          });
          setCodeSent(true);
          setEmail(mail as string);
          form.reset();
        } catch (err: Error | any) {
          setMailError(CognitoErrorHandler(err, t));
        }
      })();
    }
  };

  async function handleResendCode() {
    try { 
      setIsLoadingResendCode(true);
      await resendSignUpCode({
        username: email,
      });
    } catch (error: any) {
      setErrorResendCode(t('error.errorTryAgain') as string);
    } finally {
      setIsLoadingResendCode(false);
    }
  }

  const handleSubmitConfirmSignIn = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    resetError();
    const data = new FormData(event.currentTarget);
    const password = data.get('password');
    const confirmPasswordData = data.get('confirmPassword');
    if (!password) {
      setPasswordError(t('error.missing.password') as string);
    }
    if (password !== confirmPasswordData) {
      setConfirmPasswordError(t('error.errorNotSamePassword') as string);
    }
    if (
      password &&
      confirmPasswordData &&
      password === confirmPasswordData
    ) {
      (async () => {
        try {
          setIsLoadingConfirmSignIn(true);
          await confirmSignIn({
            challengeResponse: String(password)
          });
          const origin = location.state?.from?.pathname || '/root/dashboard';
          userHasAuthenticated(true);
          navigate(origin === '/' ? '/root/dashboard' : origin);
        } catch (err: Error | any) {
          console.log(err);
          setErrorConfirmSignIn(CognitoErrorHandler(err, t));
        } finally {
          setIsLoadingConfirmSignIn(false);
        }
      })();
    }
  };

  const handleSubmitConfirmSignUp = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    resetError();
    const data = new FormData(event.currentTarget);
    const code = String(data.get('code'));
    if (code.length !== 6) {
      setErrorConfirmSignUp('Veuillez entrer les 6 chiffres.');
      return;
    }
    try {
      setIsLoadingConfirmSignUp(true);
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      await signIn({
        username: email,
        password: password,
      });
      const origin = location.state?.from?.pathname || '/root/dashboard';
      userHasAuthenticated(true);
      navigate(origin === '/' ? '/root/dashboard' : origin);
    } catch (error: any) {
      switch (error.name) {
      case 'ExpiredCodeException':
        setErrorConfirmSignUp(t('error.errorBadCode') as string);
        break;
      case 'CodeMismatchException':
        setErrorConfirmSignUp(t('error.errorBadCode') as string);
        break;
      default:
        setErrorConfirmSignUp(t('error.errorBadCode') as string);
        break;
      }
    } finally {
      setIsLoadingConfirmSignUp(false);
    }
  };

  const handleSubmitConfirmPassword = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    resetError();
    const data = new FormData(event.currentTarget);
    const code = data.get('code');
    const password = data.get('password');
    const confirmPasswordData = data.get('confirmPassword');
    if (!code) {
      setCodeError(t('error.missing.code') as string);
    }
    if (!password) {
      setPasswordError(t('error.missing.password') as string);
    }
    if (password !== confirmPasswordData) {
      setConfirmPasswordError(t('error.errorNotSamePassword') as string);
    }

    if (
      code &&
      password &&
      confirmPasswordData &&
      password === confirmPasswordData
    ) {
      (async () => {
        try {
          setIsLoadingConfirmPassword(true);
          await confirmResetPassword({
            username: email.toLocaleLowerCase(),
            confirmationCode: code as string,
            newPassword: password as string,
          });
          setPageType('signIn');
        } catch (err: Error | any) {
          setCodeError(CognitoErrorHandler(err, t));
        } finally {
          setIsLoadingConfirmPassword(true);
        }
      })();
    }
  };

  return (
    <Box sx={{ flex: 1,  minHeight: '100vh', bgcolor: '#f4f6f8', mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative' }}>
      {pageType === 'signIn' && (
        <Box sx={{maxWidth: 500}}>
          <Box sx={{maxWidth: 400}}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: 8 }}>
              {t('page.welcomePage.signIn.title')}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {t('page.welcomePage.signIn.subTitle')}
            </Typography>

            <Box
              sx={{display: 'flex', flexDirection: 'column'}}
              component="form"
              onSubmit={handleSubmitSignIn}
              noValidate>

              <TextField
                margin="normal"
                required
                fullWidth
                id="mail"
                label={t('page.welcomePage.signIn.form.mail')}
                name="mail"
                autoComplete="mail"
                autoFocus
                error={mailError !== ''}
                helperText={mailError}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t('page.welcomePage.signIn.form.password')}
                type="password"
                id="password"
                autoComplete="current-password"
                error={passwordError !== ''}
                helperText={passwordError}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Link onClick={() => setPageType('forgotPassword')} underline="hover">
                  {t('page.welcomePage.signIn.forgotPassword')}
                </Link>
              </Box>

              <Button disabled={isLoadingSignIn} variant="contained" type='submit' fullWidth sx={{ mb: 2, width: '60%', alignSelf: 'center' }}>
                {t('page.welcomePage.signInLabel')}
              </Button>
            </Box>
          </Box>

          <Typography variant="body2" sx={{alignSelf: 'center' }}>
            {t('page.welcomePage.signIn.alreadyAccount')}{' '}
            <Link onClick={() => setPageType('signUp')} underline="hover">
              {t('page.welcomePage.signIn.signUpFree')}
            </Link>
          </Typography>
        </Box>
      )}
      {pageType === 'forgotPassword' && (
        <Box sx={{maxWidth: 500}}>
          {codeSent ? (
            <>
              <Typography component="h1" variant="h5">
                {t('page.welcomePage.forgotPassword.title2')}
              </Typography>
              <Typography variant="body2">
                {t('page.welcomePage.forgotPassword.description2')}
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmitConfirmPassword}
                noValidate
                sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="code"
                  label={t('page.welcomePage.forgotPassword.form.code')}
                  name="code"
                  type="code"
                  autoComplete="code"
                  autoFocus
                  error={codeError !== ''}
                  helperText={codeError}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label={t('page.welcomePage.forgotPassword.form.password')}
                  name="password"
                  type="password"
                  autoComplete="password"
                  autoFocus
                  error={passwordError !== ''}
                  helperText={passwordError}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="confirmPassword"
                  label={t('page.welcomePage.forgotPassword.form.confirmPassword')}
                  name="confirmPassword"
                  type="password"
                  autoComplete="confirmPassword"
                  autoFocus
                  error={confirmPasswordError !== ''}
                  helperText={confirmPasswordError}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoadingConfirmPassword}
                  sx={{ mt: 3, mb: 2, width: '60%', alignSelf: 'center'}}>
                  {t('page.welcomePage.forgotPassword.changePassword')}
                </Button>
                <Button
                  onClick={() => setPageType('signIn')}
                  disabled={isLoadingConfirmPassword}
                  variant="outlined"
                  sx={{ mt: 3, mb: 2, width: '40%', alignSelf: 'center'}}>
                  {t('page.welcomePage.forgotPassword.back')}
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography component="h1" variant="h5">
                {t('page.welcomePage.forgotPassword.title1')}
              </Typography>
              <Typography variant="body2">
                {t('page.welcomePage.forgotPassword.description1')}
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmitForgotPassword}
                noValidate
                sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="mail"
                  label={t('page.welcomePage.forgotPassword.form.mail')}
                  name="mail"
                  type="mail"
                  autoComplete="mail"
                  autoFocus
                  error={mailError !== ''}
                  helperText={mailError}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, width: '60%', alignSelf: 'center' }}>
                  {t('page.welcomePage.forgotPassword.sendCode')}
                </Button>
                <Button
                  onClick={() => {
                    setPageType('signIn');
                    setCodeSent(false);
                  }}
                  variant="outlined"
                  sx={{ mt: 3, mb: 2, width: '60%', alignSelf: 'center' }}>
                  {t('page.welcomePage.forgotPassword.back')}
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}
      {pageType === 'signUp' && (
        <Box sx={{maxWidth: 800}}>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: 8 }}>
                Créer un compte
          </Typography>
          <Box sx={{display: 'flex', flexDirection: 'column',alignItems: 'center', justifyContent: 'center'}} component="form" onSubmit={handleSubmitSignUp} noValidate>
            <Grid container spacing={2} maxWidth={400}>
              {['email', 'password', 'confirmPassword'].map((field, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    required
                    fullWidth
                    name={field}
                    label={t('page.welcomePage.signUp.form.'+field)}
                    type={field.toLowerCase().includes('password') ? 'password' : 'text'}
                    value={formValues[field as keyof typeof formValues]}
                    onChange={handleChange}
                    error={!!formErrors[field]}
                    helperText={formErrors[field]}
                  />
                </Grid>
              ))}
            </Grid>
            <FormControlLabel
              sx={{alignSelf: 'center'}}
              control={
                <Checkbox
                  name="termsAccepted"
                  checked={formValues.termsAccepted}
                  onChange={handleChange}
                />
              }
              label="J'accepte les conditions d'utilisation."
            />
            {formErrors.termsAccepted && (
              <Typography sx={{alignSelf: 'center'}} variant="body2" color="error">
                {formErrors.termsAccepted}
              </Typography>
            )}
            <Button disabled={isLoadingSignUp} variant="contained" type="submit" sx={{ mt: 3, mb: 2, width: '40%', alignSelf: 'center' }}>
              {t('page.welcomePage.signUpLabel')}
            </Button>
          </Box><Typography variant="body2" align="center">
            {t('page.welcomePage.signUp.alreadyAccount')}{' '}
            <Link onClick={() => setPageType('signIn')} underline="hover">
              {t('page.welcomePage.signInLabel')}
            </Link>
          </Typography>
        </Box>
      )}
      {pageType === 'confirmSignUp' && (
        <Box sx={{maxWidth: 500}}>
          <Typography component="h1" variant="h5">
            {t('page.welcomePage.confirmSignUp.title')}
          </Typography>
          <Typography variant="body2">
            {t('page.welcomePage.confirmSignUp.description')}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmitConfirmSignUp}
            noValidate
            sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="code"
              label={t('page.welcomePage.confirmSignUp.form.code')}
              name="code"
              type="code"
              autoComplete="code"
              autoFocus
              error={errorConfirmSignUp !== ''}
              helperText={errorConfirmSignUp}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoadingConfirmSignUp}
              sx={{ mt: 3, mb: 2, width: '50%', alignSelf: 'center'}}>
              {t('page.welcomePage.confirmSignUp.confirm')}
            </Button>
            <Button
              onClick={() => handleResendCode()}
              variant="outlined"
              disabled={isLoadingResendCode}
              sx={{ mt: 3, mb: 2, width: '40%', alignSelf: 'center'}}>
              {t('page.welcomePage.confirmSignUp.resendCode')}
            </Button>
            {errorResendCode && (
              <Typography sx={{alignSelf: 'center'}} variant="body2" color="error">
                {errorResendCode}
              </Typography>
            )}
          </Box>
        </Box>
      )}
      {pageType === 'confirmSignIn' && (
        <Box sx={{maxWidth: 500}}>
          <Typography component="h1" variant="h5">
            {t('page.welcomePage.confirmSignIn.title')}
          </Typography>
          <Typography variant="body2">
            {t('page.welcomePage.confirmSignIn.description')}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmitConfirmSignIn}
            noValidate
            sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label={t('page.welcomePage.confirmSignIn.form.password')}
              name="password"
              type="password"
              autoComplete="password"
              autoFocus
              error={passwordError !== ''}
              helperText={passwordError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label={t('page.welcomePage.confirmSignIn.form.confirmPassword')}
              name="confirmPassword"
              type="password"
              autoComplete="confirmPassword"
              autoFocus
              error={confirmPasswordError !== ''}
              helperText={confirmPasswordError}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoadingConfirmSignIn}
              sx={{ mt: 3, mb: 2, width: '60%', alignSelf: 'center'}}>
              {t('page.welcomePage.confirmSignIn.changePassword')}
            </Button>
            {errorConfirmSignIn && <FormHelperText>{errorConfirmSignIn}</FormHelperText>}
          </Box>
        </Box>
      )}
    </Box>
  );
};
