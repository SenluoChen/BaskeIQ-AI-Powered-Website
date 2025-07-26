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

const labels = ['Q1', 'Q2', 'Q3', 'Q4'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Turnover ',
      data: [2, 3, 1, 4],
      borderColor: 'rgba(255, 99, 132, 0.6)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      tension: 0.4,
      
    },
    {
      label: 'Assist ',
      data: [5, 7, 6, 8],
      borderColor: 'rgba(75, 192, 192, 0.8)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4,
     
    },
    {
      label: 'Rebound',
      data: [6, 5, 7, 9],
      borderColor: 'rgba(54, 162, 235, 0.7)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      tension: 0.4,
   
    },
  ],
};

export const options = {
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

export default function PlayerStatsLineChart() {
  return <Line options={options} data={data} />;
}
