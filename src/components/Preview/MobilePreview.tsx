import React from 'react';
import styled from 'styled-components';
import { Component } from '../types';
import { TextField, FormControl, FormLabel, FormGroup, FormControlLabel, Radio, RadioGroup, Checkbox, Button, Select, MenuItem, InputLabel, Typography, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const MobileContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: '#ffffff',
  borderRadius: '40px',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 0 20px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
}));

const ScreenContent = styled(Box)({
  flex: 1,
  overflow: 'auto',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const ComponentWrapper = styled(Box)({
  width: '100%',
});

const PreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin-bottom: 15px;
`;

const PreviewFrame = styled.div`
  width: 300px;
  height: 70vh;
  background: white;
  border-radius: 32px;
  padding: 10px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow-y: auto;
  border: 3px solid #333;
  margin: auto;
  display: flex;
  flex-direction: column;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;
  
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

interface PreviewContentProps {
  $hasFooter: boolean;
}

const PreviewContent = styled.div<PreviewContentProps>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: ${props => props.$hasFooter ? '60px' : '0'};
  position: relative;
  
  /* Hide scrollbars */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const FooterContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: white;
  border-top: 1px solid #eee;
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
  // Extract footer component and others separately
  const footerComponent = components.find(comp => comp.type === 'footer-button');
  const nonFooterComponents = components.filter(comp => comp.type !== 'footer-button');

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
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {component.properties.text}
          </Typography>
        );
      case 'sub-heading':
        return (
          <Typography variant="h6" sx={{ color: '#666' }}>
            {component.properties.text}
          </Typography>
        );
      case 'text-body':
        return (
          <Typography variant="body1" sx={{ color: '#333' }}>
            {component.properties.text}
          </Typography>
        );
      case 'text-caption':
        return (
          <Typography variant="caption" sx={{ color: '#999' }}>
            {component.properties.text}
          </Typography>
        );
      case 'text-input':
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {component.properties.label}
            </Typography>
            <Box
              sx={{
                border: '1px solid #ccc',
                borderRadius: 1,
                p: 1,
                minHeight: '40px',
              }}
            />
          </Box>
        );
      case 'text-area':
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {component.properties.label}
            </Typography>
            <Box
              sx={{
                border: '1px solid #ccc',
                borderRadius: 1,
                p: 1,
                minHeight: '100px',
              }}
            />
          </Box>
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
          <StyledFormControl key={`${component.id}_radio`}>
            <FormLabel>{component.properties?.label || 'Options'}</FormLabel>
            <RadioGroup>
              {getOptions(component.properties?.options).map((option: string, index: number) => (
                <FormControlLabel
                  key={`${component.id}_radio_${index}`}
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
          <StyledFormControl key={`${component.id}_checkbox`}>
            <FormLabel>{component.properties?.label || 'Options'}</FormLabel>
            <FormGroup>
              {getOptions(component.properties?.options).map((option: string, index: number) => (
                <FormControlLabel
                  key={`${component.id}_checkbox_${index}`}
                  control={<Checkbox />}
                  label={option}
                />
              ))}
            </FormGroup>
          </StyledFormControl>
        );
      case 'footer-button':
        return (
          <Button
            key={component.id}
            variant={component.properties?.variant || 'contained'}
            color="primary"
            fullWidth
            style={{
              textTransform: 'none',
              marginTop: '8px'
            }}
          >
            {component.properties?.buttonText || 'Button'}
          </Button>
        );
      case 'opt-in':
        return (
          <FormControlLabel
            key={component.id}
            control={<Checkbox required={component.properties?.required === 'true'} />}
            label={component.properties?.label || 'I agree'}
          />
        );
      case 'PhotoPicker':
      case 'DocumentPicker':
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
      case 'image':
        return (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img
              src={component.properties.base64Data 
                ? `data:image/png;base64,${component.properties.base64Data}`
                : component.properties.src || ''}
              alt={component.properties.altText || ''}
              style={{
                width: component.properties.width || 200,
                height: component.properties.height || 200,
                aspectRatio: component.properties.aspectRatio || 1,
                objectFit: component.properties.scaleType || 'contain',
                maxWidth: '100%'
              }}
            />
          </Box>
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
        <PreviewContent $hasFooter={!!footerComponent}>
          {nonFooterComponents.map(component => renderComponent(component))}
        </PreviewContent>
        {footerComponent && (
          <FooterContainer>
            {renderComponent(footerComponent)}
          </FooterContainer>
        )}
      </PreviewFrame>
    </PreviewContainer>
  );
};

export default MobilePreview;
