import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
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
            elevation={0}
            onClick={() => navigate(`/root/match/${match.id}`)}
            sx={{
              p: 2,
              borderRadius: 3,
              cursor: 'pointer',
              // 🎨 套用 Matches 區塊的顏色設計
              background: 'linear-gradient(180deg, #0B0F19 0%, #0F1623 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 36px rgba(0,0,0,.35)',
              transition: 'all .25s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 48px rgba(0,0,0,.5)',
                border: '1px solid rgba(255,255,255,0.12)',
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#E6EDF3',
                mb: 0.5,
                letterSpacing: 0.2,
              }}
            >
              {match.title}
            </Typography>

            <Typography variant="body2" sx={{ color: '#9AA4B2' }}>
              {formatDateFromSeconds(match.timestamp)}
            </Typography>

            {/* subtle divider glow */}
            <Box
              sx={{
                mt: 1.5,
                height: 1,
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
              }}
            />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default MatchList;
