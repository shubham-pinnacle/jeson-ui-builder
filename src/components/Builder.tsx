import React from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { Component } from '../types';
import PropertiesForm from './PropertiesForm';

const BuilderContainer = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;
`;

const BuildArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const ComponentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 100%;
`;

interface DroppedComponentProps {
  $isSelected: boolean;
  $type: string;
}

const DroppedComponent = styled.div<DroppedComponentProps>`
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

const ComponentContent = styled.div`
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
`;

interface BuilderProps {
  components: Component[];
  selectedComponent: Component | null;
  onComponentSelect: (component: Component | null) => void;
  onPropertyChange: (componentId: string, property: string, value: any) => void;
  onDeleteComponent: (componentId: string) => void;
  onDragEnd: (result: any) => void;
  onAddComponent: (component: Component) => void;
}

const Builder: React.FC<BuilderProps> = ({
  components,
  selectedComponent,
  onComponentSelect,
  onPropertyChange,
  onDeleteComponent,
  onDragEnd,
  onAddComponent
}) => {
  const renderComponentContent = (component: Component) => {
    switch (component.type) {
      case 'text-heading':
        return <ComponentContent>{component.properties?.text || 'No text content'}</ComponentContent>;
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
                    <DroppedComponent
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.5 : 1
                      }}
                      $isSelected={selectedComponent?.id === component.id}
                      $type={component.type}
                      onClick={() => onComponentSelect(component)}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteComponent(component.id);
                            }}
                          />
                        </div>
                      </ComponentHeader>
                      {renderComponentContent(component)}
                    </DroppedComponent>
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