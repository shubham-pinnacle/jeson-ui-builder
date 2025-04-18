import React from 'react';
import { Typography } from '@mui/material';
import { Component } from '../../types';

interface Props { component: Component; }

const SimulatorTextCaption: React.FC<Props> = ({ component }) => (
  <Typography variant="caption" sx={{ color: '#999' }}>
    {component.properties?.text}
  </Typography>
);

export default SimulatorTextCaption;
