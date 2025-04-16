import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box } from '@mui/material';
import { PreviewContainer } from './components/PreviewContainer';
import { DropZone } from './components/DropZone';
import { BuilderComponent } from './components/BuilderComponent';
import { ComponentState } from '../../store/types';

const BuilderContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Builder: React.FC = () => {
  const components = useSelector((state: { component: ComponentState }) => state.component.components);
  const dispatch = useDispatch();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    // Handle component reordering here
    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Dispatch action to update component order
    // TODO: Add action for reordering components
  };

  return (
    <BuilderContainer>
      <PreviewContainer>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="builder">
            {(provided, snapshot) => (
              <DropZone
                ref={provided.innerRef}
                {...provided.droppableProps}
                $isDraggingOver={snapshot.isDraggingOver}
              >
                {components.map((component, index) => (
                  <Draggable
                    key={component.id}
                    draggableId={component.id}
                    index={index}
                  >
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{ mb: 2 }}
                      >
                        <BuilderComponent component={component} />
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </DropZone>
            )}
          </Droppable>
        </DragDropContext>
      </PreviewContainer>
    </BuilderContainer>
  );
};
