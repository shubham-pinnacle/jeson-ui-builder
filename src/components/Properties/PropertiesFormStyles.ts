import { styled } from "@mui/material/styles";
import { Box, Paper,ListItem} from "@mui/material";
import Popper from '@mui/material/Popper';

export const StyledPopper = styled(Popper)(({ theme }) => ({
    '& .MuiAutocomplete-listbox': {
      maxHeight: '350px',
      overflowY: 'auto',
      overflowX: 'auto',
      scrollbarWidth: 'none', // Firefox
      '&::-webkit-scrollbar': {
        display: 'none', // Chrome, Safari, Edge
      },
    },
  }));
  
  
  export const PropertyOptions = [
      { title: "id" },
      { title: "description" },
      { title: "metadata" },
    ];

export const PropertiesPanel = styled(Paper)(({ theme }) => ({
    width: 300,
    height: "100%",
    borderLeft: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(3),
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    // Custom scrollbar styling for WebKit browsers
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#ffffff", // white track background
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "lightgrey", // light grey scrollbar thumb
      borderRadius: "4px",
    },
    // Firefox scrollbar styling
    scrollbarWidth: "thin",
    scrollbarColor: "lightgrey #ffffff",
  }));
  
export const Header = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  }));
  
export const FormSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    "&:last-child": {
      marginBottom: 0,
    },
  }));
  
export const OptionItem = styled(ListItem)(({ theme }) => ({
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
  }));