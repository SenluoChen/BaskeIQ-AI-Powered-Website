import {
  Avatar, Box, Container, Typography, Divider, Grid, Paper, Chip, Stack,
  ThemeProvider, createTheme, ScopedCssBaseline
} from '@mui/material';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import StraightenIcon from '@mui/icons-material/Straighten';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { useSelector } from 'react-redux';
import { userSelector } from '../store/selectors/userSelector';

//
// ── Design Tokens ────────────────────────────────────────────────────────────────
const TOKENS = {
  bg: '#0B0F19',
  panel: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(0,0,0,0.22))',
  panelSolid: 'rgba(18,18,18,0.75)',
  border: 'rgba(255,255,255,0.10)',
  text: '#E6EDF3',
  subtext: 'rgba(230,237,243,0.82)',
  accent: '#00dcff',
  brand: '#ffca28',
  brandGrad: 'linear-gradient(90deg, #ff8f00, #ffca28, #ff8f00)',
  radius: 16,
  shadowSm: '0 8px 18px rgba(0,0,0,.28)',
  shadowMd: '0 16px 40px rgba(0,0,0,.32)',
  gapXs: 1,   // 8px
  gapSm: 1.5, // 12px
  gapMd: 2,   // 16px
  gapLg: 3,   // 24px
  gapXl: 4,   // 32px
} as const;

// ── Local Theme（僅此頁） ─────────────────────────────────────────────────────────
const localTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: TOKENS.bg,
      paper: TOKENS.panelSolid,
    },
    text: { primary: TOKENS.text, secondary: TOKENS.subtext as any },
  },
  typography: {
    allVariants: { lineHeight: 1.55, letterSpacing: 0.2 },
    h5: { fontWeight: 900 },
    h6: { fontWeight: 800 },
    subtitle1: { fontWeight: 800 },
    body2: { fontSize: '0.95rem' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: TOKENS.panel,
          border: `1px solid ${TOKENS.border}`,
          borderRadius: TOKENS.radius,
          boxShadow: TOKENS.shadowSm,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
        },
      },
    },
  },
});

// ── Reusable ────────────────────────────────────────────────────────────────────
const chipSx = {
  color: TOKENS.text,
  borderColor: TOKENS.border,
  background: 'rgba(255,255,255,0.06)',
  '& .MuiChip-icon': { color: TOKENS.subtext },
} as const;

const StatCard = ({
  label, value, icon, accent
}: { label: string; value: string | number; icon: React.ReactNode; accent?: string }) => (
  <Paper
    elevation={0}
    sx={{
      p: TOKENS.gapMd,
      height: '100%',
      borderRadius: TOKENS.radius,
      background: TOKENS.panel,
      border: `1px solid ${TOKENS.border}`,
      boxShadow: TOKENS.shadowSm,
      transition: 'transform .15s ease, box-shadow .15s ease, border-color .15s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        borderColor: 'rgba(255,255,255,0.16)',
        boxShadow: '0 22px 46px rgba(0,0,0,.38)',
      },
    }}
  >
    <Stack direction="row" spacing={TOKENS.gapSm} alignItems="center" sx={{ mb: 0.5 }}>
      <Box sx={{ color: accent ?? TOKENS.accent, display: 'flex', alignItems: 'center' }}>
        {icon}
      </Box>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </Stack>
    <Typography variant="h5" sx={{ fontWeight: 800, color: TOKENS.text }}>
      {value}
    </Typography>
  </Paper>
);

//
// ── Page ────────────────────────────────────────────────────────────────────────
const ProfilePage: React.FC = () => {
  const user = useSelector(userSelector).userProfile;

  const userData = {
    name: user?.username ?? 'Player',
    email: user?.email ?? '—',
    avatarUrl: user?.imageUrl,
    position: user?.position ?? 'Guard',
    height: user?.height ?? '—',
    weight: user?.weight ?? '—',
    avgPoints: 18.6,
    avgAssists: 4.2,
    avgRebounds: 5.3,
    totalGames: 36,
  };

  const eff = Math.round(
    userData.avgPoints * 1.2 + userData.avgAssists * 1.4 + userData.avgRebounds * 1.1
  );

  return (
    <ThemeProvider theme={localTheme}>
      <ScopedCssBaseline>
        <Box
          sx={{
            background: TOKENS.bg,
            minHeight: '100vh',
            py: { xs: TOKENS.gapLg, md: TOKENS.gapXl },
          }}
        >
          <Container maxWidth="md">
            {/* Header */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: TOKENS.gapLg, md: TOKENS.gapXl },
                mb: TOKENS.gapLg,
                borderRadius: TOKENS.radius,
                background: TOKENS.panel,
                border: `1px solid ${TOKENS.border}`,
                boxShadow: TOKENS.shadowMd,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={TOKENS.gapSm}
                sx={{ mb: TOKENS.gapMd }}
              >
                <Box
                  sx={{
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    bgcolor: TOKENS.brand,
                    boxShadow: '0 0 14px rgba(255,202,40,.6)',
                    flex: '0 0 auto',
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    letterSpacing: 0.5,
                    background: TOKENS.brandGrad,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 14px rgba(255,183,77,.35)',
                    mr: 1,
                    mb :3,
                    mt : -1
                  }}
                >
                  Player Profile
                </Typography>
                
              </Stack>

              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={TOKENS.gapLg}
                alignItems={{ xs: 'center', md: 'center' }}
              >


                {/* Avatar */}
                <Box sx={{ position: 'relative', flex: '0 0 auto' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: -6,
                      borderRadius: '50%',
                      background:
                        'radial-gradient(60% 60% at 50% 50%, rgba(0,220,255,.35) 0%, rgba(0,0,0,0) 70%)',
                      filter: 'blur(4px)',
                    }}
                  />
                  <Avatar
                    src="/sga.webp" 
                    sx={{
                      width: 112,
                      height: 112,
                      border: `2px solid ${TOKENS.accent}`,
                      boxShadow: '0 6px 16px rgba(0,220,255,.26)',
                    }}
                  />
                </Box>

                {/* Identity + tags */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack
                    direction="row"
                    spacing={TOKENS.gapSm}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <SportsBasketballIcon
                      sx={{
                        color: TOKENS.brand,
                        fontSize: 26,
                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
                        flex: '0 0 auto',
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 900,
                        color: TOKENS.brand,
                        textShadow: '0 0 10px rgba(255,183,77,.3)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: { xs: '100%', md: 280 },
                      }}
                      title={userData.name}
                    >
                      {userData.name}
                    </Typography>
                    <Chip
                      label={userData.position}
                      size="small"
                      sx={{
                        ml: 0.5,
                        color: TOKENS.text,
                        background: 'rgba(0,220,255,0.10)',
                        border: `1px solid ${TOKENS.accent}`,
                        fontWeight: 700,
                        height: 26,
                      }}
                      variant="outlined"
                    />
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                    {userData.email}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={TOKENS.gapSm}
                    sx={{ mt: TOKENS.gapMd }}
                    flexWrap="wrap"
                  >
                    <Chip
                      icon={<StraightenIcon sx={{ fontSize: 18 }} />}
                      label={`Height: ${userData.height}`}
                      size="small"
                      sx={chipSx}
                    />
                    <Chip
                      icon={<MonitorWeightIcon sx={{ fontSize: 18 }} />}
                      label={`Weight: ${userData.weight}`}
                      size="small"
                      sx={chipSx}
                    />
                    <Chip
                      icon={<LeaderboardIcon sx={{ fontSize: 18 }} />}
                      label={`Games: ${userData.totalGames}`}
                      size="small"
                      sx={chipSx}
                    />
                    <Chip
                      icon={<LeaderboardIcon sx={{ fontSize: 18 }} />}
                      label={`Efficiency: ${eff}`}
                      size="small"
                      sx={chipSx}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            {/* Stats */}
            <Grid container spacing={TOKENS.gapMd}>
              <Grid item xs={6} md={3}>
                <StatCard
                  label="Average Points"
                  value={userData.avgPoints}
                  icon={<LeaderboardIcon fontSize="small" />}
                  accent={TOKENS.brand}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatCard
                  label="Assists"
                  value={userData.avgAssists}
                  icon={<LeaderboardIcon fontSize="small" />}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatCard
                  label="Rebounds"
                  value={userData.avgRebounds}
                  icon={<LeaderboardIcon fontSize="small" />}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatCard
                  label="Games Played"
                  value={userData.totalGames}
                  icon={<SportsBasketballIcon fontSize="small" />}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: TOKENS.gapLg, borderColor: TOKENS.border }} />

            {/* Season Overview */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: TOKENS.gapLg, 
                borderRadius: "40px",      
                background: TOKENS.panel, 
                border: `1px solid ${TOKENS.border}`, 
                boxShadow: TOKENS.shadowSm 
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                Season Overview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Designed for amateur hoopers. Sync your matches to unlock AI tips, track consistency,
                and benchmark your performance across games.
              </Typography>
            </Paper>
          </Container>
        </Box>
      </ScopedCssBaseline>
    </ThemeProvider>
  );
};

export default ProfilePage;
