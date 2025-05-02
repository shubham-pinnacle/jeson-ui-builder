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
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import AddDynamicVariableDialog, { DynamicVariable } from './AddDynamicVariableDialog';

export interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const TAB_LABELS = ['Screen Variable', 'Dynamic Variable', 'Configuration'];

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [dynamicVariables, setDynamicVariables] = useState<DynamicVariable[]>([]);
  const [isAddVariableDialogOpen, setIsAddVariableDialogOpen] = useState(false);
  
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
    setDynamicVariables([...dynamicVariables, variable]);
  };

  // Render the AddDynamicVariableDialog outside of the SettingsDialog
  // so it can be shown independently
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
                  <Button
                    variant="contained"
                    size="medium"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddVariableDialog}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: 'none',
                      px: 2
                    }}
                  >
                    Create Variables
                  </Button>
                </Box>

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
                    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dynamicVariables.map((variable, index) => (
                            <TableRow key={index}>
                              <TableCell>{variable.name}</TableCell>
                              <TableCell>{variable.type}</TableCell>
                              <TableCell>{variable.value || '-'}</TableCell>
                            </TableRow>
                          ))}
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
    </>
  );
};

export default SettingsDialog;
