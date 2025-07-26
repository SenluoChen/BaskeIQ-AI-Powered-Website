import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Court from '../components/Court/Court'; // ✅ 改為大寫且使用正確路徑
import { TextField } from '@mui/material';


import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import PlayerStatsLineChart from '../components/PlayerStatsLineChart/PlayerStatsLineChart';
import FakeAiAdvice from '../components/useAdviceGenerato/FakeAiAdvice';

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
  const [scores, setScores] = useState([18, 22, 19, 25]);
  const totalScore = scores.reduce((a, b) => a + b, 0);

  const handleScoreChange = (index: number, value: string) => {
    const newScores = [...scores];
    newScores[index] = parseInt(value) || 0;
    setScores(newScores);
  };

  const barData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Quarter Scores',
        data: scores,
        backgroundColor: '#1976d2',
        borderRadius: 6,
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
Game ID：${matchId}
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
        Game ID：{matchId}
      </Typography>

      <Grid container spacing={3}>
        {/* 每節得分圖表 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>📊 Quarter Scores</Typography>

            <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
              {['Q1', 'Q2', 'Q3', 'Q4'].map((label, index) => (
                <Grid item xs={3} key={label}>
                  <TextField
                    fullWidth
                    label={label}
                    type="number"
                    inputProps={{ min: 0, max: 50 }}
                    value={scores[index]}
                    onChange={(e) => handleScoreChange(index, e.target.value)}
                    size="small"
                  />
                </Grid>
              ))}
            </Grid>

            <Bar data={barData} options={barOptions} />
          </Paper>

        </Grid>

        {/* 投籃熱區 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>🎯Shot Chart</Typography>
            <Typography variant="body2">Left click: made 🟢 / Right click: missed 🔴。</Typography>
            <Box mt={4}>
              <Court />
            </Box>
          </Paper>
        </Grid>
    

        <Grid item xs={4} md={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>📈 Turnover / Assist / Rebound </Typography>
            <PlayerStatsLineChart />
          </Paper>
        </Grid>


        {/* AI 賽後建議 */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
          
            <Button> 
            
              <FakeAiAdvice />
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