import React from 'react';
import { Typography } from '@mui/material';
import { Component } from '../../types';

interface Props { component: Component; }

const SimulatorSubHeading: React.FC<Props> = ({ component }) => (
  <Typography variant="h6" sx={{ color: '#666' }}>
    {component.properties?.text}
  </Typography>
);

export default SimulatorSubHeading;
