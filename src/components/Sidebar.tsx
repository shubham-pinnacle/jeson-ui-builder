import React from 'react';
import styled from 'styled-components';
import { FaHeading, FaAlignLeft, FaParagraph, FaFont } from 'react-icons/fa';
import { BsTextareaResize, BsInputCursorText } from 'react-icons/bs';
import { MdRadioButtonChecked, MdCheckBox } from 'react-icons/md';
import { IoMdArrowDropdown } from 'react-icons/io';
import { BiImageAlt } from 'react-icons/bi';
import { AiOutlineLink } from 'react-icons/ai';
import { Component } from '../types';

const SidebarContainer = styled.div`
  width: 300px;
  background: white;
  height: 100vh;
  padding: 20px;
  border-right: 1px solid #eee;
  overflow-y: auto;
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

const ComponentCard = styled.div`
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
`;

const components = {
  basicText: [
    { id: 'text-heading', name: 'Text Heading', icon: FaHeading },
    { id: 'sub-heading', name: 'Sub Heading', icon: FaFont },
    { id: 'text-body', name: 'Text Body', icon: FaAlignLeft },
    { id: 'text-caption', name: 'Text Caption', icon: FaParagraph },
    { id: 'rich-text', name: 'Rich Text', icon: FaFont },
  ],
  textEntry: [
    { id: 'text-input', name: 'Text Input', icon: BsInputCursorText },
    { id: 'text-area', name: 'Text Area', icon: BsTextareaResize },
  ],
  selectControls: [
    { id: 'radio-button', name: 'Radio Button', icon: MdRadioButtonChecked },
    { id: 'check-box', name: 'Check Box', icon: MdCheckBox },
    { id: 'drop-down', name: 'Drop Down', icon: IoMdArrowDropdown },
  ],
  buttons: [
    { id: 'footer-button', name: 'Footer Button', icon: AiOutlineLink },
    { id: 'embedded-link', name: 'Embedded Link', icon: AiOutlineLink },
    { id: 'opt-in', name: 'Opt In', icon: MdCheckBox },
  ],
  mediaInput: [
    { id: 'photo', name: 'Photo', icon: BiImageAlt },
    { id: 'document', name: 'Document', icon: BiImageAlt },
  ],
};

interface SidebarProps {
  onAddComponent: (componentType: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddComponent }) => {
  const handleComponentClick = (componentId: string) => {
    onAddComponent(componentId);
  };

  return (
    <SidebarContainer>
      {Object.entries(components).map(([section, items]) => (
        <div key={section}>
          <SectionTitle>{section.split(/(?=[A-Z])/).join(' ')}</SectionTitle>
          <ComponentsGrid>
            {items.map((item) => (
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