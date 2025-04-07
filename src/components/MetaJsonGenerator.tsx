import React, { useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { Box, TextField } from '@mui/material';

const Container = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
  height: '100%',
  gap: '16px',

  // Let this container scroll if content exceeds its height
  overflow: 'auto',

  /* Custom scrollbar styling for WebKit browsers */
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#ffffff',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'lightgrey',
    borderRadius: '4px',
  },
  /* Firefox scrollbar styling */
  scrollbarWidth: 'thin',
  scrollbarColor: 'lightgrey #ffffff',
});

// A horizontal row: gutter on the left, text area on the right
const EditorContainer = styled(Box)({
  display: 'flex',
  width: '100%',
  // The parent Container can scroll vertically,
  // so we don't need overflow here unless you want horizontal scrolling too.
});

// The line-number gutter
const Gutter = styled('div')({
  // Sticky positioning keeps it pinned horizontally but lets it scroll vertically
  position: 'sticky',
  top: 0,
  left: 0,
  // Make sure it has a background so text won't bleed behind it
  backgroundColor: '#f5f5f5',
  borderRight: '1px solid #ddd',
  textAlign: 'right',
  paddingRight: '8px',
  fontFamily: 'monospace',
  fontSize: '14px',
  lineHeight: '1.5',
  userSelect: 'none',
  width: '40px',
  // so it’s above the text field background
  zIndex: 1,
});

// The JSON text field
const StyledTextField = styled(TextField)({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    fontFamily: 'monospace',
    fontSize: '14px',
    lineHeight: '1.5',

    // Let the TextField grow as needed; the parent will handle scrolling.
    '& textarea': {
      resize: 'vertical',
      minHeight: '300px',
      // A small left padding so text doesn’t run right against the gutter’s border
      paddingLeft: '8px',
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
  // Split lines to generate line numbers
  const lines = useMemo(() => jsonInput.split('\n'), [jsonInput]);

  const handleEditorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onJsonChange(event.target.value);
  };

  return (
    <Container>
      <EditorContainer>
        <Gutter>
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </Gutter>
        <StyledTextField
          multiline
          fullWidth
          variant="outlined"
          value={jsonInput}
          onChange={handleEditorChange}
        />
      </EditorContainer>
    </Container>
  );
};

export default MetaJsonGenerator;
