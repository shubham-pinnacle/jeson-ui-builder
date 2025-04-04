import React from 'react';
import styled from 'styled-components';
import { Component } from '../types';

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

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 20px;
    background: #333;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
`;

const PreviewTitle = styled.h1`
  font-size: 18px;
  color: #333;
  margin: 0;
`;

const PreviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
`;

const StyledInput = styled('input')({
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #333',
  borderRadius: '4px',
  fontSize: '16px',
  backgroundColor: '#fff',
  color: '#fff',
  '&:focus': {
    outline: 'none',
    borderColor: '#90caf9',
  },
  '&::placeholder': {
    color: '#666',
  }
});

const StyledTextArea = styled('textarea')({
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #333',
  borderRadius: '4px',
  fontSize: '16px',
  minHeight: '100px',
  resize: 'vertical',
  backgroundColor: '#fff',
  color: '#fff',
  '&:focus': {
    outline: 'none',
    borderColor: '#90caf9',
  },
  '&::placeholder': {
    color: '#666',
  }
});

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  color: #333;

  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const StyledButton = styled('button')({
  width: '100%',
  padding: '12px',
  backgroundColor: '#2196f3',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#1976d2',
  },
  '&:disabled': {
    backgroundColor: '#666',
    cursor: 'not-allowed',
  }
});

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

const CheckboxGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledCheckbox = styled('input')({
  marginRight: '8px',
  width: '18px',
  height: '18px',
  cursor: 'pointer',
  backgroundColor: '#fff',
  borderColor: '#333',
  '&:checked': {
    backgroundColor: '#90caf9',
    borderColor: '#90caf9',
  }
});

const StyledRadio = styled('input')({
  marginRight: '8px',
  width: '18px',
  height: '18px',
  cursor: 'pointer',
  backgroundColor: '#fff',
  borderColor: '#333',
  '&:checked': {
    backgroundColor: '#90caf9',
    borderColor: '#90caf9',
  }
});

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
          <FormControl key={component.id}>
            <Label>{component.properties?.label || 'Label'}</Label>
            <StyledInput 
              type={component.properties?.inputType || 'text'}
              placeholder={component.properties?.placeholder}
              required={component.properties?.required === 'true'}
            />
          </FormControl>
        );

      case 'text-area':
        return (
          <FormControl key={component.id}>
            <Label>{component.properties?.label || 'Label'}</Label>
            <StyledTextArea 
              placeholder={component.properties?.placeholder}
              required={component.properties?.required === 'true'}
            />
          </FormControl>
        );

      case 'drop-down':
        return (
          <FormControl key={component.id}>
            <Label>{component.properties?.label || 'Select'}</Label>
            <Select
              required={component.properties?.required === 'true'}
            >
              <option value="">{component.properties?.placeholder || 'Select an option'}</option>
              {getOptions(component.properties?.options).map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
          </FormControl>
        );

      case 'radio-button':
        return (
          <FormControl key={component.id}>
            <Label>{component.properties?.label || 'Options'}</Label>
            <RadioGroup>
              {getOptions(component.properties?.options).map((option: string) => (
                <CheckboxGroup key={option}>
                  <StyledRadio type="radio" name={component.id} value={option} />
                  <Label>{option}</Label>
                </CheckboxGroup>
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'check-box':
        return (
          <FormControl key={component.id}>
            <Label>{component.properties?.label || 'Options'}</Label>
            {getOptions(component.properties?.options).map((option: string) => (
              <CheckboxGroup key={option}>
                <StyledCheckbox type="checkbox" value={option} />
                <Label>{option}</Label>
              </CheckboxGroup>
            ))}
          </FormControl>
        );

      case 'footer-button':
      case 'embedded-link':
        return (
          <StyledButton 
            key={component.id}
            onClick={() => {}}
          >
            {component.properties?.buttonText || 'Submit'}
          </StyledButton>
        );

      case 'opt-in':
        return (
          <CheckboxGroup key={component.id}>
            <StyledCheckbox type="checkbox" required={component.properties?.required === 'true'} />
            <Label>{component.properties?.label || 'I agree'}</Label>
          </CheckboxGroup>
        );

      case 'photo':
      case 'document':
        return (
          <FormControl key={component.id}>
            <Label>{component.properties?.label || 'Upload File'}</Label>
            <StyledInput 
              type="file"
              accept={component.properties?.accept}
              required={component.properties?.required === 'true'}
            />
          </FormControl>
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
