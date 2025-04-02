import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import {
  TextField,
  Checkbox,
  Radio,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import { ComponentType } from '../../types';

interface PreviewProps {
  component: ComponentType;
  index: number;
}

interface ComponentWrapperProps {
  $isDragging: boolean;
}

const ComponentWrapper = styled(Box)<ComponentWrapperProps>`
  margin: 8px 0;
  padding: 8px;
  background-color: ${props => props.$isDragging ? '#e3f2fd' : '#ffffff'};
  border: 1px solid #e0e0e0;
  border-radius: 4px;
`;

const PreviewComponent: React.FC<PreviewProps> = ({ component, index }) => {
  const renderComponent = () => {
    switch (component.type) {
      case 'TextInput':
        return (
          <TextField
            fullWidth
            label={component.label}
            required={component.required}
            variant="outlined"
          />
        );
      case 'CheckBox':
        return (
          <FormControl>
            <Checkbox />
            {component.label}
          </FormControl>
        );
      case 'RadioButton':
        return (
          <FormControl>
            <Radio />
            {component.label}
          </FormControl>
        );
      case 'Dropdown':
        return (
          <FormControl fullWidth>
            <InputLabel>{component.label}</InputLabel>
            <Select label={component.label}>
              {component.data?.source?.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'Image':
        return (
          <Box
            component="img"
            src={component.data?.extraDetails?.example || ''}
            alt={component.label}
            sx={{ maxWidth: '100%', height: 'auto' }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Draggable draggableId={component.id} index={index}>
      {(provided, snapshot) => (
        <ComponentWrapper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          $isDragging={snapshot.isDragging}
        >
          {renderComponent()}
        </ComponentWrapper>
      )}
    </Draggable>
  );
};

export default PreviewComponent; 