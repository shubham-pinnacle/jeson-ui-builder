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
  FormHelperText,
  FormGroup,
  FormLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaTimes } from 'react-icons/fa';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { Component } from '../types';
import { BiImageAlt } from 'react-icons/bi';

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
    console.log('handleChange called:', { 
      property, 
      value,
      currentProperties: component.properties 
    });
    onPropertyChange(component.id, property, value);
  };

  const handlePropertyOptionChange = (option: string, checked: boolean) => {
    console.log('Property option change:', { 
      option, 
      checked,
      currentProperties: component.properties 
    });
    const currentOptions = [...(component.properties?.propertyOptions || [])];
    const newOptions = checked 
      ? [...currentOptions, option]
      : currentOptions.filter(opt => opt !== option);
    
    console.log('New property options:', newOptions);
    handleChange('propertyOptions', newOptions);

    // Initialize arrays if they don't exist when checkbox is checked
    if (checked) {
      switch (option) {
        case 'id':
          console.log('Initializing ID array with current options:', component.properties?.options);
          if (!component.properties?.optionIds) {
            const ids = new Array(JSON.parse(component.properties?.options || '[]').length).fill('');
            console.log('Created initial IDs array:', ids);
            handleChange('optionIds', ids);
          }
          break;
        case 'description':
          console.log('Initializing description array with current options:', component.properties?.options);
          if (!component.properties?.optionDescriptions) {
            const descriptions = new Array(JSON.parse(component.properties?.options || '[]').length).fill('');
            console.log('Created initial descriptions array:', descriptions);
            handleChange('optionDescriptions', descriptions);
          }
          break;
        case 'metadata':
          console.log('Initializing metadata array with current options:', component.properties?.options);
          if (!component.properties?.optionMetadata) {
            const metadata = new Array(JSON.parse(component.properties?.options || '[]').length).fill('');
            console.log('Created initial metadata array:', metadata);
            handleChange('optionMetadata', metadata);
          }
          break;
      }
    }
  };

  const handleOptionAdd = (field: string) => {
    console.log('1. handleOptionAdd called with field:', field);
    console.log('2. Current component properties:', component.properties);
    
    const newOption = component.properties?.['newOption'] || '';
    console.log('3. New option value:', newOption);
    
    if (newOption) {
      try {
        // Parse existing options array or create new one
        const optionsArray = JSON.parse(component.properties?.options || '[]');
        console.log('4. Current options array:', optionsArray);

        // Add new option to array
        optionsArray.push(newOption);
        console.log('5. Updated options array:', optionsArray);

        // Initialize property arrays if they don't exist
        const currentIds = Array.isArray(component.properties?.optionIds) ? component.properties.optionIds : [];
        const currentDescs = Array.isArray(component.properties?.optionDescriptions) ? component.properties.optionDescriptions : [];
        const currentMeta = Array.isArray(component.properties?.optionMetadata) ? component.properties.optionMetadata : [];

        // Create new arrays with the updated values
        const newIds = [...currentIds];
        const newDescs = [...currentDescs];
        const newMeta = [...currentMeta];

        // Add new values to respective arrays
        if (component.properties?.propertyOptions?.includes('id')) {
          const newId = component.properties?.newOptionId || newOption.toLowerCase().replace(/\s+/g, '_');
          newIds.push(newId);
          console.log('6. Updated IDs array:', newIds);
        }
        
        if (component.properties?.propertyOptions?.includes('description')) {
          const newDesc = component.properties?.newOptionDescription || '';
          newDescs.push(newDesc);
          console.log('7. Updated descriptions array:', newDescs);
        }
        
        if (component.properties?.propertyOptions?.includes('metadata')) {
          const newMetaValue = component.properties?.newOptionMetadata || '';
          newMeta.push(newMetaValue);
          console.log('8. Updated metadata array:', newMeta);
        }

        // Update all properties at once to ensure consistency
        const updates: Record<string, any> = {
          options: JSON.stringify(optionsArray)
        };

        if (component.properties?.propertyOptions?.includes('id')) {
          updates.optionIds = newIds;
        }
        if (component.properties?.propertyOptions?.includes('description')) {
          updates.optionDescriptions = newDescs;
        }
        if (component.properties?.propertyOptions?.includes('metadata')) {
          updates.optionMetadata = newMeta;
        }

        // Apply all updates
        Object.entries(updates).forEach(([key, value]) => {
          handleChange(key, value);
        });

        console.log('9. All updates to be applied:', updates);

        // Clear input fields
        console.log('10. Clearing input fields');
        handleChange('newOption', '');
        handleChange('newOptionId', '');
        handleChange('newOptionDescription', '');
        handleChange('newOptionMetadata', '');
        
      } catch (error) {
        console.error('Error in handleOptionAdd:', error);
        console.log('Current options value:', component.properties?.options);
      }
    }
  };

  const handleOptionDelete = (field: string, optionToDelete: string) => {
    const currentOptions = Array.isArray(component.properties?.[field])
      ? component.properties[field]
      : [];
    const deleteIndex = currentOptions.indexOf(optionToDelete);
    const updatedOptions = currentOptions.filter((option: string) => option !== optionToDelete);
    handleChange(field, updatedOptions);

    // Also remove the corresponding id, description, and metadata
    if (deleteIndex !== -1) {
      if (component.properties?.optionIds) {
        const updatedIds = [...component.properties.optionIds];
        updatedIds.splice(deleteIndex, 1);
        handleChange('optionIds', updatedIds);
      }
      
      if (component.properties?.optionDescriptions) {
        const updatedDescs = [...component.properties.optionDescriptions];
        updatedDescs.splice(deleteIndex, 1);
        handleChange('optionDescriptions', updatedDescs);
      }
      
      if (component.properties?.optionMetadata) {
        const updatedMeta = [...component.properties.optionMetadata];
        updatedMeta.splice(deleteIndex, 1);
        handleChange('optionMetadata', updatedMeta);
      }
    }
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
     
<FormControl component="fieldset" fullWidth size="small">
  <FormLabel component="legend">Property (Optional)</FormLabel>
  <FormGroup row>
    <FormControlLabel
      control={
        <Checkbox
                checked={Boolean(component.properties?.propertyOptions?.includes('id'))}
                onChange={(e) => handlePropertyOptionChange('id', e.target.checked)}
        />
      }
      label="id"
    />
    <FormControlLabel
      control={
        <Checkbox
                checked={Boolean(component.properties?.propertyOptions?.includes('description'))}
                onChange={(e) => handlePropertyOptionChange('description', e.target.checked)}
        />
      }
      label="description"
    />
    <FormControlLabel
      control={
        <Checkbox
                checked={Boolean(component.properties?.propertyOptions?.includes('metadata'))}
                onChange={(e) => handlePropertyOptionChange('metadata', e.target.checked)}
        />
      }
      label="metadata"
    />
  </FormGroup>
        
</FormControl>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Options
        </Typography>
        <Stack spacing={1} sx={{ mb: 2 }}>
          <TextField
            size="small"
            fullWidth
            value={component.properties?.newOption || ''}
            onChange={(e) => handleChange('newOption', e.target.value)}
            placeholder="Title"
          />
          {component.properties?.propertyOptions?.includes('id') && (
            <TextField
              size="small"
              fullWidth
              value={component.properties?.newOptionId || ''}
              onChange={(e) => handleChange('newOptionId', e.target.value)}
              placeholder="Id (Optional)"
            />
          )}
          {component.properties?.propertyOptions?.includes('description') && (
            <TextField
              size="small"
              fullWidth
              value={component.properties?.newOptionDescription || ''}
              onChange={(e) => handleChange('newOptionDescription', e.target.value)}
              placeholder="Description (Optional)"
            />
          )}
          {component.properties?.propertyOptions?.includes('metadata') && (
            <TextField
              size="small"
              fullWidth
              value={component.properties?.newOptionMetadata || ''}
              onChange={(e) => handleChange('newOptionMetadata', e.target.value)}
              placeholder="Metadata (Optional)"
            />
          )}
          <Button
            variant="outlined"
            onClick={() => handleOptionAdd('options')}
            size="small"
          >
            Add
          </Button>
        </Stack>
        <List>
          {Array.isArray(JSON.parse(component.properties?.options || '[]')) && 
           JSON.parse(component.properties?.options || '[]').map((option: string, index: number) => (
            <OptionItem key={index}>
              <ListItemText 
                primary={
                  <Stack spacing={1}>
                    <Typography>{option}</Typography>
                    {component.properties?.propertyOptions?.includes('id') && (
                      <TextField
                        size="small"
                        fullWidth
                        label="ID"
                        value={component.properties?.optionIds?.[index] || ''}
                        onChange={(e) => {
                          const currentIds = [...(component.properties?.optionIds || [])];
                          currentIds[index] = e.target.value;
                          handleChange('optionIds', currentIds);
                        }}
                      />
                    )}
                    {component.properties?.propertyOptions?.includes('description') && (
                      <TextField
                        size="small"
                        fullWidth
                        label="Description"
                        value={component.properties?.optionDescriptions?.[index] || ''}
                        onChange={(e) => {
                          const currentDescs = [...(component.properties?.optionDescriptions || [])];
                          currentDescs[index] = e.target.value;
                          handleChange('optionDescriptions', currentDescs);
                        }}
                      />
                    )}
                    {component.properties?.propertyOptions?.includes('metadata') && (
                      <TextField
                        size="small"
                        fullWidth
                        label="Metadata"
                        value={component.properties?.optionMetadata?.[index] || ''}
                        onChange={(e) => {
                          const currentMeta = [...(component.properties?.optionMetadata || [])];
                          currentMeta[index] = e.target.value;
                          handleChange('optionMetadata', currentMeta);
                        }}
                      />
                    )}
                  </Stack>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => {
                    const options = JSON.parse(component.properties?.options || '[]');
                    const updatedOptions = options.filter((_: any, i: number) => i !== index);
                    handleChange('options', JSON.stringify(updatedOptions));
                    
                    if (component.properties?.optionIds) {
                      const updatedIds = [...component.properties.optionIds];
                      updatedIds.splice(index, 1);
                      handleChange('optionIds', updatedIds);
                    }
                    
                    if (component.properties?.optionDescriptions) {
                      const updatedDescs = [...component.properties.optionDescriptions];
                      updatedDescs.splice(index, 1);
                      handleChange('optionDescriptions', updatedDescs);
                    }
                    
                    if (component.properties?.optionMetadata) {
                      const updatedMeta = [...component.properties.optionMetadata];
                      updatedMeta.splice(index, 1);
                      handleChange('optionMetadata', updatedMeta);
                    }
                  }}
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
        value={component.properties?.buttonText || ''}
        onChange={(e) => handleChange('buttonText', e.target.value)}
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
        label="Left Caption"
        fullWidth
        value={component.properties?.leftCaption || ''}
        onChange={(e) => {
          handleChange('leftCaption', e.target.value);
          // If left caption is filled, clear center caption
          if (e.target.value && component.properties?.centerCaption) {
            handleChange('centerCaption', '');
          }
        }}
        disabled={!!component.properties?.centerCaption}
        size="small"
      />
      <TextField
        label="Center Caption"
        fullWidth
        value={component.properties?.centerCaption || ''}
        onChange={(e) => {
          handleChange('centerCaption', e.target.value);
          // If center caption is filled, clear left and right captions
          if (e.target.value) {
            handleChange('leftCaption', '');
            handleChange('rightCaption', '');
          }
        }}
        disabled={!!component.properties?.leftCaption || !!component.properties?.rightCaption}
        size="small"
      />
      <TextField
        label="Right Caption"
        fullWidth
        value={component.properties?.rightCaption || ''}
        onChange={(e) => {
          handleChange('rightCaption', e.target.value);
          // If right caption is filled, clear center caption
          if (e.target.value && component.properties?.centerCaption) {
            handleChange('centerCaption', '');
          }
        }}
        disabled={!!component.properties?.centerCaption}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>On Click Action</InputLabel>
        <Select
          value={component.properties?.onClickAction || 'complete'}
          onChange={(e) => handleChange('onClickAction', e.target.value)}
          label="On Click Action"
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
                {screen.title}
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

  const renderImageFields = () => (
    <Stack spacing={2}>
      <Button
        variant="outlined"
        fullWidth
        startIcon={<BiImageAlt />}
        component="label"
        sx={{ 
          height: '100px', 
          border: '2px dashed #ccc',
          '&:hover': {
            border: '2px dashed #2196f3'
          }
        }}
      >
        Upload Image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('File size should not exceed 5MB');
                return;
              }
              const reader = new FileReader();
              reader.onload = (event) => {
                const base64String = event.target?.result as string;
                if (base64String) {
                  // Set default scale-type when image is uploaded
                  handleChange('scaleType', 'contain');
                  
                  // Store the base64 data
                  handleChange('base64Data', base64String.split(',')[1] || '');
                  
                  // Store the complete data URL for preview
                  handleChange('src', base64String);
                }
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </Button>
      {component.properties?.src && (
        <Box 
          sx={{ 
            width: '100%', 
            height: '200px', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            border: '1px solid #eee',
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          <img 
            src={component.properties.src} 
            alt="Preview" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: component.properties.scaleType || 'contain'
            }} 
          />
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
            onClick={() => {
              handleChange('src', '');
              handleChange('base64Data', '');
              handleChange('scaleType', 'contain');
            }}
          >
            <FaTimes />
          </IconButton>
        </Box>
      )}
      <FormControl fullWidth size="small" required>
        <InputLabel>Scale Type</InputLabel>
        <Select
          value={component.properties?.scaleType || 'contain'}
          onChange={(e) => handleChange('scaleType', e.target.value)}
          label="Scale Type *"
        >
          <MenuItem value="contain">Contain</MenuItem>
          <MenuItem value="cover">Cover</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Width (px)"
        fullWidth
        type="number"
        value={component.properties?.width || '200'}
        onChange={(e) => handleChange('width', e.target.value)}
        size="small"
        inputProps={{ min: 0 }}
      />
      <TextField
        label="Height (px)"
        fullWidth
        type="number"
        value={component.properties?.height || '200'}
        onChange={(e) => handleChange('height', e.target.value)}
        size="small"
        inputProps={{ min: 0 }}
      />
       <TextField
        label="Aspect-ratio (Optional) "
        fullWidth
        type="number"
        value={component.properties?.aspectRatio || '1'}
        onChange={(e) => handleChange('aspectRatio', e.target.value)}
        size="small"
      />
      <TextField
        label="Alt Text"
        fullWidth
        value={component.properties?.altText || ''}
        onChange={(e) => handleChange('altText', e.target.value)}
        size="small"
      />
    </Stack>
  );

  const renderDatePickerFields = () => (
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
        label="Initial Value"
        fullWidth
        value={component.properties?.initValue || ''}
        onChange={(e) => handleChange('initValue', e.target.value)}
        size="small"
      />
      <TextField
        label="Min Date"
        fullWidth
        type="date"
        value={component.properties?.minDate || ''}
        onChange={(e) => handleChange('minDate', e.target.value)}
        size="small"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Max Date"
        fullWidth
        type="date"
        value={component.properties?.maxDate || ''}
        onChange={(e) => handleChange('maxDate', e.target.value)}
        size="small"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Helper Text"
        fullWidth
        value={component.properties?.helperText || ''}
        onChange={(e) => handleChange('helperText', e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Required</InputLabel>
        <Select
          value={component.properties?.required || 'false'}
          onChange={(e) => handleChange('required', e.target.value)}
          label="Required"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );

  const renderIfElseFields = () => (
    <Stack spacing={2}>
      <TextField
        label="Condition Name"
        required
        fullWidth
        value={component.properties?.conditionName || ''}
        onChange={(e) => handleChange('conditionName', e.target.value)}
        size="small"
      />
      <TextField
        label="Compare To Variable"
        required
        fullWidth
        value={component.properties?.compareToVariable || ''}
        onChange={(e) => handleChange('compareToVariable', e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Condition</InputLabel>
        <Select
          value={component.properties?.condition1 || 'equals'}
          onChange={(e) => handleChange('condition1', e.target.value)}
          label="Condition"
        >
          <MenuItem value="equals">Equals</MenuItem>
          <MenuItem value="not_equals">Not Equals</MenuItem>
          <MenuItem value="greater_than">Greater Than</MenuItem>
          <MenuItem value="less_than">Less Than</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Compare With Value"
        required
        fullWidth
        value={component.properties?.compareWithValue || ''}
        onChange={(e) => handleChange('compareWithValue', e.target.value)}
        size="small"
      />
    </Stack>
  );

  const renderSwitchFields = () => (
    <Stack spacing={2}>
      <TextField
        label="Switch On"
        required
        fullWidth
        value={component.properties?.switchOn || ''}
        onChange={(e) => handleChange('switchOn', e.target.value)}
        size="small"
      />
      <TextField
        label="Compare To Variable"
        required
        fullWidth
        value={component.properties?.compareToVariable || ''}
        onChange={(e) => handleChange('compareToVariable', e.target.value)}
        size="small"
      />
      <Box>
        <TextField
          label="Add Case"
          fullWidth
          value={component.properties?.newOption || ''}
          onChange={(e) => handleChange('newOption', e.target.value)}
          size="small"
        />
        <Button
          variant="outlined"
          onClick={() => handleOptionAdd('cases')}
          sx={{ mt: 1 }}
          fullWidth
        >
          Add Case
        </Button>
      </Box>
      <List>
        {(component.properties?.cases || []).map((caseValue: string) => (
          <OptionItem key={caseValue}>
            <ListItemText primary={caseValue} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleOptionDelete('cases', caseValue)}
                size="small"
              >
                <FaTimes />
              </IconButton>
            </ListItemSecondaryAction>
          </OptionItem>
        ))}
      </List>
    </Stack>
  );

  const renderUserDetailsFields = () => (
    <Stack spacing={2}>
      <FormControl fullWidth size="small">
        <InputLabel>Required Fields</InputLabel>
        <Select
          multiple
          value={component.properties?.requiredFields || []}
          onChange={(e) => handleChange('requiredFields', e.target.value)}
          label="Required Fields"
          renderValue={(selected) => (selected as string[]).join(', ')}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="address">Address</MenuItem>
          <MenuItem value="dateOfBirth">Date of Birth</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Optional Fields</InputLabel>
        <Select
          multiple
          value={component.properties?.optionalFields || []}
          onChange={(e) => handleChange('optionalFields', e.target.value)}
          label="Optional Fields"
          renderValue={(selected) => (selected as string[]).join(', ')}
        >
          <MenuItem value="phone">Phone</MenuItem>
          <MenuItem value="gender">Gender</MenuItem>
          <MenuItem value="occupation">Occupation</MenuItem>
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
      case 'image':
        return renderImageFields();
      case 'date-picker':
        return renderDatePickerFields();
      case 'if-else':
        return renderIfElseFields();
      case 'switch':
        return renderSwitchFields();
      case 'user-details':
        return renderUserDetailsFields();
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