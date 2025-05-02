import React, { useState } from 'react';
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
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CodeIcon from '@mui/icons-material/Code';
import AddDynamicVariableDialog, { DynamicVariable } from './AddDynamicVariableDialog';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addDynamicVariable, removeDynamicVariable } from '../../slices/dynamicVariableSlice';
import { convertDynamicVariablesToJson } from '../../utils/jsonConverter';

export interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const TAB_LABELS = ['Screen Variable', 'Dynamic Variable', 'Configuration'];

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isAddVariableDialogOpen, setIsAddVariableDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverContent, setPopoverContent] = useState<string>('');
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState('WELCOME');
  const [jsonPayload, setJsonPayload] = useState('');

  const dispatch = useDispatch();
  const dynamicVariables = useSelector((state: RootState) => state.dynamicVariable.variables);

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
  };

  const handleDeleteVariable = (variableName: string) => {
    dispatch(removeDynamicVariable(variableName));
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

  // Handle opening the JSON viewer
  const handleOpenJsonViewer = (screenName: string) => {
    setSelectedScreen(screenName);
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
              <Typography>No Screens Found.</Typography>
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
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CodeIcon />}
                      onClick={() => handleOpenJsonViewer('WELCOME')}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        boxShadow: 'none',
                      }}
                    >
                      View JSON
                    </Button>
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
                </Box>

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
                            onClick={() => handleOpenJsonViewer(screen)}
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
                          {dynamicVariables.map((variable, index) => {
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
                                      color: '#f44336',
                                      padding: 0
                                    }}
                                    onClick={() => handleDeleteVariable(variable.name)}
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
            height: '80vh'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{selectedScreen} JSON Payload</Typography>
            <Box>
              <IconButton
                onClick={handleCopyJson}
                sx={{ mr: 1 }}
                title="Copy JSON"
              >
                <ContentCopyIcon />
              </IconButton>
              <IconButton
                onClick={() => setJsonDialogOpen(false)}
                title="Close"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
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
                height: '100%',
              }
            }}
            sx={{ height: '90%' }}
          />
        </DialogContent>
        <DialogActions>
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
