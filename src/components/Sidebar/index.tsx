import React from 'react';
import styled from 'styled-components';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Box, Typography, Paper } from '@mui/material';
import {
  MdTextFields,
  MdCheckBox,
  MdRadioButtonChecked,
  MdArrowDropDown,
  MdImage,
} from 'react-icons/md';

const SidebarContainer = styled(Box)`
  width: 250px;
  height: 100vh;
  background-color: #f5f5f5;
  padding: 16px;
  border-right: 1px solid #e0e0e0;
`;

const ComponentItem = styled(Paper)`
  padding: 12px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: move;
  &:hover {
    background-color: #e3f2fd;
  }
`;

const components = [
  { id: 'text-input', type: 'TextInput', label: 'Text Input', icon: <MdTextFields /> },
  { id: 'checkbox', type: 'CheckBox', label: 'Checkbox', icon: <MdCheckBox /> },
  { id: 'radio', type: 'RadioButton', label: 'Radio Button', icon: <MdRadioButtonChecked /> },
  { id: 'dropdown', type: 'Dropdown', label: 'Dropdown', icon: <MdArrowDropDown /> },
  { id: 'image', type: 'Image', label: 'Image', icon: <MdImage /> },
];

const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <Typography variant="h6" gutterBottom>
        Components
      </Typography>
      <Droppable droppableId="sidebar" isDropDisabled>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {components.map((component, index) => (
              <Draggable key={component.id} draggableId={component.id} index={index}>
                {(provided) => (
                  <ComponentItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    elevation={1}
                  >
                    {component.icon}
                    <Typography>{component.label}</Typography>
                  </ComponentItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </SidebarContainer>
  );
};

export default Sidebar; 