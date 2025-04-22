import React from 'react';
import { Component } from '../../types';
import { Box, Typography } from '@mui/material';

interface Props { component: Component; }

const SimulatorEmbeddedLink: React.FC<Props> = ({ component }) => {
  const text = component.properties?.text || 'Link';
  const isNav = component.properties?.onClick === 'Navigate';
  const screenName = component.properties?.screenName;
  const arrow = isNav ? '→' : '↗';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        color: '#1976d2',
        cursor: 'pointer',
        textDecoration: 'none',
        textAlign: 'center',
        '&:hover': { textDecoration: 'underline' },
      }}
      onClick={() => {
        if (isNav) console.log('Navigate to screen:', screenName);
      }}
    >
      <Typography>{text}</Typography>
      <Box component="span" sx={{ display: 'inline-flex', fontSize: '1.2em' }}>
        {arrow}
      </Box>
    </Box>
  );
};

export default SimulatorEmbeddedLink;
