import React from 'react';
import { Component } from '../../types';
import { FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { StyledFormControl } from '../SimulatorStyles';
import { getOptions } from './utils';

interface Props { component: Component; }

const SimulatorCheckBoxGroup: React.FC<Props> = ({ component }) => {
  const label = component.properties?.label || 'Options';
  const options = getOptions(component.properties?.options);

  return (
    <StyledFormControl>
      <FormLabel>{label} {(component.properties?.required === 'true') && "*" }</FormLabel>
      <FormGroup>
        {options.map((opt, idx) => (
          <FormControlLabel
            key={`${opt}-${idx}`}
            control={<Checkbox />}
            label={opt}
          />
        ))}
      </FormGroup>
    </StyledFormControl>
  );
};

export default SimulatorCheckBoxGroup;
