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
  ListItemSecondaryAction
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
  index: number;
  onPropertyChange: (index: number, field: string, value: string) => void;
  onClose: () => void;
}

const PropertiesForm: React.FC<PropertiesFormProps> = ({
  component,
  index,
  onPropertyChange,
  onClose
}) => {
  const handleOptionAdd = (field: string) => {
    const currentOptions = JSON.parse(component.properties?.[field] || '[]');
    const newOption = component.properties?.['newOption'] || '';
    if (newOption) {
      const updatedOptions = [...currentOptions, newOption];
      onPropertyChange(index, field, JSON.stringify(updatedOptions));
      onPropertyChange(index, 'newOption', '');
    }
  };

  const handleOptionDelete = (field: string, optionToDelete: string) => {
    const currentOptions = JSON.parse(component.properties?.[field] || '[]');
    const updatedOptions = currentOptions.filter((option: string) => option !== optionToDelete);
    onPropertyChange(index, field, JSON.stringify(updatedOptions));
  };

  const renderTextFields = () => (
    <Stack spacing={2}>
      <TextField
        label={`Text ${component.type === 'text-heading' ? 'Heading' : component.type === 'text-body' ? 'Body' : 'Caption'}`}
        required
        fullWidth
        value={component.properties?.text || ''}
        onChange={(e) => onPropertyChange(index, 'text', e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible || 'true'}
          onChange={(e) => onPropertyChange(index, 'visible', e.target.value)}
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
          onChange={(e) => onPropertyChange(index, 'fontWeight', e.target.value)}
          label="Font Weight (Optional)"
        >
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="bold">Bold</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Strike Through (Optional)</InputLabel>
        <Select
          value={component.properties?.strikeThrough || 'false'}
          onChange={(e) => onPropertyChange(index, 'strikeThrough', e.target.value)}
          label="Strike Through (Optional)"
        >
          <MenuItem value="false">False</MenuItem>
          <MenuItem value="true">True</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Markdown (Optional)</InputLabel>
        <Select
          value={component.properties?.markdown || 'false'}
          onChange={(e) => onPropertyChange(index, 'markdown', e.target.value)}
          label="Markdown (Optional)"
        >
          <MenuItem value="false">False</MenuItem>
          <MenuItem value="true">True</MenuItem>
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
        onChange={(e) => onPropertyChange(index, 'label', e.target.value)}
        size="small"
      />
      <TextField
        label="Output Variable"
        required
        fullWidth
        value={component.properties?.outputVariable || ''}
        onChange={(e) => onPropertyChange(index, 'outputVariable', e.target.value)}
        size="small"
      />
      <TextField
        label="Init Value (Optional)"
        fullWidth
        value={component.properties?.initValue || ''}
        onChange={(e) => onPropertyChange(index, 'initValue', e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Required (Optional)</InputLabel>
        <Select
          value={component.properties?.required || 'false'}
          onChange={(e) => onPropertyChange(index, 'required', e.target.value)}
          label="Required (Optional)"
        >
          <MenuItem value="false">False</MenuItem>
          <MenuItem value="true">True</MenuItem>
        </Select>
      </FormControl>
      {component.type === 'text-input' && (
        <FormControl fullWidth size="small">
          <InputLabel>Input Type (Optional)</InputLabel>
          <Select
            value={component.properties?.inputType || 'text'}
            onChange={(e) => onPropertyChange(index, 'inputType', e.target.value)}
            label="Input Type (Optional)"
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="password">Password</MenuItem>
          </Select>
        </FormControl>
      )}
      {component.type === 'text-input' ? (
        <>
          <TextField
            label="Min-Chars (Optional)"
            type="number"
            fullWidth
            value={component.properties?.minChars || ''}
            onChange={(e) => onPropertyChange(index, 'minChars', e.target.value)}
            size="small"
          />
          <TextField
            label="Max-Chars (Optional)"
            type="number"
            fullWidth
            value={component.properties?.maxChars || ''}
            onChange={(e) => onPropertyChange(index, 'maxChars', e.target.value)}
            size="small"
          />
        </>
      ) : (
        <TextField
          label="Max-Length (Optional)"
          type="number"
          fullWidth
          value={component.properties?.maxLength || ''}
          onChange={(e) => onPropertyChange(index, 'maxLength', e.target.value)}
          size="small"
        />
      )}
      <TextField
        label="Helper Text (Optional)"
        fullWidth
        value={component.properties?.helperText || ''}
        onChange={(e) => onPropertyChange(index, 'helperText', e.target.value)}
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
        onChange={(e) => onPropertyChange(index, 'label', e.target.value)}
        size="small"
      />
      <TextField
        label="Description (Optional)"
        fullWidth
        value={component.properties?.description || ''}
        onChange={(e) => onPropertyChange(index, 'description', e.target.value)}
        size="small"
      />
      <TextField
        label="Output Variable"
        required
        fullWidth
        value={component.properties?.outputVariable || ''}
        onChange={(e) => onPropertyChange(index, 'outputVariable', e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Property (Optional)</InputLabel>
        <Select
          value={component.properties?.property || ''}
          onChange={(e) => onPropertyChange(index, 'property', e.target.value)}
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
            onChange={(e) => onPropertyChange(index, 'newOption', e.target.value)}
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
          {JSON.parse(component.properties?.options || '[]').map((option: string) => (
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
          onChange={(e) => onPropertyChange(index, 'initValue', e.target.value)}
          label="Init Value (Optional)"
        >
          <MenuItem value="">Select value</MenuItem>
          {JSON.parse(component.properties?.options || '[]').map((option: string) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Required (Optional)</InputLabel>
        <Select
          value={component.properties?.required || 'false'}
          onChange={(e) => onPropertyChange(index, 'required', e.target.value)}
          label="Required (Optional)"
        >
          <MenuItem value="false">False</MenuItem>
          <MenuItem value="true">True</MenuItem>
        </Select>
      </FormControl>
      {component.type === 'check-box' && (
        <>
          <TextField
            label="Min-Selected-Items (Optional)"
            type="number"
            fullWidth
            value={component.properties?.minSelectedItems || ''}
            onChange={(e) => onPropertyChange(index, 'minSelectedItems', e.target.value)}
            size="small"
          />
          <TextField
            label="Max-Selected-Items (Optional)"
            type="number"
            fullWidth
            value={component.properties?.maxSelectedItems || ''}
            onChange={(e) => onPropertyChange(index, 'maxSelectedItems', e.target.value)}
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
        onChange={(e) => onPropertyChange(index, 'label', e.target.value)}
        size="small"
      />
      {component.type === 'footer-button' && (
        <>
          <TextField
            label="Left-Caption (Optional)"
            fullWidth
            value={component.properties?.leftCaption || ''}
            onChange={(e) => onPropertyChange(index, 'leftCaption', e.target.value)}
            size="small"
          />
          <TextField
            label="Center-Caption (Optional)"
            fullWidth
            value={component.properties?.centerCaption || ''}
            onChange={(e) => onPropertyChange(index, 'centerCaption', e.target.value)}
            size="small"
          />
          <TextField
            label="Right-Caption (Optional)"
            fullWidth
            value={component.properties?.rightCaption || ''}
            onChange={(e) => onPropertyChange(index, 'rightCaption', e.target.value)}
            size="small"
          />
        </>
      )}
      {component.type === 'embedded-link' && (
        <>
          <TextField
            label="Text"
            required
            fullWidth
            value={component.properties?.text || ''}
            onChange={(e) => onPropertyChange(index, 'text', e.target.value)}
            size="small"
          />
          <FormControl fullWidth size="small">
            <InputLabel>Visible (Optional)</InputLabel>
            <Select
              value={component.properties?.visible || 'true'}
              onChange={(e) => onPropertyChange(index, 'visible', e.target.value)}
              label="Visible (Optional)"
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </Select>
          </FormControl>
        </>
      )}
      <FormControl fullWidth size="small">
        <InputLabel>On Click Action</InputLabel>
        <Select
          value={component.properties?.onClickAction || ''}
          onChange={(e) => onPropertyChange(index, 'onClickAction', e.target.value)}
          label="On Click Action"
        >
          <MenuItem value="">Select action</MenuItem>
          <MenuItem value="submit">Submit</MenuItem>
          <MenuItem value="reset">Reset</MenuItem>
          <MenuItem value="cancel">Cancel</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );

  const renderPhotoFields = () => (
    <Stack spacing={2}>
      <TextField
        label="Label"
        required
        fullWidth
        value={component.properties?.label || ''}
        onChange={(e) => onPropertyChange(index, 'label', e.target.value)}
        size="small"
      />
      <TextField
        label="Description (Optional)"
        fullWidth
        value={component.properties?.description || ''}
        onChange={(e) => onPropertyChange(index, 'description', e.target.value)}
        size="small"
      />
      <TextField
        label="Output Variable"
        required
        fullWidth
        value={component.properties?.outputVariable || ''}
        onChange={(e) => onPropertyChange(index, 'outputVariable', e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Photo Source (Optional)</InputLabel>
        <Select
          value={component.properties?.photoSource || 'camera'}
          onChange={(e) => onPropertyChange(index, 'photoSource', e.target.value)}
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
        onChange={(e) => onPropertyChange(index, 'minPhotos', e.target.value)}
        size="small"
      />
      <TextField
        label="Maximum Photos"
        required
        type="number"
        fullWidth
        value={component.properties?.maxPhotos || ''}
        onChange={(e) => onPropertyChange(index, 'maxPhotos', e.target.value)}
        size="small"
      />
      <TextField
        label="Maximum file size in MB"
        type="number"
        fullWidth
        value={component.properties?.maxFileSize || '25'}
        onChange={(e) => onPropertyChange(index, 'maxFileSize', e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible || 'true'}
          onChange={(e) => onPropertyChange(index, 'visible', e.target.value)}
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
          onChange={(e) => onPropertyChange(index, 'enabled', e.target.value)}
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
      case 'text-heading':
      case 'sub-heading':
      case 'text-body':
      case 'text-caption':
      case 'rich-text':
        return renderTextFields();
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
    <PropertiesPanel elevation={0}>
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={component.properties?.isDynamic === 'true'}
              onChange={(e) => onPropertyChange(index, 'isDynamic', e.target.checked.toString())}
              color="primary"
            />
          }
          label="Use Dynamic Variable"
        />
      </Box>
      <Header>
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
      <Divider />
      <Box sx={{ mt: 2 }}>
        {renderFields()}
      </Box>
    </PropertiesPanel>
  );
};

export default PropertiesForm; 