import React from 'react';
import { Avatar, Box, Container, Typography, Divider, Grid, Paper } from '@mui/material';

const ProfilePage: React.FC = () => {
  const user = {
    name: 'Senluo',
    email: 'senluo@example.com',
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
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={3}>
          <Avatar
            src={user.avatarUrl}
            sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
          />
          <Typography variant="h5">{user.name}</Typography>
          <Typography color="text.secondary">{user.email}</Typography>
          <Typography sx={{ mt: 1, fontWeight: 'bold' }}>
            {user.position}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Height：</Typography>
            <Typography fontWeight="bold">{user.height}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Weight：</Typography>
            <Typography fontWeight="bold">{user.weight}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Average Points：</Typography>
            <Typography fontWeight="bold">{user.avgPoints}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Assits：</Typography>
            <Typography fontWeight="bold">{user.avgAssists}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Rebonds：</Typography>
            <Typography fontWeight="bold">{user.avgRebounds}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Total Games Played：</Typography>
            <Typography fontWeight="bold">{user.totalGames}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
