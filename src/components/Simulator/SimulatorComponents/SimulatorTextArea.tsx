import React from 'react';
import { Component } from '../../types';
import { Box, Typography } from '@mui/material';

interface Props { component: Component; }

const SimulatorTextArea: React.FC<Props> = ({ component }) => (
  <Box sx={{ width: '100%' }}>
    <Typography variant="subtitle2" sx={{ mb: 1 }}>
      {component.properties?.label} {(component.properties?.required === 'true') && "*" }
    </Typography>
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: 1,
        p: 1,
        minHeight: '100px',
      }}
    />
  </Box>
);

export default SimulatorTextArea;
