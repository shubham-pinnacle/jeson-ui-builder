import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Sidebar from './components/Sidebar';
import Builder from './components/Builder';
import MobilePreview from './components/MobilePreview';
import MetaJsonGenerator from './components/MetaJsonGenerator';
import { Component } from './types';

const AppContainer = styled('div')({
  display: 'flex',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  backgroundColor: '#f0f2f5',
});

const SidebarContainer = styled('div')({
  width: '300px',
  minWidth: '300px',
  height: '97vh',
  backgroundColor: '#ffffff',
  borderRight: '1px solid #e0e0e0',
  overflowY: 'hidden',
  overflowX: 'hidden',
  boxShadow: '2px 0 4px rgba(0,0,0,0.05)',
  borderRadius: '15px',
  marginTop: '13px',
  marginRight: '10px',
  marginBottom: '30px',
});

const MainContent = styled('div')({
  display: 'flex',
  flex: 1,
  height: '100vh',
  overflow: 'hidden',
});

const BuilderContainer = styled('div')<{ isPreviewVisible: boolean }>(({ isPreviewVisible }) => ({
  width: isPreviewVisible ? 'calc(100% - 875px)' : 'calc(100% - 500px)',
  minWidth: isPreviewVisible ? 'calc(100% - 875px)' : 'calc(100% - 500px)',
  height: '98vh',
  backgroundColor: '#ffffff',
  borderRight: '1px solid #e0e0e0',
  overflow: 'hidden',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  borderRadius: '15px',
}));

const PreviewContainer = styled('div')<{ isVisible: boolean }>(({ isVisible }) => ({
  width: '375px',
  minWidth: '375px',
  height: '100%',
  borderRight: '1px solid #e0e0e0',
  overflow: 'hidden',
  display: isVisible ? 'flex' : 'none',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
}));

const JsonEditorContainer = styled('div')({
  width: '500px',
  minWidth: '500px',
  height: '98vh',
  backgroundColor: '#ffffff',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  marginLeft: '10px',
  borderRadius: '15px',
});

const ButtonGroupContainer = styled('div')({
  display: 'flex',
  gap: '8px',
  padding: '16px',
  borderBottom: '1px solid #e0e0e0',
  backgroundColor: '#f8f9fa',
});

const StyledButton = styled(Button)({
  textTransform: 'none',
  fontWeight: 500,
  '&.MuiButton-outlined': {
    borderColor: '#e0e0e0',
    '&:hover': {
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
    },
  },
});

function App() {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    const jsonString = JSON.stringify(generateJson(), null, 2);
    setEditValue(jsonString);
  }, [components]);

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

    setComponents([...components, newComponent]);
    setSelectedComponent(newComponent);
  };

  const handleComponentSelect = (component: Component | null) => {
    setSelectedComponent(component);
  };

  const handlePropertyChange = (componentId: string, property: string, value: any) => {
    const updatedComponents = components.map(component => {
      if (component.id === componentId) {
        return {
          ...component,
          properties: {
            ...component.properties,
            [property]: value
          }
        };
      }
      return component;
    });

    setComponents(updatedComponents);
    
    // Update the selected component if it's the one being changed
    if (selectedComponent?.id === componentId) {
      const updatedSelectedComponent = updatedComponents.find(comp => comp.id === componentId);
      if (updatedSelectedComponent) {
        setSelectedComponent(updatedSelectedComponent);
      }
    }
    
    // Update the JSON editor with the new components
    const jsonString = JSON.stringify(generateJson(), null, 2);
    setEditValue(jsonString);
  };

  const handleDeleteComponent = (componentId: string) => {
    const updatedComponents = components.filter(comp => comp.id !== componentId);
    setComponents(updatedComponents);
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null);
    }
  };

  const handleCopyJson = () => {
    const jsonString = JSON.stringify(generateJson(), null, 2);
    navigator.clipboard.writeText(jsonString);
  };

  const handleJsonChange = (newJson: string) => {
    setEditValue(newJson);
    try {
      const parsedJson = JSON.parse(newJson);
      if (parsedJson.screens && parsedJson.screens[0]?.layout?.children) {
        const form = parsedJson.screens[0].layout.children.find((child: any) => child.type === "Form");
        if (form && form.children) {
          const newComponents = form.children.map((child: any) => {
            let type = '';
            let properties: Record<string, any> = {};

            switch (child.type) {
              case 'TextHeading':
                type = 'text-heading';
                properties = { text: child.text || '' };
                break;
              case 'TextInput':
                type = 'text-input';
                properties = {
                  label: child.label || '',
                  name: child.name || `input_field_${Date.now()}`,
                  required: child.required || false
                };
                break;
              case 'TextArea':
                type = 'text-area';
                properties = {
                  label: child.label || '',
                  name: child.name || `textarea_field_${Date.now()}`
                };
                break;
              case 'CheckboxGroup':
                type = 'check-box';
                properties = {
                  label: child.label || '',
                  name: child.name || `checkbox_group_${Date.now()}`,
                  options: JSON.stringify(child['data-source']?.map((opt: any) => opt.title) || ['Option 1', 'Option 2', 'Option 3'])
                };
                break;
              case 'RadioButtonsGroup':
                type = 'radio-button';
                properties = {
                  label: child.label || '',
                  name: child.name || `radio_group_${Date.now()}`,
                  options: JSON.stringify(child['data-source']?.map((opt: any) => opt.title) || ['Option 1', 'Option 2', 'Option 3'])
                };
                break;
              case 'Footer':
                type = 'footer-button';
                properties = {
                  buttonText: child.label || 'Submit data',
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

          setComponents(newComponents);
          
          // If there's a selected component, update it to match the new components
          if (selectedComponent) {
            const updatedSelectedComponent = newComponents.find(
              (comp: Component) => comp.type === selectedComponent.type && 
              comp.properties.label === selectedComponent.properties.label
            );
            
            if (updatedSelectedComponent) {
              setSelectedComponent(updatedSelectedComponent);
            }
          }
        }
      }
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  const generateJson = () => {
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
              children: components.map(comp => {
                switch (comp.type) {
                  case 'text-heading':
                    return {
                      type: "TextHeading",
                      text: comp.properties.text || ""
                    };
                  case 'text-input':
                    return {
                      type: "TextInput",
                      required: comp.properties.required || true,
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
                        payload: {}
                      }
                    };
                  default:
                    return null;
                }
              }).filter(Boolean)
            }
          ]
        }
      }]
    };
  };

  const handleMetaGenerate = (metaJson: any) => {
    console.log('Meta JSON generated:', metaJson);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <AppContainer>
        <SidebarContainer>
          <Sidebar onAddComponent={handleAddComponent} />
        </SidebarContainer>
        
        <MainContent>
          <BuilderContainer isPreviewVisible={showPreview}>
            <ButtonGroupContainer>
              <StyledButton
                style={{ marginLeft: 'auto' }}  // Positions the button to the right
                variant="outlined"
                size="small"
                onClick={() => setShowPreview(!showPreview)}
                startIcon={showPreview ? <VisibilityOffIcon /> : <VisibilityIcon />}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </StyledButton>
            </ButtonGroupContainer>
            <Builder
              components={components}
              selectedComponent={selectedComponent}
              onComponentSelect={handleComponentSelect}
              onPropertyChange={handlePropertyChange}
              onDeleteComponent={handleDeleteComponent}
              onDragEnd={handleDragEnd}
              onAddComponent={(type: string) => handleAddComponent(type)}
            />
          </BuilderContainer>

          <JsonEditorContainer>
            <ButtonGroupContainer>
              <StyledButton
                style={{ marginLeft: 'auto' }}  // Moves the Copy JSON button to the right
                variant="outlined"
                size="small"
                onClick={handleCopyJson}
                startIcon={<ContentCopyIcon />}
              >
                Copy JSON
              </StyledButton>
            </ButtonGroupContainer>
            <MetaJsonGenerator
              jsonInput={editValue}
              onJsonChange={handleJsonChange}
              onMetaGenerate={handleMetaGenerate}
            />
          </JsonEditorContainer>

          <PreviewContainer isVisible={showPreview}>
            <MobilePreview components={components} />
          </PreviewContainer>
        </MainContent>
      </AppContainer>
    </DragDropContext>
  );
}

export default App;
