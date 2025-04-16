import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { styled } from '@mui/material/styles';
import { store } from './store';
import { MainLayout } from './layouts/MainLayout';
import { Sidebar } from './components/Sidebar';
import { Builder } from './features/builder';
import { MobilePreview } from './features/preview';
import { PropertiesForm } from './features/properties';
import { IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const AppContainer = styled('div')({
  display: 'flex',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  backgroundColor: '#f0f2f5'
});

const SidebarContainer = styled("div")({
  width: "300px",
  minWidth: "300px",
  height: "97vh",
  backgroundColor: "#ffffff",
  borderRight: "1px solid #e0e0e0",
  overflowY: "hidden",
  overflowX: "hidden",
  boxShadow: "2px 0 4px rgba(0,0,0,0.05)",
  borderRadius: "15px",
  marginTop: "13px",
  marginRight: "10px",
  marginBottom: "30px",
});

const MainContent = styled("div")({
  display: "flex",
  flex: 1,
  height: "100vh",
  overflow: "hidden",
});

const BuilderContainer = styled('div')<{ isPreviewVisible: boolean }>(
  ({ isPreviewVisible }) => ({
    width: isPreviewVisible ? 'calc(100% - 675px)' : 'calc(100% - 300px)',
    height: '100vh',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e0e0e0',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  })
);

const PreviewContainer = styled("div")<{ isVisible: boolean }>(
  ({ isVisible }) => ({
    width: "375px",
    minWidth: "375px",
    height: "100%",
    borderRight: "1px solid #e0e0e0",
    overflow: "hidden",
    display: isVisible ? "flex" : "none",
    flexDirection: "column",
    transition: "all 0.3s ease",
  })
);

const JsonEditorContainer = styled("div")({
  width: "500px",
  minWidth: "500px",
  height: "98vh",
  backgroundColor: "#ffffff",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  marginLeft: "10px",
  borderRadius: "15px",
});

const ButtonGroupContainer = styled("div")({
  display: "flex",
  gap: "8px",
  padding: "16px",
  borderBottom: "1px solid #e0e0e0",
  backgroundColor: "#f8f9fa",
  justifyContent: "flex-end",
});

const StyledButton = styled(Button)({
  textTransform: "none",
  fontWeight: 500,
  "&.MuiButton-outlined": {
    borderColor: "#e0e0e0",
    "&:hover": {
      borderColor: "#1976d2",
      backgroundColor: "rgba(25, 118, 210, 0.04)",
    },
  },
});

const ScreenTabsContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  padding: "8px 16px",
  borderBottom: "1px solid #e0e0e0",
  backgroundColor: "#f8f9fa",
});

const ScreenTab = styled(Tab)({
  textTransform: "none",
  minWidth: "120px",
  "&.Mui-selected": {
    fontWeight: 600,
  },
});

const AddScreenButton = styled(IconButton)({
  marginLeft: "8px",
  color: "#1976d2",
});

const DeleteScreenButton = styled(IconButton)({
  marginLeft: "4px",
  fontSize: "small",
  color: "#000",
  "&:hover": {
    backgroundColor: "rgba(211, 47, 47, 0.04)",
  },
});

const ScreenTitle = styled(Typography)({
  fontSize: "14px",
  fontWeight: 800,
  color: "#333",
  marginRight: "8px",
});

const CreateScreenDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    width: "500px",
    maxWidth: "90vw",
  },
});

const DialogTextField = styled(TextField)({
  marginBottom: "16px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: "#1976d2",
    },
  },
});

const MetaJsonGeneratorContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  "& .monaco-editor": {
    "& .view-lines": {
      "& .view-line": {
        // Add your styles here
      }
    }
  }
}));

interface Screen {
  id: string;
  title: string;
  components: Component[];
  terminal?: boolean;
  success?: boolean;
}

const App: React.FC = () => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  return (
    <Provider store={store}>
      <MainLayout
        sidebar={<Sidebar />}
        content={
          <>
            <BuilderContainer isPreviewVisible={isPreviewVisible}>
              <Builder />
            </BuilderContainer>
            <MobilePreview isVisible={isPreviewVisible} />
            <PropertiesForm />
            <Tooltip title={isPreviewVisible ? 'Hide Preview' : 'Show Preview'}>
              <IconButton
                onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                sx={{ position: 'fixed', right: '16px', bottom: '16px' }}
              >
                {isPreviewVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </Tooltip>
          </>
        }
      />
    </Provider>
  );
              components={screens[activeScreenIndex].components}
              screenTitle={screens[activeScreenIndex].title}
            />
          </PreviewContainer>
        </MainContent>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleScreenMenuClose}
        >
          <MenuItem onClick={handleEditScreen}>Edit Screen</MenuItem>
          <MenuItem onClick={handleDeleteScreen} disabled={screens.length <= 1}>
            Delete Screen
          </MenuItem>
        </Menu>

        <ScreenDialog
          open={isScreenDialogOpen}
          onClose={handleScreenDialogClose}
          onSubmit={handleScreenSubmit}
          mode={screenDialogMode}
          initialData={selectedScreenForEdit || undefined}
          existingScreenIds={screens.map((screen) => screen.id)}
        />
      </AppContainer>
    </DragDropContext>
  );
}

export default App;
