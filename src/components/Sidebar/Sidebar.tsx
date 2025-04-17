import React from 'react';
import styled from 'styled-components';
import { FaHeading, FaAlignLeft, FaParagraph, FaFont } from 'react-icons/fa';
import { BsTextareaResize, BsInputCursorText } from 'react-icons/bs';
import { MdRadioButtonChecked, MdCheckBox } from 'react-icons/md';
import { IoMdArrowDropdown } from 'react-icons/io';
import { BiImageAlt, BiImage } from 'react-icons/bi';
import { AiOutlineLink, AiOutlineCalendar } from 'react-icons/ai';
import { VscSymbolClass } from 'react-icons/vsc';
import { RiUserLine, RiSwitchLine } from 'react-icons/ri';
import { Component } from '../../types';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';

const FlowNameContainer = styled.div`
  display: flex;
  justify-content: center; /* Centers content horizontally */
  align-items: center; /* Centers content vertically */
  // border: 1px solid #ccc;
  background-color:#eee;
  padding: 10px;
  border-radius: 5px;
`;


const ComponentsContainer = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
`;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
  background: white;
  height: 100vh;
  padding: 20px;
  border-right: 0.5px solid #ffff;
  overflow-y: scroll; /* Still allow scrolling */
  
  /* Hide scrollbar for Firefox */
  scrollbar-width: none; 
  
  /* Hide scrollbar for IE, Edge */
  -ms-overflow-style: none; 
  
  /* Hide scrollbar for Chrome, Safari, and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
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
  font-weight: bold;
`;

const components = {
  BasicText: [
    { id: 'text-heading', name: 'Text Heading', icon: FaHeading },
    { id: 'sub-heading', name: 'Sub Heading', icon: FaFont },
    { id: 'text-body', name: 'Text Body', icon: FaAlignLeft },
    { id: 'text-caption', name: 'Text Caption', icon: FaParagraph },
    { id: 'rich-text', name: 'Rich Text', icon: FaFont },
  ],
  TextEntry: [
    { id: 'text-input', name: 'Text Input', icon: BsInputCursorText },
    { id: 'text-area', name: 'Text Area', icon: BsTextareaResize },
  ],
  SelectControls: [
    { id: 'radio-button', name: 'Radio Button', icon: MdRadioButtonChecked },
    { id: 'check-box', name: 'Check Box', icon: MdCheckBox },
    { id: 'drop-down', name: 'Drop Down', icon: IoMdArrowDropdown },
  ],
  Buttons: [
    { id: 'footer-button', name: 'Footer Button', icon: AiOutlineLink },
    { id: 'embedded-link', name: 'Embedded Link', icon: AiOutlineLink },
    { id: 'opt-in', name: 'Opt In', icon: MdCheckBox },
  ],
  MediaInput: [
    { id: 'PhotoPicker', name: 'Photo', icon: BiImageAlt },
    { id: 'DocumentPicker', name: 'Document', icon: BiImageAlt },
    { id: 'image', name: 'Image', icon: BiImage },
  ],
  AdvancedControls: [
    { id: 'if-else', name: 'If-Else', icon: VscSymbolClass },
    { id: 'switch', name: 'Switch', icon: RiSwitchLine },
    { id: 'date-picker', name: 'Date Picker', icon: AiOutlineCalendar },
    //{ id: 'user-details', name: 'User Details', icon: RiUserLine },
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
      <FlowNameContainer>
        <b>Flow Name</b>
        <Grid ml={1}>
          <EditIcon sx={{ fontSize: "14px", color: "primary.main" }} />
          <Button
            size="small"
            variant="contained"
            color="primary"
            sx={{
              marginLeft: "10px",
              borderRadius: "10px",
              padding: "3px 10px",
              fontSize: "10px",
              minWidth: "auto"
            }}
          >
            Draft
          </Button>

        </Grid>
      </FlowNameContainer>
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