import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';

interface PropertyFieldProps {
  label: string;
  type: 'text' | 'select' | 'number';
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  required?: boolean;
  fullWidth?: boolean;
}

export const PropertyField: React.FC<PropertyFieldProps> = ({
  label,
  type,
  value,
  onChange,
  options = [],
  required = false,
  fullWidth = true,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    onChange(e.target.value);
  };

  if (type === 'select' && options.length > 0) {
    return (
      <FormControl fullWidth={fullWidth} size="small">
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          label={label}
          onChange={handleChange}
          required={required}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      type={type}
      required={required}
      fullWidth={fullWidth}
      size="small"
    />
  );
};
