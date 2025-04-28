import React from 'react';
import { Component } from '../../types';
import { Box, Typography } from '@mui/material';

interface Props { component: Component; }

const SimulatorTextArea: React.FC<Props> = ({ component }) => {
  const [value, setValue] = React.useState('');
  return (
    <textarea
      value={value}
      onChange={e => setValue(e.target.value)}
      style={{
        width: '100%',
        padding: '16px 12px 8px 12px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        background: 'white',
        minHeight: '100px',
        resize: 'vertical',
        position: 'relative',
      }}
    />
  );
};

export default SimulatorTextArea;
