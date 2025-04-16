import styled from 'styled-components';
import { Box } from '@mui/material';

interface DropZoneProps {
  $isDraggingOver: boolean;
}

export const DropZone = styled(Box)<DropZoneProps>`
  flex: 1;
  border: 2px dashed ${props => props.$isDraggingOver ? '#1976d2' : '#ccc'};
  border-radius: 8px;
  padding: 16px;
  min-height: 200px;
  background-color: ${props => props.$isDraggingOver ? 'rgba(25, 118, 210, 0.04)' : 'transparent'};
  transition: all 0.2s ease;
`;
