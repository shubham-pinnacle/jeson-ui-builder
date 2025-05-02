import React, { useState, useRef, useEffect } from 'react';
import { Button, Grid, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SidebarComponents from './SidebarComponents';
import {
  FlowNameContainer,
  SidebarContainer,
  SectionTitle,
  ComponentsGrid,
  ComponentCard,
  ComponentName
} from './SidebarStyles';

interface SidebarProps {
  onAddComponent: (componentType: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddComponent }) => {
  // --- Editable flow name state ---
  const [flowName, setFlowName] = useState<string>('Flow Name');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Keep track of the name before editing, to restore if user submits empty
  const prevFlowNameRef = useRef<string>(flowName);

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus/select when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Called when pencil icon is clicked
  const startEditing = () => {
    prevFlowNameRef.current = flowName;
    setIsEditing(true);
  };

  const finishEditing = () => {
    // If user left it empty, revert to previous
    if (!flowName.trim()) {
      setFlowName(prevFlowNameRef.current);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      // Revert and exit
      setFlowName(prevFlowNameRef.current);
      setIsEditing(false);
    }
  };

  // --- Unchanged component-click handler ---
  const handleComponentClick = (componentId: string) => {
    onAddComponent(componentId);
  };

  return (
    <SidebarContainer>
      <FlowNameContainer>
        {/* Toggle between display and TextField */}
        {isEditing ? (
          <TextField
            inputRef={inputRef}
            value={flowName}
            onChange={e => setFlowName(e.target.value)}
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
            size="small"
            variant="standard"
            sx={{ maxWidth: '200px' }}
          />
        ) : (
          <b>{flowName}</b>
        )}

        <Grid ml={1} container alignItems="center">
          {/* Pencil icon to enter edit mode */}
          <IconButton size="small" onClick={startEditing}>
            <EditIcon sx={{ fontSize: '14px', color: 'primary.main' }} />
          </IconButton>

          {/* The existing “Draft” button, unchanged */}
          <Button
            size="small"
            variant="contained"
            color="primary"
            sx={{
              marginLeft: '10px',
              borderRadius: '10px',
              padding: '3px 10px',
              fontSize: '10px',
              minWidth: 'auto'
            }}
          >
            Draft
          </Button>
        </Grid>
      </FlowNameContainer>

      {/* Sidebar components list (unchanged) */}
      {Object.entries(SidebarComponents).map(([section, items]) => (
        <div key={section}>
          <SectionTitle>{section.split(/(?=[A-Z])/).join(' ')}</SectionTitle>
          <ComponentsGrid>
            {items.map((item: any) => (
              <ComponentCard
                key={item.id}
                onClick={() => handleComponentClick(item.id)}
              >
                <item.icon size={20} color="#666" />
                <ComponentName>{item.name}</ComponentName>
              </ComponentCard>
            ))}
          </ComponentsGrid>
        </div>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;
