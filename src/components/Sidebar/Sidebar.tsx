import React from 'react';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import SidebarComponents from './SidebarComponents'
import { FlowNameContainer,
         SidebarContainer,
         SectionTitle,
         ComponentsGrid,
         ComponentCard,
         ComponentName
 } from './SidebarStyles'


interface SidebarProps {
  onAddComponent: (componentType: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddComponent }) => {
  const handleComponentClick = (componentId: string) => {
    onAddComponent(componentId);
  };

  return (
    <SidebarContainer >
      <FlowNameContainer >
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