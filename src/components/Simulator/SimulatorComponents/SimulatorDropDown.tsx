import React from 'react';
import { Component } from '../../types';
import { InputLabel, MenuItem, Select } from '@mui/material';
import { StyledFormControl } from '../SimulatorStyles';
import { getOptions } from './utils';

interface Props { component: Component; }

const SimulatorDropDown: React.FC<Props> = ({ component }) => {
  const label = component.properties?.label || 'Select';
  const required = component.properties?.required === 'true';
  const placeholder = component.properties?.placeholder || 'Select an option';
  const options = getOptions(component.properties?.options);

  return (
    <StyledFormControl>
      <InputLabel>{label}</InputLabel>
      <Select label={label} required={required} defaultValue="">
        <MenuItem value="">{placeholder}</MenuItem>
        {options.map(opt => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
    </StyledFormControl>
  );
};

export default SimulatorDropDown;
