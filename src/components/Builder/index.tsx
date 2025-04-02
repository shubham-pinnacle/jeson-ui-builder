import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Box, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ComponentType } from '../../types';
import PreviewComponent from '../Preview';

const BuilderContainer = styled(Box)`
  flex: 1;
  padding: 24px;
  background-color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const PreviewContainer = styled(Paper)`
  flex: 1;
  margin: 16px;
  padding: 16px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

interface DropZoneProps {
  $isDraggingOver: boolean;
}

const DropZone = styled(Box)<DropZoneProps>`
  flex: 1;
  border: 2px dashed ${props => props.$isDraggingOver ? '#1976d2' : '#ccc'};
  border-radius: 8px;
  padding: 16px;
  min-height: 200px;
  background-color: ${props => props.$isDraggingOver ? 'rgba(25, 118, 210, 0.08)' : '#fafafa'};
  transition: all 0.2s ease;
`;

const Builder: React.FC = () => {
  const components = useSelector((state: RootState) => state.ui.components);

  return (
    <BuilderContainer>
      <PreviewContainer elevation={1}>
        <Droppable droppableId="builder">
          {(provided, snapshot) => (
            <DropZone
              ref={provided.innerRef}
              {...provided.droppableProps}
              $isDraggingOver={snapshot.isDraggingOver}
            >
              {components.map((component, index) => (
                <PreviewComponent
                  key={component.id}
                  component={component}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </DropZone>
          )}
        </Droppable>
      </PreviewContainer>
    </BuilderContainer>
  );
};

export default Builder; 