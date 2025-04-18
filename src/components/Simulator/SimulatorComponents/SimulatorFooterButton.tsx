import React from 'react';
import { Component } from '../../types';
import { Button } from '@mui/material';

interface Props { component: Component; }

const SimulatorFooterButton: React.FC<Props> = ({ component }) => {
  const text = component.properties?.buttonText || 'Button';
  const variant =
    (component.properties?.variant as 'text' | 'outlined' | 'contained') ||
    'contained';

  return (
    <Button
      variant={variant}
      color="primary"
      fullWidth
      style={{ textTransform: 'none', marginTop: '8px' }}
    >
      {text}
    </Button>
  );
};

export default SimulatorFooterButton;
