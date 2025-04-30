import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tabs,
  Tab,
  Box,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const TAB_LABELS = ['Screen Variable', 'Dynamic Variable', 'Configuration'];

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          width: '900px',
          maxHeight: '85vh',
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography variant="h6">Settings</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
          >
            {TAB_LABELS.map((label) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>
        </Box>

        {/* Tab panels */}
        <Box sx={{ p: 3, minHeight: '200px' }}>
          {tabIndex === 0 && (
            <Typography>No Screens Found.</Typography>
          )}
          {tabIndex === 1 && (
            <Typography> {/* TODO: dynamic var content */} </Typography>
          )}
          {tabIndex === 2 && (
            <Typography> {/* TODO: configuration content */} </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
