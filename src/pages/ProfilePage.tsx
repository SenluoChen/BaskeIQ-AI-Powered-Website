import { Avatar, Box, Container, Typography, Divider, Grid, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { userSelector } from '../store/selectors/userSelector';

const ProfilePage: React.FC = () => {
  const user = useSelector(userSelector).userProfile;

  const userData = {
    name: user?.username ?? 'Inconnu',
    email:  user?.email ?? 'Inconnu',
    avatarUrl: user?.imageUrl,
    position:  user?.position ?? 'Inconnu',
    height:  user?.height ?? 'Inconnu',
    weight:  user?.weight ?? 'Inconnu',
    avgPoints: 18.6,
    avgAssists: 4.2,
    avgRebounds: 5.3,
    totalGames: 36,
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          borderRadius: '40px' // ✅ 圓角設計
        }}
      >
        {/* 頂部個人資訊 */}
        <Box textAlign="center" mb={3}>
          <Avatar
            src={userData.avatarUrl}
            sx={{ 
              width: 100, 
              height: 100, 
              mx: 'auto', 
              mb: 2 
            }}
          />
          <Typography variant="h5">{userData.name}</Typography>
          <Typography color="text.secondary">{userData.email}</Typography>
          <Typography sx={{ mt: 1, fontWeight: 'bold' }}>
            {userData.position}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* ✅ 底部數據資訊區，用淺灰背景區隔 */}
        <Box sx={{ backgroundColor: '#f7f7f7', p: 3, borderRadius: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 1000 }}>Height</Typography>
              <Typography>{userData.height}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 1000 }}>Weight</Typography>
              <Typography>{userData.weight}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 1000 }}>Average Points</Typography>
              <Typography>{userData.avgPoints}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 1000 }}>Assists</Typography>
              <Typography>{userData.avgAssists}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 1000 }}>Rebounds</Typography>
              <Typography>{userData.avgRebounds}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 1000 }}>Games Played</Typography>
              <Typography>{userData.totalGames}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;