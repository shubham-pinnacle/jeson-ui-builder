import React from 'react';
import { Component } from '../../types';
import { FormControlLabel, Checkbox } from '@mui/material';

interface Props { component: Component; }

const SimulatorOptIn: React.FC<Props> = ({ component }) => (
  <FormControlLabel
    control={<Checkbox required={component.properties?.required === 'true'} />}
    label={component.properties?.label || 'I agree'}
  />
);

export default SimulatorOptIn;
