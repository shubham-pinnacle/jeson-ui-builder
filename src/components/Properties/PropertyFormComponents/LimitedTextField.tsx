import React, { useState } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useToast } from '../../ToastContext';

interface LimitedTextFieldProps extends Omit<TextFieldProps, 'onChange' | 'error' | 'helperText' | 'value'> {
  field: string;
  value: string;
  onFieldChange: (field: string, value: string) => void;
  maxChars?: number;
  forbidSpaces?: boolean;
}

const LimitedTextField: React.FC<LimitedTextFieldProps> = ({ field, value, onFieldChange, maxChars = 80, forbidSpaces, ...props }) => {
  const { showToast } = useToast();
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    // disallow spaces if requested
    if (forbidSpaces && val.includes(' ')) {
      const noSpace = val.replace(/\s/g, '');
      onFieldChange(field, noSpace);
      if (!error) showToast({ message: `${props.label || field} cannot contain spaces`, type: 'error' });
      setError(true);
      return;
    }
    if (val.length > maxChars) {
      const trimmed = val.slice(0, maxChars);
      onFieldChange(field, trimmed);
      if (!error) showToast({ message: `${props.label || field} cannot exceed ${maxChars} characters`, type: 'error' });
      setError(true);
    } else {
      onFieldChange(field, val);
      if (error) setError(false);
    }
  };

  return (
    <TextField
      {...props}
      value={value}
      onChange={handleChange}
      error={error}
      helperText={error ? (forbidSpaces && value.includes(' ') ? `${props.label || field} cannot contain spaces` : `Maximum ${maxChars} characters allowed`) : ''}
    />
  );
};

export default LimitedTextField;
