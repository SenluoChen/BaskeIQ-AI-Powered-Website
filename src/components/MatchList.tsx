import React from 'react';
import { Paper, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Match } from '../types/Match.type';
import { formatDateFromSeconds } from '../utils/data.utils';

interface MatchListProps {
  matches: Match[];
}

const MatchList: React.FC<MatchListProps> = ({ matches }) => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      {matches.map((match) => (
        <Grid item xs={12} sm={6} md={4} key={match.id}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                backgroundColor: '#f0f0f5',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              },
            }}
            onClick={() => navigate(`/root/match/${match.id}`)}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1c1c1e' }}>
              {match.title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#636366' }}>
              {formatDateFromSeconds(match.timestamp)}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default MatchList;
