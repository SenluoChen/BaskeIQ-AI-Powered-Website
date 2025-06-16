import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default function MatchDetailPage() {
  const { matchId } = useParams();

  // 模擬每節得分
  const scores = [18, 22, 19, 25];
  const totalScore = scores.reduce((a, b) => a + b, 0);

  const barData = {
    labels: ['第1節', '第2節', '第3節', '第4節'],
    datasets: [
      {
        label: '得分',
        data: scores,
        backgroundColor: '#1976d2',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // 💬 AI 建議區塊狀態
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  // ⚙️ 點擊分析按鈕的處理函數
  const handleGenerateAdvice = async () => {
    setLoading(true);
    const matchStats = `
比賽 ID：${matchId}
第1節：${scores[0]}分，第2節：${scores[1]}分，第3節：${scores[2]}分，第4節：${scores[3]}分
總得分：${totalScore}分
失誤：12次
投籃命中率：45%
三分命中率：30%
罰球命中率：80%
    `;

    try {
      const res = await fetch('/api/chatgpt/generate-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchStats }),
      });
      const data = await res.json();
      setAdvice(data.result);
    } catch (err) {
      setAdvice('⚠️ 無法取得建議，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        🏟️ 比賽 ID：{matchId}
      </Typography>

      <Grid container spacing={3}>
        {/* 每節得分圖表 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">📊 每節得分</Typography>
            <Bar data={barData} options={barOptions} />
          </Paper>
        </Grid>

        {/* 總得分 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6">🔢 總得分</Typography>
            <Typography variant="h2" color="primary">
              {totalScore}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              來自 4 節總和
            </Typography>
          </Paper>
        </Grid>

        {/* 球員得分分析 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">👤 球員得分分析</Typography>
            <Typography variant="body2">這裡可以加入球員資料圖表或清單。</Typography>
          </Paper>
        </Grid>

        {/* 投籃熱區 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">🔥 投籃熱區圖</Typography>
            <Typography variant="body2">這裡可以放熱區圖或場上位置圖。</Typography>
          </Paper>
        </Grid>

        {/* 🎯 AI 賽後建議 */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">🎯 AI 賽後建議</Typography>
            <Button variant="contained" onClick={handleGenerateAdvice} disabled={loading}>
              {loading ? '分析中...' : '產生建議'}
            </Button>
            {advice && (
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mt: 2 }}>
                {advice}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      
    </Box>
  );
}
