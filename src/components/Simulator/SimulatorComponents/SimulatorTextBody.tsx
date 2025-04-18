import React from 'react';
import { Typography } from '@mui/material';
import { Component } from '../../types';

interface Props { component: Component; }

const SimulatorTextBody: React.FC<Props> = ({ component }) => (
  <Typography variant="body1" sx={{ color: '#333' }}>
    {component.properties?.text}
  </Typography>
);

export default SimulatorTextBody;
