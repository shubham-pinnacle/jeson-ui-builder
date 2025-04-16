import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Switch,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
  Button,
  Divider,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  useTheme,
  useMediaQuery,
  FormHelperText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaTimes } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Component } from "../types";
import { BiImageAlt } from "react-icons/bi";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { parseISO } from "date-fns";
import { useDispatch, useSelector } from 'react-redux';
import { updateOption } from '../slices/optionSlice';
import { RootState } from '../store';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const top100Films = [
  { title: "application/gzip" },
  { title: "application/msword" },
  { title: "application/pdf" },
  { title: "application/vnd.ms-powerpoint" },
  { title: "application/vnd.oasis.opendocument.presentation" },
  { title: "application/vnd.oasis.opendocument.spreadsheet" },
  { title: "application/vnd.oasis.opendocument.text" },
  { title: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
  { title: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  { title: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  { title: "application/x-7z-compressed" },
  { title: "application/zip" },
  { title: "image/avif" },
  { title: "image/gif" },
  { title: "image/heic" },
  { title: "image/heif" },
  { title: "image/jpeg" },
  { title: "image/png" },
  { title: "image/tiff" },
  { title: "image/webp" },
  { title: "text/plain" },
  { title: "video/mp4" },
  { title: "video/mpeg" }
];

const PropertyOptions = [
  { title: "id" },
  { title: "description" },
  { title: "metadata" },
];

const PropertiesPanel = styled(Paper)(({ theme }) => ({
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

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "&:last-child": {
    marginBottom: 0,
  },
}));

const OptionItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
}));

interface PropertiesFormProps {
  component: Component;
  onPropertyChange: (componentId: string, property: string, value: any) => void;
  screens: { id: string; title: string }[];
  onClose: () => void;
}

const PropertiesForm: React.FC<PropertiesFormProps> = ({
  component,
  onPropertyChange,
  screens,
  onClose,
}) => {

  const [selectedOptions, setSelectedOptions] = useState<{ title: string }[]>([]);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});

  const handleFieldChange = (key, value) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleChange = (property: string, value: any) => {
    onPropertyChange(component.id, property, value);
  };

  type Option = {
    id: any;
    title: any;
    description: string;
    metadata: string;
  };

  const [arr, setArr] = useState<Option[]>([]);

  const initValue = arr.map((option) => option.title);

  useEffect(() => {console.log("initValue", initValue);
    console.log("arr", arr);
  },[initValue,arr]);

  const dispatch = useDispatch();
 

 

  const handleOptionAdd = (field: string) => {
    const newOptionObj: any = {};

    // Generate a unique ID using timestamp
    newOptionObj.id = `option_${Date.now()}`;
    // Use the input value for title
    newOptionObj.title = component.properties?.newOption || "";

    selectedOptions.forEach(option => {
      if (option.title !== "id" && fieldValues[option.title]) {
        newOptionObj[option.title] = fieldValues[option.title];
      }
    });


    
    setArr(prevArr => [
      ...prevArr,
      {
        id: newOptionObj.id,
        title: newOptionObj.title,
        ...(newOptionObj.description && { description: newOptionObj.description }),
        ...(newOptionObj.metadata && { metadata: newOptionObj.metadata }),
      }
    ])

    dispatch(updateOption({
      id: newOptionObj.id,
      title: newOptionObj.title,
      ...(newOptionObj.description && { description: newOptionObj.description }),
      ...(newOptionObj.metadata && { metadata: newOptionObj.metadata }),
    }));
    

    console.log("New option being added:", {
      id: newOptionObj.id,
      title: newOptionObj.title,
      description: newOptionObj.description || "Not provided",
      metadata: newOptionObj.metadata || "Not provided"
    });
    console.log("Full option object:", newOptionObj);

    if (newOptionObj.id) {
      const currentDataSource = Array.isArray(component.properties?.["data-source"])
        ? [...component.properties["data-source"]]
        : [];

      console.log("Existing options before adding new one:", currentDataSource);

      const updatedDataSource = [
        ...currentDataSource,
        newOptionObj
      ];

      console.log("Updated data-source array (old + new):", updatedDataSource);
      console.log("Total options count:", updatedDataSource.length);

      console.log("All options with key fields:");
      updatedDataSource.forEach((option, index) => {
        console.log(`Option ${index + 1}:`, {
          id: option.id,
          title: option.title,
          description: option.description || "Not provided",
          metadata: option.metadata || "Not provided"
        });
      });

      handleChange("data-source", updatedDataSource);

      handleChange("newOption", "");
      setFieldValues({});
    }
  };

  const handleOptionDelete = (field: string, optionToDelete: string | any) => {
    if (field === "data-source") {
      const currentDataSource = Array.isArray(component.properties?.[field])
        ? component.properties[field]
        : [];

      const updatedDataSource = currentDataSource.filter(
        (option: any) => option.id !== optionToDelete.id
      );

      handleChange(field, updatedDataSource);
    } else {
      const currentOptions = Array.isArray(component.properties?.[field])
        ? component.properties[field]
        : [];
      const updatedOptions = currentOptions.filter(
        (option: string) => option !== optionToDelete
      );
      handleChange(field, updatedOptions);
    }
  };

  const renderDatePicker = () => {
    const unavailableDates = component.properties?.unavailableDates || [];
    const selectedDate = component.properties?.selectedDate ? parseISO(component.properties.selectedDate) : null;

    return (
      <FormControl fullWidth size="small">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newValue) => {
              handleChange('selectedDate', newValue ? format(newValue, 'yyyy-MM-dd') : null);
            }}
            shouldDisableDate={(date) => {
              return unavailableDates.includes(format(date, 'yyyy-MM-dd'));
            }}
            slotProps={{
              textField: { size: 'small' },
              day: {
                sx: {
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
        <FormHelperText>Select a date (unavailable dates are disabled)</FormHelperText>
      </FormControl>
    );
  };

  const renderTextFields = () => (
    <Stack spacing={2}>
      <TextField
        label={`Text ${
          component.type === "text-heading"
            ? "Heading"
            : component.type === "text-body"
            ? "Body"
            : "Caption"
        }`}
        required
        fullWidth
        value={component.properties?.text || ""}
        onChange={(e) => handleChange("text", e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible || true}
          onChange={(e) => handleChange('visible', e.target.value)}
          label="Visible (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Font Weight (Optional)</InputLabel>
        <Select
          value={component.properties?.fontWeight || "normal"}
          onChange={(e) => handleChange("fontWeight", e.target.value)}
          label="Font Weight (Optional)"
        >
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="bold">Bold</MenuItem>
          <MenuItem value="italic">Italic</MenuItem>
          <MenuItem value="bold_italic">Bold Italic</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Strike Through (Optional)</InputLabel>
        <Select
          value={component.properties?.strikethrough || "false"}
          onChange={(e) => handleChange("strikethrough", e.target.value)}
          label="Strike Through (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Markdown (Optional)</InputLabel>
        <Select
          value={component.properties?.markdown || "false"}
          onChange={(e) => handleChange("markdown", e.target.value)}
          label="Markdown (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );

  const renderTextHeading = () => (
    <Stack spacing={2}>
      <TextField
        label="Text-heading"
        required
        fullWidth
        value={component.properties?.text || ""}
        onChange={(e) => handleChange("text", e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible || "true"}
          onChange={(e) => handleChange("visible", e.target.value)}
          label="Visible (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );

  const renderInputFields = () => (
    <Stack spacing={2}>
      <TextField
        label="Label"
        required
        fullWidth
        value={component.properties?.label || ""}
        onChange={(e) => handleChange("label", e.target.value)}
        size="small"
      />
      <TextField
        label="Output Variable"
        required
        fullWidth
        value={component.properties?.outputVariable || ""}
        onChange={(e) => handleChange("outputVariable", e.target.value)}
        size="small"
      />
      <TextField
        label="Init Value (Optional)"
        fullWidth
        value={component.properties?.initValue || ""}
        onChange={(e) => handleChange("initValue", e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Required (Optional)</InputLabel>
        <Select
          value={component.properties?.required || "false"}
          onChange={(e) => handleChange("required", e.target.value)}
          label="Required (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      {component.type === "text-input" && (
        <FormControl fullWidth size="small">
          <InputLabel>Input Type (Optional)</InputLabel>
          <Select
            value={component.properties?.inputType || "text"}
            onChange={(e) => handleChange("inputType", e.target.value)}
            label="Input Type (Optional)"
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="password">Password</MenuItem>
          </Select>
        </FormControl>
      )}
      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible || "true"}
          onChange={(e) => handleChange("visible", e.target.value)}
          label="Visible (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      {component.type === "text-input" ? (
        <>
          <TextField
            label="Min-Chars (Optional)"
            type="number"
            fullWidth
            value={component.properties?.minChars || 0}
            onChange={(e) => handleChange("minChars", e.target.value)}
            size="small"
          />
          <TextField
            label="Max-Chars (Optional)"
            type="number"
            fullWidth
            value={component.properties?.maxChars || 0}
            onChange={(e) => handleChange("maxChars", e.target.value)}
            size="small"
          />
        </>
      ) : (
        <TextField
          label="Max-Length (Optional)"
          type="number"
          fullWidth
          value={component.properties?.maxLength || ""}
          onChange={(e) => handleChange("maxLength", e.target.value)}
          size="small"
        />
      )}
      <TextField
        label="Helper Text (Optional)"
        fullWidth
        value={component.properties?.helperText || ""}
        onChange={(e) => handleChange("helperText", e.target.value)}
        size="small"
      />
    </Stack>
  );

  const renderSelectFields = () => (
    <Stack spacing={2}>
      <TextField
        label="Label"
        required
        fullWidth
        value={component.properties?.label || ""}
        onChange={(e) => handleChange("label", e.target.value)}
        size="small"
      />
      {component.type !== "drop-down" && (
        <TextField
          label="Description (Optional)"
          fullWidth
          value={component.properties?.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          size="small"
        />
      )}

      <TextField
        label="Output Variable"
        required
        fullWidth
        value={component.properties?.outputVariable || ""}
        onChange={(e) => handleChange("outputVariable", e.target.value)}
        size="small"
      />

      <Autocomplete
        multiple
        id="checkboxes-tags-demo"
        options={PropertyOptions}
        disableCloseOnSelect
        getOptionLabel={(option) => option.title}
        onChange={(event, newValue) => {
          setSelectedOptions(newValue);
        }}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.title}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Checkboxes"
            placeholder="Favorites"
            size="small"
          />
        )}
        fullWidth
      />

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Options:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <TextField
            size="small"
            fullWidth
            value={component.properties?.newOption || ""}
            onChange={(e) => handleChange("newOption", e.target.value)}
            placeholder="Add new option"
          />

        </Stack>

        <Box mt={2}>
          {selectedOptions.map((option) => (
            <FormControl fullWidth size="small" key={option.title} sx={{ mb: 2 }}>
              <TextField
                label={`${option.title}`}
                value={fieldValues[option.title] || ""}
                onChange={(e) => handleFieldChange(option.title, e.target.value)}
                size="small"
              />
            </FormControl>
          ))}
        </Box>
          <Button
            variant="outlined"
            onClick={() => handleOptionAdd("options")}
            size="small"
          >
            Add
          </Button>

        <List>
          {Array.isArray(component.properties?.options) &&
            component.properties.options.map((option: string) => (
              <OptionItem key={option}>
                <ListItemText primary={option} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleOptionDelete("options", option)}
                  >
                    <FaTimes />
                  </IconButton>
                </ListItemSecondaryAction>
              </OptionItem>
            ))}
        </List>
      </Box>
      {/* <FormControl fullWidth size="small">
        <InputLabel>Init Value (Optional)</InputLabel>
        <Select
          value={component.properties?.initValue || ""}
          onChange={(e) => handleChange("initValue", e.target.value)}
          label="Init Value (Optional)"
        >
          <MenuItem value="">Select value</MenuItem>
          {Array.isArray(component.properties?.options) &&
            initValue.map((option: string) => (
              <MenuItem key={initValue} value={initValue}>
                {initValue}
              </MenuItem>
            ))}
        </Select>
      </FormControl> */}
      <FormControl fullWidth size="small">
  <InputLabel>Init Value (Optional)</InputLabel>
  <Select
    value={component.properties?.initValue || ""}
    onChange={(e) => handleChange("initValue", e.target.value)}
    label="Init Value (Optional)"
  >
    <MenuItem value="">Select value</MenuItem>
    {Array.isArray(initValue) &&
      initValue.map((option: any) => (
        <MenuItem key={option.id} value={option} >
          {option}
        </MenuItem>
      ))}
  </Select>
</FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>Required (Optional)</InputLabel>
        <Select
          value={component.properties?.required || "false"}
          onChange={(e) => handleChange("required", e.target.value)}
          label="Required (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible || "true"}
          onChange={(e) => handleChange("visible", e.target.value)}
          label="Visible (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>Enabled (Optional)</InputLabel>
        <Select
          value={component.properties?.enabled || "true"}
          onChange={(e) => handleChange("enabled", e.target.value)}
          label="Enabled (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      {component.type === "check-box" && (
        <>
          <TextField
            label="Min-Selected-Items (Optional)"
            type="number"
            fullWidth
            value={component.properties?.minSelectedItems || ""}
            onChange={(e) => handleChange("minSelectedItems", e.target.value)}
            size="small"
          />
          <TextField
            label="Max-Selected-Items (Optional)"
            type="number"
            fullWidth
            value={component.properties?.maxSelectedItems || ""}
            onChange={(e) => handleChange("maxSelectedItems", e.target.value)}
            size="small"
          />
        </>
      )}
    </Stack>
  );

  const renderButtonFields = () => (
    <Stack spacing={2}>
      <TextField
        label="Label"
        required
        fullWidth
        value={component.properties?.buttonText || ""}
        onChange={(e) => handleChange("buttonText", e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Enabled (Optional)</InputLabel>
        <Select
          value={component.properties?.enabled || false}
          onChange={(e) => handleChange("enabled", e.target.value)}
          label="Enabled (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Left Caption"
        fullWidth
        value={component.properties?.leftCaption || ""}
        onChange={(e) => {
          handleChange("leftCaption", e.target.value);
          if (e.target.value && component.properties?.centerCaption) {
            handleChange("centerCaption", "");
          }
        }}
        disabled={!!component.properties?.centerCaption}
        size="small"
      />
      <TextField
        label="Center Caption"
        fullWidth
        value={component.properties?.centerCaption || ""}
        onChange={(e) => {
          handleChange("centerCaption", e.target.value);
          if (e.target.value) {
            handleChange("leftCaption", "");
            handleChange("rightCaption", "");
          }
        }}
        disabled={
          !!component.properties?.leftCaption ||
          !!component.properties?.rightCaption
        }
        size="small"
      />
      <TextField
        label="Right Caption"
        fullWidth
        value={component.properties?.rightCaption || ""}
        onChange={(e) => {
          handleChange("rightCaption", e.target.value);
          if (e.target.value && component.properties?.centerCaption) {
            handleChange("centerCaption", "");
          }
        }}
        disabled={!!component.properties?.centerCaption}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>On Click Action</InputLabel>
        <Select
          value={component.properties?.onClickAction || "complete"}
          onChange={(e) => handleChange("onClickAction", e.target.value)}
          label="On Click Action"
        >
          <MenuItem value="complete">Complete</MenuItem>
          <MenuItem value="navigate">Navigate</MenuItem>
          <MenuItem value="data_exchange">Data Exchange</MenuItem>
        </Select>
      </FormControl>
      {component.properties?.onClickAction === "navigate" && (
        <FormControl fullWidth size="small">
          <InputLabel>Screen Name</InputLabel>
          <Select
            value={component.properties?.screenName || ""}
            onChange={(e) => handleChange("screenName", e.target.value)}
            label="Screen Name"
          >
            {screens.map((screen) => (
              <MenuItem key={screen.id} value={screen.id}>
                {screen.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Stack>
  );

  const renderPhotoFields = () => (
    <Stack spacing={2}>
      <TextField
        label="Label"
        required
        fullWidth
        value={component.properties?.label || ""}
        onChange={(e) => handleChange("label", e.target.value)}
        size="small"
      />
      <TextField
        label="Description (Optional)"
        fullWidth
        value={component.properties?.description || ""}
        onChange={(e) => handleChange("description", e.target.value)}
        size="small"
      />
      <TextField
        label="Output Variable"
        required
        fullWidth
        value={component.properties?.outputVariable || ""}
        onChange={(e) => handleChange("outputVariable", e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Photo Source (Optional)</InputLabel>
        <Select
          value={component.properties?.photoSource || "camera"}
          onChange={(e) => handleChange("photoSource", e.target.value)}
          label="Photo Source (Optional)"
        >
          <MenuItem value="camera_gallery">Camera Gallery</MenuItem>
          <MenuItem value="gallery">Gallery</MenuItem>
          <MenuItem value="camera">Camera</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Minimum Photos (Optional)"
        type="number"
        fullWidth
        value={component.properties?.minPhotos || ""}
        onChange={(e) => handleChange("minPhotos", e.target.value)}
        size="small"
      />
      <TextField
        label="Maximum Photos"
        required
        type="number"
        fullWidth
        value={component.properties?.maxPhotos || ""}
        onChange={(e) => handleChange("maxPhotos", e.target.value)}
        size="small"
      />
      <TextField
        label="Maximum file size in MB"
        type="number"
        fullWidth
        value={component.properties?.maxFileSize || "25"}
        onChange={(e) => handleChange("maxFileSize", e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible || "true"}
          onChange={(e) => handleChange("visible", e.target.value)}
          label="Visible (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Enabled (Optional)</InputLabel>
        <Select
          value={component.properties?.enabled || "true"}
          onChange={(e) => handleChange("enabled", e.target.value)}
          label="Enabled (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );

  const renderDocumentFields = () => (
    <Stack spacing={2}>
      <TextField
        label="Label"
        required
        fullWidth
        value={component.properties?.label || ""}
        onChange={(e) => handleChange("label", e.target.value)}
        size="small"
      />
      <TextField
        label="Description (Optional)"
        fullWidth
        value={component.properties?.description || ""}
        onChange={(e) => handleChange("description", e.target.value)}
        size="small"
      />
      <TextField
        label="Output Variable"
        required
        fullWidth
        value={component.properties?.outputVariable || ""}
        onChange={(e) => handleChange("outputVariable", e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Photo Source (Optional)</InputLabel>
        <Select
          value={component.properties?.photoSource || "camera"}
          onChange={(e) => handleChange("photoSource", e.target.value)}
          label="Photo Source (Optional)"
        >
          <MenuItem value="camera">Camera Gallery</MenuItem>
          <MenuItem value="gallery">Gallery</MenuItem>
          <MenuItem value="camera">Camera</MenuItem>
        </Select>
      </FormControl>

      <Autocomplete
        multiple
        fullWidth
        size="small"
        options={top100Films}
        disableCloseOnSelect
        value={
          top100Films.filter((film) =>
            component.properties?.allowedMimeTypes?.includes(film.title)
          ) || []
        }
        onChange={(event, newValue) => {
          const selectedTitles = newValue.map((item) => item.title);
          handleChange("allowedMimeTypes", selectedTitles); // 
        }}
        getOptionLabel={(option) => option.title}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.title}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Allowed Meme Types (Optional)"
            placeholder="Select allowed types"
            fullWidth
            size="small"
          />
        )}
      />

      <TextField
        label="Minimum Photos (Optional)"
        type="number"
        fullWidth
        value={component.properties?.minPhotos || ""}
        onChange={(e) => handleChange("minPhotos", e.target.value)}
        size="small"
      />
      <TextField
        label="Maximum Photos"
        required
        type="number"
        fullWidth
        value={component.properties?.maxPhotos || ""}
        onChange={(e) => handleChange("maxPhotos", e.target.value)}
        size="small"
      />
      <TextField
        label="Maximum file size in MB"
        type="number"
        fullWidth
        value={component.properties?.maxFileSize || "25"}
        onChange={(e) => handleChange("maxFileSize", e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible || "true"}
          onChange={(e) => handleChange("visible", e.target.value)}
          label="Visible (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Enabled (Optional)</InputLabel>
        <Select
          value={component.properties?.enabled || "true"}
          onChange={(e) => handleChange("enabled", e.target.value)}
          label="Enabled (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );

  const renderImageFields = () => (
    <Stack spacing={2}>
      <Button
        variant="outlined"
        fullWidth
        startIcon={<BiImageAlt />}
        component="label"
        sx={{
          height: "100px",
          border: "2px dashed #ccc",
          "&:hover": {
            border: "2px dashed #2196f3",
          },
        }}
      >
        Upload Image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 5 * 1024 * 1024) {
                alert("File size should not exceed 5MB");
                return;
              }
              const reader = new FileReader();
              reader.onload = (event) => {
                const base64String = event.target?.result as string;
                if (base64String) {
                  handleChange("scaleType", "contain");

                  handleChange("base64Data", base64String.split(",")[1] || "");

                  handleChange("src", base64String);
                }
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </Button>
      {component.properties?.src && (
        <Box
          sx={{
            width: "100%",
            height: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            border: "1px solid #eee",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <img
            src={component.properties.src}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: component.properties.scaleType || "contain",
            }}
          />
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
            }}
            onClick={() => {
              handleChange("src", "");
              handleChange("base64Data", "");
              handleChange("scaleType", "contain");
            }}
          >
            <FaTimes />
          </IconButton>
        </Box>
      )}
      <FormControl fullWidth size="small" required>
        <InputLabel>Scale Type</InputLabel>
        <Select
          value={component.properties?.scaleType || "contain"}
          onChange={(e) => handleChange("scaleType", e.target.value)}
          label="Scale Type *"
        >
          <MenuItem value="contain">Contain</MenuItem>
          <MenuItem value="cover">Cover</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Width (px)"
        fullWidth
        type="number"
        value={component.properties?.width || "200"}
        onChange={(e) => handleChange("width", e.target.value)}
        size="small"
        inputProps={{ min: 0 }}
      />
      <TextField
        label="Height (px)"
        fullWidth
        type="number"
        value={component.properties?.height || "200"}
        onChange={(e) => handleChange("height", e.target.value)}
        size="small"
        inputProps={{ min: 0 }}
      />
      <TextField
        label="Aspect-ratio (Optional) "
        fullWidth
        type="number"
        value={component.properties?.aspectRatio || "1"}
        onChange={(e) => handleChange("aspectRatio", e.target.value)}
        size="small"
      />
      <TextField
        label="Alt Text"
        fullWidth
        value={component.properties?.altText || ""}
        onChange={(e) => handleChange("altText", e.target.value)}
        size="small"
      />
    </Stack>
  );

  const renderIfElseFields = () => (
    <Stack spacing={2}>
      <TextField
        label="Condition Name"
        required
        fullWidth
        value={component.properties?.conditionName || ""}
        onChange={(e) => handleChange("conditionName", e.target.value)}
        size="small"
      />
      <TextField
        label="Compare To Variable"
        required
        fullWidth
        value={component.properties?.compareToVariable || ""}
        onChange={(e) => handleChange("compareToVariable", e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Condition</InputLabel>
        <Select
          value={component.properties?.condition1 || "equals"}
          onChange={(e) => handleChange("condition1", e.target.value)}
          label="Condition"
        >
          <MenuItem value="equals">Equals</MenuItem>
          <MenuItem value="not_equals">Not Equals</MenuItem>
          <MenuItem value="greater_than">Greater Than</MenuItem>
          <MenuItem value="less_than">Less Than</MenuItem>
        </Select>
      </FormControl>

      <OptionsDisplay />
    </Stack>
  );

  const OptionsDisplay = () => {
    const options = useSelector((state: RootState) => state.option.arr);

    return (
      <div>
        <h2>All Options:</h2>
        <ul>
          {options.map((item, index) => (
            <li key={index}>{item.title}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderSwitchFields = () => (
    <Stack spacing={2}>
      <TextField
        label="Switch On"
        required
        fullWidth
        value={component.properties?.switchOn || ""}
        onChange={(e) => handleChange("switchOn", e.target.value)}
        size="small"
      />
      <TextField
        label="Compare To Variable"
        required
        fullWidth
        value={component.properties?.compareToVariable || ""}
        onChange={(e) => handleChange("compareToVariable", e.target.value)}
        size="small"
      />
      <Box>
        <TextField
          label="Add Case"
          fullWidth
          value={component.properties?.newOption || ""}
          onChange={(e) => handleChange("newOption", e.target.value)}
          size="small"
        />
        <Button
          variant="outlined"
          onClick={() => handleOptionAdd("cases")}
          sx={{ mt: 1 }}
          fullWidth
        >
          Add Case
        </Button>
      </Box>
      <List>
        {(component.properties?.cases || []).map((caseValue: string) => (
          <OptionItem key={caseValue}>
            <ListItemText primary={caseValue} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleOptionDelete("cases", caseValue)}
                size="small"
              >
                <FaTimes />
              </IconButton>
            </ListItemSecondaryAction>
          </OptionItem>
        ))}
      </List>
    </Stack>
  );

  const renderUserDetailsFields = () => (
    <Stack spacing={2}>
      <FormControl fullWidth size="small">
        <InputLabel>Required Fields</InputLabel>
        <Select
          multiple
          value={component.properties?.requiredFields || []}
          onChange={(e) => handleChange("requiredFields", e.target.value)}
          label="Required Fields"
          renderValue={(selected) => (selected as string[]).join(", ")}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="address">Address</MenuItem>
          <MenuItem value="dateOfBirth">Date of Birth</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Optional Fields</InputLabel>
        <Select
          multiple
          value={component.properties?.optionalFields || []}
          onChange={(e) => handleChange("optionalFields", e.target.value)}
          label="Optional Fields"
          renderValue={(selected) => (selected as string[]).join(", ")}
        >
          <MenuItem value="phone">Phone</MenuItem>
          <MenuItem value="gender">Gender</MenuItem>
          <MenuItem value="occupation">Occupation</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );

  const renderFields = () => {
    switch (component.type) {
      case "text-body":
      case "text-caption":
        return renderTextFields();
      case "text-heading":
      case "sub-heading":
        return renderTextHeading();
      case "rich-text":
      case "text-input":
      case "text-area":
        return renderInputFields();
      case "radio-button":
      case "check-box":
      case "drop-down":
        return renderSelectFields();
      case "footer-button":
      case "embedded-link":
        return renderButtonFields();
      case "opt-in":
        return renderSelectFields();
      case "PhotoPicker":
        return renderPhotoFields();
      case "DocumentPicker":
        return renderDocumentFields();
      case "image":
        return renderImageFields();
      case "date-picker":
        return renderDatePickerFields();
      case "if-else":
        return renderIfElseFields();
      case "switch":
        return renderSwitchFields();
      case "user-details":
        return renderUserDetailsFields();
      default:
        return null;
    }
  };

  const renderDatePickerFields = () => {
    const unavailableDates = (component.properties?.unavailableDates || '').split(',').map(d => d.trim()).filter(d => d);
    const selectedDate = component.properties?.selectedDate ? parseISO(component.properties.selectedDate) : null;

    const DatePickerComponent = useTheme().breakpoints.down('sm') ? MobileDatePicker : DatePicker;

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack spacing={2}>
          <TextField
            label="Label"
            required
            fullWidth
            value={component.properties?.label || ""}
            onChange={(e) => handleChange("label", e.target.value)}
            size="small"
          />
          <TextField
            label="Output Variable"
            required
            fullWidth
            value={component.properties?.outputVariable || ""}
            onChange={(e) => handleChange("outputVariable", e.target.value)}
            size="small"
          />
          <DatePickerComponent
            label="Initial Value"
            value={selectedDate}
            onChange={(newValue) => handleChange("initValue", newValue ? format(newValue, "yyyy-MM-dd") : "")}
            shouldDisableDate={(date) => unavailableDates.includes(format(date, 'yyyy-MM-dd'))}
            slotProps={{
              textField: { 
                fullWidth: true, 
                size: "small"
              },
              day: {
                sx: {
                  '&.Mui-selected': {
                    backgroundColor: '#1976d2 !important',
                    color: '#fff !important'
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: '#1565c0 !important'
                  },
                  '&.MuiPickersDay-today': {
                    borderColor: '#1976d2'
                  }
                }
              }
            }}
          />
          <DatePickerComponent
            label="Min Date"
            value={component.properties?.minDate ? parseISO(component.properties.minDate) : null}
            onChange={(newValue) => handleChange("minDate", newValue ? format(newValue, "yyyy-MM-dd") : "")}
            slotProps={{
              textField: { 
                fullWidth: true, 
                size: "small"
              }
            }}
          />
          <DatePickerComponent
            label="Max Date"
            value={component.properties?.maxDate ? parseISO(component.properties.maxDate) : null}
            onChange={(newValue) => handleChange("maxDate", newValue ? format(newValue, "yyyy-MM-dd") : "")}
            slotProps={{
              textField: { 
                fullWidth: true, 
                size: "small"
              }
            }}
          />
          <DatePickerComponent
            label="Unavailable Dates"
            value={null}
            onChange={(newValue) => {
              if (newValue) {
                const formattedDate = format(newValue, "yyyy-MM-dd");
                const currentDates = (component.properties?.unavailableDates || '').split(',').map(d => d.trim()).filter(d => d);
                if (!currentDates.includes(formattedDate)) {
                  const newDates = [...currentDates, formattedDate].join(', ');
                  handleChange("unavailableDates", newDates);
                }
              }
            }}
            shouldDisableDate={(date) => {
              const currentDates = (component.properties?.unavailableDates || '').split(',').map(d => d.trim()).filter(d => d);
              return currentDates.includes(format(date, 'yyyy-MM-dd'));
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#1976d2' },
                '&:hover fieldset': { borderColor: '#1976d2' },
                '&.Mui-focused fieldset': { borderColor: '#1976d2' }
              },
              '& .MuiInputLabel-root': { color: '#1976d2' }
            }}
            slotProps={{
              textField: { 
                fullWidth: true,
                size: "small",
                value: component.properties?.unavailableDates || "",
                error: false,
                sx: {
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#1976d2 !important' },
                    '&:hover fieldset': { borderColor: '#1976d2 !important' },
                    '&.Mui-focused fieldset': { borderColor: '#1976d2 !important' }
                  }
                }
              },
              day: {
                sx: {
                  '&.Mui-selected': {
                    backgroundColor: '#1976d2 !important',
                    color: '#fff !important'
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: '#1565c0 !important'
                  },
                  '&.MuiPickersDay-today': {
                    borderColor: '#1976d2'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#bbdefb !important',
                    color: '#1976d2 !important'
                  }
                }
              }
            }}
          />
          <FormControl fullWidth size="small">
            <InputLabel>Required</InputLabel>
            <Select
              value={component.properties?.required || "false"}
              onChange={(e) => handleChange("required", e.target.value)}
              label="Required"
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Visible</InputLabel>
            <Select
              value={component.properties?.visible || "true"}
              onChange={(e) => handleChange("visible", e.target.value)}
              label="Visible"
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Helper Text"
            fullWidth
            value={component.properties?.helperText || ""}
            onChange={(e) => handleChange("helperText", e.target.value)}
            size="small"
          />
        </Stack>
      </LocalizationProvider>
    );
  };

  useEffect(() => {
    if (component.type === 'datepicker') {
      const defaultProperties = {
        label: "",
        outputVariable: "",
        initValue: "",
        minDate: "",
        maxDate: "",
        unavailableDates: ""
      };

      if (!component.properties || Object.keys(defaultProperties).some(key => !(key in (component.properties || {})))) {
        handleChange("properties", { 
          ...defaultProperties,
          ...(component.properties || {})
        });
      }
    }
  }, [component.id, component.type]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <PropertiesPanel elevation={0}>
      <Header
        sx={{
          backgroundColor: "rgba(128, 128, 128, 0.2)", // 80% transparency
          padding: "10px",
          borderRadius: 0,
          marginX: "-24px", // adjust based on padding of PropertiesPanel
          marginTop: "-24px",
          marginBottom: "-4px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IoMdInformationCircleOutline size={20} />
          <Typography variant="subtitle1" fontWeight={500}>
            {component.name}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <FaTimes />
        </IconButton>
      </Header>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mt: -0.4,
          marginX: "-11px",
        }}
      >
        <FormControlLabel
          label="Use Dynamic Variable"
          labelPlacement="start"
          control={
            <Switch
              checked={component.properties?.isDynamic === "true"}
              onChange={(e) =>
                handleChange("isDynamic", e.target.checked.toString())
              }
              color="primary"
            />
          }
        />
      </Box>

      <Box sx={{ mt: 0.2 }}>{renderFields()}</Box>
    </PropertiesPanel>
  );
};

export default PropertiesForm;
