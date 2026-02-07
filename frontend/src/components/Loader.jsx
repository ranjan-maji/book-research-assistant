// components/Loader.js
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Searching Academic Databases
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This may take 10-30 seconds...
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <CircularProgress size={20} />
        <CircularProgress size={20} />
        <CircularProgress size={20} />
      </Box>
    </Box>
  );
};

export default Loader;