import React from 'react';
import { Paper, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../styles/Colors';

type MatchType = {
  id: number;
  name: string;
  date: string;
};

interface MatchListProps {
  matches: MatchType[];
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
              cursor: 'pointer',
              transition: '0.3s',
              '&:hover': {
                backgroundColor: Colors?.primaryHover || '#1976d2',
                color: '#fff',
              },
            }}
            onClick={() => navigate(`/root/match/${match.id}`)}
          >
            <Typography variant="h6">{match.name}</Typography>
            <Typography variant="body2">📅 {match.date}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default MatchList;
