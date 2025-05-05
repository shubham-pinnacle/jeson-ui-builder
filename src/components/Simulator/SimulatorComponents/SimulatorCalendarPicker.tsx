import React, { useState, useEffect } from 'react';
import { Component } from '../../../types';
import { TextField, Box, Typography } from '@mui/material';

interface Props { component: Component; }

const SimulatorCalendarPicker: React.FC<Props> = ({ component }) => {
  const mode = component.properties?.mode || 'single';
  const [value, setValue] = useState<string>('');
  
  useEffect(() => {
    if (component.properties?.initValue) {
      if (mode === 'single') {
        setValue(component.properties.initValue);
      } else {
        try {
          const rangeValue = JSON.parse(component.properties.initValue);
          if (rangeValue["start-date"] && rangeValue["end-date"]) {
            setValue(`${rangeValue["start-date"]} to ${rangeValue["end-date"]}`);
          } else if (rangeValue["start-date"]) {
            setValue(`${rangeValue["start-date"]} to ...`);
          }
        } catch (e) {
          setValue('');
        }
      }
    }
  }, [component.properties?.initValue, mode]);

  const label = component.properties?.label || 'Select Date';
  const helperText = component.properties?.helperText || '';
  const required = component.properties?.required === 'true';
  const placeholder = mode === 'single' ? 'YYYY-MM-DD' : 'YYYY-MM-DD to YYYY-MM-DD';

  return (
    <Box sx={{ marginTop: '8px', marginBottom: '8px' }}>
      <TextField
        type="text"
        label={label}
        variant="outlined"
        required={required}
        fullWidth
        InputLabelProps={{ shrink: true }}
        inputProps={{ 
          placeholder: placeholder,
          readOnly: true
        }}
        sx={{ 
          '& input': { fontFamily: 'monospace' },
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#1976d2',
            },
          }
        }}
        value={value}
        helperText={helperText}
      />
      {mode === 'range' && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {component.properties?.minDays && `Min days: ${component.properties.minDays}`}
          {component.properties?.maxDays && component.properties?.minDays && ' | '}
          {component.properties?.maxDays && `Max days: ${component.properties.maxDays}`}
        </Typography>
      )}
    </Box>
  );
};

export default SimulatorCalendarPicker;
