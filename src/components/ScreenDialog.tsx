import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Typography,
  Box,
  styled,
} from '@mui/material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '55vw',
    maxWidth: '1200px',
    minWidth: '600px',
    padding: theme.spacing(3),
    borderRadius: '8px',
  },
}));

const DialogTitle = styled(Typography)({
  fontSize: '20px',
  fontWeight: 500,
  marginBottom: '24px',
});

const InputRow = styled('div')({
  display: 'flex',
  gap: '16px',
  marginBottom: '16px',
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
  },
}));

const InstructionsContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  '& ul': {
    margin: 0,
    paddingLeft: theme.spacing(3),
    color: '#666666',
    fontSize: '14px',
    lineHeight: 1.6,
  },
  '& li': {
    marginBottom: theme.spacing(0.5),
  },
}));

const ImportBox = styled(Box)(({ theme }) => ({
  border: '1px dashed #1976d2',
  borderRadius: '4px',
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  marginTop: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.04)',
  },
}));

const ButtonContainer = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  marginTop: '24px',
});

interface ScreenDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (screenName: string, screenId: string) => void;
  mode: 'create' | 'edit';
  initialData?: {
    title: string;
    id: string;
  };
  existingScreenIds?: string[];
}

const ScreenDialog: React.FC<ScreenDialogProps> = ({
  open,
  onClose,
  onSubmit,
  mode,
  initialData,
  existingScreenIds = []
}) => {
  const [screenName, setScreenName] = React.useState(initialData?.title || '');
  const [screenId, setScreenId] = React.useState(initialData?.id || '');
  const [nameError, setNameError] = React.useState('');
  const [idError, setIdError] = React.useState('');
  const [isAutoGeneratingId, setIsAutoGeneratingId] = React.useState(!initialData?.id);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setScreenName(initialData.title);
        setScreenId(initialData.id);
        setIsAutoGeneratingId(false);
      } else {
        setScreenName('');
        setScreenId('');
        setIsAutoGeneratingId(true);
      }
      setNameError('');
      setIdError('');
    }
  }, [open, initialData, mode]);

  // Updated generator: Remove any character that is not an alphabet, underscore or space.
  const generateScreenId = (name: string): string => {
    if (!name) return '';
    return name
      .replace(/[^a-zA-Z_\s]/g, '') // Remove numbers and special characters except underscore and spaces
      .replace(/\s+/g, '_')         // Replace one or more spaces with an underscore
      .toUpperCase();
  };

  const validateScreenName = (name: string) => {
    if (!name) {
      setNameError('Screen name is required');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateScreenId = (id: string) => {
    if (!id) {
      setIdError('Screen ID is required');
      return false;
    }
    if (!/^[A-Z_]+$/.test(id)) {
      setIdError('Screen ID can only contain alphabets and underscores');
      return false;
    }
    if (existingScreenIds.includes(id) && id !== initialData?.id) {
      setIdError('Screen ID must be unique');
      return false;
    }
    setIdError('');
    return true;
  };

  const handleScreenNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setScreenName(value);
    validateScreenName(value);
    
    if (isAutoGeneratingId) {
      const generatedId = generateScreenId(value);
      setScreenId(generatedId);
      validateScreenId(generatedId);
    }
  };

  const handleScreenIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setScreenId(value);
    setIsAutoGeneratingId(false);
    validateScreenId(value);
  };

  const handleSubmit = () => {
    const isNameValid = validateScreenName(screenName);
    const isIdValid = validateScreenId(screenId);

    if (isNameValid && isIdValid) {
      onSubmit(screenName, screenId);
      onClose();
    }
  };

  const handleFileImport = () => {
    console.log('File import clicked');
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle>
        {mode === 'create' ? 'Create New Screen' : 'Edit Screen'}
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <InputRow>
          <StyledTextField
            fullWidth
            label="Enter screen name"
            placeholder="e.g. My Screen"
            value={screenName}
            onChange={handleScreenNameChange}
            error={!!nameError}
            helperText={nameError}
          />
          <StyledTextField
            fullWidth
            label="Enter screen ID (Optional)"
            placeholder="e.g. MY_SCREEN"
            value={screenId}
            onChange={handleScreenIdChange}
            error={!!idError}
            helperText={idError}
          />
        </InputRow>

        <InstructionsContainer>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Instructions:
          </Typography>
          <ul>
            <li>If the screen name meets the Screen ID rules, then the Screen ID is used as its screen name</li>
            <li>Screen ID must be unique.</li>
            <li>Screen ID allows only alphabets and underscores ("_").</li>
            <li>Provide a separate screen ID if the screen title includes special characters or doesn't meet screen ID rules.</li>
          </ul>
        </InstructionsContainer>

        <ImportBox onClick={handleFileImport}>
          <Typography variant="body2" color="primary" gutterBottom>
            Click here to import screen JSON file.
          </Typography>
          <Typography variant="caption" color="textSecondary">
            (Only 1 file allowed)
          </Typography>
        </ImportBox>

        <ButtonContainer>
          <Button 
            onClick={onClose}
            variant="text"
            sx={{ color: '#666666' }}
          >
            Close
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!screenName || !!nameError || !!idError}
          >
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </ButtonContainer>
      </DialogContent>
    </StyledDialog>
  );
};

export default ScreenDialog;
