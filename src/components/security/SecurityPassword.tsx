import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  ButtonGroup,
} from '@mui/material';
import { updatePassword, resetPassword } from 'aws-amplify/auth';
import { Colors } from '../../styles/Colors';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { CognitoErrorHandler } from '../error/CognitoErrorHandler';
import { useTranslation } from 'react-i18next';

const SecurityPassword: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleForgotPasswordEmailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForgotPasswordEmail(e.target.value);
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
    setPasswords({ oldPassword: '', newPassword: '' });
    setError('');
  };

  const handleForgotModalOpen = () => setIsForgotModalOpen(true);
  const handleForgotModalClose = () => {
    setIsForgotModalOpen(false);
    setForgotPasswordEmail('');
    setError('');
  };

  async function handleUpdatePassword() {
    try {
      setIsLoading(true);
      setError('');
      await updatePassword(passwords);
      handleModalClose();
    } catch (err: Error | any) {
      setError(CognitoErrorHandler(err, t));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword() {
    try {
      setIsLoading(true);
      setError('');
      await resetPassword({ username: forgotPasswordEmail });
      handleForgotModalClose();
      alert('Un email de réinitialisation a été envoyé.');
    } catch (err: Error | any) {
      setError(CognitoErrorHandler(err, t));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Mot de passe et sécurité
      </Typography>
      <Typography variant="h6">Information de connexion</Typography>
      <Typography sx={{ color: Colors.darkGrey }} variant="body2" mb={2}>
        Modifier vos informations de connexion ou réinitialiser votre mot de
        passe.
      </Typography>
      <ButtonGroup orientation="vertical" fullWidth>
        <Button
          sx={{
            justifyContent: 'space-between',
            padding: 1,
            paddingX: 2,
            backgroundColor: 'white',
            boxShadow: 'none',
            border: '1px solid',
            borderColor: Colors.darkGrey,
            color: 'black',
            '&:hover': {
              backgroundColor: Colors.background,
              boxShadow: 'none',
            },
          }}
          variant="contained"
          fullWidth
          onClick={handleModalOpen}
          endIcon={<KeyboardArrowRightIcon fontSize="large" />}>
          Changer le mot de passe
        </Button>
        <Button
          sx={{
            justifyContent: 'space-between',
            padding: 1,
            paddingX: 2,
            backgroundColor: 'white',
            boxShadow: 'none',
            border: '1px solid',
            borderColor: Colors.darkGrey,
            color: 'black',
            '&:hover': {
              backgroundColor: Colors.background,
              boxShadow: 'none',
            },
          }}
          variant="contained"
          fullWidth
          onClick={handleForgotModalOpen}
          endIcon={<KeyboardArrowRightIcon fontSize="large" />}>
          Mot de passe oublié
        </Button>
      </ButtonGroup>

      {/* Modal for Changing Password */}
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: '90%',
            maxWidth: 700,
          }}>
          <Typography id="modal-title" variant="h6" mb={2}>
            Modifier le mot de passe
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Le nouveau mot de passe doit respecter les règles suivantes :
          </Typography>
          <ul style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
            <li>
              <Typography variant="body2">Au moins 7 caractères.</Typography>
            </li>
            <li>
              <Typography variant="body2">Au moins une lettre.</Typography>
            </li>
            <li>
              <Typography variant="body2">Au moins un chiffre.</Typography>
            </li>
            <li>
              <Typography variant="body2">
                Au moins un caractère spécial (@, $, !, %, *, ?, &).
              </Typography>
            </li>
          </ul>
          <TextField
            label="Mot de passe actuel"
            name="oldPassword"
            type="password"
            fullWidth
            margin="normal"
            value={passwords.oldPassword}
            onChange={handleInputChange}
          />
          <TextField
            label="Nouveau mot de passe"
            name="newPassword"
            type="password"
            fullWidth
            margin="normal"
            value={passwords.newPassword}
            onChange={handleInputChange}
          />
          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}
          <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={handleModalClose}>
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdatePassword}
              disabled={isLoading}>
              {isLoading ? 'En cours...' : 'Confirmer'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal for Forgot Password */}
      <Modal
        open={isForgotModalOpen}
        onClose={handleForgotModalClose}
        aria-labelledby="forgot-modal-title"
        aria-describedby="forgot-modal-description">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: '90%',
            maxWidth: 400,
          }}>
          <Typography id="forgot-modal-title" variant="h6" mb={2}>
            Mot de passe oublié
          </Typography>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={forgotPasswordEmail}
            onChange={handleForgotPasswordEmailChange}
          />
          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}
          <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={handleForgotModalClose}>
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={handleForgotPassword}
              disabled={isLoading}>
              {isLoading ? 'En cours...' : 'Envoyer'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default SecurityPassword;
