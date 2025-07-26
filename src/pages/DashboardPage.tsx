import { useEffect } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MatchList from '../components/MatchList';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { matchSelector } from '../store/selectors/matchSelector';
import { setMatched } from '../store/slices/matchSlice';
import CommunityPage from './CommunityPage';
import { Grid } from '@mui/material';


export type MatchType = {
  id: number;
  name: string;
  date: string;
};

export default function DashboardPage() {
  const dispatch = useDispatch();
  const matches = useSelector(matchSelector).matches;

  // 載入 localStorage 比賽
  useEffect(() => {
    const saved = localStorage.getItem('matches');
    if (saved) {
      dispatch(setMatched(JSON.parse(saved)));
    }
  }, [dispatch]);

  const matchNames = [
    'Opening Game',
    'Rivalry Match',
    'Court Clash',
    'Playoff 1',
    'Playoff 2',
    'Playoff 3',
    'Championship Trial',
  ];

  const matchCount = matches.length;

  const handleAddMatch = () => {
    const name = matchNames[matchCount % matchNames.length];

    const newMatch: MatchType = {
      id: Date.now(),
      name,
      date: new Date().toISOString().slice(0, 10),
    };

    const updated = [...matches, newMatch];
    dispatch(setMatched(updated));
    localStorage.setItem('matches', JSON.stringify(updated));
  };


  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: 3 }}>
      {/* 🏀 Matchs 標題區塊 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          🏀 Matchs
        </Typography>
        <Tooltip title="新增比賽">
          <IconButton color="primary" onClick={handleAddMatch}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 📋 比賽列表（最多顯示前 8 個） */}
      <MatchList matches={matches.slice(0, 9)} />

      {/* “...” Apple 風格的更多按鈕 */}
      {matches.length > 8 && (
        <Box
          onClick={() => alert('將來跳轉至完整比賽頁')}
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

      {/* 🧑‍🤝‍🧑 社群活動區塊 */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          backgroundColor: '#fff',
          zIndex: 10,
          boxShadow: '0 -4px 12px rgba(94, 94, 94, 0.06)',
          mt: 65, // 跟上面列表拉開距離
          borderRadius: 10,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <CommunityPage />
      </Box>

      {/* 🔽 Outlet 子頁面 */}
      <Box mt={4}>
        <Outlet />
      </Box>
    </Box>
  );
}
