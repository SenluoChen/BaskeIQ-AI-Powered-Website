import React from 'react';
import { Avatar, Box, Container, Typography, Divider, Grid, Paper } from '@mui/material';

const ProfilePage: React.FC = () => {
  const user = {
    name: 'Senluo',
    email: 'ray191714@gmail.com',
    avatarUrl: '/sga.webp',
    position: 'Shooting Guard',
    height: "185 cm",
    weight: "78 kg",
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
            src={user.avatarUrl}
            sx={{ 
              width: 100, 
              height: 100, 
              mx: 'auto', 
              mb: 2 
            }}
          />
          <Typography variant="h5">{user.name}</Typography>
          <Typography color="text.secondary">{user.email}</Typography>
          <Typography sx={{ mt: 1, fontWeight: 'bold' }}>
            {user.position}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* ✅ 底部數據資訊區，用淺灰背景區隔 */}
        <Box sx={{ backgroundColor: '#f7f7f7', p: 3, borderRadius: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 1000 }}>Height</Typography>
              <Typography>{user.height}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 1000 }}>Weight</Typography>
              <Typography>{user.weight}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 1000 }}>Average Points</Typography>
              <Typography>{user.avgPoints}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 1000 }}>Assists</Typography>
              <Typography>{user.avgAssists}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 1000 }}>Rebounds</Typography>
              <Typography>{user.avgRebounds}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 1000 }}>Games Played</Typography>
              <Typography>{user.totalGames}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;