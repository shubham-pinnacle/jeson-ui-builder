import React from 'react';
import styled from 'styled-components';
import { ComponentDefinition } from '../../../constants/components';
import { ComponentCard } from './ComponentCard';

interface ComponentSectionProps {
  title: string;
  components: ComponentDefinition[];
  onAddComponent: (componentId: string) => void;
}

const SectionContainer = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  color: #333;
  margin: 20px 0 10px;
  font-weight: 600;
`;

const ComponentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

export const ComponentSection: React.FC<ComponentSectionProps> = ({
  title,
  components,
  onAddComponent
}) => (
  <SectionContainer>
    <SectionTitle>{title}</SectionTitle>
    <ComponentsGrid>
      {components.map(component => (
        <ComponentCard
          key={component.id}
          name={component.name}
          Icon={component.icon}
          onClick={() => onAddComponent(component.id)}
        />
      ))}
    </ComponentsGrid>
  </SectionContainer>
);
