import React, { useState } from 'react';
import { Component } from '../../types';
import { Box, Typography } from '@mui/material';

interface Props { component: Component; }

const SimulatorTextArea: React.FC<Props> = ({ component }) => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const label = component.properties?.label || '';
  const initValue = component.properties?.initValue || '';

  // Check if the user has input value or initValue is set
  const hasUserInput = value.length > 0;
  const isFloating = hasUserInput || focused;

  // Placeholder logic: Only display initValue if there is no user input or focus
  const placeholder = !hasUserInput && !focused && initValue ? initValue : '';

  return (
    <Box style={{ position: 'relative', width: '100%' }}>
      {/* Floating label */}
      {isFloating && (
        <Typography
          variant="body2"
          style={{
            position: 'absolute',
            top: '6px',
            left: '12px',
            fontSize: '12px',
            color: '#666',
            backgroundColor: 'white',
            padding: '0 4px',
            transition: 'all 0.2s ease',
            pointerEvents: 'none',
          }}
        >
          {label}
        </Typography>
      )}

      {/* Textarea */}
      <textarea
        value={value}
        placeholder={placeholder} // Set placeholder correctly
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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
    </Box>
  );
};

export default SimulatorTextArea;
