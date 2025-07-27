import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Avatar,
  CircularProgress,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PostUser, PostUserResponse } from '../../types/User.type';
import { usePostUserMutation, useGetUserMutation } from '../../store/api/UserApi';
import { setUser } from '../../store/slices/userSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';

const steps = ['Nom d\'utilisateur', 'Position', 'Taille', 'Poids', 'Photo'];

const UserSetupModal = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<PostUser>({
    username: '',
    position: 'Point Guard',
    height: 180,
    weight: 75,
    filename: '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key in keyof PostUser]?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [postUser] = usePostUserMutation();
  const [getUser] = useGetUserMutation();

  const validateStep = (): boolean => {
    const newErrors: typeof errors = {};

    if (activeStep === 0) {
      const username = formData.username.trim();
      if (username.length < 3 || username.length > 24) {
        newErrors.username = 'Le nom d\'utilisateur doit contenir entre 3 et 24 caractères.';
      }
    } else if (activeStep === 2) {
      if (formData.height < 90 || formData.height > 300) {
        newErrors.height = 'La taille doit être comprise entre 90 et 300 cm.';
      }
    } else if (activeStep === 3) {
      if (formData.weight < 25 || formData.weight > 300) {
        newErrors.weight = 'Le poids doit être compris entre 25 et 300 kg.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (activeStep === steps.length - 1) {
      uploadImageAndSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (key: keyof PostUser, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const uploadImageAndSubmit = async () => {
    if (!photo) return;
    setIsSubmitting(true);

    try {
      const response = await postUser({ ...formData, filename: photo.name }).unwrap() as PostUserResponse;

      await fetch(response.uploadUrl, {
        method: 'PUT',
        body: photo,
      });

      const userResponse = await getUser().unwrap();
      if (userResponse !== null) {
        dispatch(setUser(userResponse));
        onClose();
      }
    } catch (error) {
      console.error('Erreur lors de la création du profil :', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
    case 0:
      return (
        <TextField
          label="Nom d'utilisateur"
          value={formData.username}
          fullWidth
          error={!!errors.username}
          helperText={errors.username}
          onChange={(e) => handleChange('username', e.target.value)}
        />
      );
    case 1:
      return (
        <FormControl fullWidth>
          <InputLabel>Poste</InputLabel>
          <Select
            value={formData.position}
            onChange={(e) => handleChange('position', e.target.value)}
            label="Poste"
          >
            {['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'].map((pos) => (
              <MenuItem key={pos} value={pos}>{pos}</MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    case 2:
      return (
        <TextField
          label="Taille (cm)"
          type="number"
          fullWidth
          value={formData.height}
          error={!!errors.height}
          helperText={errors.height}
          onChange={(e) => handleChange('height', Number(e.target.value))}
        />
      );
    case 3:
      return (
        <TextField
          label="Poids (kg)"
          type="number"
          fullWidth
          value={formData.weight}
          error={!!errors.weight}
          helperText={errors.weight}
          onChange={(e) => handleChange('weight', Number(e.target.value))}
        />
      );
    case 4:
      return (
        <Box sx={{ textAlign: 'center' }}>
          {photo && (
            <Avatar
              src={URL.createObjectURL(photo)}
              sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
            />
          )}
          <Button variant="contained" component="label">
              Choisir une photo
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) setPhoto(e.target.files[0]);
              }}
            />
          </Button>
        </Box>
      );
    default:
      return null;
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm" disableEscapeKeyDown>
      <DialogTitle>Profil Obligatoire</DialogTitle>
      <DialogContent>
        {isSubmitting ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Création de votre profil en cours...</Typography>
          </Box>
        ) : (
          <>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mt: 3 }}>{renderStep()}</Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <IconButton disabled={activeStep === 0} onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
              <Button onClick={handleNext} variant="contained">
                {activeStep === steps.length - 1 ? 'Finaliser' : 'Suivant'}
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserSetupModal;
