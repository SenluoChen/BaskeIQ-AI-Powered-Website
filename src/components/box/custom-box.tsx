import React from 'react';
import { Box } from '@mui/material';

interface Props {
  children: React.ReactNode;
  customStyle?: React.CSSProperties;
}

const CustomBox: React.FC<Props> = ({ children, customStyle }) => {
  return (
    <Box
      sx={{
        margin: 4,
        padding: 3,
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
        borderRadius: '10px',
        backgroundColor: 'white',
        ...customStyle,
      }}>
      {children}
    </Box>
  );
};

export default CustomBox;
