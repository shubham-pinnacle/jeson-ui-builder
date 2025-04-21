import React from "react";
import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Checkbox,
  Box,
  Typography,
  Button,
  List,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { FaTimes } from "react-icons/fa";
import { FieldRendererProps } from "./FieldRendererProps";
import { BiImageAlt } from "react-icons/bi"; 

export default function RadioFields(props: FieldRendererProps) {
  const {
    component,
    onPropertyChange: h,
    selectedOptions,
    setSelectedOptions,
    fieldValues,
    handleFieldChange,       // now defined
    handleOptionAdd,
    handleOptionDelete,
  } = props;

  const handleChange = (prop: string, value: any) => h(prop, value);

  // normalize options to an array
  const rawOptions = component.properties?.options;
  const optionsArray: any[] = Array.isArray(rawOptions)
    ? rawOptions
    : typeof rawOptions === "string"
    ? (() => {
        try {
          const p = JSON.parse(rawOptions);
          return Array.isArray(p) ? p : [];
        } catch {
          return [];
        }
      })()
    : [];

  const initValue = optionsArray.map(opt =>
    typeof opt === "object" ? opt.title : opt
  );

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
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
            label="Properties (optional)"
            
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
            placeholder="Title"
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
}
