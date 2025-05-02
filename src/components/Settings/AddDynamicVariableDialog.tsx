import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  FormControlLabel,
  RadioGroup,
  Typography,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Radio,
  Checkbox,
  Autocomplete,
  InputLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useToast } from '../ToastContext';

// Interface for component props
interface AddDynamicVariableDialogProps {
  open: boolean;
  onClose: () => void;
  onAddVariable: (variable: any) => void;
}

// Interface for property options in Array type
interface PropertyOption {
  id: string;
  title: string;
}

const PROPERTY_OPTIONS: PropertyOption[] = [
  { id: 'description', title: 'Description' },
  { id: 'metadata', title: 'Metadata' },
];

export type VariableType = 'String' | 'Boolean' | 'Number' | 'Array';

export interface DynamicVariable {
  name: string;
  type: VariableType;
  value?: string; // Display value
  screen?: string; // Screen name
  sample?: string; // For string variables
  booleanValue?: boolean; // For boolean variables
  numberValue?: number; // For number variables
  arraySamples?: any[]; // For array variables
  selectedProperties?: string[]; // For array variables - which properties are selected
}

const AddDynamicVariableDialog: React.FC<AddDynamicVariableDialogProps> = ({
  open,
  onClose,
  onAddVariable,
}) => {
  const { showToast } = useToast();
  const [variableName, setVariableName] = useState('');
  const [variableType, setVariableType] = useState<VariableType | ''>('');
  const [sampleValue, setSampleValue] = useState('');
  const [booleanValue, setBooleanValue] = useState<boolean | undefined>(undefined);
  const [numberValue, setNumberValue] = useState('');
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [propertySelectionDisabled, setPropertySelectionDisabled] = useState(false);
  const [arraySamples, setArraySamples] = useState<Array<{id: string, title: string, description?: string, metadata?: string}>>([]);
  const [currentArrayItem, setCurrentArrayItem] = useState<{id: string, title: string, description?: string, metadata?: string}>({ id: '', title: '' });
  
  // Error states
  const [nameError, setNameError] = useState('');
  const [sampleError, setSampleError] = useState('');
  const [numberError, setNumberError] = useState('');
  const [arrayItemErrors, setArrayItemErrors] = useState<{id?: string, title?: string, description?: string, metadata?: string}>({});

  // Default screen set to WELCOME
  const [screen] = useState('WELCOME');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Check if the user tried to enter a space
    if (value.includes(' ')) {
      // Show toast/snackbar notification
      showToast({
        message: 'variableName can only contain underscores and alphanumeric characters',
        type: 'error',
        duration: 3000
      });
      
      // Remove spaces for the actual value
      const cleanValue = value.replace(/\s/g, '');
      setVariableName(cleanValue);
      return;
    }
    
    setVariableName(value);
    
    if (value.trim() === '') {
      setNameError('Variable name is required');
    } else if (!/^[a-zA-Z0-9_]*$/.test(value)) {
      setNameError('variableName can only contain underscores and alphanumeric characters');
    } else {
      setNameError('');
    }
  };

  const handleTypeChange = (e: any) => {
    const selectedType = e.target.value as VariableType;
    setVariableType(selectedType);
    
    // Reset values based on type
    if (selectedType !== 'String') {
      setSampleValue('');
      setSampleError('');
    }

    if (selectedType !== 'Number') {
      setNumberValue('');
      setNumberError('');
    }

    if (selectedType !== 'Array') {
      setSelectedProperties([]);
      setArraySamples([]);
      setCurrentArrayItem({ id: '', title: '' });
      setPropertySelectionDisabled(false);
    }
  };

  const handleSampleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSampleValue(value);
    
    // Validate that the sample is a valid string
    if (value.trim() === '') {
      setSampleError('Sample value is required for String type');
    } else {
      setSampleError('');
    }
  };

  const handleBooleanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBooleanValue(event.target.value === 'true');
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumberValue(value);
    
    // Allow empty input during typing
    if (value === '') {
      setNumberError('Number value is required');
      return;
    }
    
    // Check if it's a valid number
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setNumberError('Please enter a valid number');
    } else {
      setNumberError('');
    }
  };

  const handleNumberIncrement = () => {
    const currentNum = numberValue === '' ? 0 : parseFloat(numberValue);
    if (!isNaN(currentNum)) {
      setNumberValue(String(currentNum + 1));
      setNumberError('');
    }
  };

  const handleNumberDecrement = () => {
    const currentNum = numberValue === '' ? 0 : parseFloat(numberValue);
    if (!isNaN(currentNum)) {
      setNumberValue(String(currentNum - 1));
      setNumberError('');
    }
  };

  const handleSave = () => {
    // Validate required fields
    let isValid = true;
    
    if (variableName.trim() === '') {
      setNameError('Variable name is required');
      isValid = false;
    }
    
    if (variableType === '') {
      isValid = false;
    }
    
    if (variableType === 'String' && sampleValue.trim() === '') {
      setSampleError('Sample value is required for String type');
      isValid = false;
    }
    
    if (variableType === 'Number' && numberValue.trim() === '') {
      setNumberError('Number value is required');
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Create variable object
    const variable: DynamicVariable = {
      name: variableName,
      type: variableType as VariableType,
      screen: screen,
    };
    
    // Add type-specific properties
    if (variableType === 'String') {
      variable.sample = sampleValue;
      variable.value = sampleValue; // Set the display value
    } else if (variableType === 'Boolean') {
      variable.booleanValue = booleanValue;
      variable.value = booleanValue ? 'true' : 'false'; // Set the display value
    } else if (variableType === 'Number') {
      variable.numberValue = Number(numberValue);
      variable.value = numberValue; // Set the display value
    } else if (variableType === 'Array') {
      variable.arraySamples = arraySamples;
      variable.selectedProperties = selectedProperties;
      variable.value = `[${arraySamples.length} items]`; // Set the display value
    }

    onAddVariable(variable);

    // Reset form
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setVariableName('');
    setVariableType('');
    setSampleValue('');
    setBooleanValue(undefined);
    setNumberValue('');
    setNameError('');
    setSampleError('');
    setNumberError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Handler for property selection change (for Array type)
  const handlePropertyChange = (
    _event: React.SyntheticEvent,
    newValue: (PropertyOption | undefined)[]
  ) => {
    const newSelectedProperties = newValue
      .filter((option): option is PropertyOption => option !== undefined)
      .map(option => option.id);
    
    setSelectedProperties(newSelectedProperties);

    // Update current array item with properties
    const newItem = { ...currentArrayItem };
    if (!newSelectedProperties.includes('description') && newItem.description) {
      delete newItem.description;
    }
    if (!newSelectedProperties.includes('metadata') && newItem.metadata) {
      delete newItem.metadata;
    }
    setCurrentArrayItem(newItem);
  };

  // Handle array item field changes
  const handleArrayItemChange = (field: keyof any, value: string) => {
    setCurrentArrayItem(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for the field
    setArrayItemErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  // Add new array sample item
  const handleAddArrayItem = () => {
    // Validate required fields
    const errors = { id: '', title: '', description: '', metadata: '' };
    let hasError = false;

    if (!currentArrayItem.id) {
      errors.id = 'ID is required';
      hasError = true;
    }

    if (!currentArrayItem.title) {
      errors.title = 'Title is required';
      hasError = true;
    }

    if (selectedProperties.includes('description') && !currentArrayItem.description) {
      errors.description = 'Description is required';
      hasError = true;
    }

    if (selectedProperties.includes('metadata') && !currentArrayItem.metadata) {
      errors.metadata = 'Metadata is required';
      hasError = true;
    }

    if (hasError) {
      setArrayItemErrors(errors);
      return;
    }

    // Add item to array samples
    setArraySamples(prev => [...prev, currentArrayItem]);
    
    // Reset current item
    setCurrentArrayItem({ id: '', title: '' });
    
    // Disable property selection after adding first item
    setPropertySelectionDisabled(true);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          width: '500px',
          overflow: 'hidden',
          p: 1
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          borderBottom: '1px solid #eee', 
          p: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'medium', fontSize: '0.95rem' }}>
            Add Dynamic Variable
          </Typography>
          {variableType && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'medium', fontSize: '0.95rem' ,backgroundColor: "#f57c00", padding:"2px 5px"  ,borderRadius:"5px"}}>
                {variableType}
              </Typography>
            </Box>
          )}
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          edge="end"
          size="small"
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, pt: 5, mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Variable Name *"
              value={variableName}
              onChange={handleNameChange}
              fullWidth
              required
              error={!!nameError}
              helperText={nameError}
              variant="outlined"
              size="small"
              InputProps={{
                sx: {
                  borderRadius: 2,
                  height: '45px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E0E0E0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#BDBDBD',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2196f3',
                    borderWidth: '1px',
                  },
                }
              }}
              InputLabelProps={{
                sx: {
                  color: 'rgba(0, 0, 0, 0.6)',
                  '&.Mui-focused': {
                    color: '#2196f3',
                  },
                  '&.MuiFormLabel-filled': {
                    color: '#2196f3',
                  },
                  fontSize: '0.85rem',
                }
              }}
            />
          </Box>
          
          {/* Show Variable Type dropdown initially */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5,  }}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel 
                id="variable-type-label"
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.6)',
                  '&.Mui-focused': {
                    color: '#2196f3',
                  },
                  fontSize: '0.85rem',
                }}
              >
                Variable Type *
              </InputLabel>
              <Select
                value={variableType}
                onChange={handleTypeChange}
                displayEmpty
                IconComponent={KeyboardArrowDownIcon}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: 2,
                      marginTop: 1,
                      boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.05)',
                    },
                  },
                }}
                label="Variable Type *"
                sx={{
                  borderRadius: 2,
                  height: '45px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E0E0E0',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2196f3',
                    borderWidth: '1px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#BDBDBD',
                  },
                }}
              >
                <MenuItem value="String">String</MenuItem>
                <MenuItem value="Boolean">Boolean</MenuItem>
                <MenuItem value="Number">Number</MenuItem>
                <MenuItem value="Array">Array</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          {/* Show Sample field only when String type is selected */}
          {variableType === 'String' && (
            <Box>
              <TextField
                label="Add Sample *"
                value={sampleValue}
                onChange={handleSampleChange}
                fullWidth
                required
                error={!!sampleError}
                helperText={sampleError}
                variant="outlined"
                size="small"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    height: '45px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E0E0E0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#BDBDBD',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2196f3',
                      borderWidth: '1px',
                    },
                  }
                }}
                InputLabelProps={{
                  sx: {
                    color: 'rgba(0, 0, 0, 0.6)',
                    '&.Mui-focused': {
                      color: '#2196f3',
                    },
                    '&.MuiFormLabel-filled': {
                      color: '#2196f3',
                    },
                    fontSize: '0.85rem',
                  }
                }}
              />
            </Box>
          )}
          
          {/* Show Boolean field only when Boolean type is selected */}
          {variableType === 'Boolean' && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#757575', mb: 1 }}>
                Select Value *
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={booleanValue}
                  onChange={handleBooleanChange}
                >
                  <FormControlLabel 
                    value="true" 
                    control={<Radio sx={{ '&.Mui-checked': { color: '#5C6BC0' } }} />} 
                    label="True" 
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                  />
                  <FormControlLabel 
                    value="false" 
                    control={<Radio sx={{ '&.Mui-checked': { color: '#5C6BC0' } }} />} 
                    label="False" 
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          )}
          
          {/* Show Number field only when Number type is selected */}
          {variableType === 'Number' && (
            <Box>
              <Typography sx={{ mb: 0.3, color: '#757575', fontSize: '0.8rem' }}>
                Number Value
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  placeholder="Number Value"
                  value={numberValue}
                  onChange={handleNumberChange}
                  fullWidth
                  required
                  error={!!numberError}
                  helperText={numberError}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      height: '36px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#BDBDBD',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2196f3',
                        borderWidth: '1px',
                      },
                    }
                  }}
                  InputLabelProps={{
                    sx: {
                      color: 'rgba(0, 0, 0, 0.6)',
                      '&.Mui-focused': {
                        color: '#2196f3',
                      },
                      '&.MuiFormLabel-filled': {
                        color: '#2196f3',
                      },
                      fontSize: '0.85rem',
                    }
                  }}
                />
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton onClick={handleNumberDecrement} sx={{ color: '#757575' }}>
                    <RemoveIcon />
                  </IconButton>
                  <IconButton onClick={handleNumberIncrement} sx={{ color: '#757575' }}>
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}
          
          {/* Show Array fields only when Array type is selected */}
          {variableType === 'Array' && (
            <Box>
              <Typography sx={{ mb: 0.3, color: '#757575', fontSize: '0.8rem' }}>
                Select Properties
              </Typography>
              <Autocomplete
                multiple
                value={selectedProperties
                  .map(id => PROPERTY_OPTIONS.find(item => item.id === id))
                  .filter((option): option is PropertyOption => option !== undefined)
                }
                onChange={handlePropertyChange}
                options={PROPERTY_OPTIONS}
                disableCloseOnSelect
                getOptionLabel={(option) => option.title}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.title}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    placeholder="Select properties"
                    error={!!arrayItemErrors.id}
                    helperText={arrayItemErrors.id}
                    InputProps={{
                      ...params.InputProps,
                      sx: {
                        borderRadius: 2,
                        height: '36px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#E0E0E0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#BDBDBD',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2196f3',
                          borderWidth: '1px',
                        },
                      }
                    }}
                    InputLabelProps={{
                      sx: {
                        color: 'rgba(0, 0, 0, 0.6)',
                        '&.Mui-focused': {
                          color: '#2196f3',
                        },
                        '&.MuiFormLabel-filled': {
                          color: '#2196f3',
                        },
                        fontSize: '0.85rem',
                      }
                    }}
                  />
                )}
                disabled={propertySelectionDisabled}
              />
              
              {/* ID and Title fields are always shown for Array type */}
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ mb: 0.3, color: '#757575', fontSize: '0.8rem' }}>
                  Add Array Item
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <TextField
                    placeholder="ID"
                    value={currentArrayItem.id}
                    onChange={(e) => handleArrayItemChange('id', e.target.value)}
                    fullWidth
                    error={!!arrayItemErrors.id}
                    helperText={arrayItemErrors.id}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        height: '36px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#E0E0E0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#BDBDBD',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2196f3',
                          borderWidth: '1px',
                        },
                      }
                    }}
                    InputLabelProps={{
                      sx: {
                        color: 'rgba(0, 0, 0, 0.6)',
                        '&.Mui-focused': {
                          color: '#2196f3',
                        },
                        '&.MuiFormLabel-filled': {
                          color: '#2196f3',
                        },
                        fontSize: '0.85rem',
                      }
                    }}
                  />
                  <TextField
                    placeholder="Title"
                    value={currentArrayItem.title}
                    onChange={(e) => handleArrayItemChange('title', e.target.value)}
                    fullWidth
                    error={!!arrayItemErrors.title}
                    helperText={arrayItemErrors.title}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        height: '36px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#E0E0E0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#BDBDBD',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2196f3',
                          borderWidth: '1px',
                        },
                      }
                    }}
                    InputLabelProps={{
                      sx: {
                        color: 'rgba(0, 0, 0, 0.6)',
                        '&.Mui-focused': {
                          color: '#2196f3',
                        },
                        '&.MuiFormLabel-filled': {
                          color: '#2196f3',
                        },
                        fontSize: '0.85rem',
                      }
                    }}
                  />
                  
                  {/* Only show property-specific fields when those properties are selected */}
                  {selectedProperties.includes('description') && (
                    <TextField
                      placeholder="Description"
                      value={currentArrayItem.description}
                      onChange={(e) => handleArrayItemChange('description', e.target.value)}
                      fullWidth
                      error={!!arrayItemErrors.description}
                      helperText={arrayItemErrors.description}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                          height: '36px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#E0E0E0',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#BDBDBD',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2196f3',
                            borderWidth: '1px',
                          },
                        }
                      }}
                      InputLabelProps={{
                        sx: {
                          color: 'rgba(0, 0, 0, 0.6)',
                          '&.Mui-focused': {
                            color: '#2196f3',
                          },
                          '&.MuiFormLabel-filled': {
                            color: '#2196f3',
                          },
                          fontSize: '0.85rem',
                        }
                      }}
                    />
                  )}
                  {selectedProperties.includes('metadata') && (
                    <TextField
                      placeholder="Metadata"
                      value={currentArrayItem.metadata}
                      onChange={(e) => handleArrayItemChange('metadata', e.target.value)}
                      fullWidth
                      error={!!arrayItemErrors.metadata}
                      helperText={arrayItemErrors.metadata}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                          height: '36px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#E0E0E0',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#BDBDBD',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2196f3',
                            borderWidth: '1px',
                          },
                        }
                      }}
                      InputLabelProps={{
                        sx: {
                          color: 'rgba(0, 0, 0, 0.6)',
                          '&.Mui-focused': {
                            color: '#2196f3',
                          },
                          '&.MuiFormLabel-filled': {
                            color: '#2196f3',
                          },
                          fontSize: '0.85rem',
                        }
                      }}
                    />
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button 
                      onClick={handleAddArrayItem} 
                      variant="contained" 
                      color="primary"
                      size="small"
                      sx={{ 
                        textTransform: 'none', 
                        borderRadius: 1.5,
                        boxShadow: 'none',
                        px: 2,
                        py: 0.5,
                        fontSize: '0.85rem',
                        minWidth: '80px',
                        height: '32px'
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 1.5, justifyContent: 'flex-end', gap: 1 }}>
        <Button 
          onClick={handleClose} 
          sx={{ 
            textTransform: 'none', 
            borderRadius: 1.5,
            border: '1px solid #E0E0E0',
            px: 2,
            py: 0.5,
            color: 'rgba(0, 0, 0, 0.7)' 
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          sx={{ 
            textTransform: 'none', 
            borderRadius: 1.5,
            boxShadow: 'none',
            px: 2,
            py: 0.5
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDynamicVariableDialog;