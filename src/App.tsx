import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Button, Box, Tabs, Tab, Typography, IconButton, Tooltip, Menu, MenuItem, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Sidebar from './components/Sidebar';
import Builder from './components/Builder';
import MobilePreview from './components/MobilePreview';
import MetaJsonGenerator from './components/MetaJsonGenerator';
import ScreenDialog from './components/ScreenDialog';
import { Component } from './types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

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
  justifyContent: 'flex-end',
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

const ScreenTabsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  borderBottom: '1px solid #e0e0e0',
  backgroundColor: '#f8f9fa',
  
});

const ScreenTab = styled(Tab)({
  textTransform: 'none',
  minWidth: '120px',
  '&.Mui-selected': {
    fontWeight: 600,
  },
});

const AddScreenButton = styled(IconButton)({
  marginLeft: '8px',
  color: '#1976d2',
});

const DeleteScreenButton = styled(IconButton)({
  marginLeft: '4px',
  fontSize:'small',
  color: '#000',
  '&:hover': {
    backgroundColor: 'rgba(211, 47, 47, 0.04)',
  },
});

const ScreenTitle = styled(Typography)({
  fontSize: '14px',
  fontWeight: 800,
  color: '#333',
  marginRight: '8px',
  
});

const CreateScreenDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    width: '500px',
    maxWidth: '90vw',
  }
});

const DialogTextField = styled(TextField)({
  marginBottom: '16px',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#1976d2',
    },
  },
});

interface Screen {
  id: string;
  title: string;
  components: Component[];
  terminal?: boolean;
  success?: boolean;
}

function App() {
  const [screens, setScreens] = useState<Screen[]>([
    {
      id: 'WELCOME',
      title: 'WELCOME',
      components: [],
    }
  ]);
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newScreenName, setNewScreenName] = useState('');
  const [newScreenId, setNewScreenId] = useState('');
  const [screenNameError, setScreenNameError] = useState('');
  const [screenIdError, setScreenIdError] = useState('');
  const [isScreenDialogOpen, setIsScreenDialogOpen] = useState(false);
  const [screenDialogMode, setScreenDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedScreenForEdit, setSelectedScreenForEdit] = useState<{ title: string; id: string } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedScreenIndex, setSelectedScreenIndex] = useState<number | null>(null);

  // Update JSON editor when screens change
  useEffect(() => {
    const jsonString = JSON.stringify(generateJson(), null, 2);
    setEditValue(jsonString);
  }, [screens]);

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
          newComponent.properties = { text: '',visible : true};
          break;
        case 'sub-heading':
          newComponent.properties = { text: 'Sub Heading Text'};
          break;
        case 'text-body':
          newComponent.properties = { text: 'Body Text Content'};
          break;
        case 'text-caption':
          newComponent.properties = { text: 'Caption Text'};
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
            buttonText: '',
            variant: 'contained'
          };
          break;
      }

      const updatedScreens = [...screens];
      const currentScreen = updatedScreens[activeScreenIndex];
      const newComponents = Array.from(currentScreen.components);
      newComponents.splice(destination.index, 0, newComponent);
      currentScreen.components = newComponents;
      setScreens(updatedScreens);
      setSelectedComponent(newComponent);
    } else if (source.droppableId === 'builder' && destination.droppableId === 'builder') {
      // Reorder components in builder
      const updatedScreens = [...screens];
      const currentScreen = updatedScreens[activeScreenIndex];
      const newComponents = Array.from(currentScreen.components);
      const [removed] = newComponents.splice(source.index, 1);
      newComponents.splice(destination.index, 0, removed);
      currentScreen.components = newComponents;
      setScreens(updatedScreens);
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
        newComponent.properties = { text: '' ,visible : true};
        break;
      case 'sub-heading':
        newComponent.properties = { text: '' };
        break;
      case 'text-body':
        newComponent.properties = { text: ''};
        break;
      case 'text-caption':
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
          buttonText: '',
          variant: 'contained'
        };
        break;
    }

    const updatedScreens = [...screens];
    updatedScreens[activeScreenIndex].components = [...updatedScreens[activeScreenIndex].components, newComponent];
    setScreens(updatedScreens);
    setSelectedComponent(newComponent);
  };

  const handleComponentSelect = (component: Component | null) => {
    setSelectedComponent(component);
  };

  const handlePropertyChange = (componentId: string, property: string, value: any) => {
    const updatedScreens = screens.map((screen, index) => {
      if (index === activeScreenIndex) {
        return {
          ...screen,
          components: screen.components.map(component => {
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
          })
        };
      }
      return screen;
    });

    setScreens(updatedScreens);
    
    // Update the selected component if it's the one being changed
    if (selectedComponent?.id === componentId) {
      const updatedSelectedComponent = updatedScreens[activeScreenIndex].components.find(comp => comp.id === componentId);
      if (updatedSelectedComponent) {
        setSelectedComponent(updatedSelectedComponent);
      }
    }
    
    // Update the JSON editor with the new components
    const jsonString = JSON.stringify(generateJson(), null, 2);
    setEditValue(jsonString);
  };

  const handleDeleteComponent = (componentId: string) => {
    const updatedScreens = screens.map((screen, index) => {
      if (index === activeScreenIndex) {
        return {
          ...screen,
          components: screen.components.filter(comp => comp.id !== componentId)
        };
      }
      return screen;
    });

    setScreens(updatedScreens);
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
      const trimmedJson = newJson.trim();
      if (!trimmedJson) {
        return;
      }

      const parsedJson = JSON.parse(trimmedJson);
      if (!parsedJson || typeof parsedJson !== 'object') {
        console.error('Invalid JSON: Expected an object');
        return;
      }

      if (!parsedJson.screens || !Array.isArray(parsedJson.screens)) {
        console.error('Invalid JSON: Missing or invalid screens array');
        return;
      }

      const newScreens = parsedJson.screens.map((screen: any) => {
        const layoutChildren = screen.layout?.children || [];
        
        return {
          id: screen.id || `SCREEN_${Date.now()}`,
          title: screen.title || 'Untitled Screen',
          components: layoutChildren.map((child: any) => {
            let type = '';
            let properties: Record<string, any> = {};

            switch (child.type) {
              case 'TextHeading':
                type = 'text-heading';
                properties = {
                  text: child.text || '',
                  color: child.color || '#333333',
                  fontSize: child.fontSize || '24px',
                  visible: child.visible || true
                };
                break;
              case 'TextSubheading':
                type = 'sub-heading';
                properties = {
                  text: child.text || '',
                  color: child.color || '#666666',
                  fontSize: child.fontSize || '18px'
                };
                break;
              case 'TextCaption':
                type = 'text-caption';
                properties = {
                  text: child.text || '',
                  color: child.color || '#999999',
                  fontSize: child.fontSize || '12px'
                };
                break;
              case 'TextInput':
                type = 'text-input';
                properties = {
                  label: child.label || '',
                  name: child.name || `field_${Date.now()}`,
                  required: child.required || false,
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
                  buttonText: child.label || 'Submit'
                };
                break;
              case 'Photo':
                type = 'photo';
                properties = {
                  label: child.label || 'Upload Photo',
                  required: child.required || false,
                  accept: child.accept || 'image/*'
                };
                break;
              case 'Document':
                type = 'document';
                properties = {
                  label: child.label || 'Upload Document',
                  required: child.required || false,
                  accept: child.accept || '.pdf,.doc,.docx'
                };
                break;
              case 'Image':
                type = 'image';
                properties = {
                  src: child.src || '',
                  width: child.width || 200,
                  height: child.height || 200
                };
                break;
            }

            return {
              id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              type,
              name: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              properties
            };
          }),
          terminal: screen.terminal || false,
          success: screen.success || false
        };
      });

      setScreens(newScreens);
      
      if (selectedComponent && activeScreenIndex < newScreens.length) {
        const updatedSelectedComponent = newScreens[activeScreenIndex].components.find(
          (comp: Component) => comp.type === selectedComponent.type && 
          comp.properties.label === selectedComponent.properties.label
        );
        
        if (updatedSelectedComponent) {
          setSelectedComponent(updatedSelectedComponent);
        }
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('JSON Syntax Error:', error.message);
      } else {
        console.error('Error parsing JSON:', error);
      }
    }
  };

  const handleAddScreen = () => {
    const newScreen: Screen = {
      id: `SCREEN_${Date.now()}`,
      title: `Screen ${screens.length + 1}`,
      components: [],
    };
    
    setScreens([...screens, newScreen]);
    setActiveScreenIndex(screens.length);
    setSelectedComponent(null);
  };

  const handleScreenChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveScreenIndex(newValue);
    setSelectedComponent(null);
  };

  const generateJson = () => {
    // Create routing model based on screen order
    const routingModel: Record<string, string[]> = {};
    for (let i = 0; i < screens.length - 1; i++) {
      routingModel[screens[i].id] = [screens[i + 1].id];
    }

    return {
      version: "7.0",
      routing_model: routingModel,
      screens: screens.map((screen, index) => {
        const isLastScreen = index === screens.length - 1;
        const nextScreen = !isLastScreen ? screens[index + 1] : null;
        const nextScreenId = nextScreen?.id || '';

        return {
          id: screen.id,
          title: screen.title,
          ...(isLastScreen ? { terminal: true } : {}),
          layout: {
            type: "SingleColumnLayout",
            children: screen.components.map(component => {
              switch (component.type) {
                case 'text-heading':
                  return {
                    type: "TextHeading",
                    text: component.properties.text || '',
                    color: component.properties.color || '#333333',
                    fontSize: component.properties.fontSize || '24px',
                    visible: component.properties.visible || true
                  };
                case 'sub-heading':
                  return {
                    type: "TextSubheading",
                    text: component.properties.text || '',
                    color: component.properties.color || '#666666',
                    fontSize: component.properties.fontSize || '18px'
                  };
                case 'text-caption':
                  return {
                    type: "TextCaption",
                    text: component.properties.text || '',
                    color: component.properties.color || '#999999',
                    fontSize: component.properties.fontSize || '12px'
                  };
                case 'text-input':
                  return {
                    type: "TextInput",
                    name: component.properties.name || `field_${Date.now()}`,
                    label: component.properties.label || '',
                    required: component.properties.required || false,
                  };
                case 'text-area':
                  return {
                    type: "TextArea",
                    name: component.properties.name || `textarea_${Date.now()}`,
                    label: component.properties.label || ''
                  };
                case 'check-box':
                  return {
                    type: "CheckboxGroup",
                    name: component.properties.name || `checkbox_${Date.now()}`,
                    'data-source': component.properties.options ? 
                      JSON.parse(component.properties.options).map((option: string) => ({
                        id: option.toLowerCase().replace(/\s+/g, '_'),
                        title: option
                      })) : 
                      [{ id: 'default_option', title: 'Default Option' }]
                  };
                case 'radio-button':
                  return {
                    type: "RadioButtonsGroup",
                    name: component.properties.name || `radio_${Date.now()}`,
                    label: component.properties.label || '',
                    'data-source': component.properties.options ? 
                      JSON.parse(component.properties.options).map((option: string) => ({
                        id: option.toLowerCase().replace(/\s+/g, '_'),
                        title: option
                      })) : 
                      [{ id: 'default_option', title: 'Default Option' }]
                  };
                case 'footer-button':
                  return {
                    type: "Footer",
                    label: component.properties.buttonText || 'Submit',
                    'on-click-action': {
                      name: isLastScreen ? "complete" : "navigate",
                      ...(isLastScreen ? {
                        payload: {
                          ...screen.components.reduce((acc: Record<string, string>, comp) => {
                            if (comp.type === 'text-input' || comp.type === 'radio-button' || comp.type === 'check-box') {
                              acc[comp.properties.name] = `\${screen.${screen.id}.form.${comp.properties.name}}`;
                            }
                            return acc;
                          }, {})
                        }
                      } : {
                        next: {
                          type: "screen",
                          name: nextScreen?.id
                        },
                        payload: {}
                      })
                    }
                  };
                // case 'photo':
                //   return {
                //     type: "Photo",
                //     label: component.properties.label || '',
                //     required: component.properties.required || false,
                //     accept: component.properties.accept || 'image/*'
                //   };
                case 'document':
                  return {
                    type: "Document",
                    label: component.properties.label || 'Upload Document',
                    required: component.properties.required || false,
                    accept: component.properties.accept || '.pdf,.doc,.docx'
                  };
                case 'photo':
                  return {
                    type: "Image",
                    src: component.properties.src || '',
                    width: component.properties.width || 200,
                    height: component.properties.height || 200
                  };
                default:
                  return null;
              }
            }).filter(Boolean)
          }
        };
      })
    };
  };

  const handleMetaGenerate = (metaJson: any) => {
    console.log('Meta JSON generated:', metaJson);
  };

  const validateScreenName = (name: string) => {
    if (!name) {
      setScreenNameError('Screen name is required');
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      setScreenNameError('Screen name can only contain alphabets and spaces');
      return false;
    }
    setScreenNameError('');
    return true;
  };

  const validateScreenId = (id: string) => {
    if (id && !/^[a-zA-Z_]+$/.test(id)) {
      setScreenIdError('Screen ID can only contain alphabets and underscores');
      return false;
    }
    if (id && screens.some(screen => screen.id === id)) {
      setScreenIdError('Screen ID must be unique');
      return false;
    }
    setScreenIdError('');
    return true;
  };

  const handleCreateScreen = () => {
    const isNameValid = validateScreenName(newScreenName);
    const isIdValid = validateScreenId(newScreenId);

    if (isNameValid && isIdValid) {
      const screenId = newScreenId || newScreenName.toUpperCase().replace(/\s+/g, '_');
      
      if (screens.some(screen => screen.id === screenId)) {
        setScreenIdError('Screen ID must be unique');
        return;
      }

      const newScreen: Screen = {
        id: screenId,
        title: newScreenName,
        components: [],
      };
      
      setScreens([...screens, newScreen]);
      setActiveScreenIndex(screens.length);
      setSelectedComponent(null);
      handleCloseDialog();
    }
  };

  const handleOpenDialog = () => {
    setIsCreateDialogOpen(true);
    setNewScreenName('');
    setNewScreenId('');
    setScreenNameError('');
    setScreenIdError('');
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setNewScreenName('');
    setNewScreenId('');
    setScreenNameError('');
    setScreenIdError('');
  };

  const handleScreenMenuOpen = (event: React.MouseEvent<HTMLElement>, index: number) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedScreenIndex(index);
  };

  const handleScreenMenuClose = () => {
    setAnchorEl(null);
    setSelectedScreenIndex(null);
  };

  const handleEditScreen = () => {
    if (selectedScreenIndex !== null) {
      const screen = screens[selectedScreenIndex];
      setSelectedScreenForEdit({ title: screen.title, id: screen.id });
      setScreenDialogMode('edit');
      setIsScreenDialogOpen(true);
    }
    handleScreenMenuClose();
  };

  const handleDeleteScreen = () => {
    if (selectedScreenIndex !== null && screens.length > 1) {
      const updatedScreens = screens.filter((_, index) => index !== selectedScreenIndex);
      setScreens(updatedScreens);
      if (activeScreenIndex >= updatedScreens.length) {
        setActiveScreenIndex(updatedScreens.length - 1);
      }
    }
    handleScreenMenuClose();
  };

  const handleOpenCreateDialog = () => {
    setScreenDialogMode('create');
    setSelectedScreenForEdit(null);
    setIsScreenDialogOpen(true);
  };

  const handleScreenDialogClose = () => {
    setIsScreenDialogOpen(false);
    setSelectedScreenForEdit(null);
  };

  const handleScreenSubmit = (screenName: string, screenId: string) => {
    if (screenDialogMode === 'create') {
      const newScreen: Screen = {
        id: screenId,
        title: screenName,
        components: [],
      };
      setScreens([...screens, newScreen]);
      setActiveScreenIndex(screens.length);
    } else if (screenDialogMode === 'edit' && selectedScreenIndex !== null) {
      const updatedScreens = [...screens];
      updatedScreens[selectedScreenIndex] = {
        ...updatedScreens[selectedScreenIndex],
        id: screenId,
        title: screenName,
      };
      setScreens(updatedScreens);
    }
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
                variant="outlined"
                size="small"
                onClick={() => setShowPreview(!showPreview)}
                startIcon={showPreview ? <VisibilityOffIcon /> : <VisibilityIcon />}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </StyledButton>
            </ButtonGroupContainer>
            
            <ScreenTabsContainer>
              <Tabs 
                value={activeScreenIndex} 
                onChange={handleScreenChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                {screens.map((screen, index) => (
                  <ScreenTab 
                    key={screen.id} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScreenTitle>{screen.title}</ScreenTitle>
                        <Box
                          component="div"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScreenMenuOpen(e, index);
                          }}
                          sx={{ ml: 1, cursor: 'pointer' }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </Box>
                      </Box>
                    }
                  />
                ))}
              </Tabs>
              <AddScreenButton onClick={handleOpenCreateDialog} size="small">
                <AddIcon />
              </AddScreenButton>
            </ScreenTabsContainer>
            
            <Builder
              components={screens[activeScreenIndex].components}
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
            <MobilePreview 
              components={screens[activeScreenIndex].components} 
              screenTitle={screens[activeScreenIndex].title}
            />
          </PreviewContainer>
        </MainContent>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleScreenMenuClose}
        >
          <MenuItem onClick={handleEditScreen}>Edit Screen</MenuItem>
          <MenuItem 
            onClick={handleDeleteScreen}
            disabled={screens.length <= 1}
          >
            Delete Screen
          </MenuItem>
        </Menu>

        <ScreenDialog
          open={isScreenDialogOpen}
          onClose={handleScreenDialogClose}
          onSubmit={handleScreenSubmit}
          mode={screenDialogMode}
          initialData={selectedScreenForEdit || undefined}
          existingScreenIds={screens.map(screen => screen.id)}
        />
          </AppContainer>
        </DragDropContext>
  );
}

export default App;
