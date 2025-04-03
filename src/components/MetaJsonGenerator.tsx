import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, TextField } from '@mui/material';

const Container = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
  overflow: 'hidden',
  height: '100%',
  gap: '16px',
});

const StyledTextField = styled(TextField)({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    height: '100%',
    '& textarea': {
      height: '100% !important',
      fontFamily: 'monospace',
      fontSize: '14px',
      lineHeight: '1.5',
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