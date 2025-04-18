import React from 'react';
import { Component } from '../../types';
import { FormLabel } from '@mui/material';
import { StyledFormControl } from '../SimulatorStyles';

interface Props { component: Component; }

const SimulatorFilePicker: React.FC<Props> = ({ component }) => (
  <StyledFormControl>
    <FormLabel>{component.properties?.label || 'Upload File'}</FormLabel>
    <input
      type="file"
      accept={component.properties?.accept}
      required={component.properties?.required === 'true'}
      style={{
        marginTop: '8px',
        padding: '8px',
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: '4px',
      }}
    />
  </StyledFormControl>
);

export default SimulatorFilePicker;
