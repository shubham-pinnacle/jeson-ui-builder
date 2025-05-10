import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import {
  Button,
  Box,
  Tabs,
  Tab,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import Sidebar from "./components/Sidebar/Sidebar";
import Builder from "./components/Builder/Builder";
import Simulator from "./components/Simulator/Simulator";
import MetaJsonGenerator from "./components/MetaJsonGenerator";
import ScreenDialog from "./components/ScreenDialog";
import { Component } from "./types";
import Dialog from "@mui/material/Dialog";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/index';
import { useToast } from './components/ToastContext';;
import SettingsDialog from "./components/Settings/SettingsDialog"


const AppContainer = styled("div")({
  display: "flex",
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  backgroundColor: "#f0f2f5",
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

const BuilderContainer = styled("div")<{ isPreviewVisible: boolean }>(
  ({ isPreviewVisible }) => ({
    width: isPreviewVisible ? "calc(100% - 875px)" : "calc(100% - 500px)",
    minWidth: isPreviewVisible ? "calc(100% - 875px)" : "calc(100% - 500px)",
    height: "98vh",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e0e0e0",
    overflow: "hidden",
    flexDirection: "column",
    transition: "all 0.3s ease",
    borderRadius: "15px",
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
        "& .mtk1": {
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          maxWidth: "100%",
          overflowWrap: "break-word",
        },
      },
    },
  },
}));

interface Screen {
  id: string;
  title: string;
  components: Component[];
  terminal?: boolean;
  success?: boolean;
}

function App() {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const [screens, setScreens] = useState<Screen[]>([
    {
      id: "WELCOME",
      title: "WELCOME",
      components: [],
    },
  ]);
  const options = useSelector((state: RootState) => state.option.arr);
  const CheckBoxOptions = useSelector((state: RootState) => state.checkboxOption.arr);
  const TextHeadingtext = useSelector((state: RootState) => state.text.value);
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null
  );
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newScreenName, setNewScreenName] = useState("");
  const [newScreenId, setNewScreenId] = useState("");
  const [screenNameError, setScreenNameError] = useState("");
  const [screenIdError, setScreenIdError] = useState("");
  const [isScreenDialogOpen, setIsScreenDialogOpen] = useState(false);
  const [screenDialogMode, setScreenDialogMode] = useState<"create" | "edit">(
    "create"
  );
  const [selectedScreenForEdit, setSelectedScreenForEdit] = useState<{
    title: string;
    id: string;
  } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedScreenIndex, setSelectedScreenIndex] = useState<number | null>(
    null
  );

  const [settingsOpen, setSettingsOpen] = useState(false);

  const openSettings = () => setSettingsOpen(true);
  const closeSettings = () => setSettingsOpen(false);

  // useEffect(() => {
  //   showToast({
  //     message: 'Maximum of 50 components are allowed per screen.',
  //     type: 'error',
  //   });
  // }, []); 



  useEffect(() => {
    console.log("options", options);
  }, [options])

  // Update JSON editor when screens change
  useEffect(() => {
    const jsonString = JSON.stringify(generateJson(), null, 2);
    setEditValue(jsonString);
  }, [screens]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (
      source.droppableId === "sidebar" &&
      destination.droppableId === "builder"
    ) {
      // Add new component from sidebar
      const newComponent: Component = {
        id: `component_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        type: draggableId,
        name: draggableId
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        properties: {},
      };

      // Set default properties based on component type
      switch (draggableId) {
        case "text-heading":
          newComponent.properties = { text: TextHeadingtext || "", visible: true };
          break;
        case "sub-heading":
          newComponent.properties = { text: "", visible: true };
          break;
        case "text-body":
          newComponent.properties = {
            text: "",
            visible: true,
            strikethrough: undefined,
            fontWeight: "",
            markdown: false,
          };
          break;
        case "text-caption":
          newComponent.properties = {
            text: "",
            visible: true,
            strikethrough: undefined,
            fontWeight: "",
            markdown: false,
          };
          break;
        case "text-input":
          newComponent.properties = { 
            label: "",
            outputVariable: "",
            required: undefined,
            inputType: "text",
            initValue: "",
            helperText: "",
            visible: true,
            minChars: 0,
            maxChars: 80,
          };
          break;
        case "text-area":
          newComponent.properties = { 
            label: "",
            outputVariable: "",
            required: undefined,
            initValue: "",
            helperText: "",
            visible: true,
            maxLength: 600,
            enabled: undefined,
          };
          break;
        case "check-box":
          newComponent.properties = { 
            label: "",
            description: "",
            outputVariable: "",
            options: JSON.stringify(CheckBoxOptions),
            initValue: "",
            visible: true,
            required: false,
            enabled: true,
            minSelectedItems: 0,
            maxSelectedItems: 0,
          };
          break;
          case "radio-button":
          newComponent.properties = { 
            label: "",
            description: "",
            outputVariable: "",
            "data-source": [],
            visible: true,
            required: "",
            enabled: "",
            initValue: "",
          };
          break;
        case "drop-down":
          newComponent.properties = { 
            label: "",
            description: "",
            name: `dropdown_field_${Date.now()}`,
            // Initialize with an empty data-source array instead of global options
            "data-source": [],
            outputVariable: "",
            enabled: true,
            visible: true,
            required: false,
            placeholder: "Select an option",
          };
          break;
        case "footer-button":
          newComponent.properties = {
            label: "",
            leftCaption: "",
            centerCaption: "",
            rightCaption: "",
            enabled: undefined,
            onClickAction: "",
            screenName: "",
          };
          break;
        case "embedded-link":
          newComponent.properties = {
            text: "",
            visible: true,
            onClickAction: "",
            screenName: "",
            url: ""
          };
          break;
        case "opt-in":
          newComponent.properties = {
            label: "",
            required: undefined,
            visible: true,
            outputVariable: "",
            initValue: undefined,
            onClickAction: "",
            screenName: "",
            url: ""
          };
          break;
        case "PhotoPicker":
          newComponent.properties = { 
            label: "",
            description: "",
            outputVariable: "",
            photoSource: "camera_gallery",
            minPhotos: "0",
            maxPhotos: "30",
            maxFileSize: "25",
            visible: true,
            enabled: true,
            required: false,
            accept: "image/*",
          };
          break;
        case "DocumentPicker":
          newComponent.properties = {
            label: "",
            description: "",
            outputVariable: "",
            allowedMimeTypes: [],
            minDocuments: "0",
            maxDocuments: "",
            maxFileSize: "25",
            visible: true,
            enabled: true,
            required: false,
          };
          break;
        case "image":
          newComponent.properties = {
            src: "",
            width: "",
            height: "",
            scaleType: "contain",
            altText: "",
            aspectRatio: 1,
            base64Data: "",
          };
          break;
        case "date-picker":
          newComponent.properties = {
            label: "",
            outputVariable: "",
            initValue: null,
            visible: true,
            enabled: true,
            minDate: null,
            maxDate: null,
            unavailableDates: [],
            helperText: "",
          };
          break;

        case "user-details":
          newComponent.properties = {
            name: "",
            email: "",
            address: "",
            dateOfBirth: "",
          };
          break;
      }

      const updatedScreens = [...screens];
      updatedScreens[activeScreenIndex].components = [
        ...updatedScreens[activeScreenIndex].components,
        newComponent,
      ];
      setScreens(updatedScreens);
      setSelectedComponent(newComponent);
    } else if (
      source.droppableId === "builder" &&
      destination.droppableId === "builder"
    ) {
      // Reorder components in builder
      const updatedScreens = [...screens];
      const currentScreen = updatedScreens[activeScreenIndex];
      const newComponents = Array.from(currentScreen.components);
      const [removed] = newComponents.splice(source.index, 1);
      newComponents.splice(destination.index, 0, removed);
      currentScreen.components = newComponents;
      setScreens(updatedScreens);
    }
  };

  const handleAddComponent = (type: string) => {

    const currentComponents = screens[activeScreenIndex]?.components || [];

    if (currentComponents.length >= 50) {
      // useEffect(() => {
      showToast({
        message: 'Maximum of 50 components are allowed per screen.',
        type: 'error',
      });
      // }, []); 

      return;
    }
    const newComponent: Component = {
      id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      name: type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      properties: {},
    };

    // Set default properties based on component type
    switch (type) {
      case "text-heading":
        newComponent.properties = { text: TextHeadingtext || "", visible: true };
        break;
      case "sub-heading":
        newComponent.properties = { text: "", visible: true };
        break;
      case "text-body":
        newComponent.properties = {
          text: "",
          visible: true,
          strikethrough: undefined,
          fontWeight: "",
          markdown: false,
        };
        break;
      case "text-caption":
        newComponent.properties = {
          text: "",
          visible: true,
          strikethrough: undefined,
          fontWeight: "",
          markdown: false,
        };
        break;
      case "text-input":
        newComponent.properties = { 
          label: "",
          outputVariable: "",
          required: undefined,
          inputType: "text",
          initValue: "",
          helperText: "",
          visible: true,
          minChars: 0,
          maxChars: 80,
        };
        break;
      case "text-area":
        newComponent.properties = { 
          label: "",
          outputVariable: "",
          required: undefined,
          initValue: "",
          helperText: "",
          visible: true,
          maxLength: 600,
          enabled: undefined,
        };
        break;
      case "check-box":
        newComponent.properties = { 
          label: "",
          description: "",
          outputVariable: "",
          options: JSON.stringify(CheckBoxOptions),
          initValue: "",
          visible: true,
          required: false,
          enabled: true,
          minSelectedItems: 0,
          maxSelectedItems: 0,
        };
        break;
      case "radio-button":
        newComponent.properties = { 
          label: "",
          description: "",
          outputVariable: "",
          // Initialize with an empty data-source array instead of global options
          "data-source": [],
          visible: true,
          required: "",
          enabled: "",
          initValue: "",
        };
        break;
      case "drop-down":
        newComponent.properties = { 
          label: "",
          description: "",
          name: `dropdown_field_${Date.now()}`,
          // Initialize with an empty data-source array instead of global options
          "data-source": [],
          outputVariable: "",
          enabled: true,
          visible: true,
          required: false,
          placeholder: "Select an option",
        };
        break;
      case "footer-button":
        newComponent.properties = {
          label: "",
          leftCaption: "",
          centerCaption: "",
          rightCaption: "",
          enabled: undefined,
          onClickAction: "",
          screenName: "",
        };
        break;
      case "embedded-link":
        newComponent.properties = {
          text: "",
          visible: true,
          onClickAction: "",
          screenName: "",
          url: ""
        };
        break;
      case "opt-in":
        newComponent.properties = {
          label: "",
          required: undefined,
          visible: true,
          outputVariable: "",
          initValue: undefined,
          onClickAction: "",
          screenName: "",
          url: ""
        };
        break;
      case "PhotoPicker":
        newComponent.properties = { 
          label: "",
          description: "",
          outputVariable: "",
          photoSource: "camera_gallery",
          minPhotos: "0",
          maxPhotos: "30",
          maxFileSize: "25",
          visible: true,
          enabled: true,
          required: false,
          accept: "image/*",
        };
        break;
      case "DocumentPicker":
        newComponent.properties = {
          label: "",
          description: "",
          outputVariable: "",
          allowedMimeTypes: [],
          minDocuments: "0",
          maxDocuments: "",
          maxFileSize: "25",
          visible: true,
          enabled: true,
          required: false,
        };
        break;
      case "image":
        newComponent.properties = {
          src: "",
          width: "",
          height: "",
          scaleType: "contain",
          altText: "",
          aspectRatio: 1,
          base64Data: "",
        };
        break;
      case "date-picker":
          newComponent.properties = { 
            label: "",
            outputVariable: "",
            initValue: null,
            visible: true,
            enabled: true,
            minDate: null,
            maxDate: null,
            unavailableDates: [],
            helperText: "",
        };
        break;


    }

    const updatedScreens = [...screens];
    updatedScreens[activeScreenIndex].components = [
      ...updatedScreens[activeScreenIndex].components,
      newComponent,
    ];
    setScreens(updatedScreens);
    setSelectedComponent(newComponent);
  };

  const handleComponentSelect = (component: Component | null) => {
    // Ensure we're properly retrieving the component with all its current properties
    if (component) {
      // Find the most up-to-date version of this component from the screens state
      const updatedComponent = screens[activeScreenIndex].components.find(
        (comp) => comp.id === component.id
      );
      
      // Use the updated component with all its properties if available
      setSelectedComponent(updatedComponent || component);
    } else {
      setSelectedComponent(null);
    }
  };

  const handlePropertyChange = (
    componentId: string,
    property: string,
    value: any
  ) => {
    console.log(`Property change for component ${componentId}, property: ${property}`);
    
    // Special handling for data-source to ensure we're making a deep copy
    const processedValue = property === 'data-source' && Array.isArray(value) 
      ? JSON.parse(JSON.stringify(value)) // Deep clone the array to break all references
      : value;
      
    const updatedScreens = screens.map((screen, index) => {
      if (index === activeScreenIndex) {
        return {
          ...screen,
          components: screen.components.map((component) => {
            if (component.id === componentId) {
              // Create a deep copy of the component's properties
              const updatedProperties = { ...component.properties };
              
              // Update the specific property
              updatedProperties[property] = processedValue;
              
              // Log the update for debugging
              if (property === 'data-source') {
                console.log(`Updating data-source for component ${componentId}:`, processedValue);
              }
              
              return {
                ...component,
                properties: updatedProperties,
              };
            }
            return component;
          }),
        };
      }
      return screen;
    });

    setScreens(updatedScreens);
    
    // Update the selected component if it's the one being changed
    if (selectedComponent?.id === componentId) {
      const updatedSelectedComponent = updatedScreens[
        activeScreenIndex
      ].components.find((comp) => comp.id === componentId);
      if (updatedSelectedComponent) {
        setSelectedComponent(updatedSelectedComponent);
      }
    }
    
    // Update the JSON editor with the new components
    const jsonString = JSON.stringify(generateJson(), null, 2);
    setEditValue(jsonString);
  };

  const handleDeleteComponent = (componentId: string) => {
    const updatedScreens = screens.map((screen, index) => {
      if (index === activeScreenIndex) {
        return {
          ...screen,
          components: screen.components.filter(
            (comp) => comp.id !== componentId
          ),
        };
      }
      return screen;
    });

    setScreens(updatedScreens);
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null);
    }
  };

  const handleCopyJson = () => {
    // Export JSON without id fields
    const jsonObj = generateJson();
    const jsonNoId = JSON.parse(
      JSON.stringify(jsonObj),
      (key, value) => (key === 'id' ? undefined : value)
    );
    navigator.clipboard.writeText(JSON.stringify(jsonNoId, null, 2));
  };

  const handleJsonChange = (newJson: string) => {
    setEditValue(newJson);
    try {
      const trimmedJson = newJson.trim();
      if (!trimmedJson) {
        return;
      }

      const parsedJson = JSON.parse(trimmedJson);

      if (!parsedJson || typeof parsedJson !== "object") {
        console.error("Invalid JSON: Expected an object");
        return;
      }

      if (!parsedJson.screens || !Array.isArray(parsedJson.screens)) {
        console.error("Invalid JSON: Missing or invalid screens array");
        return;
      }

      // Extract all data-source options from radio buttons and checkboxes
      const allDataSources: any[] = [];
      parsedJson.screens.forEach((screen: any) => {
        const layoutChildren = screen.layout?.children || [];
        layoutChildren.forEach((child: any) => {
          if ((child.type === "RadioButtonsGroup" || child.type === "CheckboxGroup") &&
            Array.isArray(child["data-source"])) {
            // Add each option to the Redux store
            child["data-source"].forEach((option: any) => {
              if (option && option.id && option.title) {
                // Dispatch to Redux store
                dispatch({ type: 'UPDATE_OPTION', payload: option });
                allDataSources.push(option);
              }
            });
          }
        });
      });

      const newScreens = parsedJson.screens.map((screen: any) => {
        const prevScreen = screens.find(s => s.id === screen.id);
        const layoutChildren = screen.layout?.children || [];
        
        return {
          id: screen.id,
          title: screen.title,
          components: layoutChildren
            .map((child: any) => {
              let type = "";
            let properties: Record<string, any> = {};
              
              // Generate a stable component ID at the beginning
              // Don't include name in ID to prevent breaking component identification when name changes
              const componentId = child.id || 
                `component_${child.type || ''}${child.label || ''}${child.text || ''}`;
                
              // PRIORITY 1: If child has explicit ID, use that to find component
              let prevComponent = child.id ? 
                prevScreen?.components.find((c: any) => c.id === child.id) : null;
                
              // Store original ID to ensure we maintain component identity
              const originalId = child.id;
              
              // PRIORITY 2: If not found by ID, try finding by generated ID
              if (!prevComponent) {
                prevComponent = prevScreen?.components.find(
                  (c: any) => c.id === componentId
                );
              }
              
              // PRIORITY 3: If not found and component has name, try finding by name
              if (!prevComponent && child.name) {
                prevComponent = prevScreen?.components.find((c: any) => 
                  (c.properties.outputVariable === child.name || c.properties.name === child.name) &&
                  c.type === child.type
                );
              }
              
              // PRIORITY 4: If still not found, try matching by position/index in the layout
              // This helps maintain identities when the component is completely renamed
              if (!prevComponent && prevScreen?.components && layoutChildren) {
                const index = layoutChildren.indexOf(child);
                if (index >= 0 && index < prevScreen.components.length) {
                  const sameTypeAtIndex = prevScreen.components.filter(c => c.type === child.type);
                  if (sameTypeAtIndex.length > 0) {
                    const indexInType = layoutChildren.filter(c => c.type === child.type).indexOf(child);
                    if (indexInType >= 0 && indexInType < sameTypeAtIndex.length) {
                      prevComponent = sameTypeAtIndex[indexInType];
                    }
                  }
                }
              }

            switch (child.type) {
                case "TextHeading":
                  type = "text-heading";
                properties = {
                    ...prevComponent?.properties,
                    ...(child.text !== undefined && { text: child.text }),
                    ...(child.visible !== undefined && { visible: child.visible }),
                  };
                  return {
                    id: prevComponent?.id || componentId,
                    type,
                    name: type
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()),
                    properties,
                  };
                case "TextSubheading":
                  type = "sub-heading";
                properties = {
                    ...prevComponent?.properties,
                    ...(child.text !== undefined && { text: child.text }),
                    ...(child.visible !== undefined && { visible: child.visible }),
                  };
                  return {
                    id: prevComponent?.id || componentId,
                    type,
                    name: type
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()),
                    properties,
                  };
                case "TextBody":
                  type = "text-body";
                properties = {
                    ...prevComponent?.properties,
                    ...(child.text !== undefined && { text: child.text }),
                    ...(child.visible !== undefined && { visible: child.visible }),
                    ...(child["font-weight"]!== undefined && { fontWeight: child["font-weight"] }),
                    ...(child.strikethrough !== undefined && { strikethrough: child.strikethrough }),
                    ...(child.markdown !== undefined && { markdown: child.markdown }),
                  };
                  return {
                    id: prevComponent?.id || componentId,
                    type,
                    name: type
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()),
                    properties,
                  };
                case "TextCaption":
                  type = "text-caption";
                properties = {
                    ...prevComponent?.properties,
                    ...(child.text !== undefined && { text: child.text }),
                    ...(child.visible !== undefined && { visible: child.visible }),
                    ...(child["font-weight"] !== undefined && { fontWeight: child["font-weight"] }),
                    ...(child.strikethrough !== undefined && { strikethrough: child.strikethrough }),
                    ...(child.markdown !== undefined && { markdown: child.markdown }),
                  };
                  return {
                    id: prevComponent?.id || componentId,
                    type,
                    name: type
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()),
                    properties,
                  };
                case "TextInput":
                  type = "text-input";
                properties = {
                    ...prevComponent?.properties,
                    ...(child.label !== undefined && { label: child.label }),
                    ...(child.name !== undefined && { outputVariable: child.name }),
                    ...(child.required !== undefined && { required: child.required }),
                    ...(child['input-type'] !== undefined && { inputType: child['input-type'] }),
                    ...(child['init-value'] !== undefined && { initValue: child["init-value"] }),
                    ...(child["helper-text"] !== undefined && {  helperText: child["helper-text"] }),
                    visible: child.visible ?? true,
                    // "min-chars":
                    //   child['min-chars'] !== undefined
                    //     ? Number(child['min-chars'])
                    //     : 0,
                    // ...(child['min-chars'] !== undefined
                    //   ? {
                    //     "min-chars":
                    //       child['min-chars'] !== undefined
                    //         ? Number(child['min-chars'])
                    //         : undefined
                    //   }
                    //   : {}),
                    // "max-chars":
                    //   child['max-chars'] !== undefined
                    //     ? Number(child['max-chars'])
                    //     : 80,


                    // "max-chars":
                    //   child['max-chars'] !== undefined
                    //     && Number(child['max-chars']),

                    // ...(child['max-chars'] !== undefined && { 'max-chars': Number(child['max-chars']) }),

                    // map JSON "min-chars" → camelCase minChars
                  ...(child["min-chars"] !== undefined && {
                    minChars: Number(child["min-chars"]),
                  }),
                
                  // map JSON "max-chars" → camelCase maxChars
                  ...(child["max-chars"] !== undefined && {
                    maxChars: Number(child["max-chars"]),
                  }),
                  };

                // properties = {
                //   ...prevComponent?.properties,
                
                //   // map JSON "min-chars" → camelCase minChars
                //   ...(child["min-chars"] !== undefined && {
                //     minChars: Number(child["min-chars"]),
                //   }),
                
                //   // map JSON "max-chars" → camelCase maxChars
                //   ...(child["max-chars"] !== undefined && {
                //     maxChars: Number(child["max-chars"]),
                //   }),
                
                //   label: child.label ?? prevComponent?.properties?.label,
                //   outputVariable: child.name ?? prevComponent?.properties?.outputVariable,
                //   required:
                //     child.required !== undefined
                //       ? Boolean(child.required)
                //       : prevComponent?.properties?.required,
                //   inputType: child["input-type"] ?? prevComponent?.properties?.inputType,
                //   initValue: child["init-value"] ?? prevComponent?.properties?.initValue,
                //   helperText: child["helper-text"] ?? prevComponent?.properties?.helperText,
                //   visible: child.visible ?? prevComponent?.properties?.visible ?? true,
                // };

                  return {
                    id: prevComponent?.id || componentId,
                    type,
                    name: type
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()),
                    properties,
                  };
                case "TextArea":
                  type = "text-area";
                properties = {
                    ...prevComponent?.properties,
                    ...(child.label !== undefined && { label: child.label }),
                    ...(child.name !== undefined && { outputVariable: child.name }),
                    ...(child.required !== undefined && { required: child.required }),
                    ...(child["init-value"] !== undefined && { initValue: child["init-value"] }),
                    ...(child["helper-text"] !== undefined && {  helperText: child["helper-text"] }),
                    visible: child.visible ?? true,
                    // ...(child['max-length'] !== undefined
                    //   ? { "max-length": Number(child['max-length']) }
                    //   : {}),
                    ...(child["max-length"] !== undefined && {
                      maxLength: Number(child["max-length"]),
                      }),
                    // ...(child.enabled !== undefined
                    //   ? { enabled: child.enabled }
                    //   : {}),
                    ...(child.enabled !== undefined && { enabled: child.enabled }),
                  };
                  return {
                    id: prevComponent?.id || componentId,
                    type,
                    name: type
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()),
                    properties,
                  };
                case "CheckboxGroup":
                  type = "check-box";
                properties = {
                    ...prevComponent?.properties,
                    ...(child.label !== undefined && { label: child.label }),
                    ...(child.description !== undefined && { description: child.description }),
                    ...(child.name !== undefined && { outputVariable: child.name, name: child.name }),
                    ...(options !== undefined && { options: options }),
                    visible: child.visible ?? true,
                    ...(child.required !== undefined && { required: child.required }),
                    ...(child.enabled !== undefined && { enabled: child.enabled }),
                    "min-selected-items":
                    child["min-selected-items"] !== undefined
                      ? Number(child["min-selected-items"])
                      : 0,
                  "max-selected-items":
                    child["max-selected-items"] !== undefined
                      ? Number(child["max-selected-items"])
                      : 0,
                };
                return {
                  id: prevComponent?.id || componentId,
                  type,
                  name: type
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase()),
                  properties,
                };
                  case "RadioButtonsGroup":
                    type = "radio-button";
                properties = {
                        ...prevComponent?.properties,
                        ...(child.label !== undefined && { label: child.label }),
                        ...(child.description !== undefined && { description: child.description }),
                        ...(child.name !== undefined && { outputVariable: child.name, name: child.name }),
                        ...(child.enabled !== undefined && { enabled: child.enabled }),
                        ...(child.required !== undefined && { required: child.required }),
                        visible: child.visible ?? true,
                        ...(child["init-value"] !== undefined && { initValue: child["init-value"] }),
                        ...(options !== undefined && { options: options }),
                };
                return {
                  id: prevComponent?.id || componentId,
                  type,
                  name: type
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase()),
                  properties,
                };
                case "Dropdown":
                  type = "drop-down";
                  const dropdownOptions = child["data-source"] ? JSON.stringify(
                    child["data-source"]?.map((opt: any) => opt.title)
                  ) : undefined;
                properties = {
                    ...prevComponent?.properties,
                    ...(child.label !== undefined && { label: child.label }),
                    ...(child.name !== undefined && { name: child.name, outputVariable: child.name }),
                    ...(dropdownOptions !== undefined && { options: dropdownOptions }),
                    ...(child.enabled !== undefined && { enabled: child.enabled }),
                    visible: child.visible ?? true,
                    ...(child.required !== undefined && { required: child.required }),
                    ...(child.placeholder !== undefined && { placeholder: child.placeholder }),
                };
                return {
                  id: prevComponent?.id || componentId,
                  type,
                  name: type
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase()),
                  properties,
                };
                case "Footer":
                  type = "footer-button";
                properties = {
                    ...prevComponent?.properties,
                    ...(child.label !== undefined && { label: child.label }),
                    ...(child["left-caption"] !== undefined && { leftCaption: child["left-caption"] }),
                    ...(child["center-caption"] !== undefined && { centerCaption: child["center-caption"] }),
                    ...(child["right-caption"] !== undefined && { rightCaption: child["right-caption"] }),
                    ...(child.enabled !== undefined && { enabled: child.enabled }),
                    ...(child["on-click-action"]?.name !== undefined && { onClickAction: child["on-click-action"]?.name }),
                    ...(child["on-click-action"]?.next?.name !== undefined && { screenName: child["on-click-action"]?.next?.name }),
                };
                return {
                  id: prevComponent?.id || componentId,
                  type,
                  name: type
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase()),
                  properties,
                };
                case "EmbeddedLink":
                  type = "embedded-link"
                  properties = {
                    ...prevComponent?.properties,
                    ...(child.text !== undefined && { text: child.text }),
                    visible: child.visible ?? true,
                    ...(child["on-click-action"]?.name !== undefined && { onClickAction: child["on-click-action"]?.name }),
                    ...(child["on-click-action"]?.next?.name !== undefined && { screenName: child["on-click-action"]?.next?.name }),

                    ...(child["on-click-action"]?.url !== undefined && { url: child["on-click-action"]?.url }),

                    // ...(child.url !== undefined && { url: child.url })
                };
                return {
                  id: prevComponent?.id || componentId,
                  type,
                  name: type
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase()),
                  properties,
                };

                case "OptIn":
                  type = "opt-in"
                  properties = {
                    ...prevComponent?.properties,
                    ...(child.label !== undefined && { label: child.label }),
                    // label: child.label || "",
                    ...(child.name !== undefined && { outputVariable: child.name }),
                    // outputVariable: child.name || "",
                    ...(child.required !== undefined && { required: child.required }),
                    // required: child.required || null,
                    visible: child.visible ?? true,
                    ...(child['init-value'] !== undefined && { initValue: child["init-value"] }),
                    // initValue: child.initValue || null,
                    ...(child["on-click-action"]?.name !== undefined && { onClickAction: child["on-click-action"]?.name }),
                    ...(child["on-click-action"]?.next?.name !== undefined && { screenName: child["on-click-action"]?.next?.name }),

                    ...(child["on-click-action"]?.url !== undefined && { url: child["on-click-action"]?.url }),

                    // onClickAction: child["on-click-action"]?.name || "",
                    // screenName: child["on-click-action"]?.next?.name || "",
                    // url: child["url"]?.url || ""
                  };
                  return {
                    id: prevComponent?.id || componentId,
                    type,
                    name: type
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()),
                    properties,
                  };
                case "Image":
                  type = "image";
                  properties = {
                    name: child.name || `image_${Date.now()}`,
                    // Preserve base64Data or restore data URL prefix to src if needed
                    src: child.src || "",
                    base64Data: child.src ? `data:image/jpeg;base64,${child.src}` : "",
                    width: child.width || "",
                    height: child.height || "",
                    scaleType: child['scale-type'] || "contain",
                    altText: child['alt-text'] || "",
                    aspectRatio: child['aspect-ratio'] || 1,
                    visible: child.visible ?? true,
                  };
                  return {
                    id: prevComponent?.id || componentId,
                    type,
                    name: type
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()),
                    properties,
                  };
                case "DocumentPicker":
                  type = "DocumentPicker";
                  properties = {
                    label: child.label || "",
                    description: child.description || "",
                    outputVariable: child.name || "",
                    visible: child.visible ?? true,
                    enabled: child.enabled ?? true,
                    // "allowed-mime-types": component.properties.allowedMimeTypes || [],
                    ...(child["allowed-mime-types"]
                      ? { "allowed-mime-types": child["allowed-mime-types"] }
                      : {}),
                    "min-uploaded-documents":
                      parseInt(child["min-uploaded-documents"]) || 0,
                    "max-uploaded-documents":
                      parseInt(child["max-uploaded-documents"]) || 30,
                    "max-file-size-kb":
                      parseInt(child["max-file-size-kb"]) || 10240,
                  };
                  return {
                    id: prevComponent?.id || componentId,
                    type,
                    name: type
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()),
                    properties,
                  };

                case "PhotoPicker":
                  type = "PhotoPicker";
                  properties = {
                    label: child.label || "",
                    description: child.description || "",
                    outputVariable: child.name || "",
                    photoSource: child["photo-source"] || "camera_gallery",
                    minPhotos: child["min-uploaded-photos"] || "0",
                    maxPhotos: child["max-uploaded-photos"] || "30",
                    maxFileSize:
                      child["max-file-size-kb"] || "10", // Convert back to MB
                    visible: child.visible ?? true,
                    enabled: child.enabled ?? true,
                  };
                  return {
                    id: prevComponent?.id || componentId,
                    type,
                    name: type
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()),
                    properties,
                  };

                case "DatePicker":
                  type = "date-picker";
                  properties = {
                    label: child.label || "",
                    outputVariable: child.name || "",
                    initValue: child['init-value'] || null,
                    visible: child.visible ?? true,
                    enabled: child.enabled ?? true,
                    minDate: child['min-date'] || null,
                    maxDate: child['max-date'] || null,
                    unavailableDates: child['unavailable-dates'] || [],
                    helperText: child['helper-text'] || ""
                  };
                  return {
                    id: prevComponent?.id || componentId,
                    type,
                    name: type
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()),
                    properties,
                  };

                  case "user-details":
                    type = "user-details";
                    properties = {
                      name: child.name || "",
                      email: child.email || "",
                      address: child.address || "",
                      dateOfBirth: child.dateOfBirth || "",
                    };
                    return {
                      id: prevComponent?.id || componentId,
                      type,
                      name: type
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase()),
                      properties,
                    };
                default:
                  return null;
              }


            // Use the stable ID generated at the beginning or preserve original ID
            return {
                id:
                  child.id ||
                  `component_${Date.now()}_${Math.random()
                    .toString(36)
                    .substr(2, 9)}`,
              type,
                name: type
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase()),
                properties,
              };
            })
            .filter((c): c is Component => c !== null),
        };
      });


      // Ensure each component gets an id (existing or generated)
      const screensWithIds = newScreens.map((screen: any) => ({
        ...screen,
        components: screen.components.map((comp: any, idx: number) => ({
          id: comp.id || `component_${screen.id}_${idx}`,
          ...comp,
        })),
      }));
      setScreens(screensWithIds);
      // Sync selectedComponent by matching type and name
      if (selectedComponent && activeScreenIndex < newScreens.length) {
        const comps = newScreens[activeScreenIndex].components;
        const updated = comps.find(c =>
          c.type === selectedComponent.type &&
          (selectedComponent.properties.name
            ? c.properties.name === selectedComponent.properties.name
            : true)
        );
        if (updated) setSelectedComponent(updated);
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error("JSON Syntax Error:", error.message);
      } else {
        console.error("Error parsing JSON:", error);
      }
    }
  };

  const handleAddScreen = () => {
    const newScreen: Screen = {
      id: `SCREEN_${Date.now()}`,
      title: `Screen ${screens.length + 1}`,
      components: [],
    };
    
    setScreens([...screens, newScreen]);
    setActiveScreenIndex(screens.length);
    setSelectedComponent(null);
  };

  const handleScreenChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setActiveScreenIndex(newValue);
    setSelectedComponent(null);
  };

  const generateJson = () => {
    // Create routing model based on screen order
    const routingModel: Record<string, string[]> = {};
    for (let i = 0; i < screens.length - 1; i++) {
      routingModel[screens[i].id] = [screens[i + 1].id];
    }

    return {
      version: "7.0",
      routing_model: routingModel,
      screens: screens.map((screen, index) => {
        const isLastScreen = index === screens.length - 1;
        const nextScreen = !isLastScreen ? screens[index + 1] : null;
        const nextScreenId = nextScreen?.id || "";

        return {
          id: screen.id,
          title: screen.title,
          ...(isLastScreen ? { terminal: true } : {}),
          layout: {
            type: "SingleColumnLayout",
            children: screen.components
              .map((component) => {
                const visible =
                  component.properties?.visible === "false" ||
                    component.properties?.visible === false
                    ? false
                    : true;

                const required =
                component.properties?.required === undefined ? undefined : 
                  component.properties?.required === "false" ||
                  component.properties?.required === false
                    ? false
                    : true;

                const strikethrough =
                  component.properties?.strikethrough === undefined ? undefined :
                    component.properties?.strikethrough === false || component.properties?.strikethrough === "false"
                      ? false
                      : true;

                // const markdown =
                //   component.properties?.markdown === null ? null : component.properties?.markdown === "false" ||
                //     component.properties?.markdown === false
                //     ? false
                //     : true;

                const markdown =
                   component.properties?.markdown === "false" ||
                    component.properties?.markdown === false
                    ? false
                    : true;

                const enabled =
                  component.properties?.enabled === undefined ? undefined : 
                  component.properties?.enabled === "false" ||
                  component.properties?.enabled === false
                    ? false
                    : true;

                const intiValueOptIn = 
                component.properties?.initValue === undefined ? undefined :
                component.properties?.initValue === "false" ||
                component.properties?.initValue === false
                  ? false
                  : true;

              switch (component.type) {
                  case "text-heading":
                  return {
                    type: "TextHeading",
                      text: component.properties.text || "",
                      visible,
                    };
                  case "sub-heading":
                  return {
                    type: "TextSubheading",
                      text: component.properties.text || "",
                      visible
                    };
                  case "text-body":
                    return {
                      type: "TextBody",
                      text: component.properties.text ?? "",
                      visible,
                      ...(component.properties?.fontWeight
                        ? { "font-weight": component.properties.fontWeight }
                        : {}),
                      ...(component.properties?.strikethrough != undefined
                        ? { "strikethrough": strikethrough }
                        : {}),
                      markdown
                    };
                  case "text-caption":
                  return {
                    type: "TextCaption",
                      text: component.properties.text ?? "",
                      visible,
                      ...(component.properties?.fontWeight
                        ? { "font-weight": component.properties.fontWeight }
                        : {}),
                      ...(component.properties?.strikethrough != undefined
                        ? { "strikethrough": strikethrough }
                        : {}),
                      markdown,
                      // color: component.properties.color || '#999999',
                      // fontSize: component.properties.fontSize || '12px'
                    };
                  case "text-input":
                  return {
                    type: "TextInput",
                    label: component.properties.label ?? "",
                      name: component.properties.outputVariable || component.properties.name || "",
                      ...(component.properties?.required !== undefined
                        ? { required }
                        : {}),
                      "input-type": component.properties.inputType || "text",
                      // "init-value": component.properties["init-value"] || component.properties.initValue || "",
                      ...(component.properties?.initValue
                        ? { "init-value": component.properties["init-value"] || component.properties.initValue || "" }
                        : {}),
                      ...(component.properties?.helperText
                        ? { "helper-text": component.properties["helper-text"] || component.properties.helperText || "" }
                        : {}),
                      // "helper-text": component.properties["helper-text"] || component.properties.helperText || "",
                      visible,
                      // "min-chars":
                      //   component.properties.minChars !== undefined
                      //     ? Number(component.properties.minChars)
                      //     : 0,
                      // ...(component.properties?.minChars
                      //   ? {
                      //     "min-chars":
                      //       component.properties.minChars !== undefined
                      //         ? Number(component.properties.minChars)
                      //         : undefined
                      //   }
                      // //   : {}),
                      // "max-chars":
                      //   component.properties.maxChars !== undefined
                      //     ? Number(component.properties.maxChars)
                      //     : 80,
                      "min-chars":
                        component.properties.minChars !== undefined
                        ? Number(component.properties.minChars)
                        : 0,
                      "max-chars":
                        component.properties.maxChars !== undefined
                        ? Number(component.properties.maxChars)
                        : 80,

                    };

                  case "text-area":
                  return {
                    type: "TextArea",
                      name: component.properties.outputVariable || component.properties.name || "",
                      label: component.properties.label ?? "",
                      // "init-value": component.properties["init-value"] || component.properties.initValue || "",

                      ...(component.properties?.initValue 
                        ? { "init-value": component.properties["init-value"] || component.properties.initValue || ""}
                        : {}),
                      ...(component.properties?.helperText 
                        ? { "helper-text": component.properties["helper-text"] || component.properties.helperText || "",}
                        : {}),
                      visible,
                      ...(component.properties?.required !== undefined
                        ? { required }
                        : {}),
                      "max-length":
                        component.properties.maxLength !== undefined
                          ? Number(component.properties.maxLength)
                          : 600,
                      ...(component.properties?.enabled !== undefined
                        ? { enabled }
                        : {}),
                    };
                  case "check-box":
                  return {
                    type: "CheckboxGroup",
                      description: component.properties.description || "",
                      name: component.properties.outputVariable || "",
                      label: component.properties.label || "",
                      required,
                      visible,
                      enabled,
                      "init-value": component.properties.initValue || "",
                      "min-selected-items":
                        parseInt(component.properties.minSelectedItems) || 0,
                      "max-selected-items":
                        parseInt(component.properties.maxSelectedItems) || 0,
                      // Use component-specific data-source instead of global CheckBoxOptions
                      "data-source": component.properties["data-source"] || [],
                    };
                  case "embedded-link":
                    return {
                      type: "EmbeddedLink",
                      text: component.properties?.text ?? "",
                      visible,
                      "on-click-action": component.properties?.onClickAction === "navigate" ? {
                        name: "navigate",
                        next: {
                          type: "screen",
                          name: component.properties?.screenName || ""
                        }
                      } : component.properties?.onClickAction === "open_url" ? {
                        name: component.properties?.onClickAction ||"open_url",
                        url: component.properties?.url ??""
                      } : component.properties?.onClickAction === "data_exchange" ? {
                        name:
                          component.properties?.onClickAction ||
                          "data_exchange",
                      } : "",
                    };
                  case "radio-button":
                  return {
                    type: "RadioButtonsGroup",
                      label: component.properties.label || "",
                      description: component.properties.description || "",
                      name: component.properties.outputVariable || "",
                      // enabled,
                      // required,
                      ...(component.properties?.required
                        ? { required }
                        : {}),
                      visible,
                      "init-value": component.properties.initValue || "",
                      // Use component-specific data-source instead of global options
                      "data-source": component.properties["data-source"] || []
                    };
                  case "drop-down":
                    return {
                      type: "Dropdown",
                      name: component.properties.outputVariable || "",
                      label: component.properties.label || "",
                      required,
                      visible,
                      enabled,
                      placeholder:
                        component.properties.placeholder || "Select an option",
                      // Use component-specific data-source
                      "data-source": component.properties["data-source"] || []
                    };
                  case "footer-button":
                  return {
                    type: "Footer",
                      label: component.properties?.label ?? "",
                      ...(component.properties?.leftCaption
                        ? { "left-caption": component.properties["left-caption"] || component.properties.leftCaption || "" }
                        : {}),
                      ...(component.properties?.centerCaption
                        ? {
                          "center-caption": 
                          component.properties["center-caption"] ||
                          component.properties.centerCaption || ""
                        }
                        : {}),
                      ...(component.properties?.rightCaption
                        ? { "right-caption": 
                          component.properties["right-caption"] ||
                          component.properties.rightCaption || ""}
                        : {}),
                      ...(component.properties?.enabled !== undefined
                        ? { "enabled": enabled }
                        : {}),
                      "on-click-action":
                        component.properties?.onClickAction === "navigate"
                          ? {
                            name: "navigate",
                            next: {
                            type: "screen",
                              name: component.properties?.screenName || "",
                            },
                          }
                          : component.properties?.onClickAction === "complete" ? {
                            name:
                              component.properties?.onClickAction ||
                              "complete",
                          } : component.properties?.onClickAction === "data_exchange" ? {
                            name:
                              component.properties?.onClickAction ||
                              "data_exchange",
                          } : "",
                    };
                  case "image":
                    // Use base64Data if available, otherwise use src
                    let rawSrc = component.properties.base64Data || component.properties.src || "";
                    
                    // If rawSrc starts with data:image prefix, remove it for JSON output
                    const imageSrc = rawSrc.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

                    return {
                      type: "Image",
                      src: imageSrc,
                      ...(component.properties?.width
                        ? { "width": parseInt(component.properties.width) }
                        : {}),
                      ...(component.properties?.height
                        ? { "height": parseInt(component.properties.height) }
                        : {}),
                      "aspect-ratio": parseFloat(component.properties.aspectRatio) || 1,
                      "scale-type": component.properties.scaleType || "contain",
                      "alt-text": component.properties.altText || "",
                      visible: component.properties.visible === false ? false : true,
                    };

                  case "PhotoPicker":
                    return {
                      type: "PhotoPicker",
                      label: component.properties.label || "",
                      name: component.properties.outputVariable || "",
                      // description: component.properties.description || "",
                      ...(component.properties?.description
                        ? { "description": component.properties.description }
                        : {}),
                      // required: component.properties.required || false,
                      // accept: component.properties.accept || 'image/*',
                      visible,
                      enabled,
                      // 'output-variable': component.properties.outputVariable || '',
                      "photo-source":
                        component.properties.photoSource || "camera_gallery",
                      "min-uploaded-photos":
                        parseInt(component.properties.minPhotos) || 0,
                      "max-uploaded-photos":
                        parseInt(component.properties.maxPhotos) || 30,
                      "max-file-size-kb":
                        parseInt(component.properties.maxFileSize) * 1024 ||
                        10240,
                    };


                  // case "DocumentPicker":
                //   return {
                  //     type: "DocumentPicker",
                  //     label: component.properties.label || "",
                  //     name: "document_picker",
                  //     description: component.properties.description || "",
                  //     visible,
                  //     enabled,
                  //     "allowed-mime-types": Array.isArray(
                  //       component.properties.allowedMimeTypes
                  //     )
                  //       ? component.properties.allowedMimeTypes
                  //       : ["image/jpeg", "application/pdf"],
                  //     "min-uploaded-documents":
                  //       parseInt(component.properties.minPhotos) || 1,
                  //     "max-uploaded-documents":
                  //       parseInt(component.properties.maxPhotos) || 1,
                  //     "max-file-size-kb":
                  //       parseInt(component.properties.maxFileSize) * 1024 ||
                  //       10240,
                  //   };

                  case "DocumentPicker":
                  return {
                      type: "DocumentPicker",
                      label: component.properties.label || "",
                      name: component.properties.outputVariable || "",
                      ...(component.properties?.description
                        ? { "description": component.properties.description }
                        : {}),
                      visible,
                      enabled,
                      // "allowed-mime-types": component.properties.allowedMimeTypes || [],
                      ...(component.properties?.allowedMimeTypes
                        ? { "allowed-mime-types": component.properties.allowedMimeTypes }
                        : {}),
                      "min-uploaded-documents": parseInt(component.properties.minDocuments) || 0,
                      "max-uploaded-documents": parseInt(component.properties.maxDocuments) || 30,
                      "max-file-size-kb":
                        parseInt(component.properties.maxFileSize) * 1024 || 10240,
                    };



                  case "if-else":
                  return {
                      type: "If-Else",
                      "condition-name":
                        component.properties.conditionName || "",
                      condition: {
                        compare: component.properties.compareToVariable || "",
                        operator: component.properties.condition1 || "",
                        value: component.properties.compareWithValue || "",
                      },
                      success: component.properties.success || true,
                      failure: component.properties.failure || false,
                    };
                  case "switch":
                    return {
                      type: "Switch",
                      "switch-on": component.properties.switchOn || "",
                      "compare-to-variable":
                        component.properties.compareToVariable || "",
                      cases: component.properties.cases || ["default"],
                    };
                  case "opt-in":
                    // const optInJson = {
                    //   type: "OptIn",
                    //   name: component.properties.outputVariable || "",
                    //   label: component.properties?.label || "",
                    //   ...(component.properties?.required
                    //     ? { "required": required }
                    //     : {}),
                    //   visible,
                    //   ...(component.properties?.initValue
                    //     ? { "init-value": intiValueOptIn }
                    //     : {}),
                    //   // "init-value": component.properties?.initValue === "true"
                    // };

                    // // Add on-click-action if it's not none
                    // if (component.properties?.onClick && component.properties.onClick !== "none") {
                    //   if (component.properties.onClick === "navigate") {
                    //     optInJson["on-click-action"] = {
                    //       name: "navigate",
                    //       next: {
                    //         type: "screen",
                    //         name: component.properties?.screenName || ""
                    //       },
                    //       payload: {}
                    //     };
                    //   } else if (component.properties.onClick === "open_url") {
                    //     optInJson["on-click-action"] = {
                    //       name: "open_url",
                    //       url: component.properties?.url || "",
                    //       payload: {}
                    //     };
                    //   } else if (component.properties.onClick === "data_exchange") {
                    //     optInJson["on-click-action"] = {
                    //       name: "data_exchange",
                    //       payload: {}
                    //     };
                    //   }
                    // }

                    // // // Add select/unselect actions
                    // // optInJson["on-select-action"] = {
                    // //   name: "update_data",
                    // //   payload: {}
                    // // };
                    // // optInJson["on-unselect-action"] = {
                    // //   name: "update_data",
                    // //   payload: {}
                    // // };

                    // return optInJson;
                    
                    return {
                      type: "OptIn",
                      name: component.properties.outputVariable || component.properties.name || "",
                      label: component.properties?.label ?? "",
                      ...(component.properties?.required !== undefined
                        ? { required }
                        : {}),
                      visible,
                      ...(component.properties?.initValue !== undefined
                        ? { "init-value": intiValueOptIn }
                        : {}),
                      // "init-value": component.properties?.initValue === "true"
                      "on-click-action": component.properties?.onClickAction === "navigate" ? {
                        name: "navigate",
                        next: {
                          type: "screen",
                          name: component.properties?.screenName || ""
                        }
                      } : component.properties?.onClickAction === "open_url" ? {
                        name: component.properties?.onClickAction ||"open_url",
                        url: component.properties?.url ??""
                      } : component.properties?.onClickAction === "data_exchange" ? {
                        name:
                          component.properties?.onClickAction ||
                          "data_exchange",
                      } : "",
                    };

                    // // Add on-click-action if it's not none
                    // if (component.properties?.onClick && component.properties.onClick !== "none") {
                    //   if (component.properties.onClick === "navigate") {
                    //     optInJson["on-click-action"] = {
                    //       name: "navigate",
                    //       next: {
                    //         type: "screen",
                    //         name: component.properties?.screenName || ""
                    //       },
                    //       payload: {}
                    //     };
                    //   } else if (component.properties.onClick === "open_url") {
                    //     optInJson["on-click-action"] = {
                    //       name: "open_url",
                    //       url: component.properties?.url || "",
                    //       payload: {}
                    //     };
                    //   } else if (component.properties.onClick === "data_exchange") {
                    //     optInJson["on-click-action"] = {
                    //       name: "data_exchange",
                    //       payload: {}
                    //     };
                    //   }
                    // }
                      
                    // // Add select/unselect actions
                    // optInJson["on-select-action"] = {
                    //   name: "update_data",
                    //   payload: {}
                    // };
                    // optInJson["on-unselect-action"] = {
                    //   name: "update_data",
                    //   payload: {}
                    // };

                  case "date-picker":
                    return {
                      type: "DatePicker",
                      label: component.properties.label || "",
                      name: component.properties.outputVariable || "",
                      visible,
                      enabled,
                      ...(component.properties?.minDate
                        ? { "min-date": component.properties.minDate }
                        : {}),
                      ...(component.properties?.initValue
                        ? { "init-value": component.properties.initValue }
                        : {}),
                      ...(component.properties?.maxDate
                        ? { "max-date": component.properties.maxDate }
                        : {}),
                      "unavailable-dates": component.properties.unavailableDates || [],
                      "helper-text": component.properties["helper-text"] || component.properties.helperText || "",
                    };

                  case "user-details":
                    return {
                      type: "UserDetails",
                      fields: [
                        {
                          type: "TextInput",
                          label: "Name",
                          name: "name",
                          required: true,
                        },
                        {
                          type: "TextInput",
                          label: "Email",
                          name: "email",
                          required: true,
                        },
                        {
                          type: "TextArea",
                          label: "Address",
                          name: "address",
                        },
                        {
                          type: "DatePicker",
                          label: "Date Of Birth",
                          name: "dateOfBirth",
                        },
                      ],
                    };
                  default:
                    return null;
                }
              })
              .filter(Boolean),
          },
        };
      }),
    };
  };

  const handleMetaGenerate = (metaJson: any) => {
    console.log("Meta JSON generated:", metaJson);
  };



  const validateScreenName = (name: string) => {
    if (!name) {
      setScreenNameError("Screen name is required");
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      setScreenNameError("Screen name can only contain alphabets and spaces");
      return false;
    }
    setScreenNameError("");
    return true;
  };

  const validateScreenId = (id: string) => {
    if (id && !/^[a-zA-Z_]+$/.test(id)) {
      setScreenIdError("Screen ID can only contain alphabets and underscores");
      return false;
    }
    if (id && screens.some((screen) => screen.id === id)) {
      setScreenIdError("Screen ID must be unique");
      return false;
    }
    setScreenIdError("");
    return true;
  };

  const handleCreateScreen = () => {
    const isNameValid = validateScreenName(newScreenName);
    const isIdValid = validateScreenId(newScreenId);

    if (isNameValid && isIdValid) {
      const screenId =
        newScreenId || newScreenName.toUpperCase().replace(/\s+/g, "_");
      
      if (screens.some((screen) => screen.id === screenId)) {
        setScreenIdError("Screen ID must be unique");
        return;
      }

      const newScreen: Screen = {
        id: screenId,
        title: newScreenName,
        components: [],
      };
      
      setScreens([...screens, newScreen]);
      setActiveScreenIndex(screens.length);
      setSelectedComponent(null);
      handleCloseDialog();
    }
  };

  const handleOpenDialog = () => {
    setIsCreateDialogOpen(true);
    setNewScreenName("");
    setNewScreenId("");
    setScreenNameError("");
    setScreenIdError("");
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setNewScreenName("");
    setNewScreenId("");
    setScreenNameError("");
    setScreenIdError("");
  };

  const handleScreenMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedScreenIndex(index);
  };

  const handleScreenMenuClose = () => {
    setAnchorEl(null);
    setSelectedScreenIndex(null);
  };

  const handleEditScreen = () => {
    if (selectedScreenIndex !== null) {
      const screen = screens[selectedScreenIndex];
      setSelectedScreenForEdit({ title: screen.title, id: screen.id });
      setScreenDialogMode("edit");
      setIsScreenDialogOpen(true);
    }
    handleScreenMenuClose();
  };

  const handleDeleteScreen = () => {
    if (selectedScreenIndex !== null && screens.length > 1) {
      const updatedScreens = screens.filter(
        (_, index) => index !== selectedScreenIndex
      );
      setScreens(updatedScreens);
      if (activeScreenIndex >= updatedScreens.length) {
        setActiveScreenIndex(updatedScreens.length - 1);
      }
    }
    handleScreenMenuClose();
  };

  const handleOpenCreateDialog = () => {
    setScreenDialogMode("create");
    setSelectedScreenForEdit(null);
    setIsScreenDialogOpen(true);
  };

  const handleScreenDialogClose = () => {
    setIsScreenDialogOpen(false);
    setSelectedScreenForEdit(null);
  };

  const handleScreenSubmit = (screenName: string, screenId: string) => {
    if (screenDialogMode === "create") {
      const newScreen: Screen = {
        id: screenId,
        title: screenName,
        components: [],
      };
      setScreens([...screens, newScreen]);
      setActiveScreenIndex(screens.length);
    } else if (screenDialogMode === "edit" && selectedScreenIndex !== null) {
      const updatedScreens = [...screens];
      updatedScreens[selectedScreenIndex] = {
        ...updatedScreens[selectedScreenIndex],
        id: screenId,
        title: screenName,
      };
      setScreens(updatedScreens);
    }
  };



  return (
        <DragDropContext onDragEnd={handleDragEnd}>
          <AppContainer>
        <SidebarContainer>
          <Sidebar onAddComponent={handleAddComponent} />
        </SidebarContainer>
        
        <MainContent>
          <BuilderContainer isPreviewVisible={showPreview}>
            <ButtonGroupContainer>
              <StyledButton
                variant="outlined"
                size="small"
                onClick={() => setShowPreview(!showPreview)}
                startIcon={
                  showPreview ? <VisibilityOffIcon /> : <VisibilityIcon />
                }
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </StyledButton>
            </ButtonGroupContainer>
            
            <ScreenTabsContainer>
              <Tabs 
                value={activeScreenIndex} 
                onChange={handleScreenChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                {screens.map((screen, index) => (
                  <ScreenTab 
                    key={screen.id} 
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ScreenTitle>{screen.title}</ScreenTitle>
                        <Box
                          component="div"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScreenMenuOpen(e, index);
                          }}
                          sx={{ ml: 1, cursor: "pointer" }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </Box>
                      </Box>
                    }
                  />
                ))}
              </Tabs>
              <AddScreenButton onClick={handleOpenCreateDialog} size="small">
                <AddIcon />
              </AddScreenButton>
            </ScreenTabsContainer>
            
            <Builder
              components={screens[activeScreenIndex].components}
              selectedComponent={selectedComponent}
              onComponentSelect={handleComponentSelect}
              onPropertyChange={handlePropertyChange}
              onDeleteComponent={handleDeleteComponent}
              onDragEnd={handleDragEnd}
              onAddComponent={(type: string) => handleAddComponent(type)}
              screens={screens}
            />
          </BuilderContainer>

          <JsonEditorContainer>
            <ButtonGroupContainer>
              <StyledButton
                variant="outlined"
                size="small"
                onClick={openSettings}
                startIcon={<SettingsIcon />}
                sx={{ mr: 1 }}
              >
                Settings
              </StyledButton>

              <StyledButton
                variant="contained"
                size="small"
                
                startIcon={<SaveIcon />}
                sx={{ mr: 2 }}
              >
                Save
              </StyledButton>

              <StyledButton
                variant="outlined"
                size="small"
                onClick={handleCopyJson}
                startIcon={<ContentCopyIcon />}
              >
                Copy JSON
              </StyledButton>
            </ButtonGroupContainer>

            <MetaJsonGenerator
              jsonInput={editValue}
              onJsonChange={handleJsonChange}
              onMetaGenerate={handleMetaGenerate}
            />
          </JsonEditorContainer>

          <SettingsDialog 
            open={settingsOpen} 
            onClose={closeSettings}
            screens={screens} 
            activeScreenIndex={activeScreenIndex}
            activeScreenId={screens[activeScreenIndex].id}
          />
          <PreviewContainer isVisible={showPreview}>
            <Simulator
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
