import React from 'react';
import { styled } from '@mui/material/styles';
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Component } from '../../types';
import PropertiesForm from '../Properties/PropertiesForm';
import { DropResult } from 'react-beautiful-dnd';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { useToast } from '../ToastContext';

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: '12px',
    backgroundColor: '#fafafa',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
  },
});

const StyledDialogTitle = styled(DialogTitle)({
  fontSize: '20px',
  fontWeight: 600,
  color: '#333',
  padding: '20px 24px',
  borderBottom: '1px solid #ddd',
});

const StyledDialogContent = styled(DialogContent)({
  padding: '20px 24px',
});

const StyledDialogContentText = styled(DialogContentText)({
  fontSize: '16px',
  color: '#444',
});

const StyledDialogActions = styled(DialogActions)({
  padding: '16px 24px',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
});

const StyledButton = styled(Button)(({ theme }) => ({
  padding: '8px 18px',
  fontSize: '14px',
  fontWeight: 500,
  borderRadius: '6px',
  textTransform: 'none',
  transition: 'all 0.2s ease',
  '&.MuiButton-contained': {
    backgroundColor: theme.palette.error.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
      transform: 'scale(1.05)',
    },
  },
  '&.MuiButton-outlined': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      transform: 'scale(1.05)',
    },
  },
}));


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
})<StyledProps>(({ $isSelected }) => ({
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

// const ComponentHeader = styled('div')({
//   display: 'flex',
//   flexWrap: 'wrap',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   marginBottom: '8px',
//   gap: '8px',
// });


// const ComponentTitle = styled('div')({
//   display: 'flex',
//   flexWrap: 'wrap',
//   alignItems: 'center',
//   gap: '8px',
//   fontWeight: 500,
//   color: '#333',
// });

const ComponentHeader = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
  gap: '8px',
});


const ComponentTitle = styled('div')({
  flex: '1 1 auto',
  minWidth: 0,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});



const ComponentContent = styled('div', {
  shouldForwardProp: (prop) => !['$type', 'color', 'fontSize'].includes(prop as string),
})<{ $type?: string; color?: string; fontSize?: string }>(({ $type, color, fontSize }) => ({
  padding: $type === 'text-input' ? '8px 12px' : '8px',
  borderRadius: $type === 'text-input' ? '4px' : '0',
  backgroundColor: $type === 'text-input' ? '#ffffff' : 'transparent',
  color: color || '#333333',
  fontSize: (() => {
    switch ($type) {
      case 'text-heading': return '24px';
      case 'sub-heading': return '18px';
      case 'text-caption': return '12px';
      case 'text-input': return '14px';
      default: return '14px';
    }
  })(),
  fontWeight: $type === 'text-heading' ? 'bold' : 'normal',
  width: '100%',
  minHeight: $type === 'text-input' ? '40px' : 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  border: $type === 'text-input' ? '1px solid #e0e0e0' : 'none',
  whiteSpace: 'pre-wrap',        
  overflowWrap: 'break-word',    
  wordBreak: 'break-word',  
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
  const { showToast } = useToast(); 
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [componentToDelete, setComponentToDelete] = React.useState<Component | null>(null);

  const handleComponentClick = (component: Component) => {
    onComponentSelect(component);
  };

  const handleDeleteClick = (e: React.MouseEvent, componentId: string) => {
    e.stopPropagation();
    const comp = components.find(c => c.id === componentId);
    if (comp) {
      setComponentToDelete(comp);
      setDeleteDialogOpen(true);
    }
  };

  const renderComponent = (component: Component) => {
    switch (component.type) {
      case 'text-heading':
      case 'sub-heading':
      case 'text-caption':
      case 'text-body':
        return (
          <ComponentContent
            $type={component.type}
            color={component.properties?.color}
            fontSize={component.properties?.fontSize}
          >
            {component.properties?.text || ''}
          </ComponentContent>
        );
      case 'text-input':
        return (
          <ComponentContent $type="text-input">
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#333', marginBottom: '4px' }}>
                {component.properties?.label || 'No Content'}
              </label>
            </div>
          </ComponentContent>
        );
      case 'text-area':
        return <ComponentContent>{component.properties?.label  || 'No Content'}</ComponentContent>;
      case 'check-box':
      case 'radio-button':
      case 'embedded-link':
      case 'opt-in':
      case 'footer-button':
        return <ComponentContent>{component.properties?.buttonText  || 'No Content'}</ComponentContent>;
      case 'PhotoPicker':
      case 'DocumentPicker':
        return <ComponentContent>{component.properties?.label || component.properties?.text || 'No Content'}</ComponentContent>;
        case 'image':
          return (
            <ComponentContent>
              {component.properties?.src ? (
                <img
                  src={component.properties.src}
                  alt={component.properties.altText || 'Image'}
                  style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
                />
              ) : (
                'No Content'
              )}
            </ComponentContent>
          );
        
      case 'date-picker':
          return <ComponentContent>{component.properties?.label || component.properties?.text || 'No Content'}</ComponentContent>;
      default:
        return null;
    }
  };

  return (
    <BuilderContainer>
      <BuildArea sx={{ mb: 15 }}>
        <Droppable droppableId="builder">
          {(provided, snapshot) => (
            <ComponentsList
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                background: snapshot.isDraggingOver ? '#e3f2fd' : 'transparent',
                transition: 'background-color 0.2s ease',
              }}
            >
              {components.map((component, index) => (
                <Draggable key={component.id} draggableId={component.id} index={index}>
                  {(provided, snapshot) => (
                    <ComponentWrapper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.5 : 1,
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

      <StyledDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <StyledDialogTitle>Confirm Delete</StyledDialogTitle>
        <StyledDialogContent>
          <StyledDialogContentText>
            Are you sure you want to delete <strong>{componentToDelete?.name}</strong>?
          </StyledDialogContentText>
        </StyledDialogContent>
        <StyledDialogActions>
          <StyledButton
            variant="outlined"
            onClick={() => setDeleteDialogOpen(false)}
          >
            Cancel
          </StyledButton>
          <StyledButton
            variant="contained"
            color="error"
            onClick={() => {
              if (componentToDelete) {
                onDeleteComponent(componentToDelete.id);
                showToast({
                  message: `${componentToDelete.name} deleted successfully.`,
                  type: 'success',
                });
              }
              setDeleteDialogOpen(false);
            }}
          >
            Delete
          </StyledButton>
        </StyledDialogActions>
      </StyledDialog>

      {/* <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{componentToDelete?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
              onClick={() => {
                if (componentToDelete) {
                  onDeleteComponent(componentToDelete.id);
                  showToast({
                    message: `${componentToDelete.name} deleted successfully.`,
                    type: 'success'
                  });
                }
                setDeleteDialogOpen(false);
              }}
              color="error"
              variant="contained"
            >

            Delete
          </Button>
        </DialogActions>
      </Dialog> */}
    </BuilderContainer>
  );
};

export default Builder;
