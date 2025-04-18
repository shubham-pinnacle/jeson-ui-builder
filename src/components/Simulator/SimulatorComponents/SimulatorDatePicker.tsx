import React, { useState, useEffect } from 'react';
import { Component } from '../../types';
import { TextField } from '@mui/material';
import { formatDate } from './utils';

interface Props { component: Component; }

const SimulatorDatePicker: React.FC<Props> = ({ component }) => {
  const raw = component.properties?.initValue;
  const [currentDate, setCurrentDate] = useState(
    formatDate(raw || new Date())
  );

  useEffect(() => {
    if (raw) setCurrentDate(formatDate(raw));
  }, [raw]);

  return (
    <TextField
      type="text"
      label={component.properties?.label || 'Select Date'}
      variant="outlined"
      fullWidth
      InputLabelProps={{ shrink: true }}
      inputProps={{ pattern: '\\d{4}-\\d{2}-\\d{2}', placeholder: 'YYYY-MM-DD' }}
      sx={{ marginTop: '8px', marginBottom: '8px', '& input': { fontFamily: 'monospace' } }}
      value={currentDate}
      onChange={e => {
        const v = e.target.value;
        if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
          console.log('Date selected:', v);
          setCurrentDate(v);
        }
      }}
    />
  );
};

export default SimulatorDatePicker;
