import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, Checkbox, FormControlLabel, Radio, Button } from '@mui/material';
import { Component } from '../types';

const ComponentContent = styled(Box)({
  padding: '16px',
  backgroundColor: '#ffffff',
});

const StyledTextField = styled(TextField)({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f8f9fa',
  },
});

const StyledTextArea = styled(TextField)({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f8f9fa',
  },
});

const CheckboxGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const RadioGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const StyledButton = styled(Button)({
  width: '100%',
  marginTop: '16px',
});

interface DroppedComponentProps {
  component: Component;
  onPropertyChange: (componentId: string, property: string, value: any) => void;
}

const DroppedComponent: React.FC<DroppedComponentProps> = ({
  component,
  onPropertyChange,
}) => {
  const renderComponentContent = () => {
    switch (component.type) {
      case 'text-heading':
        return (
          <Typography variant="h6" style={{ color: '#333' }}>
            {component.properties?.text || 'Heading Text'}
          </Typography>
        );
      case 'text-input':
        return (
          <StyledTextField
            label={component.properties?.label || 'Input Label'}
            placeholder={component.properties?.placeholder || 'Enter text...'}
            variant="outlined"
            size="small"
            disabled
          />
        );
      case 'text-area':
        return (
          <StyledTextArea
            label={component.properties?.label || 'Text Area Label'}
            placeholder={component.properties?.placeholder || 'Enter text...'}
            variant="outlined"
            size="small"
            multiline
            rows={4}
            disabled
          />
        );
      case 'check-box':
        return (
          <CheckboxGroup>
            <Typography variant="body2" style={{ color: '#666', marginBottom: '8px' }}>
              {component.properties?.label || 'Checkbox Group Label'}
            </Typography>
            {component.properties?.options ? 
              JSON.parse(component.properties.options).map((option: string, index: number) => (
                <FormControlLabel
                  key={index}
                  control={<Checkbox disabled />}
                  label={option}
                />
              )) : 
              <FormControlLabel
                control={<Checkbox disabled />}
                label="Default Option"
              />
            }
          </CheckboxGroup>
        );
      case 'radio-button':
        return (
          <RadioGroup>
            <Typography variant="body2" style={{ color: '#666', marginBottom: '8px' }}>
              {component.properties?.label || 'Radio Group Label'}
            </Typography>
            {component.properties?.options ? 
              JSON.parse(component.properties.options).map((option: string, index: number) => (
                <FormControlLabel
                  key={index}
                  control={<Radio disabled />}
                  label={option}
                />
              )) : 
              <FormControlLabel
                control={<Radio disabled />}
                label="Default Option"
              />
            }
          </RadioGroup>
        );
      case 'footer-button':
        return (
          <StyledButton
            variant={component.properties?.variant || 'contained'}
            color="primary"
            disabled
          >
            {component.properties?.buttonText || 'Submit'}
          </StyledButton>
        );
      default:
        return null;
    }
  };

  return (
    <ComponentContent>
      {renderComponentContent()}
    </ComponentContent>
  );
};

export default DroppedComponent; 