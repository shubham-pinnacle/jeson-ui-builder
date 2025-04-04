import React from 'react';
import styled from 'styled-components';
import { Component } from '../types';
import { TextField, FormControl, FormLabel, FormGroup, FormControlLabel, Radio, RadioGroup, Checkbox, Button, Select, MenuItem, InputLabel } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const PreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height for vertical centering */
  // background: #ffff; /* Optional: background color for contrast */
  margin-bottom: 15px;
`;

const PreviewFrame = styled.div`
  width: 320px;
  height: 70vh;
  background: white;
  border-radius: 32px;
  padding: 20px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow-y: auto;
  border: 3px solid #333;
  margin: auto;
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */

  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 13px;
    background: #333;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
`;

const PreviewTitle = styled.h1`
  font-size: 18px;
  color: #333;
  margin: 0;
  text-align: center;
`;

const PreviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledFormControl = styled(FormControl)`
  width: 100%;
  margin-bottom: 16px;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
  & .MuiOutlinedInput-root {
    background-color: #fff;
    & fieldset {
      border-color: rgba(0, 0, 0, 0.23);
    }
    &:hover fieldset {
      border-color: rgba(0, 0, 0, 0.87);
    }
    &.Mui-focused fieldset {
      border-color: #1976d2;
    }
  }
  & .MuiInputLabel-root {
    color: rgba(0, 0, 0, 0.6);
    &.Mui-focused {
      color: #1976d2;
    }
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-top: 8px;
  text-transform: none;
`;

const Heading = styled.h2`
  font-size: 24px;
  color: #333;
  margin: 0;
`;

const SubHeading = styled.h3`
  font-size: 18px;
  color: #666;
  margin: 0;
`;

const TextBody = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
`;

const Caption = styled.p`
  font-size: 12px;
  color: #999;
  line-height: 1.5;
  margin: 0;
`;

interface MobilePreviewProps {
  components: Component[];
  screenTitle: string;
}

const MobilePreview: React.FC<MobilePreviewProps> = ({ components, screenTitle }) => {
  const renderComponent = (component: Component) => {
    const getOptions = (options: any): string[] => {
      if (Array.isArray(options)) {
        return options;
      }
      if (typeof options === 'string') {
        try {
          const parsed = JSON.parse(options);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          return [];
        }
      }
      return [];
    };

    switch (component.type) {
      case 'text-heading':
        return (
          <Heading key={component.id}>
            {component.properties?.text || 'Heading'}
          </Heading>
        );

      case 'sub-heading':
        return (
          <SubHeading key={component.id}>
            {component.properties?.text || 'Sub Heading'}
          </SubHeading>
        );

      case 'text-body':
        return (
          <TextBody key={component.id}>
            {component.properties?.text || 'Text content goes here'}
          </TextBody>
        );

      case 'text-caption':
        return (
          <Caption key={component.id}>
            {component.properties?.text || 'Caption text'}
          </Caption>
        );

      case 'text-input':
        return (
          <StyledTextField
            key={component.id}
            label={component.properties?.label || 'Label'}
            variant="outlined"
            fullWidth
            size="small"
            required={component.properties?.required === 'true'}
            placeholder={component.properties?.placeholder}
            type={component.properties?.inputType || 'text'}
          />
        );

      case 'text-area':
        return (
          <StyledTextField
            key={component.id}
            label={component.properties?.label || 'Label'}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            required={component.properties?.required === 'true'}
            placeholder={component.properties?.placeholder}
          />
        );

      case 'drop-down':
        return (
          <StyledFormControl key={component.id}>
            <InputLabel>{component.properties?.label || 'Select'}</InputLabel>
            <Select
              label={component.properties?.label || 'Select'}
              required={component.properties?.required === 'true'}
              defaultValue=""
            >
              <MenuItem value="">{component.properties?.placeholder || 'Select an option'}</MenuItem>
              {getOptions(component.properties?.options).map((option: string) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        );

      case 'radio-button':
        return (
          <StyledFormControl key={component.id}>
            <FormLabel>{component.properties?.label || 'Options'}</FormLabel>
            <RadioGroup>
              {getOptions(component.properties?.options).map((option: string) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </StyledFormControl>
        );

      case 'check-box':
        return (
          <StyledFormControl key={component.id}>
            <FormLabel>{component.properties?.label || 'Options'}</FormLabel>
            <FormGroup>
              {getOptions(component.properties?.options).map((option: string) => (
                <FormControlLabel
                  key={option}
                  control={<Checkbox />}
                  label={option}
                />
              ))}
            </FormGroup>
          </StyledFormControl>
        );

      case 'footer-button':
      case 'embedded-link':
        return (
          <StyledButton
            key={component.id}
            variant="contained"
            color="primary"
            onClick={() => {}}
          >
            {component.properties?.buttonText || 'Submit'}
          </StyledButton>
        );

      case 'opt-in':
        return (
          <FormControlLabel
            key={component.id}
            control={<Checkbox required={component.properties?.required === 'true'} />}
            label={component.properties?.label || 'I agree'}
          />
        );

      case 'photo':
      case 'document':
        return (
          <StyledFormControl key={component.id}>
            <FormLabel>{component.properties?.label || 'Upload File'}</FormLabel>
            <input
              type="file"
              accept={component.properties?.accept}
              required={component.properties?.required === 'true'}
              style={{
                marginTop: '8px',
                padding: '8px',
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px'
              }}
            />
          </StyledFormControl>
        );

      default:
        return null;
    }
  };

  return (
    <PreviewContainer>
      <PreviewFrame>
        <PreviewHeader>
          <PreviewTitle>{screenTitle}</PreviewTitle>
        </PreviewHeader>
        <PreviewContent>
          {components.map(component => renderComponent(component))}
        </PreviewContent>
      </PreviewFrame>
    </PreviewContainer>
  );
};

export default MobilePreview;
