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
import { Paper } from '@mui/material';






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
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0B0F19',
        background:
        'radial-gradient(1200px 600px at 50% -100px, rgba(255,202,40,0.08), rgba(0,0,0,0))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      {/* Shared: Dark Glass Card Style */}
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: pageType === 'signUp' ? 820 : 520,
          p: { xs: 3, md: 4 },
          borderRadius: 10,
          background:
          'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(0,0,0,0.22))',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 18px 38px rgba(0,0,0,.35)',
          color: '#E6EDF3',
        }}
      >
        {/* Title Area */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: 0.5,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              background:
              'linear-gradient(90deg, #ff8f00, #ffca28, #ff8f00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 12px rgba(255,165,0,0.4)',
            }}
          >
            {pageType === 'signIn' && 'Sign In'}
            {pageType === 'signUp' && 'Create Account'}
            {pageType === 'forgotPassword' && 'Forgot Password'}
            {pageType === 'confirmSignUp' && 'Confirm Your Account'}
            {pageType === 'confirmSignIn' && 'Set a New Password'}
          </Typography>
        </Box>

        {/* Unified Dark Input Style */}
        <Box
          sx={{
            '& .MuiTextField-root': { my: 1 },
            '& .MuiInputLabel-root': { color: 'rgba(230,237,243,0.7)' },
            '& .MuiOutlinedInput-root': {
              color: '#E6EDF3',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 2,
              '& fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.28)' },
              '&.Mui-focused fieldset': { borderColor: '#FFCA28' },
            },
            '& .MuiFormHelperText-root': { color: '#FFB74D' },
            '& a': {
              color: '#FFCA28',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            },
            '& .MuiButton-contained': {
              backgroundColor: '#FFCA28',
              color: '#0B0F19',
              fontWeight: 800,
              borderRadius: 10,
              boxShadow: '0 8px 20px rgba(255,202,40,.25)',
              '&:hover': {
                backgroundColor: '#ffb300',
                boxShadow: '0 10px 24px rgba(255,202,40,.35)',
              },
            },
            '& .MuiButton-outlined': {
              borderColor: 'rgba(255,255,255,0.24)',
              color: '#E6EDF3',
              borderRadius: 10,
              '&:hover': {
                borderColor: '#FFCA28',
                background: 'rgba(255,202,40,0.08)',
              },
            },
          }}
        >
          {/* ---------- Each Page Content ---------- */}
          {pageType === 'signIn' && (
            <Box sx={{ maxWidth: 480 }}>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: 'rgba(230,237,243,0.75)' }}
              >
              Sign in to continue.
              </Typography>

              <Box component="form" onSubmit={handleSubmitSignIn} noValidate>
                <TextField
                  required
                  fullWidth
                  id="mail"
                  name="mail"
                  label="Email"
                  autoComplete="email"
                  autoFocus
                  error={mailError !== ''}
                  helperText={mailError}
                />
                <TextField
                  required
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  error={passwordError !== ''}
                  helperText={passwordError}
                />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    my: 1,
                  }}
                >
                  <Link
                    onClick={() => setPageType('forgotPassword')}
                    underline="hover"
                  >
                  Forgot your password?
                  </Link>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    disabled={isLoadingSignIn}
                    variant="contained"
                    type="submit"
                    fullWidth
                    sx={{
                      mt: 1.5,
                      width: { xs: '100%', sm: '60%' },
                      mx: 'auto',
                      fontWeight: 900,
                    }}
                  >
                  Log In
                  </Button>
                </Box>
              </Box>

              <Typography
                variant="body2"
                sx={{ mt: 2, color: 'rgba(230,237,243,0.75)' }}
              >
              Don’t have an account?{' '}
                <Link onClick={() => setPageType('signUp')} underline="hover">
                Create one for free
                </Link>
              </Typography>
            </Box>
          )}

          {pageType === 'forgotPassword' && (
            <Box sx={{ maxWidth: 520 }}>
              {codeSent ? (
                <>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1.5, color: 'rgba(230,237,243,0.75)' }}
                  >
                  Enter the verification code and your new password.
                  </Typography>
                  <Box
                    component="form"
                    onSubmit={handleSubmitConfirmPassword}
                    noValidate
                  >
                    <TextField
                      required
                      fullWidth
                      id="code"
                      name="code"
                      label="Code"
                      error={codeError !== ''}
                      helperText={codeError}
                    />
                    <TextField
                      required
                      fullWidth
                      id="password"
                      name="password"
                      label="New Password"
                      type="password"
                      error={passwordError !== ''}
                      helperText={passwordError}
                    />
                    <TextField
                      required
                      fullWidth
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      error={confirmPasswordError !== ''}
                      helperText={confirmPasswordError}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoadingConfirmPassword}
                      sx={{
                        mt: 2,
                        mb: 1,
                        width: { xs: '100%', sm: '60%' },
                        alignSelf: 'center',
                      }}
                    >
                    Change Password
                    </Button>
                    <Button
                      onClick={() => setPageType('signIn')}
                      variant="outlined"
                      sx={{
                        width: { xs: '100%', sm: '40%' },
                        alignSelf: 'center',
                      }}
                    >
                    Back
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1.5, color: 'rgba(230,237,243,0.75)' }}
                  >
                  We’ll send you a verification code by email.
                  </Typography>
                  <Box
                    component="form"
                    onSubmit={handleSubmitForgotPassword}
                    noValidate
                  >
                    <TextField
                      required
                      fullWidth
                      id="mail"
                      name="mail"
                      type="email"
                      label="Email"
                      error={mailError !== ''}
                      helperText={mailError}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        mt: 2,
                        mb: 1,
                        width: { xs: '100%', sm: '60%' },
                        alignSelf: 'center',
                      }}
                    >
                    Send Code
                    </Button>
                    <Button
                      onClick={() => {
                        setPageType('signIn');
                        setCodeSent(false);
                      }}
                      variant="outlined"
                      sx={{
                        width: { xs: '100%', sm: '60%' },
                        alignSelf: 'center',
                      }}
                    >
                    Back
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          )}

          {pageType === 'signUp' && (
            <Box sx={{ maxWidth: 820 }}>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: 'rgba(230,237,243,0.75)' }}
              >
              Join the BasketIQ community.
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmitSignUp}
                noValidate
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Grid container spacing={2} maxWidth={500}>
                  {['email', 'password', 'confirmPassword'].map((field) => (
                    <Grid item xs={12} key={field}>
                      <TextField
                        required
                        fullWidth
                        name={field}
                        label={
                          field === 'email'
                            ? 'Email'
                            : field === 'password'
                              ? 'Password'
                              : 'Confirm Password'
                        }
                        type={field.includes('password') ? 'password' : 'email'}
                        value={formValues[field as keyof typeof formValues]}
                        onChange={handleChange}
                        error={!!formErrors[field]}
                        helperText={formErrors[field]}
                      />
                    </Grid>
                  ))}
                </Grid>

                <FormControlLabel
                  sx={{ mt: 1 }}
                  control={
                    <Checkbox
                      name="termsAccepted"
                      checked={formValues.termsAccepted}
                      onChange={handleChange}
                      sx={{
                        color: 'rgba(255,255,255,0.5)',
                        '&.Mui-checked': { color: '#FFCA28' },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(230,237,243,0.8)' }}
                    >
                    I agree to the Terms of Service.
                    </Typography>
                  }
                />
                {formErrors.termsAccepted && (
                  <Typography variant="body2" color="#FFB74D">
                    {formErrors.termsAccepted}
                  </Typography>
                )}

                <Button
                  disabled={isLoadingSignUp}
                  variant="contained"
                  type="submit"
                  sx={{
                    mt: 2,
                    mb: 1,
                    width: { xs: '100%', sm: '50%' },
                    alignSelf: 'center',
                  }}
                >
                Create Account
                </Button>
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(230,237,243,0.75)' }}
                >
                Already have an account?{' '}
                  <Link onClick={() => setPageType('signIn')} underline="hover">
                  Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          )}

          {pageType === 'confirmSignUp' && (
            <Box sx={{ maxWidth: 520 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1.5, color: 'rgba(230,237,243,0.75)' }}
              >
              Enter the 6-digit code sent to your email.
              </Typography>
              <Box component="form" onSubmit={handleSubmitConfirmSignUp} noValidate>
                <TextField
                  required
                  fullWidth
                  id="code"
                  name="code"
                  label="Code"
                  error={errorConfirmSignUp !== ''}
                  helperText={errorConfirmSignUp}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoadingConfirmSignUp}
                  sx={{
                    mt: 2,
                    mb: 1,
                    width: { xs: '100%', sm: '50%' },
                    alignSelf: 'center',
                  }}
                >
                Confirm
                </Button>
                <Button
                  onClick={handleResendCode}
                  variant="outlined"
                  disabled={isLoadingResendCode}
                  sx={{
                    width: { xs: '100%', sm: '40%' },
                    alignSelf: 'center',
                  }}
                >
                Resend Code
                </Button>
                {errorResendCode && (
                  <Typography variant="body2" color="#FFB74D" sx={{ mt: 1 }}>
                    {errorResendCode}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {pageType === 'confirmSignIn' && (
            <Box sx={{ maxWidth: 520 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1.5, color: 'rgba(230,237,243,0.75)' }}
              >
              Set your new password.
              </Typography>
              <Box component="form" onSubmit={handleSubmitConfirmSignIn} noValidate>
                <TextField
                  required
                  fullWidth
                  id="password"
                  name="password"
                  label="New Password"
                  type="password"
                  error={passwordError !== ''}
                  helperText={passwordError}
                />
                <TextField
                  required
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  error={confirmPasswordError !== ''}
                  helperText={confirmPasswordError}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoadingConfirmSignIn}
                  sx={{
                    mt: 2,
                    width: { xs: '100%', sm: '60%' },
                    alignSelf: 'center',
                  }}
                >
                Change Password
                </Button>
                {errorConfirmSignIn && (
                  <Typography variant="body2" color="#FFB74D" sx={{ mt: 1 }}>
                    {errorConfirmSignIn}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );

}