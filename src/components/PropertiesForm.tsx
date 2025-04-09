import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Switch,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
  Button,
  Divider,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaTimes } from 'react-icons/fa';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { Component } from '../types';

const PropertiesPanel = styled(Paper)(({ theme }) => ({
  width: 300,
  height: '100%',
  borderLeft: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(3),
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  // Custom scrollbar styling for WebKit browsers
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#ffffff", // white track background
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "lightgrey", // light grey scrollbar thumb
    borderRadius: "4px",
  },
  // Firefox scrollbar styling
  scrollbarWidth: "thin",
  scrollbarColor: "lightgrey #ffffff",
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const OptionItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
}));

interface PropertiesFormProps {
  component: Component;
  onPropertyChange: (componentId: string, property: string, value: any) => void;
  screens: { id: string; title: string }[];
  onClose: () => void;
}

const PropertiesForm: React.FC<PropertiesFormProps> = ({
  component,
  onPropertyChange,
  screens,
  onClose
}) => {
  const handleChange = (property: string, value: any) => {
    onPropertyChange(component.id, property, value);
  };

  const handleOptionAdd = (field: string) => {
    const currentOptions = Array.isArray(component.properties?.[field]) 
      ? component.properties[field] 
      : [];
    const newOption = component.properties?.['newOption'] || '';
    if (newOption) {
      const updatedOptions = [...currentOptions, newOption];
      handleChange(field, updatedOptions);
      handleChange('newOption', '');
    }
  };

  const handleOptionDelete = (field: string, optionToDelete: string) => {
    const currentOptions = Array.isArray(component.properties?.[field])
      ? component.properties[field]
      : [];
    const updatedOptions = currentOptions.filter((option: string) => option !== optionToDelete);
    handleChange(field, updatedOptions);
  };

  const renderTextFields = () => (
    <Stack spacing={2}>
      <TextField
        label={`Text ${component.type === 'text-heading' ? 'Heading' : component.type === 'text-body' ? 'Body' : 'Caption'}`}
        required
        fullWidth
        value={component.properties?.text || ''}
        onChange={(e) => handleChange('text', e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible || 'true'}
          onChange={(e) => handleChange('visible', e.target.value)}
          label="Visible (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Font Weight (Optional)</InputLabel>
        <Select
          value={component.properties?.fontWeight || 'normal'}
          onChange={(e) => handleChange('fontWeight', e.target.value)}
          label="Font Weight (Optional)"
        >
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="bold">Bold</MenuItem>
          <MenuItem value="italic">Italic</MenuItem>
          <MenuItem value="bold_italic">Bold Italic</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Strike Through (Optional)</InputLabel>
        <Select
          value={component.properties?.strikethrough || 'false'}
          onChange={(e) => handleChange('strikethrough', e.target.value)}
          label="Strike Through (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Markdown (Optional)</InputLabel>
        <Select
          value={component.properties?.markdown || 'false'}
          onChange={(e) => handleChange('markdown', e.target.value)}
          label="Markdown (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );


  const renderTextHeading = () => (
    <Stack spacing={2}>
      <TextField
        label='Text-heading' 
        required
        fullWidth
        value={component.properties?.text || ''}
        onChange={(e) => handleChange('text', e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible || 'true'}
          onChange={(e) => handleChange('visible', e.target.value)}
          label="Visible (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      
    </Stack>
  );

  const renderInputFields = () => (
    <Stack spacing={2}>
      <TextField
        label="Label"
        required
        fullWidth
        value={component.properties?.label || ''}
        onChange={(e) => handleChange('label', e.target.value)}
        size="small"
      />
      <TextField
        label="Output Variable"
        required
        fullWidth
        value={component.properties?.outputVariable || ''}
        onChange={(e) => handleChange('outputVariable', e.target.value)}
        size="small"
      />
      <TextField
        label="Init Value (Optional)"
        fullWidth
        value={component.properties?.initValue || ''}
        onChange={(e) => handleChange('initValue', e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Required (Optional)</InputLabel>
        <Select
          value={component.properties?.required || 'false'}
          onChange={(e) => handleChange('required', e.target.value)}
          label="Required (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      {component.type === 'text-input' && (
        <FormControl fullWidth size="small">
          <InputLabel>Input Type (Optional)</InputLabel>
          <Select
            value={component.properties?.inputType || 'text'}
            onChange={(e) => handleChange('inputType', e.target.value)}
            label="Input Type (Optional)"
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="password">Password</MenuItem>
          </Select>
        </FormControl>
      )}
      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible || 'true'}
          onChange={(e) => handleChange('visible', e.target.value)}
          label="Visible (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>  
      {component.type === 'text-input' ? (
        <>
          <TextField
            label="Min-Chars (Optional)"
            type="number"
            fullWidth
            value={component.properties?.minChars || 0}
            onChange={(e) => handleChange('minChars', e.target.value)}
            size="small"
          />
          <TextField
            label="Max-Chars (Optional)"
            type="number"
            fullWidth
            value={component.properties?.maxChars || 0}
            onChange={(e) => handleChange('maxChars', e.target.value)}
            size="small"
          />
          
        </>
      ) : (
        <TextField
          label="Max-Length (Optional)"
          type="number"
          fullWidth
          value={component.properties?.maxLength || ''}
          onChange={(e) => handleChange('maxLength', e.target.value)}
          size="small"
        />
      )}
      <TextField
        label="Helper Text (Optional)"
        fullWidth
        value={component.properties?.helperText || ''}
        onChange={(e) => handleChange('helperText', e.target.value)}
        size="small"
      />
    </Stack>
  );

  const renderSelectFields = () => (
    <Stack spacing={2}>
      <TextField
        label="Label"
        required
        fullWidth
        value={component.properties?.label || ''}
        onChange={(e) => handleChange('label', e.target.value)}
        size="small"
      />
       {component.type !== 'drop-down' && (
      <TextField
        label="Description (Optional)"
        fullWidth
        value={component.properties?.description || ''}
        onChange={(e) => handleChange('description', e.target.value)}
        size="small"
      />)}
      <TextField
        label="Output Variable"
        required
        fullWidth
        value={component.properties?.name || ''}
        onChange={(e) => handleChange('name', e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Property (Optional)</InputLabel>
        <Select
          value={component.properties?.options || ''}
          onChange={(e) => handleChange('options', e.target.value)}
          label="Property (Optional)"
        >
          <MenuItem value="">Select property</MenuItem>
          <MenuItem value="value1">Value 1</MenuItem>
          <MenuItem value="value2">Value 2</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Options
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <TextField
            size="small"
            fullWidth
            value={component.properties?.newOption || ''}
            onChange={(e) => handleChange('newOption', e.target.value)}
            placeholder="Add new option"
          />
          <Button
            variant="outlined"
            onClick={() => handleOptionAdd('options')}
            size="small"
          >
            Add
          </Button>
        </Stack>
        <List>
          {Array.isArray(component.properties?.options) && component.properties.options.map((option: string) => (
            <OptionItem key={option}>
              <ListItemText primary={option} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => handleOptionDelete('options', option)}
                >
                  <FaTimes />
                </IconButton>
              </ListItemSecondaryAction>
            </OptionItem>
          ))}
        </List>
      </Box>
      <FormControl fullWidth size="small">
        <InputLabel>Init Value (Optional)</InputLabel>
        <Select
          value={component.properties?.initValue || ''}
          onChange={(e) => handleChange('initValue', e.target.value)}
          label="Init Value (Optional)"
        >
          <MenuItem value="">Select value</MenuItem>
          {Array.isArray(component.properties?.options) && component.properties.options.map((option: string) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Required (Optional)</InputLabel>
        <Select
          value={component.properties?.required || 'false'}
          onChange={(e) => handleChange('required', e.target.value)}
          label="Required (Optional)"
        >
          <MenuItem value="false">False</MenuItem>
          <MenuItem value="true">True</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible || 'true'}
          onChange={(e) => handleChange('visible', e.target.value)}
          label="Visible (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>Enabled (Optional)</InputLabel>
        <Select
          value={component.properties?.visible || 'true'}
          onChange={(e) => handleChange('visible', e.target.value)}
          label="Visible (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      {component.type === 'check-box' && (
        <>
          <TextField
            label="Min-Selected-Items (Optional)"
            type="number"
            fullWidth
            value={component.properties?.minSelectedItems || ''}
            onChange={(e) => handleChange('minSelectedItems', e.target.value)}
            size="small"
          />
          <TextField
            label="Max-Selected-Items (Optional)"
            type="number"
            fullWidth
            value={component.properties?.maxSelectedItems || ''}
            onChange={(e) => handleChange('maxSelectedItems', e.target.value)}
            size="small"
          />
        </>
      )}
    </Stack>
  );

  const renderButtonFields = () => (
    <Stack spacing={2}>
      <TextField
        label="Label"
        required
        fullWidth
        value={component.properties?.label || ''}
        onChange={(e) => handleChange('label', e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Enabled (Optional)</InputLabel>
        <Select
          value={component.properties?.enabled || 'true'}
          onChange={(e) => handleChange('enabled', e.target.value)}
          label="Enabled (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Left Caption (Optional)"
        fullWidth
        value={component.properties?.leftCaption || ''}
        onChange={(e) => handleChange('leftCaption', e.target.value)}
        size="small"
      />
      <TextField
        label="Center Caption (Optional)"
        fullWidth
        value={component.properties?.centerCaption || ''}
        onChange={(e) => handleChange('centerCaption', e.target.value)}
        size="small"
      />
      <TextField
        label="Right Caption (Optional)"
        fullWidth
        value={component.properties?.rightCaption || ''}
        onChange={(e) => handleChange('rightCaption', e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>On Click Action (Optional)</InputLabel>
        <Select
          value={component.properties?.onClickAction || 'complete'}
          onChange={(e) => handleChange('onClickAction', e.target.value)}
          label="On Click Action (Optional)"
        >
          <MenuItem value="complete">Complete</MenuItem>
          <MenuItem value="navigate">Navigate</MenuItem>
          <MenuItem value="data_exchange">Data Exchange</MenuItem>
        </Select>
      </FormControl>
      {component.properties?.onClickAction === 'navigate' && (
        <FormControl fullWidth size="small">
          <InputLabel>Screen Name</InputLabel>
          <Select
            value={component.properties?.screenName || ''}
            onChange={(e) => handleChange('screenName', e.target.value)}
            label="Screen Name"
          >
            {screens.map((screen) => (
              <MenuItem key={screen.id} value={screen.id}>
                {screen.title || screen.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      
    </Stack>
  );

  const renderPhotoFields = () => (
    <Stack spacing={2}>
      <TextField
        label="Label"
        required
        fullWidth
        value={component.properties?.label || ''}
        onChange={(e) => handleChange('label', e.target.value)}
        size="small"
      />
      <TextField
        label="Description (Optional)"
        fullWidth
        value={component.properties?.description || ''}
        onChange={(e) => handleChange('description', e.target.value)}
        size="small"
      />
      <TextField
        label="Output Variable"
        required
        fullWidth
        value={component.properties?.outputVariable || ''}
        onChange={(e) => handleChange('outputVariable', e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Photo Source (Optional)</InputLabel>
        <Select
          value={component.properties?.photoSource || 'camera'}
          onChange={(e) => handleChange('photoSource', e.target.value)}
          label="Photo Source (Optional)"
        >
          <MenuItem value="camera">Camera Gallery</MenuItem>
          <MenuItem value="gallery">Gallery Only</MenuItem>
          <MenuItem value="camera_only">Camera Only</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Minimum Photos (Optional)"
        type="number"
        fullWidth
        value={component.properties?.minPhotos || ''}
        onChange={(e) => handleChange('minPhotos', e.target.value)}
        size="small"
      />
      <TextField
        label="Maximum Photos"
        required
        type="number"
        fullWidth
        value={component.properties?.maxPhotos || ''}
        onChange={(e) => handleChange('maxPhotos', e.target.value)}
        size="small"
      />
      <TextField
        label="Maximum file size in MB"
        type="number"
        fullWidth
        value={component.properties?.maxFileSize || '25'}
        onChange={(e) => handleChange('maxFileSize', e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible || 'true'}
          onChange={(e) => handleChange('visible', e.target.value)}
          label="Visible (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Enabled (Optional)</InputLabel>
        <Select
          value={component.properties?.enabled || 'true'}
          onChange={(e) => handleChange('enabled', e.target.value)}
          label="Enabled (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );

  const renderFields = () => {
    switch (component.type) {
      
      
      case 'text-body':
      case 'text-caption':
      
        return renderTextFields();

      case 'text-heading':
      case 'sub-heading':
       return renderTextHeading();

       case 'rich-text':
        
      case 'text-input':
      case 'text-area':
        return renderInputFields();
      case 'radio-button':
      case 'check-box':
      case 'drop-down':
        return renderSelectFields();
      case 'footer-button':
      case 'embedded-link':
        return renderButtonFields();
      case 'opt-in':
        return renderSelectFields();
      case 'photo':
      case 'document':
        return renderPhotoFields();
      default:
        return null;
    }
  }; 

  return (
    <PropertiesPanel elevation={0} >
  <Header
  sx={{
    backgroundColor: 'rgba(128, 128, 128, 0.2)', // 80% transparency
    padding: '10px',
    borderRadius: 0,
    marginX: '-24px', // adjust based on padding of PropertiesPanel
    marginTop: '-24px',
    marginBottom: '-4px',
  }}
>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <IoMdInformationCircleOutline size={20} />
    <Typography variant="subtitle1" fontWeight={500}>
      {component.name}
    </Typography>
  </Box>
  <IconButton size="small" onClick={onClose}>
    <FaTimes />
  </IconButton>
</Header>

    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: -0.4   ,marginX: '-11px'}}>
      <FormControlLabel
        label="Use Dynamic Variable"
        labelPlacement="start"
        control={
          <Switch
            checked={component.properties?.isDynamic === 'true'}
            onChange={(e) => handleChange('isDynamic', e.target.checked.toString())}
            color="primary"
          />
        }
      />
    </Box>
    
    
    <Box sx={{ mt: 0.2 }}>
      {renderFields()}
    </Box>
  </PropertiesPanel>
  

  );
};

export default PropertiesForm; 