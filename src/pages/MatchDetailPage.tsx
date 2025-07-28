import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Modal,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { matchSelector } from '../store/selectors/matchSelector';
import { useState, useMemo, useEffect } from 'react';
import Court from '../components/Court/Court';
import PlayerStatsLineChart from '../components/PlayerStatsLineChart/PlayerStatsLineChart';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatDateFromSeconds } from '../utils/data.utils';
import { usePutMatchMutation } from '../store/api/MatchApi';
import { QuarterStats } from '../types/Match.type';
import { usePostAnalyzeMatchResultMutation } from '../store/api/AnalyseApi';
import { MatchAnalysisResult } from '../types/Analysis.type';

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
  const matches = useSelector(matchSelector).matches;

  // Get the match corresponding to matchId
  const match = useMemo(() => matches.find((m) => m.id === matchId), [matchId, matches]);

  const [scores, setScores] = useState([0, 0, 0, 0]);
  const [phaseModalOpen, setPhaseModalOpen] = useState(false);
  const [phaseInput, setPhaseInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MatchAnalysisResult | null>(null);

  const [putMatch] = usePutMatchMutation();
  const [postAnalyzeMatchResult] = usePostAnalyzeMatchResultMutation();
  const [statModalOpen, setStatModalOpen] = useState(false);

  const [formStats, setFormStats] = useState({
    turnovers: match?.turnovers ?? { q1: 0, q2: 0, q3: 0, q4: 0 },
    assists: match?.assists ?? { q1: 0, q2: 0, q3: 0, q4: 0 },
    rebounds: match?.rebounds ?? { q1: 0, q2: 0, q3: 0, q4: 0 },
  });

  const handleFormChange = (
    type: 'turnovers' | 'assists' | 'rebounds',
    quarter: 'q1' | 'q2' | 'q3' | 'q4',
    value: number
  ) => {
    setFormStats((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [quarter]: value,
      },
    }));
  };

  const handleSubmitStats = async () => {
    try {
      if(match) {
        await putMatch({
          timestamp: match.timestamp,
          turnovers: formStats.turnovers,
          assists: formStats.assists,
          rebounds: formStats.rebounds,
        }).unwrap();

        setStatModalOpen(false);
      }
    } catch (err) {
      console.error('❌ Failed to update stats:', err);
    }
  };

  useEffect(() => {
    if (match?.points) {
      const { q1 = 0, q2 = 0, q3 = 0, q4 = 0 } = match.points;
      setScores([q1, q2, q3, q4]);
    }
  }, [match?.points]);

  if (!match) {
    return <div>Match not found.</div>;
  }

  // If no match found
  if (!match) {
    return (
      <Box p={4}>
        <Alert severity="error">❌ Match not found.</Alert>
      </Box>
    );
  }

  const totalScore = scores.reduce((sum, val) => sum + val, 0);

  const handleScoreChange = async (index: number, value: string) => {
    const updated = [...scores];
    updated[index] = parseInt(value) || 0;
    setScores(updated);

    // Prepare object to send to DynamoDB
    const updatedPoints = {
      q1: updated[0],
      q2: updated[1],
      q3: updated[2],
      q4: updated[3],
    };

    try {
      await putMatch({
        timestamp: match.timestamp,
        points: updatedPoints,
      }).unwrap();
    } catch (err) {
      console.error('❌ Failed to update quarter scores:', err);
    // (Optionnel : affiche une erreur UI ici)
    }
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
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  const handleGenerateAdvice = async (phase: string) => {
    if (!match) return;
    setLoading(true);

    try {
      const result = await postAnalyzeMatchResult({
        timestamp: match.timestamp,
        phase,
        shots: match.shots?.length ?? 0,
        turnovers: Object.values(match.turnovers || {}).reduce((a, b) => a + b, 0),
        assists: Object.values(match.assists || {}).reduce((a, b) => a + b, 0),
        rebounds: Object.values(match.rebounds || {}).reduce((a, b) => a + b, 0),
        points: scores.reduce((sum, val) => sum + val, 0),
      }).unwrap();

      setAnalysisResult(result.advice.result);
    } catch (err) {
      console.error('❌ Error generating advice', err);
      setAnalysisResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        🏀 {match?.title}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {formatDateFromSeconds(match.timestamp)}
      </Typography>

      <Grid container spacing={3}>
        {/* Quarter Scores with editable inputs */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700}>📊 Quarter Scores</Typography>

            <Grid container spacing={2} mt={1} mb={2}>
              {['Q1', 'Q2', 'Q3', 'Q4'].map((label, i) => (
                <Grid item xs={3} key={label}>
                  <TextField
                    fullWidth
                    label={label}
                    type="number"
                    inputProps={{ min: 0, max: 50 }}
                    value={scores[i]}
                    onChange={(e) => handleScoreChange(i, e.target.value)}
                    size="small"
                  />
                </Grid>
              ))}
            </Grid>

            <Bar data={barData} options={barOptions} />
          </Paper>
        </Grid>

        {/* Shot chart component */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700}>🎯 Shot Chart</Typography>
            <Typography variant="body2" color="text.secondary">
              Left click = 🟢 made, Right click = 🔴 missed
            </Typography>
            <Box mt={4}>
              <Court shots={match.shots ?? []} matchTimestamp={match.timestamp} />
            </Box>
          </Paper>
        </Grid>

        {/* Player stat trends */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700}>
              📈 Turnovers / Assists / Rebounds
            </Typography>
            <PlayerStatsLineChart
              turnovers={formStats.turnovers}
              assists={formStats.assists}
              rebounds={formStats.rebounds}
            />
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => setStatModalOpen(true)}
            >
  ➕ Ajouter données
            </Button>
          </Paper>
        </Grid>

        {/* AI advice section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700}>🤖 AI Post-Game Advice</Typography>
            <Button
              variant="contained"
              onClick={() => setPhaseModalOpen(true)}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Generating...' : 'Generate Advice'}
            </Button>
            {analysisResult && (
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight={700}>
      ⭐ Principal Advice
                </Typography>
                <Typography variant="h6" gutterBottom>{analysisResult.mainAdvice.title}</Typography>
                <Typography variant="body1">{analysisResult.mainAdvice.text}</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
      💬 {analysisResult.mainAdvice.comment}
                </Typography>

                {analysisResult.secondaryAdvices.length > 0 && (
                  <Box mt={4}>
                    <Typography variant="subtitle1" fontWeight={700}>
          🔍 Secondary Advices
                    </Typography>
                    {analysisResult.secondaryAdvices.map((advice, index) => (
                      <Box key={index} mt={2}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {advice.title}
                        </Typography>
                        <Typography>{advice.text}</Typography>
                        <Typography variant="body2" color="text.secondary">
              💬 {advice.comment}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      <Modal open={statModalOpen} onClose={() => setStatModalOpen(false)}>
        <Box
          sx={{
            width: 500,
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
          <Typography variant="h6" fontWeight={700}>📊 Modifier les stats</Typography>

          {['turnovers', 'assists', 'rebounds'].map((type) => (
            <Box key={type}>
              <Typography fontWeight={600}>{type.toUpperCase()}</Typography>
              <Grid container spacing={1}>
                {['q1', 'q2', 'q3', 'q4'].map((q) => (
                  <Grid item xs={3} key={q}>
                    <TextField
                      label={q.toUpperCase()}
                      type="number"
                      size="small"
                      value={formStats[type as keyof typeof formStats][q as keyof QuarterStats]}
                      onChange={(e) =>
                        handleFormChange(
                    type as 'turnovers' | 'assists' | 'rebounds',
                    q as 'q1' | 'q2' | 'q3' | 'q4',
                    parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}

          <Button variant="contained" onClick={handleSubmitStats}>
      💾 Enregistrer
          </Button>
        </Box>
      </Modal>
      <Modal open={phaseModalOpen} onClose={() => setPhaseModalOpen(false)}>
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
          <Typography variant="h6" fontWeight={700}>📌 Nom de la phase</Typography>
          <TextField
            label="Ex: training, game, playoff..."
            value={phaseInput}
            onChange={(e) => setPhaseInput(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            disabled={!phaseInput}
            onClick={async () => {
              setPhaseModalOpen(false);
              await handleGenerateAdvice(phaseInput); // appel avec phase
            }}
          >
      ✅ Confirmer et lancer l’analyse
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
