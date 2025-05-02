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
  ListItem,
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
import SaveIcon from '@mui/icons-material/Save';
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
}

// Mock screen data
const SCREENS = ['WELCOME', 'SCREEN'];

const TAB_LABELS = ['Screen Variable', 'Dynamic Variable', 'Configuration'];

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isAddVariableDialogOpen, setIsAddVariableDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverContent, setPopoverContent] = useState<string>('');
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState('WELCOME');
  const [activeScreen, setActiveScreen] = useState('WELCOME');
  const [jsonPayload, setJsonPayload] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editorValue, setEditorValue] = useState<string>('');
  const [editorError, setEditorError] = useState<string>('');

  const dispatch = useDispatch();
  const dynamicVariables = useSelector((state: RootState) => state.dynamicVariables.variables);

  // Keep JSON updated whenever variables change
  useEffect(() => {
    if (activeScreen) {
      const json = convertDynamicVariablesToJson(activeScreen, dynamicVariables);
      setJsonPayload(json);
    }
  }, [dynamicVariables, activeScreen]);

  // Keep editor value in sync with the JSON payload
  useEffect(() => {
    setEditorValue(jsonPayload);
  }, [jsonPayload]);

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

  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  const handleOpenAddVariableDialog = () => {
    // Close settings dialog first, then open the add variable dialog
    onClose();
    setTimeout(() => {
      setIsAddVariableDialogOpen(true);
    }, 100); // Small delay to ensure smooth transition
  };

  const handleCloseAddVariableDialog = () => {
    setIsAddVariableDialogOpen(false);
  };

  const handleSaveVariable = (variable: DynamicVariable) => {
    dispatch(addDynamicVariable(variable));
    // The JSON will be updated automatically via the useEffect
  };

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
        return JSON.stringify(variable.arraySamples); 
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
    const screens = dynamicVariables.map(v => v.screen || 'WELCOME');
    return [...new Set(screens)];
  };

  // Handle click on a screen
  const handleScreenClick = (screenName: string) => {
    setActiveScreen(screenName);
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
        alert('JSON copied to clipboard');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
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
                  <List>
                    {SCREENS.map((screen, index) => (
                      <ListItemButton 
                        key={index}
                        selected={activeScreen === screen}
                        onClick={() => handleScreenClick(screen)}
                        sx={{ 
                          borderRadius: 1,
                          mb: 0.5,
                          '&.Mui-selected': {
                            backgroundColor: 'primary.light',
                            color: 'primary.main',
                          }
                        }}
                      >
                        <ListItemText 
                          primary={screen}
                          primaryTypographyProps={{
                            fontSize: '0.9rem',
                            fontWeight: activeScreen === screen ? 'bold' : 'normal'
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
                
                {/* Right side - JSON code display */}
                <Box sx={{ flex: 1, pl: 2, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
                      {activeScreen} JSON
                    </Typography>
                    <Box>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveJson}
                        disabled={!!editorError}
                        sx={{
                          borderRadius: 1,
                          textTransform: 'none',
                          mr: 1
                        }}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<ContentCopyIcon />}
                        onClick={() => handleOpenJsonModal()}
                        sx={{
                          borderRadius: 1,
                          textTransform: 'none',
                        }}
                      >
                        Copy Payload
                      </Button>
                    </Box>
                  </Box>
                  
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
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    overflow: 'hidden',
                    '& .ace_gutter': {
                      background: '#f8f8f8'
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
                      setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            )}

            {tabIndex === 1 && (
              <>
                {/* Header row */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Dynamic Variables
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddVariableDialog}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: 'none',
                    }}
                  >
                    Create Variables
                  </Button>
                </Box>

                {/* Search bar */}
                <TextField 
                  placeholder="Search variables..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ mb: 2 }}
                />

                {/* Screen Selector (if multiple screens exist) */}
                {getUniqueScreens().length > 1 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Screens:</Typography>
                    <List disablePadding>
                      {getUniqueScreens().map((screen, index) => (
                        <ListItem 
                          key={index} 
                          disablePadding
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            py: 0.5
                          }}
                        >
                          <ListItemText 
                            primary={screen} 
                            primaryTypographyProps={{ fontSize: '0.9rem' }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleOpenJsonModal(screen)}
                            sx={{ color: 'primary.main' }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Content area */}
                <Box sx={{ height: '100%' }}>
                  {dynamicVariables.length === 0 ? (
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Typography color="text.secondary">
                        No variables found
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer component={Paper} sx={{ 
                      boxShadow: 'none', 
                      maxHeight: 400, 
                      overflowY: 'auto',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px' 
                    }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>Screen</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>Value</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', py: 1.5 }}>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dynamicVariables
                            .filter((v: DynamicVariable) => {
                              // If on tab 0 (Screen Variable), only show variables from the active screen
                              if (tabIndex === 0) {
                                return v.screen === activeScreen;
                              }
                              
                              // Otherwise filter by search term if any
                              return !searchTerm || 
                                v.name.toLowerCase().includes(searchTerm.toLowerCase());
                            })
                            .map((variable: DynamicVariable, index: number) => {
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
                  )}
                </Box>
              </>
            )}

            {tabIndex === 2 && (
              <Typography> {/* TODO: configuration content */} </Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dynamic Variable Create Dialog */}
      <AddDynamicVariableDialog
        open={isAddVariableDialogOpen}
        onClose={handleCloseAddVariableDialog}
        onAddVariable={handleSaveVariable}
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
