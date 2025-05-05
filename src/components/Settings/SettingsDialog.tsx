import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Popover,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AceEditor from 'react-ace';

// Import ace editor themes and modes
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import AddDynamicVariableDialog, { DynamicVariable } from './AddDynamicVariableDialog';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addDynamicVariable, removeDynamicVariable } from '../../slices/dynamicVariableSlice';
import { convertDynamicVariablesToJson } from '../../utils/jsonConverter';

export interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  screens: { id: string; title: string }[];
  activeScreenIndex?: number;
  activeScreenId?: string;
}

const TAB_LABELS = ['Screen Variable', 'Dynamic Variable', 'Configuration'];

const SettingsDialog: React.FC<SettingsDialogProps> = ({ 
  open, 
  onClose, 
  screens, 
  activeScreenIndex = 0, 
  activeScreenId 
}) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [isAddVariableDialogOpen, setIsAddVariableDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverContent, setPopoverContent] = useState<string>('');
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(screens[0].id);
  const [activeScreen, setActiveScreen] = useState(activeScreenId || screens[0].id);
  const [jsonPayload, setJsonPayload] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editorValue, setEditorValue] = useState<string>('');
  const [editorError, setEditorError] = useState<string>('');
  const [apiUrl, setApiUrl] = useState<string>('');
  const [apiUrlError, setApiUrlError] = useState<string>('');
  const [isApiUrlValid, setIsApiUrlValid] = useState<boolean>(false);

  const dispatch = useDispatch();
  const dynamicVariables = useSelector((state: RootState) => state.dynamicVariables.variables);

  // Keep JSON updated whenever variables change
  useEffect(() => {
    if (activeScreen) {
      const json = convertDynamicVariablesToJson(activeScreen, dynamicVariables);
      setJsonPayload(json);
      
      // Keep handleSaveJson in code for future reference without lint warnings
      void(0); // This prevents any unused variable warnings
    }
  }, [dynamicVariables, activeScreen]);

  // Keep editor value in sync with the JSON payload
  useEffect(() => {
    setEditorValue(jsonPayload);
  }, [jsonPayload]);

  // Set the active screen when it changes from the App component
  useEffect(() => {
    if (activeScreenId) {
      setActiveScreen(activeScreenId);
      setSelectedScreen(activeScreenId);
    }
  }, [activeScreenId]);

  // Handle JSON editor change
  const handleJsonChange = (value: string) => {
    setEditorValue(value);
    try {
      JSON.parse(value);
      setEditorError('');
    } catch (error) {
      if (error instanceof Error) {
        setEditorError(error.message);
      } else {
        setEditorError('Invalid JSON');
      }
    }
  };

  // Save edited JSON back to Redux
  // NOTE: Currently unused, but kept for future reference
  const handleSaveJson = () => {
    if (editorError) return;

    try {
      const parsed = JSON.parse(editorValue);

      if (!parsed.screen || !parsed.data) {
        setEditorError('JSON must contain screen and data properties');
        return;
      }

      // Clear existing variables for this screen
      const screenName = parsed.screen;
      const currentScreenVariables = dynamicVariables.filter((v: DynamicVariable) => v.screen === screenName);

      currentScreenVariables.forEach((variable: DynamicVariable) => {
        dispatch(removeDynamicVariable({ 
          name: variable.name, 
          screen: variable.screen || 'WELCOME',
          type: variable.type 
        }));
      });

      // Add variables from the JSON
      const data = parsed.data;
      Object.keys(data).forEach(key => {
        const value = data[key];
        let variable: DynamicVariable;

        if (typeof value === 'string') {
          variable = {
            name: key,
            type: 'String',
            screen: screenName,
            sample: value,
            value: value.length > 20 ? `${value.substring(0, 20)}...` : value
          };
        } else if (typeof value === 'boolean') {
          variable = {
            name: key,
            type: 'Boolean',
            screen: screenName,
            booleanValue: value,
            value: value.toString()
          };
        } else if (typeof value === 'number') {
          variable = {
            name: key,
            type: 'Number',
            screen: screenName,
            numberValue: value,
            value: value.toString()
          };
        } else if (Array.isArray(value)) {
          variable = {
            name: key,
            type: 'Array',
            screen: screenName,
            arraySamples: value,
            value: value.length > 0 ? 
              `[{"id":"${value[0].id || ''}","ti...` : 
              '[]'
          };
        } else {
          return; // Skip unknown types
        }

        dispatch(addDynamicVariable(variable));
      });

      // Show success notification
      alert('JSON successfully saved to variables');
    } catch (error) {
      setEditorError('Error processing JSON');
    }
  };

  // Handle tab change
  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  // Handle open add variable dialog
  const handleOpenAddVariableDialog = () => {
    setIsAddVariableDialogOpen(true);
  };

  // Handle close add variable dialog
  const handleCloseAddVariableDialog = () => {
    setIsAddVariableDialogOpen(false);
  };

  // Handle save variable
  const handleSaveVariable = (variable: DynamicVariable) => {
    dispatch(addDynamicVariable(variable));
    // The JSON will be updated automatically via the useEffect
  };

  // Handle delete variable
  const handleDeleteVariable = (name: string, screen: string, type: string) => {
    dispatch(removeDynamicVariable({ name, screen, type }));
  };

  // Format value based on type
  const formatValue = (variable: DynamicVariable): string => {
    switch (variable.type) {
      case 'String':
        return variable.sample || '-';
      case 'Boolean':
        return variable.booleanValue !== undefined ? (variable.booleanValue ? 'true' : 'false') : '-';
      case 'Number':
        return variable.numberValue !== undefined ? variable.numberValue.toString() : '-';
      case 'Array':
        if (!variable.arraySamples?.length) return '[]';
        // Use a more compact representation that shows just the essential info
        return `[${variable.arraySamples.map(item => `{"id":"${item.id}","title":"${item.title}"}`).join(',')}]`; 
      default:
        return '-';
    }
  };

  // Truncate long values
  const truncateValue = (value: string, maxLength: number = 20): string => {
    if (value.length <= maxLength) return value;
    return value.substring(0, maxLength) + '...';
  };

  // Handle popover open
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, content: string) => {
    setAnchorEl(event.currentTarget);
    setPopoverContent(content);
  };

  // Handle popover close
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // Check if value is long enough to need truncation
  const isLongValue = (value: string): boolean => {
    return value.length > 20;
  };

  // Get unique screens from dynamic variables
  const getUniqueScreens = (): string[] => {
    // First include all screens from props
    const screensFromProps = screens.map(screen => screen.id);
    
    // Then add any screens from dynamic variables that might not be in props
    const screensFromVariables = dynamicVariables.map(v => v.screen || 'WELCOME');
    
    // Combine and deduplicate
    return [...new Set([...screensFromProps, ...screensFromVariables])];
  };

  // Handle click on a screen
  const handleScreenClick = (screenId: string) => {
    setActiveScreen(screenId);
    // The JSON will be updated automatically via the useEffect
  };

  // Open the JSON modal
  const handleOpenJsonModal = (screenName: string = activeScreen) => {
    setSelectedScreen(screenName);
    // Get fresh JSON payload to ensure it's up to date
    const json = convertDynamicVariablesToJson(screenName, dynamicVariables);
    setJsonPayload(json);
    setJsonDialogOpen(true);
  };

  // Copy JSON to clipboard
  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonPayload)
      .then(() => {
        console.log('JSON copied to clipboard');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  // Validate API URL function
  const validateApiUrl = (url: string): boolean => {
    const urlPattern = /^https:\/\/process-automation\.1spoc\.ai\/process\/pf2\/execute\?.*org_id=[\w\d]+.*process_id=[\w\d]+.*version=[\w\d]+.*$/;
    return urlPattern.test(url);
  };

  // Handle API URL change
  const handleApiUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setApiUrl(newUrl);
    
    // Clear error when user starts typing again
    if (apiUrlError) setApiUrlError('');
    
    // Check if URL is valid as user types
    const isValid = validateApiUrl(newUrl);
    setIsApiUrlValid(isValid);
  };

  // Handle API URL blur for validation
  const handleApiUrlBlur = () => {
    if (!apiUrl) {
      setApiUrlError('API URL is required');
      setIsApiUrlValid(false);
    } else if (!validateApiUrl(apiUrl)) {
      setApiUrlError('Invalid API URL format. URL should match the pattern: https://process-automation.1spoc.ai/process/pf2/execute?org_id=XXX&process_id=XXX&version=XXX');
      setIsApiUrlValid(false);
    } else {
      setIsApiUrlValid(true);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="xl"
        PaperProps={{
          sx: {
            width: '76vw',
            height: '78vh',
            borderRadius: 5,
            px: 3,
            pt: 1,
          }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Settings
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            p: 0,
            overflowY: 'auto',
            scrollbarWidth: 'none', // Firefox
            '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Safari
          }}
        >
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
            >
              {TAB_LABELS.map((label) => (
                <Tab
                  key={label}
                  label={label}
                  sx={{ textTransform: 'none', fontSize: 15 }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Tab panels */}
          <Box sx={{ p: 3, minHeight: 'calc(78vh - 120px)' }}>
            {tabIndex === 0 && (
              <Box sx={{ display: 'flex', height: 'calc(78vh - 120px)' }}>
                {/* Left sidebar - Screen list */}
                <Box sx={{ 
                  width: '250px', 
                  borderRight: '1px solid #eee', 
                  pr: 2 
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Screens
                  </Typography>
                  <List sx={{ padding: 0 }}>
                    {screens.map((screen) => (
                      <ListItemButton 
                        key={screen.id}
                        onClick={() => handleScreenClick(screen.id)}
                        sx={{ 
                          borderRadius: 1,
                          mb: 0.5,
                          padding: '8px 12px',
                          color: activeScreen === screen.id ? '#1976d2' : 'inherit',
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.04)'
                          }
                        }}
                      >
                        <PostAddIcon 
                          fontSize="small" 
                          sx={{ 
                            mr: 1,
                            color: activeScreen === screen.id ? '#1976d2' : 'rgba(0, 0, 0, 0.54)'
                          }} 
                        />
                        <ListItemText 
                          primary={screen.title}
                          primaryTypographyProps={{
                            fontSize: '0.9rem',
                            fontWeight: activeScreen === screen.id ? 'bold' : 'normal'
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
                {/* Right side - JSON code display */}
                <Box sx={{ flex: 1, pl: 2, display: 'flex', flexDirection: 'column' }}>
                  {editorError && (
                    <Typography 
                      color="error" 
                      variant="caption" 
                      sx={{ mb: 1, display: 'block' }}
                    >
                      Error: {editorError}
                    </Typography>
                  )}
                  
                  <Box sx={{ 
                    flexGrow: 1, 
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    overflow: 'hidden',
                    '& .ace_gutter': {
                      background: '#f8f8f8'
                    },
                    // Custom styling for JSON keys and values
                    '& .ace_variable': {
                      color: '#C62828' // Darker Material UI red for keys
                    },
                    '& .ace_string': {
                      color: '#0D47A1' // Darker Material UI blue for values
                    },
                    '& .ace_constant.ace_numeric': {
                      color: '#0D47A1' // Darker Material UI blue for numeric values
                    },
                    '& .ace_constant.ace_boolean': {
                      color: '#0D47A1' // Darker Material UI blue for boolean values
                    },
                    // Make brackets normal black instead of bold/dark
                    '& .ace_paren': {
                      color: '#000000',
                      fontWeight: 'normal'
                    },
                    '& .ace_bracket': {
                      color: '#000000',
                      fontWeight: 'normal'
                    },
                    '& .ace_curly': {
                      color: '#000000',
                      fontWeight: 'normal'
                    }
                  }}>
                    <AceEditor
                      mode="json"
                      theme="github"
                      name="json-editor"
                      value={editorValue}
                      onChange={handleJsonChange}
                      fontSize={14}
                      width="100%"
                      height="calc(78vh - 180px)"
                      showPrintMargin={false}
                      showGutter={true}
                      highlightActiveLine={true}
                      readOnly={true}
                      setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2,
                      }}
                    />
                    
                    {/* Copy Payload button inside the editor area */}
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10,
                      zIndex: 10
                    }}>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<ContentCopyIcon />}
                        onClick={handleCopyJson}
                        sx={{
                          backgroundColor: 'white',
                          borderRadius: 1,
                          textTransform: 'none',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          padding: '4px 10px',
                          '&:hover': {
                            backgroundColor: '#f5f5f5'
                          }
                        }}
                      >
                        Copy Payload
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {tabIndex === 1 && (
              <>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="h2">
                    Dynamic Variables
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddVariableDialog}
                    disabled={activeScreen !== 'WELCOME' && !isApiUrlValid}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      boxShadow: 'none',
                    }}
                  >
                    Create Variables
                  </Button>
                </Box>

                {dynamicVariables.length > 0 && (
                  <TextField 
                    placeholder="Search variables..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                )}
                {/* Variables table or No variables message */}
                {dynamicVariables.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
                      <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f7f7f7' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', py: 1 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', py: 1 }}>Screen</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', py: 1 }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', py: 1 }}>Value</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', py: 1 }} align="center">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dynamicVariables
                            .filter((v: DynamicVariable) => {
                              // Ensure type-safe comparison by explicitly checking number value
                              if (Number(tabIndex) === 0) {
                                return v.screen === activeScreen;
                              }
                              
                              // Otherwise filter by search term if any
                              return !searchTerm || 
                                v.name.toLowerCase().includes(searchTerm.toLowerCase());
                            })
                            .map((variable, index) => {
                              const formattedValue = formatValue(variable);
                              const truncatedValue = truncateValue(formattedValue);
                              const needsPopover = isLongValue(formattedValue);

                              return (
                                <TableRow 
                                  key={index}
                                  sx={{ 
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    borderBottom: '1px solid #e0e0e0'
                                  }}
                                >
                                  <TableCell sx={{ py: 1 }}>{variable.name}</TableCell>
                                  <TableCell sx={{ py: 1 }}>{variable.screen || 'WELCOME'}</TableCell>
                                  <TableCell sx={{ py: 1 }}>{variable.type}</TableCell>
                                  <TableCell sx={{ py: 1 }}>
                                    {truncatedValue}
                                    {needsPopover && (
                                      <IconButton
                                        size="small"
                                        sx={{ ml: 1, p: 0 }}
                                        onClick={(e) => handlePopoverOpen(e, formattedValue)}
                                      >
                                        <VisibilityIcon fontSize="small" sx={{ color: '#2196f3' }} />
                                      </IconButton>
                                    )}
                                  </TableCell>
                                  <TableCell sx={{ py: 1 }} align="center">
                                    <IconButton 
                                      size="small" 
                                      sx={{ 
                                        color: 'error.main',
                                        padding: 0
                                      }}
                                      onClick={() => handleDeleteVariable(variable.name, variable.screen || 'WELCOME', variable.type)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ) : (
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ 
                      textAlign: 'center',
                      mt: 10
                    }}
                  >
                    No variables found
                  </Typography>
                )}
              </>
            )}

            {tabIndex === 2 && (
              <Box sx={{ maxWidth: '100%' }}>
                <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
                  API Configuration
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Enter API URL
                  </Typography>
                  <TextField
                    fullWidth
                    value={apiUrl}
                    onChange={handleApiUrlChange}
                    onBlur={handleApiUrlBlur}
                    error={!!apiUrlError}
                    helperText={apiUrlError}
                    placeholder="https://process-automation.1spoc.ai/process/pf2/execute?org_id=XXX&process_id=XXX&version=XXX"
                    sx={{
                      width: '100%',
                      maxWidth: '1350px',
                      margin: '0 auto' // optional, to center it
                    }}
                    
                    InputProps={{
                      sx: {
                        borderColor: apiUrlError ? 'error.main' : undefined,
                      }
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dynamic Variable Create Dialog */}
      <AddDynamicVariableDialog
        open={isAddVariableDialogOpen}
        onClose={handleCloseAddVariableDialog}
        onAddVariable={handleSaveVariable}
        activeScreenId={activeScreen}
      />

      {/* Value Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 2, maxWidth: 400, maxHeight: 300, overflow: 'auto' }}>
          <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {popoverContent}
          </Typography>
        </Box>
      </Popover>

      {/* JSON Viewer Dialog */}
      <Dialog
        open={jsonDialogOpen}
        onClose={() => setJsonDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '80vh'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{selectedScreen} JSON Payload</Typography>
            <IconButton
              onClick={() => setJsonDialogOpen(false)}
              aria-label="close"
              sx={{ p: 0.5 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <TextField
            value={jsonPayload}
            multiline
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: true,
              sx: {
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                whiteSpace: 'pre',
                padding: 2,
                border: 'none'
              }
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                border: 'none',
                '& fieldset': {
                  border: 'none'
                }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', py: 1.5, px: 2 }}>
          <Button 
            onClick={() => setJsonDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Close
          </Button>
          <Button 
            onClick={handleCopyJson}
            variant="contained"
            sx={{ borderRadius: 2, textTransform: 'none' }}
            startIcon={<ContentCopyIcon />}
          >
            Copy JSON
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SettingsDialog;
