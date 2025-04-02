import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Sidebar from './components/Sidebar';
import Builder from './components/Builder';
import MobilePreview from './components/MobilePreview';
import MetaJsonGenerator from './components/MetaJsonGenerator';
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
  width: 'calc(100% - 300px - 375px - 500px)',
  backgroundColor: '#fff',
  padding: '20px',
  overflowY: 'auto',
  borderRight: '1px solid #e0e0e0',
  zIndex: 90,
});

const PreviewContainer = styled('div')({
  position: 'fixed',
  right: '500px',
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
  width: '400px',
  backgroundColor: '#1e1e1e',
  padding: '20px',
  overflowY: 'auto',
  zIndex: 70,
  color: '#fff',
});

const MetaContainer = styled('div')({
  position: 'fixed',
  right: '300px',
  top: 0,
  bottom: 0,
  width: '375px',
  backgroundColor: '#f8f9fa',
  padding: '20px',
  overflowY: 'auto',
  zIndex: 75,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const App: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [jsonInput, setJsonInput] = useState<string>('');
  const [metaJson, setMetaJson] = useState<any>(null);

  const generateScreenFormat = (components: Component[]) => {
    // Get all form field names
    const formFields = components
      .filter(comp => comp.type === 'text-input' || comp.type === 'text-area')
      .map(comp => comp.properties.name)
      .filter(Boolean);

    // Create payload with available form fields
    const payload = formFields.reduce((acc, field) => {
      acc[field] = `\${form.${field}}`;
      return acc;
    }, {} as Record<string, string>);

    return {
      version: "3.1",
      screens: [{
        id: "FORM_EXAMPLE",
        title: "Demo Screen",
        terminal: true,
        success: true,
        data: {},
        layout: {
          type: "SingleColumnLayout",
          children: [
            {
              type: "Form",
              name: "user_data",
              children: [
                ...components.map(comp => {
                  if (!comp.properties) return null;
                  
                  switch (comp.type) {
                    case 'text-heading':
                      return {
                        type: "TextHeading",
                        text: comp.properties.text || ""
                      };
                    case 'text-input':
                      return {
                        type: "TextInput",
                        required: true,
                        label: comp.properties.label || "",
                        name: comp.properties.name || "input_field"
                      };
                    case 'text-area':
                      return {
                        type: "TextArea",
                        label: comp.properties.label || "",
                        name: comp.properties.name || "textarea_field"
                      };
                    case 'check-box':
                      return {
                        type: "CheckboxGroup",
                        name: comp.properties.name || "checkbox_group",
                        'data-source': comp.properties.options ? 
                          JSON.parse(comp.properties.options).map((option: string) => ({
                            id: option.toLowerCase().replace(/\s+/g, '_'),
                            title: option
                          })) : 
                          [{ id: 'default_option', title: 'Default Option' }]
                      };
                    case 'radio-button':
                      return {
                        type: "RadioButtonsGroup",
                        name: comp.properties.name || "radio_group",
                        'data-source': comp.properties.options ? 
                          JSON.parse(comp.properties.options).map((option: string) => ({
                            id: option.toLowerCase().replace(/\s+/g, '_'),
                            title: option
                          })) : 
                          [{ id: 'default_option', title: 'Default Option' }]
                      };
                    case 'footer-button':
                      return {
                        type: "Footer",
                        label: comp.properties.buttonText || "Submit data",
                        'on-click-action': {
                          name: "complete",
                          payload
                        }
                      };
                    default:
                      return null;
                  }
                }).filter(Boolean),
                // Always add Footer if not present
                ...(components.some(comp => comp.type === 'footer-button') ? [] : [{
                  type: "Footer",
                  label: "Submit data",
                  'on-click-action': {
                    name: "complete",
                    payload
                  }
                }])
              ]
            }
          ]
        }
      }]
    };
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === 'sidebar' && destination.droppableId === 'builder') {
      // Add new component from sidebar
      const newComponent: Component = {
        id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: draggableId,
        name: draggableId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        properties: {}
      };

      // Set default properties based on component type
      switch (draggableId) {
        case 'text-heading':
          newComponent.properties = { text: '' };
          break;
        case 'text-input':
          newComponent.properties = { 
            label: '', 
            name: `input_field_${Date.now()}`,
            required: true
          };
          break;
        case 'text-area':
          newComponent.properties = { 
            label: '', 
            name: `textarea_field_${Date.now()}`
          };
          break;
        case 'check-box':
          newComponent.properties = { 
            label: '', 
            name: `checkbox_group_${Date.now()}`,
            options: JSON.stringify(['Option 1', 'Option 2', 'Option 3'])
          };
          break;
        case 'radio-button':
          newComponent.properties = { 
            label: '', 
            name: `radio_group_${Date.now()}`,
            options: JSON.stringify(['Option 1', 'Option 2', 'Option 3'])
          };
          break;
        case 'footer-button':
          newComponent.properties = { 
            buttonText: 'Submit data',
            variant: 'contained'
          };
          break;
      }

      const newComponents = Array.from(components);
      newComponents.splice(destination.index, 0, newComponent);
      setComponents(newComponents);
      setSelectedComponent(newComponent);

      // Generate new JSON format
      setJsonInput(JSON.stringify(generateScreenFormat(newComponents), null, 2));
    } else if (source.droppableId === 'builder' && destination.droppableId === 'builder') {
      // Reorder components in builder
      const newComponents = Array.from(components);
      const [removed] = newComponents.splice(source.index, 1);
      newComponents.splice(destination.index, 0, removed);
      setComponents(newComponents);

      // Update JSON with reordered components
      setJsonInput(JSON.stringify(generateScreenFormat(newComponents), null, 2));
    }
  };

  const handleAddComponent = (type: string) => {
    const newComponent: Component = {
      id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      name: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      properties: {}
    };

    // Set default properties based on component type
    switch (type) {
      case 'text-heading':
        newComponent.properties = { text: '' };
        break;
      case 'text-input':
        newComponent.properties = { 
          label: '', 
          name: `input_field_${Date.now()}`,
          required: true
        };
        break;
      case 'text-area':
        newComponent.properties = { 
          label: '', 
          name: `textarea_field_${Date.now()}`
        };
        break;
      case 'check-box':
        newComponent.properties = { 
          label: '', 
          name: `checkbox_group_${Date.now()}`,
          options: JSON.stringify(['Option 1', 'Option 2', 'Option 3'])
        };
        break;
      case 'radio-button':
        newComponent.properties = { 
          label: '', 
          name: `radio_group_${Date.now()}`,
          options: JSON.stringify(['Option 1', 'Option 2', 'Option 3'])
        };
        break;
      case 'footer-button':
        newComponent.properties = { 
          buttonText: 'Submit data',
          variant: 'contained'
        };
        break;
    }

    // Update components state
    const updatedComponents = [...components, newComponent];
    setComponents(updatedComponents);
    setSelectedComponent(newComponent);

    // Generate new JSON format
    setJsonInput(JSON.stringify(generateScreenFormat(updatedComponents), null, 2));
  };

  const handlePropertyChange = (componentId: string, property: string, value: any) => {
    // Update components state
    const updatedComponents = components.map(component => {
      if (component.id === componentId) {
        // Create a new properties object with the updated value
        const updatedProperties = {
          ...component.properties,
          [property]: value
        };
        
        // Return a new component with updated properties
        return {
          ...component,
          properties: updatedProperties
        };
      }
      return component;
    });

    // Update components state
    setComponents(updatedComponents);

    // Update selected component if it's the one being modified
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(prev => prev ? {
        ...prev,
        properties: {
          ...prev.properties,
          [property]: value
        }
      } : null);
    }

    // Generate new JSON format using the same function as other updates
    setJsonInput(JSON.stringify(generateScreenFormat(updatedComponents), null, 2));
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
      const parsedJson = JSON.parse(newJson);
      setJsonInput(newJson);
      
      // Update components based on the JSON
      if (parsedJson.screens && parsedJson.screens.length > 0) {
        const screen = parsedJson.screens[0];
        if (screen.layout && screen.layout.children) {
          const form = screen.layout.children.find((child: any) => child.type === "Form");
          if (form && form.children) {
            const newComponents = form.children.map((child: any) => {
              // Convert the UI component format back to our internal format
              let type = '';
              let properties: Record<string, any> = {};

              switch (child.type) {
                case 'TextHeading':
                  type = 'text-heading';
                  properties = { text: child.text };
                  break;
                case 'TextInput':
                  type = 'text-input';
                  properties = {
                    label: child.label,
                    name: child.name,
                    required: child.required
                  };
                  break;
                case 'TextArea':
                  type = 'text-area';
                  properties = {
                    label: child.label,
                    name: child.name
                  };
                  break;
                case 'CheckboxGroup':
                  type = 'check-box';
                  properties = {
                    label: child.label,
                    name: child.name,
                    options: JSON.stringify(child['data-source'].map((option: any) => option.title))
                  };
                  break;
                case 'RadioButtonsGroup':
                  type = 'radio-button';
                  properties = {
                    label: child.label,
                    name: child.name,
                    options: JSON.stringify(child['data-source'].map((option: any) => option.title))
                  };
                  break;
                case 'Footer':
                  type = 'footer-button';
                  properties = {
                    buttonText: child.label,
                    variant: 'contained'
                  };
                  break;
              }

              return {
                id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type,
                name: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                properties
              };
            });

            // Filter out any null components and update state
            setComponents(newComponents.filter(Boolean));
          }
        }
      }
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  const handleMetaGenerate = (metaJson: any) => {
    setMetaJson(metaJson);
    // Convert meta JSON to UI components
    const newComponents: Component[] = [];
    
    if (metaJson.screens && metaJson.screens.length > 0) {
      metaJson.screens.forEach((screen: any) => {
        if (screen.layout && screen.layout.children) {
          screen.layout.children.forEach((child: any) => {
            newComponents.push({
              id: child.id,
              type: child.type,
              name: child.name,
              properties: child.properties || {}
            });
          });
        }
      });
    }
    
    setComponents(newComponents);
  };

  return (
        <DragDropContext onDragEnd={handleDragEnd}>
          <AppContainer>
        <SidebarContainer>
          <Sidebar
            components={components}
            onComponentSelect={handleComponentSelect}
            onDeleteComponent={handleDeleteComponent}
            onAddComponent={handleAddComponent}
          />
        </SidebarContainer>
        <BuilderContainer>
          <Builder
            components={components}
            selectedComponent={selectedComponent}
            onComponentSelect={handleComponentSelect}
            onPropertyChange={handlePropertyChange}
            onDeleteComponent={handleDeleteComponent}
            onDragEnd={handleDragEnd}
            onAddComponent={handleAddComponent}
          />
        </BuilderContainer>
        <PreviewContainer>
          <MobilePreview
            components={components}
            selectedComponent={selectedComponent}
            onComponentSelect={handleComponentSelect}
          />
        </PreviewContainer>
        <JsonEditorContainer>
          <MetaJsonGenerator
            jsonInput={jsonInput}
            onJsonChange={handleJsonChange}
            onMetaGenerate={handleMetaGenerate}
          />
        </JsonEditorContainer>
          </AppContainer>
        </DragDropContext>
  );
};

export default App;