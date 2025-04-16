import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Paper, Typography, Stack } from '@mui/material';
import { RootState } from '../../store';
import { updateComponentProperty } from '../../store/actions/componentActions';
import { PropertyField } from './components/PropertyField';

const PropertiesContainer = styled(Paper)`
  width: 300px;
  padding: 16px;
  height: 100vh;
  overflow-y: auto;
  background-color: #ffffff;
`;

const NoSelectionMessage = styled(Typography)`
  color: #666;
  text-align: center;
  margin-top: 20px;
`;

export const PropertiesForm: React.FC = () => {
  const selectedComponent = useSelector(
    (state: RootState) => state.component.selectedComponent
  );
  const dispatch = useDispatch();

  const handlePropertyChange = (property: string, value: string) => {
    if (selectedComponent) {
      dispatch(updateComponentProperty(selectedComponent.id, property, value));
    }
  };

  if (!selectedComponent) {
    return (
      <PropertiesContainer>
        <NoSelectionMessage variant="body2">
          Select a component to edit its properties
        </NoSelectionMessage>
      </PropertiesContainer>
    );
  }

  const renderFields = () => {
    switch (selectedComponent.type) {
      case 'text-heading':
      case 'sub-heading':
      case 'text-body':
      case 'text-caption':
        return (
          <Stack spacing={2}>
            <PropertyField
              label="Text"
              type="text"
              value={selectedComponent.properties?.text || ''}
              onChange={(value) => handlePropertyChange('text', value)}
            />
            <PropertyField
              label="Visible"
              type="select"
              value={selectedComponent.properties?.visible?.toString() || 'true'}
              onChange={(value) => handlePropertyChange('visible', value)}
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]}
            />
          </Stack>
        );

      case 'opt-in':
        return (
          <Stack spacing={2}>
            <PropertyField
              label="Label"
              type="text"
              value={selectedComponent.properties?.label || ''}
              onChange={(value) => handlePropertyChange('label', value)}
            />
            <PropertyField
              label="Required"
              type="select"
              value={selectedComponent.properties?.required?.toString() || 'false'}
              onChange={(value) => handlePropertyChange('required', value)}
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]}
            />
            <PropertyField
              label="Visible"
              type="select"
              value={selectedComponent.properties?.visible?.toString() || 'true'}
              onChange={(value) => handlePropertyChange('visible', value)}
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]}
            />
            <PropertyField
              label="Init Value"
              type="select"
              value={selectedComponent.properties?.initValue?.toString() || 'false'}
              onChange={(value) => handlePropertyChange('initValue', value)}
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]}
            />
          </Stack>
        );

      // Add more component types here
      default:
        return (
          <NoSelectionMessage variant="body2">
            No properties available for this component type
          </NoSelectionMessage>
        );
    }
  };

  return (
    <PropertiesContainer>
      <Typography variant="h6" gutterBottom>
        {selectedComponent.name} Properties
      </Typography>
      {renderFields()}
    </PropertiesContainer>
  );
};
