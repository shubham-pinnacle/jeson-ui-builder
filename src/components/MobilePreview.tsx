import React from 'react';
import styled from 'styled-components';
import { Component } from '../types';

const PreviewFrame = styled.div`
  width: 320px;
  height: 640px;
  background: white;
  border-radius: 32px;
  padding: 20px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow-y: auto;
  border: 12px solid #333;

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
  color: #666;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const TextArea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const Button = styled.button<{ variant?: string }>`
  padding: 8px 16px;
  background: ${props => props.variant === 'contained' ? '#2196f3' : 'transparent'};
  color: ${props => props.variant === 'contained' ? 'white' : '#2196f3'};
  border: ${props => props.variant === 'contained' ? 'none' : '1px solid #2196f3'};
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.variant === 'contained' ? '#1976d2' : 'rgba(33, 150, 243, 0.1)'};
  }
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

interface MobilePreviewProps {
  components: Component[];
}

const MobilePreview: React.FC<MobilePreviewProps> = ({ components }) => {
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
            <Input 
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
            <TextArea 
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
                  <input type="radio" name={component.id} value={option} />
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
                <input type="checkbox" value={option} />
                <Label>{option}</Label>
              </CheckboxGroup>
            ))}
          </FormControl>
        );

      case 'footer-button':
      case 'embedded-link':
        return (
          <Button 
            key={component.id}
            variant={component.properties?.variant}
          >
            {component.properties?.buttonText || 'Submit'}
          </Button>
        );

      case 'opt-in':
        return (
          <CheckboxGroup key={component.id}>
            <input type="checkbox" required={component.properties?.required === 'true'} />
            <Label>{component.properties?.label || 'I agree'}</Label>
          </CheckboxGroup>
        );

      case 'photo':
      case 'document':
        return (
          <FormControl key={component.id}>
            <Label>{component.properties?.label || 'Upload File'}</Label>
            <Input 
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
    <PreviewFrame>
      <PreviewHeader>
        <PreviewTitle>Step One</PreviewTitle>
      </PreviewHeader>
      <PreviewContent>
        {components.map(component => renderComponent(component))}
      </PreviewContent>
    </PreviewFrame>
  );
};

export default MobilePreview; 