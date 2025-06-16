import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MatchList from '../components/MatchList';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { matchSelector } from '../store/selectors/matchSelector';
import { setMatched } from '../store/slices/matchSlice';

export type MatchType = {
  id: number;
  name: string;
  date: string;
};

export default function DashboardPage() {
  const dispatch = useDispatch();
  const matches  = useSelector(matchSelector).matches;

  // ✅ 頁面載入時從 localStorage 載入比賽
  useEffect(() => {
    const saved = localStorage.getItem('matches');
    if (saved) {
      dispatch(setMatched(JSON.parse(saved)));
    }
  }, [dispatch]);

  // ✅ 新增比賽並儲存到 localStorage
  const handleAddMatch = () => {
    const newMatch: MatchType = {
      id: Date.now(),
      name: '未命名比賽',
      date: new Date().toISOString().slice(0, 10),
    };
    const updated = [...matches, newMatch];
    dispatch(setMatched(updated));
    localStorage.setItem('matches', JSON.stringify(updated));
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: 3 }}>
      {/* 🏀 標題 + 新增按鈕 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">📊 所有比賽</Typography>
        <Tooltip title="新增比賽">
          <IconButton color="primary" onClick={handleAddMatch}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 📋 比賽列表 */}
      <MatchList matches={matches} />

      {/* 🔽 子頁面 */}
      <Box mt={4}>
        <Outlet />
      </Box>
    </Box>
  );
}
