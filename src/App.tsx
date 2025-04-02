import React, { useState } from 'react';
import styled from 'styled-components';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Sidebar from './components/Sidebar';
import Builder from './components/Builder';
import MobilePreview from './components/MobilePreview';
import { Component } from './types';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #f8f9fa;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const BuilderContainer = styled.div`
  flex: 1;
  border-right: 1px solid #eee;
  background: white;
  overflow-y: auto;
  padding: 20px;
`;

const PreviewContainer = styled.div`
  width: 375px;
  background: #f8f9fa;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const App: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<number | null>(null);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === 'builder' && destination.droppableId === 'builder') {
      const newComponents = Array.from(components);
      const [removed] = newComponents.splice(source.index, 1);
      newComponents.splice(destination.index, 0, removed);
      setComponents(newComponents);
    }
  };

  const handleAddComponent = (componentType: string) => {
    const newComponent: Component = {
      id: `${componentType}-${Date.now()}`,
      type: componentType,
      name: getComponentName(componentType),
      properties: getDefaultProperties(componentType)
    };

    setComponents(prev => [...prev, newComponent]);
    setSelectedComponent(components.length); // Select the newly added component
  };

  const getComponentName = (type: string): string => {
    switch (type) {
      case 'text-heading':
        return 'Text Heading';
      case 'sub-heading':
        return 'Sub Heading';
      case 'text-body':
        return 'Text Body';
      case 'text-caption':
        return 'Text Caption';
      case 'rich-text':
        return 'Rich Text';
      case 'text-input':
        return 'Text Input';
      case 'text-area':
        return 'Text Area';
      case 'radio-button':
        return 'Radio Button';
      case 'check-box':
        return 'Check Box';
      case 'drop-down':
        return 'Drop Down';
      case 'footer-button':
        return 'Footer Button';
      case 'embedded-link':
        return 'Embedded Link';
      case 'opt-in':
        return 'Opt In';
      case 'photo':
        return 'Photo';
      case 'document':
        return 'Document';
      default:
        return 'Unknown Component';
    }
  };

  const getDefaultProperties = (type: string): Record<string, string> => {
    switch (type) {
      case 'text-heading':
      case 'sub-heading':
      case 'text-body':
      case 'text-caption':
      case 'rich-text':
        return {
          text: 'Enter your text here',
          label: getComponentName(type)
        };
      case 'text-input':
      case 'text-area':
        return {
          label: 'Input Label',
          placeholder: 'Enter text...',
          outputVariable: '',
          required: 'false',
          inputType: 'text',
          visible: 'true'
        };
      case 'radio-button':
      case 'check-box':
        return {
          label: 'Select Option',
          outputVariable: '',
          required: 'false',
          options: '[]',
          visible: 'true'
        };
      case 'drop-down':
        return {
          label: 'Select from dropdown',
          outputVariable: '',
          required: 'false',
          options: '[]',
          placeholder: 'Select an option',
          visible: 'true'
        };
      case 'footer-button':
      case 'embedded-link':
        return {
          buttonText: 'Submit',
          variant: 'contained',
          action: 'submit'
        };
      case 'opt-in':
        return {
          label: 'I agree to the terms',
          outputVariable: '',
          required: 'false'
        };
      case 'photo':
      case 'document':
        return {
          label: 'Upload File',
          outputVariable: '',
          accept: type === 'photo' ? 'image/*' : 'application/pdf',
          maxSize: '5',
          required: 'false'
        };
      default:
        return {};
    }
  };

  const handleComponentSelect = (index: number) => {
    setSelectedComponent(index);
  };

  const handlePropertyChange = (index: number, field: string, value: string) => {
    setComponents(prev => {
      const newComponents = [...prev];
      if (!newComponents[index].properties) {
        newComponents[index].properties = {};
      }
      newComponents[index].properties![field] = value;
      return newComponents;
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <AppContainer>
        <Sidebar onAddComponent={handleAddComponent} />
        <MainContent>
          <BuilderContainer>
            <Builder 
              components={components} 
              setComponents={setComponents}
              selectedComponent={selectedComponent}
              onComponentSelect={handleComponentSelect}
              onPropertyChange={handlePropertyChange}
            />
          </BuilderContainer>
          <PreviewContainer>
            <MobilePreview components={components} />
          </PreviewContainer>
        </MainContent>
      </AppContainer>
    </DragDropContext>
  );
};

export default App;
