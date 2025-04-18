import React from 'react';
import { styled } from '@mui/material/styles';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Component } from '../../types';
import PropertiesForm from '../Properties/PropertiesForm';
import { DropResult } from 'react-beautiful-dnd';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { IoMdInformationCircleOutline } from 'react-icons/io';

interface StyledProps {
  $isSelected?: boolean;
  $type?: string;
}

const BuilderContainer = styled('div')({
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
});

const BuildArea = styled('div')({
  flex: 1,
  padding: '20px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#ffffff',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'lightgrey',
    borderRadius: '4px',
  },
  scrollbarWidth: 'thin',
  scrollbarColor: 'lightgrey #ffffff',
});

const ComponentsList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  minHeight: '100%',
});

const ComponentWrapper = styled('div', {
  shouldForwardProp: (prop) => !['$isSelected', '$type'].includes(prop as string),
})<StyledProps>(({ theme, $isSelected, $type }) => ({
  background: 'white',
  border: `2px solid ${$isSelected ? '#2196f3' : '#e0e0e0'}`,
  borderRadius: '4px',
  padding: '10px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#2196f3',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
}));

const ComponentHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
});

const ComponentTitle = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontWeight: 500,
  color: '#333',
});

const ComponentContent = styled('div', {
  shouldForwardProp: (prop) => !['$type', 'color', 'fontSize'].includes(prop as string),
})<{ $type?: string; color?: string; fontSize?: string }>(({ theme, $type, color, fontSize }) => ({
  padding: $type === 'text-input' ? '8px 12px' : '8px',
  borderRadius: $type === 'text-input' ? '4px' : '0',
  backgroundColor: $type === 'text-input' ? '#ffffff' : 'transparent',
  color: color || '#333333',
  fontSize: (() => {
    switch ($type) {
      case 'text-heading':
        return '24px';
      case 'sub-heading':
        return '18px';
      case 'text-caption':
        return '12px';
      case 'text-input':
        return '14px';
      default:
        return '14px';
    }
  })(),
  fontWeight: $type === 'text-heading' ? 'bold' : 'normal',
  width: '100%',
  minHeight: $type === 'text-input' ? '40px' : 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  border: $type === 'text-input' ? '1px solid #e0e0e0' : 'none'
}));



interface BuilderProps {
  components: Component[];
  selectedComponent: Component | null;
  onComponentSelect: (component: Component | null) => void;
  onPropertyChange: (componentId: string, property: string, value: any) => void;
  onDeleteComponent: (componentId: string) => void;
  onDragEnd: (result: DropResult) => void;
  onAddComponent: (type: string) => void;
  screens: { id: string; title: string }[];
}

const Builder: React.FC<BuilderProps> = ({
  components,
  selectedComponent,
  onComponentSelect,
  onPropertyChange,
  onDeleteComponent,
  onDragEnd,
  onAddComponent,
  screens
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

  const renderComponent = (component: Component) => {
    switch (component.type) {
      case 'text-heading':
        return (
          <ComponentContent
            $type="text-heading"
            color={component.properties.color}
            fontSize={component.properties.fontSize}
          >
            {component.properties.text || 'Heading Text'}
          </ComponentContent>
        );
      case 'sub-heading':
        return (
          <ComponentContent
            $type="sub-heading"
            color={component.properties.color || '#666666'}
            fontSize={component.properties.fontSize}
          >
            {component.properties.text || 'Sub Heading Text'}
          </ComponentContent>
        );
      case 'text-caption':
        return (
          <ComponentContent
            $type="text-caption"
            color={component.properties.color || '#999999'}
            fontSize={component.properties.fontSize}
          >
            {component.properties.text || 'Caption Text'}
          </ComponentContent>
        );
        console.log(component.properties,"jsdksks")
      case 'text-input':
        console.log('TextInput Component Properties:', {
          id: component.id,
          properties: component.properties,
          label: component.properties.label,
          placeholder: component.properties.placeholder,
          value: component.properties.value
        });
        return (
          <ComponentContent $type="text-input">
            <div style={{ marginBottom: '8px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                color: '#333', 
                marginBottom: '4px' 
              }}>
                {component.properties.label || 'Label'}
              </label>
            </div>
            
          </ComponentContent>
        );
      case 'text-body':
        return (
          <ComponentContent fontSize="14px" color={component.properties?.color || '#666666'}>
            {component.properties?.text || 'Body Text Content'}
          </ComponentContent>
        );
      case 'text-area':
        return <ComponentContent>{component.properties?.label || 'No label'}</ComponentContent>;
      case 'check-box':
        return <ComponentContent>{component.properties?.label || 'No label'}</ComponentContent>;
      case 'radio-button':
        return <ComponentContent>{component.properties?.label || 'No label'}</ComponentContent>;
      case 'footer-button':
        return <ComponentContent>{component.properties?.label || ''}</ComponentContent>;
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
                      {renderComponent(component)}
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
          onPropertyChange={onPropertyChange}
          onClose={() => onComponentSelect(null)}
          screens={screens}
        />
      )}
    </BuilderContainer>
  );
};

export default Builder; 