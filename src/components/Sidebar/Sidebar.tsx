import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { addComponent } from '../../store/actions/componentActions';
import { COMPONENTS, COMPONENT_CATEGORIES } from '../../constants/components';
import { ComponentSection } from './components/ComponentSection';

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
  background: white;
  height: 100vh;
  padding: 20px;
  border-right: 0.5px solid #ffff;
  overflow-y: scroll;
  
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const FlowNameContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eee;
  padding: 10px;
  border-radius: 5px;
`;

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();

  const handleAddComponent = (componentId: string) => {
    const component = COMPONENTS.find(c => c.id === componentId);
    if (component) {
      dispatch(addComponent({
        id: `${componentId}_${Date.now()}`,
        type: componentId,
        name: component.name,
        properties: {}
      }));
    }
  };

  // Group components by category
  const componentsByCategory = COMPONENTS.reduce((acc, component) => {
    const { category } = component;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(component);
    return acc;
  }, {} as Record<string, typeof COMPONENTS>);

  return (
    <SidebarContainer>
      <FlowNameContainer>
        <h3>Flow Builder</h3>
      </FlowNameContainer>

      {Object.entries(componentsByCategory).map(([category, components]) => (
        <ComponentSection
          key={category}
          title={category}
          components={components}
          onAddComponent={handleAddComponent}
        />
      ))}
    </SidebarContainer>
  );
};
