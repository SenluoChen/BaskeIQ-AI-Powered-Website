import React from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { QuarterStats } from '../../types/Match.type';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Filler,
  Legend
);

type Props = {
  turnovers?: QuarterStats;
  assists?: QuarterStats;
  rebounds?: QuarterStats;
};

const labels = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function PlayerStatsLineChart({
  turnovers,
  assists,
  rebounds,
}: Props) {
  const toArray = (stats?: QuarterStats): number[] => {
    return stats ? [stats.q1, stats.q2, stats.q3, stats.q4] : [0, 0, 0, 0];
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Turnover',
        data: toArray(turnovers),
        borderColor: 'rgba(255, 99, 132, 0.6)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Assist',
        data: toArray(assists),
        borderColor: 'rgba(75, 192, 192, 0.8)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Rebound',
        data: toArray(rebounds),
        borderColor: 'rgba(54, 162, 235, 0.7)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
  };

  return <Line options={options} data={data} />;
}
