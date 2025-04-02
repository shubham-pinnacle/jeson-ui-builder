import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Sidebar from './components/Sidebar';
import Builder from './components/Builder';
import MobilePreview from './components/MobilePreview';
import { Component } from './types';

const AppContainer = styled('div')({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: '#f5f5f5',
});

const SidebarContainer = styled('div')({
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  width: '300px',
  backgroundColor: '#fff',
  borderRight: '1px solid #e0e0e0',
  overflowY: 'auto',
  zIndex: 100,
});

const BuilderContainer = styled('div')({
  position: 'fixed',
  left: '300px',
  top: 0,
  bottom: 0,
  width: 'calc(100% - 300px - 375px - 300px)',
  backgroundColor: '#fff',
  padding: '20px',
  overflowY: 'auto',
  borderRight: '1px solid #e0e0e0',
  zIndex: 90,
});

const PreviewContainer = styled('div')({
  position: 'fixed',
  right: '300px',
  top: 0,
  bottom: 0,
  width: '375px',
  backgroundColor: '#f8f9fa',
  padding: '20px',
  overflowY: 'auto',
  zIndex: 80,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const JsonEditorContainer = styled('div')({
  position: 'fixed',
  right: 0,
  top: 0,
  bottom: 0,
  width: '300px',
  backgroundColor: '#1e1e1e',
  padding: '20px',
  overflowY: 'auto',
  zIndex: 70,
  color: '#fff',
});

const App: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [jsonInput, setJsonInput] = useState<string>('[]');

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === 'sidebar' && destination.droppableId === 'builder') {
      // Add new component from sidebar
      const newComponent: Component = {
        id: `component-${Date.now()}`,
        type: draggableId,
        name: draggableId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        properties: {}
      };

      const newComponents = Array.from(components);
      newComponents.splice(destination.index, 0, newComponent);
      setComponents(newComponents);
      setSelectedComponent(newComponent);
    } else if (source.droppableId === 'builder' && destination.droppableId === 'builder') {
      // Reorder components in builder
      const newComponents = Array.from(components);
      const [removed] = newComponents.splice(source.index, 1);
      newComponents.splice(destination.index, 0, removed);
      setComponents(newComponents);
    }
  };

  const handleAddComponent = (type: string) => {
    const newComponent: Component = {
      id: `component-${Date.now()}`,
      type,
      name: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      properties: {}
    };
    setComponents(prev => [...prev, newComponent]);
    setSelectedComponent(newComponent);
  };

  const handlePropertyChange = (componentId: string, property: string, value: any) => {
    setComponents(prevComponents =>
      prevComponents.map(comp =>
        comp.id === componentId
          ? {
              ...comp,
              properties: {
                ...comp.properties,
                [property]: value
              }
            }
          : comp
      )
    );

    // Update selected component to reflect changes immediately
    if (selectedComponent && selectedComponent.id === componentId) {
      setSelectedComponent(prev => prev ? {
        ...prev,
        properties: {
          ...prev.properties,
          [property]: value
        }
      } : null);
    }
  };

  const handleComponentSelect = (component: Component | null) => {
    setSelectedComponent(component);
  };

  const handleDeleteComponent = (componentId: string) => {
    setComponents(prevComponents => prevComponents.filter(comp => comp.id !== componentId));
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null);
    }
  };

  const handleJsonChange = (newJson: string) => {
    try {
      const parsed = JSON.parse(newJson);
      if (Array.isArray(parsed)) {
        setComponents(parsed);
        setJsonInput(newJson);
      }
    } catch (e) {
      console.error('Invalid JSON');
    }
  };

  // Update JSON when components change
  useEffect(() => {
    setJsonInput(JSON.stringify(components, null, 2));
  }, [components]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <AppContainer>
        <SidebarContainer>
          <Sidebar onAddComponent={handleAddComponent} />
        </SidebarContainer>
        <BuilderContainer>
          <Builder
            components={components}
            selectedComponent={selectedComponent}
            onComponentSelect={handleComponentSelect}
            onPropertyChange={handlePropertyChange}
            onDeleteComponent={handleDeleteComponent}
          />
        </BuilderContainer>
        <PreviewContainer>
          <MobilePreview components={components} />
        </PreviewContainer>
        <JsonEditorContainer>
          <h3 style={{ color: '#fff', marginBottom: '16px' }}>JSON Editor</h3>
          <textarea
            value={jsonInput}
            onChange={(e) => handleJsonChange(e.target.value)}
            style={{
              width: '100%',
              height: 'calc(100% - 40px)',
              backgroundColor: '#2d2d2d',
              color: '#fff',
              border: '1px solid #444',
              padding: '8px',
              fontFamily: 'monospace',
              fontSize: '14px',
              resize: 'none'
            }}
          />
        </JsonEditorContainer>
      </AppContainer>
    </DragDropContext>
  );
};

export default App;
