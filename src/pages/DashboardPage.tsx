import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Modal,
  TextField,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MatchList from '../components/MatchList';
import CommunityPage from './CommunityPage';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMatched } from '../store/slices/matchSlice';
import { useGetMatchesQuery, usePostMatchMutation } from '../store/api/MatchApi';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const {
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    refetch,
  } = useGetMatchesQuery();

  const [postMatch, { isLoading: isCreating }] = usePostMatchMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [createError, setCreateError] = useState('');

  // Update Redux store when data is fetched
  useEffect(() => {
    if (isSuccess && data?.matches) {
      dispatch(setMatched(data.matches));
    }
  }, [isSuccess, data, dispatch]);

  const handleCreateMatch = async () => {
    if (!newTitle.trim()) {
      setCreateError('Title is required');
      return;
    }

    try {
      await postMatch({ title: newTitle }).unwrap();
      setModalOpen(false);
      setNewTitle('');
      setCreateError('');
      refetch();
    } catch (err) {
      setCreateError('Failed to create match');
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box m={4}>
        <Alert severity="error">
          {typeof error === 'string' ? error : 'Failed to load matches'}
        </Alert>
      </Box>
    );
  }

  const matches = data?.matches || [];

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: 3 }}>
      {/* 🏀 Match header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          🏀 Matches
        </Typography>
        <Tooltip title="Add new match">
          <IconButton color="primary" onClick={() => setModalOpen(true)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 📋 Match list */}
      <MatchList matches={matches.slice(0, 9)} />

      {/* "..." See more button */}
      {matches.length > 8 && (
        <Box
          onClick={() => alert('Navigate to full match list')}
          sx={{
            width: 200,
            height: 70,
            margin: '35px auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#eeeeee',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(14, 14, 14, 0.15)',
            fontSize: '2rem',
            cursor: 'pointer',
            transition: '0.2s',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          ...
        </Box>
      )}

      {/* 🧑‍🤝‍🧑 Community */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          backgroundColor: '#fff',
          zIndex: 10,
          boxShadow: '0 -4px 12px rgba(94, 94, 94, 0.06)',
          mt: 65,
          borderRadius: 10,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <CommunityPage />
      </Box>

      {/* 🔽 Outlet */}
      <Box mt={4}>
        <Outlet />
      </Box>

      {/* ➕ Create match modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setNewTitle('');
          setCreateError('');
        }}
      >
        <Box
          sx={{
            width: 400,
            p: 4,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 24,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Create a New Match
          </Typography>
          <TextField
            label="Match Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            fullWidth
          />
          {createError && <Alert severity="error">{createError}</Alert>}
          <Button
            variant="contained"
            onClick={handleCreateMatch}
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
