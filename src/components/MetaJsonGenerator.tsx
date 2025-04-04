import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, TextField } from '@mui/material';
const Container = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
  height: '100%',
  gap: '16px',
  overflowY: 'auto',
  /* Custom scrollbar styling for WebKit browsers */
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#ffffff', // white track
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'lightgrey', // light grey thumb
    borderRadius: '4px',
  },
  /* Firefox scrollbar styling */
  scrollbarWidth: 'thin',
  scrollbarColor: 'lightgrey #ffffff',
});

// Updated StyledTextField remains largely unchanged
const StyledTextField = styled(TextField)({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    fontFamily: 'monospace',
    fontSize: '14px',
    lineHeight: '1.5',
    overflow: 'hidden', // ensures the container of the textarea scrolls if needed
    '& textarea': {
      overflow: 'hidden', // enables scrolling for the textarea when content overflows
      resize: 'vertical', // allow user to resize if needed
      minHeight: '300px', // sets a minimum height so that extra content will trigger a scrollbar
    },
  },
});

interface MetaJsonGeneratorProps {
  jsonInput: string;
  onJsonChange: (json: string) => void;
  onMetaGenerate: (metaJson: any) => void;
}

const MetaJsonGenerator: React.FC<MetaJsonGeneratorProps> = ({
  jsonInput,
  onJsonChange,
  onMetaGenerate,
}) => {
  const handleEditorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onJsonChange(event.target.value);
  };

  return (
    <Container>
      <StyledTextField
        multiline
        fullWidth
        value={jsonInput}
        onChange={handleEditorChange}
        variant="outlined"
        InputProps={{
          sx: {
            height: '100%',
          },
        }}
      />
    </Container>
  );
};

export default MetaJsonGenerator; 