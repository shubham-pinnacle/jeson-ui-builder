import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Button,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setText } from '../../../slices/TextHeading/textSlice';
import { setDynamicVariableDialogOpen } from '../../../slices/dialogSlice';
import AddIcon from '@mui/icons-material/Add';
import AddDynamicVariableDialog from '../../Settings/AddDynamicVariableDialog';
import { DynamicVariable } from '../../Settings/AddDynamicVariableDialog';
import { addDynamicVariable } from '../../../slices/dynamicVariableSlice';
import { styled } from '@mui/material/styles';

// Custom styled components for the dropdown
const StyledPaper = styled(Paper)(() => ({
  width: '250px',
  boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
  borderRadius: '8px',
  overflow: 'visible',
}));

// No interface needed for CustomPaperComponent as we're using React.ComponentProps<typeof Paper>

// Custom Paper Component - ensures the button always appears in the dropdown
const CustomPaperComponent = (props: React.ComponentProps<typeof Paper>) => {
  const { children, ...paperProps } = props;
  const dispatch = useDispatch();
  
  const handleOpenDialog = (event: React.MouseEvent) => {
    // Prevent the autocomplete from closing when button is clicked
    event.preventDefault();
    event.stopPropagation();
    // Debugging

    dispatch(setDynamicVariableDialogOpen(true));
    console.log('Dynamic variable button clicked from PaperComponent');
    // We'll set this from the parent component via a ref
    if (paperComponentRef.current?.onOpenDialog) {
      paperComponentRef.current.onOpenDialog();
    }
  };

  return (
    <StyledPaper {...paperProps}>
      <Box sx={{ p: 1 }}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            borderRadius: '30px',
            backgroundColor: '#1976d2',
            color: '#fff',
            my: 0.5,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            height: '36px',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
          onMouseDown={handleOpenDialog}
          startIcon={<AddIcon />}
        >
          Dynamic variable
        </Button>
      </Box>
      {children}
    </StyledPaper>
  );
};

// Reference to communicate with the PaperComponent
const paperComponentRef = React.createRef<{
  onOpenDialog?: () => void;
}>();

export default function TextHeadingPropertyForm({
  component,
  onPropertyChange: h,
}: Pick<FieldRendererProps, "component" | "onPropertyChange">) {
  const dispatch = useDispatch();
  const componentId = component.id;
  
  // Get component-specific text from Redux store
  const componentText = useSelector((state: RootState) => {
    // Check if this component has a specific text value
    if (state.text.componentsText[componentId]) {
      console.log('TextHeadingPropertyForm - Found component text for ID:', componentId, state.text.componentsText[componentId]);
      return state.text.componentsText[componentId];
    }
    // If this is the active component, use the global value
    if (state.text.currentComponentId === componentId) {
      return state.text.value;
    }
    // Fall back to local properties or empty string
    return component.properties?.text || "";
  });
  
  // Initialize input value with component text
  const [inputValue, setInputValue] = useState(componentText);
  const [touched, setTouched] = useState(false);

  // Get dialog state from Redux instead of local state
  const dynamicDialogOpen = useSelector((state: RootState) => state.dialog.dynamicVariableDialogOpen);
  const maxChars = 80;
  const isOverLimit = inputValue.length > maxChars;
  const isEmpty = touched && inputValue.trim() === "";

  useEffect(() => {
    console.log("Dialog box ", dynamicDialogOpen)
  }, [dynamicDialogOpen])

  // Get dynamic variables from Redux store, memoized to prevent re-renders
  const allDynamicVariables = useSelector((state: RootState) => state.dynamicVariables.variables);

  // Filter for string variables and memoize to prevent unnecessary re-renders
  const dynamicVariables = useMemo(() => {
    // Add debug log to verify variables are loaded properly
    console.log('Dynamic variables from Redux:', allDynamicVariables);
    return allDynamicVariables.filter(v => v.type === 'String');
  }, [allDynamicVariables]);

  // Extract variable names, format them for display
  const options = useMemo(() => {
    return dynamicVariables.map(v => `{{${v.name}}}`);
  }, [dynamicVariables]);

  // Sync with Redux state when component text changes
  useEffect(() => {
    if (componentText !== inputValue) {
      console.log('TextHeadingPropertyForm - Text changed in Redux, updating input value', { 
        componentText, 
        inputValue,
        componentId 
      });
      setInputValue(componentText);
    }
  }, [componentText, componentId]);

  useEffect(() => {
    const componentTextFromProps = component.properties?.text || "";
    // Convert JSON format ${data.varName} to UI format {{varName}}
    const uiText = componentTextFromProps.replace(/\${data\.(.*?)}/g, '{{$1}}');
    console.log('TextHeadingPropertyForm - Component text from JSON:', componentTextFromProps);
    console.log('TextHeadingPropertyForm - converted to uiText:', uiText);
    
    // Only update if the text is different from current values to avoid loops
    if (uiText !== inputValue && uiText !== componentText) {
      console.log('TextHeadingPropertyForm - updating values because different:', { 
        uiText, 
        inputValue, 
        componentText 
      });
      
      // Update local state
      setInputValue(uiText);
      
      // Update Redux state with component ID
      dispatch(setText({ 
        text: uiText, 
        componentId 
      }));
    } else {
      console.log('TextHeadingPropertyForm - no update needed:', { 
        uiText, 
        inputValue, 
        componentText 
      });
    }
  }, [component.properties?.text, componentText, inputValue, componentId]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    const value = newValue || inputValue;
    setInputValue(value);
    setTouched(true);

    if (value.length <= maxChars) {
      // For UI, keep the {{variableName}} format but include component ID
      dispatch(setText({
        text: value,
        componentId
      }));
      console.log('TextHeadingPropertyForm - handleChange dispatched to Redux with componentId:', componentId);
      
      // Handle empty string case explicitly
      if (value === '') {
        h("text", '');
      } else {
        // For JSON storage, convert {{variableName}} to ${data.variableName} format
        // This ensures the JSON has the correct format while the UI displays the braces format
        const jsonValue = value.replace(/{{(.*?)}}/g, '\${data.$1}');
        h("text", jsonValue);
        console.log('TextHeadingPropertyForm - handleChange converted to JSON format:', jsonValue);
      }
    }
  };
  
  // Update text in real-time as user types
  const handleRealTimeInput = (_e: React.SyntheticEvent, newInput: string) => {
    // Always update the local input value
    setInputValue(newInput);
    console.log('TextHeadingPropertyForm - handleRealTimeInput with value:', newInput);
    
    // Handle text updates including empty text (clearing)
    if (newInput.length <= maxChars) {
      // Update Redux state in real-time with component ID
      dispatch(setText({
        text: newInput,
        componentId
      }));
      
      // Update component properties in real-time
      // Important: Handle empty string case explicitly
      if (newInput === '') {
        h("text", '');
        console.log('TextHeadingPropertyForm - handleRealTimeInput cleared text for component:', componentId);
      } else {
        const jsonValue = newInput.replace(/{{(.*?)}}/g, '\${data.$1}');
        h("text", jsonValue);
        console.log('TextHeadingPropertyForm - handleRealTimeInput converted to JSON format:', jsonValue);
      }
    }
  };

  // Dynamic variable handling removed

  // Handle adding a new variable
  const handleAddVariable = (variable: DynamicVariable) => {
    dispatch(addDynamicVariable(variable));
    dispatch(setDynamicVariableDialogOpen(false));
  };

  // Connect the paper component ref to open the dialog
  React.useEffect(() => {
    if (paperComponentRef.current) {
      paperComponentRef.current.onOpenDialog = () => {
        dispatch(setDynamicVariableDialogOpen(true));
      };
    }
  }, [dispatch]);

  return (
    <>
      <Stack spacing={2}>
        <Autocomplete
          freeSolo
          options={options}
          value={inputValue}
          componentsProps={{
            paper: {
              sx: {
                borderRadius: '8px',
                mt: 0.5,
                overflow: 'hidden',
              }
            }
          }}
          // Use openOnFocus to ensure the popup always appears
          openOnFocus
          // This is the key - use our custom PaperComponent for the dropdown
          PaperComponent={CustomPaperComponent}
          // Ensure the Dynamic variable button shows even when no options exist
          noOptionsText={
            <Button
              fullWidth
              variant="contained"
              sx={{
                borderRadius: '30px',
                backgroundColor: '#1976d2',
                color: '#fff',
                my: 0.5,
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                height: '36px',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
              onClick={() =>
                dispatch(setDynamicVariableDialogOpen(true))}
              startIcon={<AddIcon />}
            >
              Dynamic variable
            </Button>
          }
          inputValue={inputValue}
          onInputChange={handleRealTimeInput}
          onChange={handleChange}
          sx={{
            width: '100%',
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Text Heading"
              required
              variant="outlined"
              size="small"
              error={isOverLimit || isEmpty}
              helperText={
                isEmpty
                  ? "Text Heading cannot be empty."
                  : `${inputValue.length}/${maxChars} characters`
              }
              FormHelperTextProps={{
                sx: {
                  color: isOverLimit || isEmpty ? "error.main" : "text.secondary",
                  fontWeight: isOverLimit || isEmpty ? 600 : 400,
                },
              }}
              onBlur={() => setTouched(true)}
              // Handle the clear button (×) click explicitly
              onChange={(e) => {
                if (e.target.value === '') {
                  // When cleared using the × button
                  handleRealTimeInput(e, '');
                }
              }}
              sx={{
                '.MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  backgroundColor: 'white',
                },
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 15px',
                backgroundColor: '#f8f8f8',
                borderBottom: '1px solid #eee',
                '&:hover': {
                  backgroundColor: '#f0f7ff',
                },
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#555',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                >
                  {/* Display the full {{variableName}} format */}
                  {option}
                </Typography>
              </Box>
              <Button
                size="small"
                sx={{
                  minWidth: '24px',
                  width: '24px',
                  height: '24px',
                  padding: 0,
                  borderRadius: '4px',
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  },
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  handleChange(
                    { target: { value: option } } as unknown as React.SyntheticEvent,
                    option
                  );
                }}
              >
                +
              </Button>
            </Box>
          )}
        />



        <FormControl fullWidth size="small">
          <InputLabel>Visible</InputLabel>
          <Select
            value={component.properties?.visible || "true"}
            onChange={(e) => h("visible", e.target.value)}
            label="Visible"
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Dynamic Variable Dialog */}
      <AddDynamicVariableDialog
        open={dynamicDialogOpen}
        onClose={() => dispatch(setDynamicVariableDialogOpen(false))}
        onAddVariable={handleAddVariable}
        activeScreenId={component.screen}
      />
    </>
  );
}
