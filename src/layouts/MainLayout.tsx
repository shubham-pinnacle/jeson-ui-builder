import React from 'react';
import { styled } from '@mui/material/styles';

const AppContainer = styled('div')({
  display: 'flex',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  backgroundColor: '#f0f2f5',
});

const SidebarContainer = styled('div')({
  width: '300px',
  minWidth: '300px',
  height: '97vh',
  backgroundColor: '#ffffff',
  borderRight: '1px solid #e0e0e0',
  overflowY: 'hidden',
  overflowX: 'hidden',
  boxShadow: '2px 0 4px rgba(0,0,0,0.05)',
  borderRadius: '15px',
  marginTop: '13px',
  marginRight: '10px',
  marginBottom: '30px',
});

const MainContent = styled('div')({
  display: 'flex',
  flex: 1,
  height: '100vh',
  overflow: 'hidden',
});

interface MainLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ sidebar, content }) => {
  return (
    <AppContainer>
      <SidebarContainer>
        {sidebar}
      </SidebarContainer>
      <MainContent>
        {content}
      </MainContent>
    </AppContainer>
  );
};
