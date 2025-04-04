import React from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { Component, BuilderProps } from '../types';
import PropertiesForm from './PropertiesForm';
import DroppedComponent from './DroppedComponent';
import { Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface StyledProps {
  $isSelected?: boolean;
  $type?: string;
}

const BuilderContainer = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;
`;

const BuildArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;

  /* Custom scrollbar styling for WebKit browsers */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #ffffff; /* white track */
  }
  &::-webkit-scrollbar-thumb {
    background-color: lightgrey; /* light grey thumb */
    border-radius: 4px;
  }

  /* Firefox scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: lightgrey #ffffff;
`;

const ComponentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 100%;
`;

const ComponentWrapper = styled.div<StyledProps>`
  background: white;
  border: 2px solid ${props => props.$isSelected ? '#2196f3' : '#e0e0e0'};
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #2196f3;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const ComponentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ComponentTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #333;
`;

const ComponentContent = styled.div<{ color?: string; fontSize?: string }>`
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: ${props => props.fontSize || '14px'};
  color: ${props => props.color || '#666'};
`;

const Builder: React.FC<BuilderProps> = ({
  components,
  selectedComponent,
  onComponentSelect,
  onPropertyChange,
  onDeleteComponent,
  onDragEnd,
  onAddComponent,
}) => {
  const handleComponentClick = (component: Component) => {
    onComponentSelect(component);
  };

  const handleDeleteClick = (e: React.MouseEvent, componentId: string) => {
    e.stopPropagation();
    onDeleteComponent(componentId);
  };

  // This function is needed to match the interface but won't be used
  const handleAddComponentWrapper = (type: string) => {
    onAddComponent(type);
  };

  const renderComponentContent = (component: Component) => {
    switch (component.type) {
      case 'text-heading':
        return (
          <ComponentContent fontSize="24px" color={component.properties?.color || '#333333'}>
            {component.properties?.text || 'Heading Text'}
          </ComponentContent>
        );
      case 'sub-heading':
        return (
          <ComponentContent fontSize="18px" color={component.properties?.color || '#666666'}>
            {component.properties?.text || 'Sub Heading Text'}
          </ComponentContent>
        );
      case 'text-body':
        return (
          <ComponentContent fontSize="14px" color={component.properties?.color || '#666666'}>
            {component.properties?.text || 'Body Text Content'}
          </ComponentContent>
        );
      case 'text-caption':
        return (
          <ComponentContent fontSize="12px" color={component.properties?.color || '#999999'}>
            {component.properties?.text || 'Caption Text'}
          </ComponentContent>
        );
      case 'text-input':
        return <ComponentContent>{component.properties?.label || 'No label'}</ComponentContent>;
      case 'text-area':
        return <ComponentContent>{component.properties?.label || 'No label'}</ComponentContent>;
      case 'check-box':
        return <ComponentContent>{component.properties?.label || 'No label'}</ComponentContent>;
      case 'radio-button':
        return <ComponentContent>{component.properties?.label || 'No label'}</ComponentContent>;
      case 'footer-button':
        return <ComponentContent>{component.properties?.buttonText || 'Submit'}</ComponentContent>;
      default:
        return null;
    }
  };

  return (
    <BuilderContainer>
      <BuildArea>
        <Droppable droppableId="builder">
          {(provided, snapshot) => (
            <ComponentsList
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                minHeight: '100%',
                background: snapshot.isDraggingOver ? '#e3f2fd' : 'transparent',
                transition: 'background-color 0.2s ease'
              }}
            >
              {components.map((component, index) => (
                <Draggable
                  key={component.id}
                  draggableId={component.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <ComponentWrapper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.5 : 1
                      }}
                      $isSelected={selectedComponent?.id === component.id}
                      $type={component.type}
                      onClick={() => handleComponentClick(component)}
                    >
                      <ComponentHeader>
                        <ComponentTitle>
                          {component.name}
                          <IoMdInformationCircleOutline size={16} color="#666" />
                        </ComponentTitle>
                        <div>
                          <FaEdit size={14} style={{ marginRight: '8px', color: '#666' }} />
                          <FaTrash
                            size={14}
                            style={{ color: '#666', cursor: 'pointer' }}
                            onClick={(e) => handleDeleteClick(e, component.id)}
                          />
                        </div>
                      </ComponentHeader>
                      {renderComponentContent(component)}
                    </ComponentWrapper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ComponentsList>
          )}
        </Droppable>
      </BuildArea>
      
      {selectedComponent && (
        <PropertiesForm
          component={selectedComponent}
          onPropertyChange={(property, value) => onPropertyChange(selectedComponent.id, property, value)}
          onClose={() => onComponentSelect(null)}
        />
      )}
    </BuilderContainer>
  );
};

export default Builder; 