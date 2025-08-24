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
  const { data, error, isLoading, isSuccess, isError, refetch } = useGetMatchesQuery();
  const [postMatch, { isLoading: isCreating }] = usePostMatchMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [createError, setCreateError] = useState('');

  // 更新 Redux store
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
    } catch {
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
    <Box sx={{ backgroundColor: '#0B0F19', minHeight: '100vh', p: 3 }}>
      {/* 🏀 Matches 區塊 */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #0B0F19 0%, #0F1623 100%)', // 保留你要的深黑
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          mb: 3,
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,.45)',
        }}
      >

        {/* 標題列 */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(90deg, #FFCA28, #ffca28, #ff8f00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textShadow: '0 0 8px rgba(255,165,0,0.5)',
            }}
          >
            🏀 Matches
            <Box
              component="span"
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: '#ffca28',
                ml: 1,
                letterSpacing: 1,
              }}
            >
              AI Stats & Insights
            </Box>
          </Typography>

          <Tooltip title="Add new match">
            <IconButton
              onClick={() => setModalOpen(true)}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                boxShadow: '0 4px 12px rgba(33,150,243,.4)',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'scale(1.08)',
                  boxShadow: '0 6px 18px rgba(33,150,243,.6)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Match 列表 */}
        <Box sx={{ '& *': { color: 'inherit' } }}>
          <MatchList matches={matches.slice(0, 9)} />
        </Box>

        {/* 更多按鈕 */}
        {matches.length > 8 && (
          <Box
            onClick={() => alert('Navigate to full match list')}
            sx={{
              width: 200,
              height: 50,
              mt: 3,
              mx: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
              fontSize: '1.6rem',
              color: '#fff',
              cursor: 'pointer',
              transition: '0.2s',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.16)',
              },
            }}
          >
            …
          </Box>
        )}
      </Box>

      {/* 🧑‍🤝‍🧑 Community */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          mt: 70,
          borderRadius: 3,
          background:  'transparent',
          border: '0',
          boxShadow:
      'none',
          p: { xs: 2, sm: 3 },
          width: '100%', // 佔滿容器寬度
          minHeight: 100, // 最小高度
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow:
        'inset 0 1px 0 rgba(255,255,255,0.04), 0 28px 80px rgba(0,0,0,.55)',
          },
          '& .community-title': {
            mt: -10, // 這裡調整標題往上移
          },
        }}
      >
        <CommunityPage />
      </Box>


      {/* 🔽 Outlet */}
      <Box mt={4}>
        <Outlet />
      </Box>

      {/* ➕ Create Match Modal */}
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
            background: 'linear-gradient(180deg, #1c1c1e, #111)',
            borderRadius: 3,
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              color: '#fff',
              textAlign: 'center',
              letterSpacing: 0.5,
              textShadow: '0 0 12px rgba(255,165,0,0.4)',
            }}
          >
      Create a New Match
          </Typography>

          <TextField
            label="Match Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                backgroundColor: 'rgba(255,255,255,0.05)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: '#ffb300' },
                '&.Mui-focused fieldset': { borderColor: '#ff9800' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
            }}
          />

          {createError && (
            <Alert severity="error" sx={{ backgroundColor: '#3a1a1a', color: '#ffb4b4' }}>
              {createError}
            </Alert>
          )}

          <Button
            variant="contained"
            onClick={handleCreateMatch}
            disabled={isCreating}
            sx={{
              mt: 1,
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 999,
              px: 2,
              py: 1,
              background: 'linear-gradient(90deg, #ff8f00, #ffb300)',
              color: '#111',
              boxShadow: '0 0 10px rgba(255,152,0,0.4)', // 橘色光暈
              '&:hover': {
                background: 'linear-gradient(90deg, #ffa000, #ffc107)',
                boxShadow: '0 0 14px rgba(255,160,0,0.6)', // hover 時更亮
              },
              '&:disabled': {
                background: 'linear-gradient(90deg, #bdbdbd, #9e9e9e)',
                color: '#333',
                boxShadow: 'none',
              },
            }}
          >
            {isCreating ? 'Creating...' : 'Create'}
          </Button>

        </Box>
      </Modal>

    </Box>
  );
}
