import React from 'react';
import { Component } from '../../types';
import { FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { StyledFormControl } from '../SimulatorStyles';
import { getOptions } from './utils';

interface Props { component: Component; }

const SimulatorRadioButton: React.FC<Props> = ({ component }) => {
  const label = component.properties?.label || 'Options';
  const options = getOptions(component.properties?.options);

  return (
    <StyledFormControl>
      <FormLabel>{label}</FormLabel>
      <RadioGroup>
        {options.map((opt, idx) => (
          <FormControlLabel
            key={`${opt}-${idx}`}
            value={opt}
            control={<Radio />}
            label={opt}
          />
        ))}
      </RadioGroup>
    </StyledFormControl>
  );
};

export default SimulatorRadioButton;
