import React from "react";
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem, Autocomplete, Checkbox } from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";
import AllowedMimeTypes from "../AllowedMimeTypes";
import { StyledPopper } from "../PropertiesFormStyles";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function DocumentPropertyForm({
  component, onPropertyChange: handleChange
}: Pick<FieldRendererProps, "component"|"onPropertyChange">) {

  const text = component.properties?.label || "";
  const maxChars = 80;
  const isOverLimit = text.length > maxChars;

  const descriptionText = component.properties?.description || "";
  const descriptionMaxChars = 300;
  const isDescriptionOverLimit = descriptionText.length > descriptionMaxChars;

  return (
    <Stack spacing={2}>
  <TextField
    label="Label"
    required
    fullWidth
    value={component.properties?.label || ""}
    onChange={(e) => handleChange("label", e.target.value)}
    size="small"
      error={isOverLimit}
      helperText={`${text.length}/${maxChars} characters`}
      FormHelperTextProps={{
        sx: {
          color: isOverLimit ? 'red' : 'text.secondary',
          fontWeight: isOverLimit ? 600 : 400,
        },
      }}
  />
  <TextField
    label="Description (Optional)"
    fullWidth
    value={component.properties?.description || ""}
    onChange={(e) => handleChange("description", e.target.value)}
    size="small"
    error={isDescriptionOverLimit}
    helperText={`${descriptionText.length}/${descriptionMaxChars} characters`}
    FormHelperTextProps={{
      sx: {
        color: isDescriptionOverLimit ? 'red' : 'text.secondary',
        fontWeight: isDescriptionOverLimit ? 600 : 400,
      },
    }}
  />
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
    fullWidth
    size="small"
    options={AllowedMimeTypes}
    disableCloseOnSelect
    value={
      AllowedMimeTypes.filter((film) =>
        component.properties?.allowedMimeTypes?.includes(film.title)
      ) || []
    }
    onChange={(event, newValue) => {
      const selectedTitles = newValue.map((item) => item.title);
      handleChange("allowedMimeTypes", selectedTitles);
    }}
    getOptionLabel={(option) => option.title}
    PopperComponent={StyledPopper}
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
    label="Minimum Documents (Optional)"
    type="number"
    fullWidth
    value={component.properties?.minDocuments || "0"}
    onChange={(e) => handleChange("minDocuments", e.target.value)}
    size="small"
  />
  <TextField
    label="Maximum Documents (Optional)"
    required
    type="number"
    fullWidth
    value={component.properties?.maxDocuments || "30"}
    onChange={(e) => handleChange("maxDocuments", e.target.value)}
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
}
