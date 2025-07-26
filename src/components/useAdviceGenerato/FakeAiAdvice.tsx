import { Box, Button, Typography, Grid } from '@mui/material';
import { useState } from 'react';

const mockAdvices = [
  'Scoring improved significantly in Q2 — consider analyzing if there were changes in offensive strategy.',
  'Rebounds dropped in Q3 — may indicate a need to improve boxing out and help-side awareness.',
  'Assists remained steady — a sign of strong team coordination that should be maintained.'
];

const extraAdvices = [
  'AI Insight: Defensive struggles were concentrated in Q1 — consider reviewing the opening defensive setup.',
  'AI Insight: Turnover count is high — ball handling and passing stability may need improvement.',
  'AI Insight: Inconsistent shooting performance — consider adjusting substitutions and shot.'
];

export default function FakeAiAdvice() {
  const [adviceList, setAdviceList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateAdvice = () => {
    setLoading(true);
    setTimeout(() => {
      setAdviceList(mockAdvices);
      setLoading(false);
    }, 1500);
  };

  return (
    <Box mt={3}>
      {/* 標題與按鈕：垂直排版 */}
      <Box mb={3}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          🧠 AI Insights
        </Typography>
        <Button
          onClick={handleGenerateAdvice}
          disabled={loading}
          sx={{
            backgroundColor: '#f2f2f7',
            color: '#000',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1.5,
            '&:hover': {
              backgroundColor: '#e5e5ea',
            },
            '&:disabled': {
              backgroundColor: '#f2f2f7',
              color: '#aaa',
            },
          }}
        >
          {loading ? 'Analyse en cours...' : 'Générer'}
        </Button>
      </Box>

      {/* 建議清單區塊 */}
      {adviceList.length > 0 && (
        <Grid container spacing={4}>
          {/* 左欄：Key Suggestions */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              📄 Key Suggestions
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {adviceList.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    marginBottom: '0.8rem',
                    listStyleType: 'disc',
                    listStylePosition: 'outside',
                    paddingLeft: '0.5rem',
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: 'left',
                      lineHeight: 1.7,
                      display: 'block',
                    }}
                  >
                    {item}
                  </Typography>
                </li>
              ))}
            </Box>
          </Grid>

          {/* 右欄：Advanced Recommendations */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              💡 Advanced Recommendations
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {extraAdvices.map((item, idx) => (
                <li
                  key={`extra-${idx}`}
                  style={{
                    marginBottom: '0.8rem',
                    listStyleType: 'disc',
                    listStylePosition: 'outside',
                    paddingLeft: '0.5rem',
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: 'left',
                      lineHeight: 1.7,
                      display: 'block',
                    }}
                  >
                    {item}
                  </Typography>
                </li>
              ))}
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
