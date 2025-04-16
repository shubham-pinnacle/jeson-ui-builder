import React from 'react';
import styled from 'styled-components';
import { IconType } from 'react-icons';

interface ComponentCardProps {
  name: string;
  Icon: IconType;
  onClick: () => void;
}

const Card = styled.div`
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transform: translateY(-2px);
    border-color: #2196f3;
  }
`;

const ComponentName = styled.span`
  font-size: 12px;
  color: #666;
  text-align: center;
  font-weight: bold;
`;

export const ComponentCard: React.FC<ComponentCardProps> = ({ name, Icon, onClick }) => (
  <Card onClick={onClick}>
    <Icon size={24} color="#666" />
    <ComponentName>{name}</ComponentName>
  </Card>
);
