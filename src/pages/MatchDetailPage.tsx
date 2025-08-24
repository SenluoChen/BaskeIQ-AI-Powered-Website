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
import { useDispatch, useSelector } from 'react-redux';
import { matchSelector } from '../store/selectors/matchSelector';
import { useState, useMemo, useEffect } from 'react';
import Court from '../components/Court/Court';
import PlayerStatsLineChart from '../components/PlayerStatsLineChart/PlayerStatsLineChart';
import { skipToken } from '@reduxjs/toolkit/query';
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
import { useGetAnalyzesQuery, useLazyGetAnalyzesQuery, usePostAnalyzeMatchResultMutation } from '../store/api/AnalyseApi';
import { MatchAnalysis, MatchAnalysisResult } from '../types/Analysis.type';
import { setAnalyzes } from '../store/slices/analysisSlice';
import { SxProps } from "@mui/material";


ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// ---------- Visual tokens (match dashboard neon style) ----------
const UI = {
  bg:        '#0b0f17',
  bgGrad:    'radial-gradient(1200px 600px at 15% -10%, rgba(255,179,77,.08), transparent 60%), radial-gradient(1000px 500px at 90% 10%, rgba(0,209,255,.07), transparent 60%)',
  surface:   '#0f1624',
  surface2:  '#121b2c',
  border:    'rgba(255,255,255,0.06)',
  text:      '#d7e0ea',
  subtext:   '#8ea0b5',
  accent:    '#FFB34D', // orange like your "Matches" title
  cyan:      '#00D1FF',
};

// Reusable card style
const cardSx = {
  p: 3,
  bgcolor: UI.surface,
  border: `1px solid ${UI.border}`,
  borderRadius: 2.5,
  boxShadow: '0 10px 30px rgba(0,0,0,.35)',
};


const Stat = ({
  label,
  value,
  sx,
}: {
  label: string;
  value: React.ReactNode;
  sx?: SxProps;
}) => (
  <Box
    sx={{
      p: 1.2,
      border: `1px solid ${UI.border}`,
      borderRadius: "15px",
      padding : 1,
      bgcolor: UI.surface2,
      color: UI.text,
      minHeight: 64,
      ...sx, // <-- merge external overrides here
    }}
  >
    <Typography variant="caption" sx={{ color: UI.subtext }}>
      {label}
    </Typography>
    <Typography variant="subtitle1" fontWeight={700}>
      {value}
    </Typography>
  </Box>
);

export default function MatchDetailPage() {
  const dispatch = useDispatch();
  const { matchId } = useParams();
  const matches = useSelector(matchSelector).matches;
  const match = useMemo(() => matches.find((m) => m.id === matchId), [matchId, matches]);

  const [scores, setScores] = useState([0, 0, 0, 0]);
  const [phaseModalOpen, setPhaseModalOpen] = useState(false);
  const [phaseInput, setPhaseInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MatchAnalysisResult | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<MatchAnalysis | null>(null);

  const [putMatch] = usePutMatchMutation();
  const [postAnalyzeMatchResult] = usePostAnalyzeMatchResultMutation();
  const { data: analyzesData } = useGetAnalyzesQuery(match ? match.timestamp.toString() : skipToken);
  const [getAnalyzes] = useLazyGetAnalyzesQuery();
  const [statModalOpen, setStatModalOpen] = useState(false);

  const [formStats, setFormStats] = useState({
    turnovers: match?.turnovers ?? { q1: 0, q2: 0, q3: 0, q4: 0 },
    assists:   match?.assists   ?? { q1: 0, q2: 0, q3: 0, q4: 0 },
    rebounds:  match?.rebounds  ?? { q1: 0, q2: 0, q3: 0, q4: 0 },
  });

  // 基本數據 
  const [stats, setStats] = useState({
    FGM: 0, FGA: 0,
    _3PM: 0, _3PA: 0,
    FTM: 0, FTA: 0,
    ORB: 0, DRB: 0,
    AST: 0, TOV: 0,
    STL: 0, BLK: 0, PF: 0,
    PTS: 0, 
  })

  const handleStatChange = (key: keyof typeof stats, value: number) => {
    setStats(prev => {
      const updated = { ...prev, [key]: value };
      // ✅ 正確：PTS = (FGM - 3PM) * 2 + 3PM * 3 + FTM
      const twoPM = Math.max(0, updated.FGM - updated._3PM);
      updated.PTS = twoPM * 2 + updated._3PM * 3 + updated.FTM;
      return updated;
    });
  };

  const handleFormChange = (
    type: 'turnovers' | 'assists' | 'rebounds',
    quarter: 'q1' | 'q2' | 'q3' | 'q4',
    value: number
  ) => {
    setFormStats((prev) => ({
      ...prev,
      [type]: { ...prev[type], [quarter]: value },
    }));
  };

  // Updated: safe server sync + local update
  const handleScoreChange = async (index: number, value: string) => {
    const updated = [...scores];
    updated[index] = parseInt(value) || 0;
    setScores(updated);
    if (!match) return;
    try {
      await putMatch({
        timestamp: match.timestamp,
        points: { q1: updated[0], q2: updated[1], q3: updated[2], q4: updated[3] },
      }).unwrap();
    } catch (err) {
      console.error('❌ Failed to update quarter scores:', err);
    }
  };

  const handleSubmitStats = async () => {
    try {
      if (match) {
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
    if (analyzesData?.items) dispatch(setAnalyzes(analyzesData.items));
  }, [analyzesData, dispatch]);

  useEffect(() => {
    if (match?.points) {
      const { q1 = 0, q2 = 0, q3 = 0, q4 = 0 } = match.points;
      setScores([q1, q2, q3, q4]);
    }
  }, [match?.points]);

  const totalScore = scores.reduce((sum, val) => sum + val, 0);

  const totals = useMemo(() => ({
    points: totalScore,
    tov: Object.values(match?.turnovers ?? {}).reduce((a: number, b: number) => a + (b || 0), 0),
    ast: Object.values(match?.assists   ?? {}).reduce((a: number, b: number) => a + (b || 0), 0),
    reb: Object.values(match?.rebounds  ?? {}).reduce((a: number, b: number) => a + (b || 0), 0),
  }), [totalScore, match?.turnovers, match?.assists, match?.rebounds]);

  const shotStats = useMemo(() => {
    const shots: any[] = match?.shots ?? [];
    let FGA = 0, FGM = 0, _3PA = 0, _3PM = 0;
    for (const s of shots) {
      const made = typeof s.made === 'boolean' ? s.made : Boolean((s as any).isMade || (s as any).success);
      const isThree =
        typeof s.isThree === 'boolean'
          ? s.isThree
          : (typeof (s as any).points === 'number' && (s as any).points === 3) ||
            (typeof (s as any).type === 'string' && /3|three/i.test((s as any).type)) ||
            (typeof (s as any).shotType === 'string' && /3|three/i.test((s as any).shotType));
      FGA += 1;
      if (made) FGM += 1;
      if (isThree) { _3PA += 1; if (made) _3PM += 1; }
    }
    return { FGA, FGM, _3PA, _3PM };
  }, [match?.shots]);

  const adv = useMemo(() => {
    const { FGM, FGA, _3PM, FTA, FTM, AST, TOV, ORB, DRB, PTS } = stats;

    return {
      eFG: FGA > 0 ? (FGM + 0.5 * _3PM) / FGA : 0,
      TS: (FGA + 0.44 * FTA) > 0 ? PTS / (2 * (FGA + 0.44 * FTA)) : 0,
      AST_TOV: TOV > 0 ? AST / TOV : AST, 
      REB: ORB + DRB,
      ORB, DRB, STL: stats.STL, BLK: stats.BLK, PF: stats.PF,
    };
  }, [stats]);



  if (!match) {
    return (
      <Box sx={{ p: 4, bgcolor: UI.bg, color: UI.text, minHeight: '100vh' }}>
        <Alert severity="error" sx={{ bgcolor: UI.surface2, color: UI.text, border: `1px solid ${UI.border}` }}>
          ❌ Match not found.
        </Alert>
      </Box>
    );
  }

  // Chart palette aligned with neon style
  const barData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Quarter Scores',
        data: scores,
        backgroundColor: UI.accent,
        borderRadius: 6,
      },
    ],
  };
  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: UI.subtext }, grid: { color: 'rgba(255,255,255,0.06)' } },
      y: { beginAtZero: true, ticks: { color: UI.subtext }, grid: { color: 'rgba(255,255,255,0.06)' } },
    },
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

      const analyzesResult = await getAnalyzes(String(match.timestamp)).unwrap();
      dispatch(setAnalyzes(analyzesResult.items));
      setAnalysisResult(result.advice.result);
    } catch (err) {
      console.error('❌ Error generating advice', err);
      setAnalysisResult(null);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Render ----------
  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: UI.bg,
        color: UI.text,
        minHeight: '100vh',
        backgroundImage: UI.bgGrad,
      }}
    >
      {/* Neon title */}
      <Box
        sx={{
          mb: { xs: 2, md: 3 }, // a bit more breathing room
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight={800}
            sx={{
              color: UI.accent,
              textShadow: '0 0 18px rgba(255,179,77,.35)',
              letterSpacing: 0.6,
              lineHeight: 1.1, // tighter line height for a stronger headline
            }}
          >
      🏀 {match.title}
          </Typography>
        </Box>

        <Typography
          variant="subtitle2"
          sx={{
            color: UI.subtext,
            mt: 0.5, // small gap under the title
          }}
        >
          {formatDateFromSeconds(match.timestamp)}
        </Typography>

        {/* thin neon divider */}
        <Box
          sx={{
            mt: 1.25,
            height: 2,
            width: '100%',
            borderRadius: 1,
            background: `linear-gradient(90deg, ${UI.accent} 0%, rgba(255,179,77,.35) 35%, transparent 100%)`,
            opacity: 0.7,
          }}
        />
      </Box>
      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        {/* Quarter Scores */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={cardSx}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}> Quarter Scores</Typography>
            <Grid container spacing={1.5} mt={0} mb={1.5}>
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
                    sx={{
                      '& .MuiInputBase-root': { bgcolor: UI.surface2, color: UI.text },
                      '& .MuiInputLabel-root': { color: UI.subtext },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: UI.border },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ bgcolor: UI.surface2, p: 2, borderRadius: 2 }}>
              <Bar data={barData} options={barOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Shot chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={cardSx}>
            <Typography variant="h6" fontWeight={700}> Shot Chart</Typography>
            <Typography variant="body2" sx={{ color: UI.subtext }}>
              Left click = 🟢 made, Right click = 🔴 missed
            </Typography>
            <Box mt={3}>
              <Court shots={match.shots ?? []} matchTimestamp={match.timestamp} />
            </Box>
          </Paper>
        </Grid>

        {/* Player stat trends */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={cardSx}>
            <Typography variant="h6" fontWeight={700}> Turnovers / Assists / Rebounds</Typography>
            <PlayerStatsLineChart
              turnovers={formStats.turnovers}
              assists={formStats.assists}
              rebounds={formStats.rebounds}
            />
            <Button
              variant="contained"
              onClick={() => setStatModalOpen(true)}
              sx={{
                mt: 2,
                bgcolor: UI.cyan,
                color: '#001318',
                fontWeight: 700,
                '&:hover': { bgcolor: '#07c6f0' },
              }}
            >
              ➕ Add Stats
            </Button>
          </Paper>
        </Grid>
        
        {/* Advanced metrics — inputs & live results (SELF) */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={cardSx}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
      Advanced Stats
            </Typography>

            <Grid container spacing={4}>
              {/* LEFT: inputs */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
              
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
                        gap: 1.5,
                      }}
                    >
                      {(
                [
                  'FGM', 'FGA',
                  '_3PM', '_3PA',
                  'FTM', 'FTA',
                  'ORB', 'DRB',
                  'AST', 'TOV',
                  'STL', 'BLK', 'PF',
                ] as const
                      ).map((k) => (
                        <TextField
                          key={k}
                          label={k}
                          type="number"
                          size="small"
                          value={stats[k]}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => handleStatChange(k, Number(e.target.value || 0))}
                          sx={{
                            '& .MuiInputBase-root': { bgcolor: UI.surface2, color: UI.text,  borderRadius: "15px",  },
                            '& .MuiInputLabel-root': { color: UI.subtext },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: UI.border },
                          }}
                        />
                      ))}
                      {/* PTS 是自動計算，不提供手動輸入 */}
                      <TextField
                        label="PTS (auto)"
                        type="number"
                        size="small"
                        value={stats.PTS}
                        InputProps={{ readOnly: true }}
                        sx={{
                          '& .MuiInputBase-root': { bgcolor: UI.surface2, color: UI.text, },
                          '& .MuiInputLabel-root': { color: UI.subtext },
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: UI.border },
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
  

              {/* RIGHT: live computed results */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
                    gap: 1.5,
                    borderRadius: "15px", 
                    
                  }}
                >
                  {/* Volume & scoring */}
                  <Stat
                    label="PTS"
                    value={stats.PTS}
                    sx={{
                      bgcolor: UI.surface2,
                      color: UI.text,

                    }}
                  />
                  <Stat label="REB (Total)" value={adv.REB} />
                  <Stat label="ORB" value={adv.ORB} />
                  <Stat label="DRB" value={adv.DRB} />

                  {/* Efficiency */}
                  <Stat label="eFG%" value={`${(adv.eFG * 100).toFixed(1)}%`} />
                  <Stat label="TS%" value={`${(adv.TS * 100).toFixed(1)}%`} />

                  {/* Ball security */}
                  <Stat label="AST/TOV" value={adv.AST_TOV.toFixed(2)} />

                  {/* Defense & misc */}
                  <Stat label="Def Impact" value={`STL ${adv.STL} + BLK ${adv.BLK}`} />
                  <Stat label="PF" value={adv.PF} />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

     
        {/* AI advice */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              gap: 1,
              mb: 2,
              p: 1,
              '&::-webkit-scrollbar': { height: 6 },
              '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,.25)', borderRadius: 3 },
            }}
          >
            {/* 按鈕永遠顯示 */}
            <Button
              variant="contained"
              onClick={() => setPhaseModalOpen(true)}
              disabled={loading}
              sx={{
                minWidth: 200,
                flexShrink: 0,
                bgcolor: UI.accent,
                color: '#3b2300',
                fontWeight: 800,
                letterSpacing: .4,
                boxShadow: '0 0 16px rgba(255,179,77,.4)',
                '&:hover': { bgcolor: '#ffa632' },
              }}
            >
              {loading ? 'Generating...' : 'Generate Advice'}
            </Button>

            {/* 有資料才渲染歷史記錄；用可選鏈避免 TS 錯誤 */}
            {analyzesData?.items?.map((analysis) => {
              const isSelected = selectedAnalysis?.phase === analysis.phase;
              return (
                <Button
                  key={analysis['user_id#timestamp']}
                  variant={isSelected ? 'contained' : 'outlined'}
                  sx={{
                    minWidth: 200,
                    flexShrink: 0,
                    bgcolor: isSelected ? UI.cyan : UI.surface2,
                    color: isSelected ? '#001318' : UI.text,
                    borderColor: UI.border,
                    '&:hover': { bgcolor: isSelected ? '#07c6f0' : '#16233a' },
                  }}
                  onClick={() => { setSelectedAnalysis(analysis); setAnalysisResult(analysis.result); }}
                >
                  {analysis.phase || 'No phase'} – {formatDateFromSeconds(analysis.timestamp)}
                </Button>
              );
            })}
          </Box>

          <Paper elevation={0} sx={cardSx}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>🤖 AI Post-Game Advice</Typography>
            {analysisResult && (
              <Box mt={2}>
                <Typography variant="subtitle1" fontWeight={1000} sx={{ color: UI.cyan }}>
           - Main Advice -
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: UI.text }}>
                  {analysisResult.mainAdvice.title}
                </Typography>
                <Typography variant="body1">{analysisResult.mainAdvice.text}</Typography>
                <Typography variant="body2" sx={{ color: UI.subtext, mt: 1 }}>
          💬 {analysisResult.mainAdvice.comment}
                </Typography>

                {analysisResult.secondaryAdvices.length > 0 && (
                  <Box mt={3}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: UI.cyan }}>
              - Secondary Advices -
                    </Typography>
                    {analysisResult.secondaryAdvices.map((advice, index) => (
                      <Box key={index} mt={2}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {advice.title}
                        </Typography>
                        <Typography>{advice.text}</Typography>
                        <Typography variant="body2" sx={{ color: UI.subtext }}>
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
      {/* Stats modal */}
      <Modal open={statModalOpen} onClose={() => setStatModalOpen(false)}>
        <Box
          sx={{
            width: 520,
            p: 3,
            bgcolor: UI.surface,
            color: UI.text,
            borderRadius: 2,
            border: `1px solid ${UI.border}`,
            boxShadow: '0 20px 60px rgba(0,0,0,.6)',
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            display: 'flex', flexDirection: 'column', gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700}>📊 Edit Stats</Typography>

          {(['turnovers','assists','rebounds'] as const).map((type) => (
            <Box key={type}>
              <Typography fontWeight={600} sx={{ mb: .5, color: UI.subtext }}>{type.toUpperCase()}</Typography>
              <Grid container spacing={1}>
                {(['q1','q2','q3','q4'] as const).map((q) => (
                  <Grid item xs={3} key={q}>
                    <TextField
                      label={q.toUpperCase()}
                      type="number"
                      size="small"
                      value={formStats[type][q as keyof QuarterStats]}
                      onChange={(e) =>
                        handleFormChange(type, q, parseInt(e.target.value) || 0)
                      }
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-root': { bgcolor: UI.surface2, color: UI.text },
                        '& .MuiInputLabel-root': { color: UI.subtext },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: UI.border },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}

          <Button
            variant="contained"
            onClick={handleSubmitStats}
            sx={{ alignSelf: 'flex-end', bgcolor: UI.accent, color: '#3b2300', fontWeight: 800, '&:hover': { bgcolor: '#ffa632' } }}
          >
            💾 Save
          </Button>
        </Box>
      </Modal>

      {/* Phase modal */}
      <Modal open={phaseModalOpen} onClose={() => setPhaseModalOpen(false)}>
        <Box
          sx={{
            width: 420,
            p: 3,
            bgcolor: UI.surface,
            color: UI.text,
            borderRadius: 2,
            border: `1px solid ${UI.border}`,
            boxShadow: '0 20px 60px rgba(0,0,0,.6)',
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            display: 'flex', flexDirection: 'column', gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700}>Phase Name</Typography>
          <TextField
            label="Ex: training, game, playoff..."
            value={phaseInput}
            onChange={(e) => setPhaseInput(e.target.value)}
            fullWidth
            sx={{
              '& .MuiInputBase-root': { bgcolor: UI.surface2, color: UI.text },
              '& .MuiInputLabel-root': { color: UI.subtext },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: UI.border },
            }}
          />
          <Button
            variant="contained"
            disabled={
              !phaseInput ||
              analyzesData?.items?.some((a) => a.phase.toLowerCase() === phaseInput.toLowerCase())
            }
            onClick={async () => {
              setPhaseModalOpen(false);
              await handleGenerateAdvice(phaseInput);
            }}
            sx={{ bgcolor: UI.cyan, color: '#001318', fontWeight: 800, '&:hover': { bgcolor: '#07c6f0' } }}
          >
             Confirm & Generate
          </Button>

          {phaseInput &&
            analyzesData?.items?.some((a) => a.phase.toLowerCase() === phaseInput.toLowerCase()) && (
            <Typography variant="body2" color="error">
              ⚠️ This phase name already exists. Please choose another.
            </Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
