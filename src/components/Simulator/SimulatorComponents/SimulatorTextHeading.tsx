import React from 'react';
import { Typography } from '@mui/material';
import { Component } from '../../types';

interface Props { component: Component; }

const SimulatorTextHeading: React.FC<Props> = ({ component }) => (
  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
    {component.properties?.text}
  </Typography>
);

export default SimulatorTextHeading;
