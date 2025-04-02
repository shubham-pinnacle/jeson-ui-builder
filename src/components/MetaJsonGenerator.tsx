import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, TextField, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import { PlayArrow, ContentCopy, Refresh } from '@mui/icons-material';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const Container = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid #333',
});

const Title = styled(Typography)({
  color: '#fff',
  fontSize: '18px',
  fontWeight: 500,
});

const ActionButtons = styled(Box)({
  display: 'flex',
  gap: '8px',
});

const JsonEditor = styled(Paper)({
  flex: 1,
  overflow: 'auto',
  backgroundColor: '#1e1e1e',
  padding: '16px',
  borderRadius: '4px',
  '& .syntax-highlighter': {
    margin: 0,
    padding: '16px',
    borderRadius: '4px',
    fontSize: '14px',
    lineHeight: '1.5',
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#333',
    },
    '&:hover fieldset': {
      borderColor: '#666',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#90caf9',
    },
    backgroundColor: '#2d2d2d',
    color: '#fff',
  },
  '& .MuiInputLabel-root': {
    color: '#999',
    '&.Mui-focused': {
      color: '#90caf9',
    },
  },
});

const StyledButton = styled(Button)({
  backgroundColor: '#2196f3',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#1976d2',
  },
  '&.Mui-disabled': {
    backgroundColor: '#666',
  },
});

const defaultJson = {
  version: "1.0",
  data_api_version: "1.0",
  routing_model: "stack",
  screens: [
    {
      id: "screen_1",
      title: "Default Screen",
      terminal_status: "success",
      success_status: "success",
      layout: {
        type: "stack",
        children: []
      }
    }
  ]
};

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
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(jsonInput);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(jsonInput);
  };

  const handleSave = () => {
    try {
      const parsedJson = JSON.parse(editValue);
      onJsonChange(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Invalid JSON:', error);
      alert('Invalid JSON format');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonInput);
  };

  const handleRefresh = () => {
    onMetaGenerate(JSON.parse(jsonInput));
  };

  return (
    <Container>
      <Header>
        <Title>JSON Editor</Title>
        <ActionButtons>
          <Tooltip title="Copy JSON">
            <IconButton onClick={handleCopy} size="small" sx={{ color: '#fff' }}>
              <ContentCopy />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh Preview">
            <IconButton onClick={handleRefresh} size="small" sx={{ color: '#fff' }}>
              <Refresh />
            </IconButton>
          </Tooltip>
          {!isEditing ? (
            <StyledButton
              startIcon={<PlayArrow />}
              onClick={handleEdit}
              variant="contained"
              size="small"
            >
              Edit
            </StyledButton>
          ) : (
            <StyledButton
              onClick={handleSave}
              variant="contained"
              size="small"
            >
              Save
            </StyledButton>
          )}
        </ActionButtons>
      </Header>

      <JsonEditor>
        {isEditing ? (
          <StyledTextField
            fullWidth
            multiline
            rows={20}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            variant="outlined"
            size="small"
          />
        ) : (
          <SyntaxHighlighter
            language="json"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '16px',
              borderRadius: '4px',
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          >
            {jsonInput}
          </SyntaxHighlighter>
        )}
      </JsonEditor>
    </Container>
  );
};

export default MetaJsonGenerator; 