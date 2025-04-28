import React from "react";
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem, List, ListItemText, ListItemSecondaryAction, IconButton, Button, Box, Typography, Checkbox, Autocomplete } from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";
import { OptionItem, PropertyOptions } from "../PropertiesFormStyles";
import { FaTimes } from "react-icons/fa";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";


const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function SelectFields(props: FieldRendererProps) {
  const {
    component, onPropertyChange: h,
    selectedOptions, setSelectedOptions,
    fieldValues, setFieldValues,
    handleOptionAdd, handleOptionDelete
  } = props;

  return (
    <Stack spacing={2}>
      <TextField
        label="Label"
        required fullWidth
        value={component.properties?.label || ""}
        onChange={e => h("label", e.target.value)}
        size="small"
      />
      {component.type !== "drop-down" && (
        <TextField
          label="Description"
          fullWidth
          value={component.properties?.description || ""}
          onChange={e => h("description", e.target.value)}
          size="small"
        />
      )}
      <TextField
        label="Output Variable"
        required fullWidth
        value={component.properties?.outputVariable || ""}
        onChange={e => h("outputVariable", e.target.value)}
        size="small"
      />

      {/* property‑selector */}
      {/* <FormControl fullWidth size="small">
        <InputLabel>Property</InputLabel>
        <Select
          value={component.properties?.property || ""}
          onChange={e => h("property", e.target.value)}
          label="Property"
        >
          <MenuItem value="">Select property</MenuItem>
          <MenuItem value="value1">Value 1</MenuItem>
          <MenuItem value="value2">Value 2</MenuItem>
        </Select>
      </FormControl> */}


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
        <Typography variant="subtitle2">Options</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <TextField
            size="small" fullWidth
            value={component.properties?.newOption || ""}
            onChange={e => h("newOption", e.target.value)}
            placeholder="Add new option"
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleOptionAdd("options")}
          >Add</Button>
        </Stack>

        {/* <List>
          {(component.properties?.options || []).map((opt:string) => (
            <OptionItem key={opt}>
              <ListItemText primary={opt} />
              <ListItemSecondaryAction>
                <IconButton edge="end" size="small"
                  onClick={() => handleOptionDelete("options", opt)}
                ><FaTimes/></IconButton>
              </ListItemSecondaryAction>
            </OptionItem>
          ))}
        </List> */}
      </Box>

      {/* <FormControl fullWidth size="small">
        <InputLabel>Init Value</InputLabel>
        <Select
          value={component.properties?.initValue || ""}
          onChange={e => h("initValue", e.target.value)}
          label="Init Value"
        >
          <MenuItem value="">Select value</MenuItem>
          {(component.properties?.options || []).map((opt:string) => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
      </FormControl> */}

      {/* visible/enabled/required */}
      {["required","visible","enabled"].map(p => (
        <FormControl fullWidth size="small" key={p}>
          <InputLabel>{p.charAt(0).toUpperCase()+p.slice(1)}</InputLabel>
          <Select
            value={component.properties?.[p] || "false"}
            onChange={e => h(p, e.target.value)}
            label={p}
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>
      ))}

      {component.type === "check-box" && (
        <Stack spacing={2}>
          <TextField
            label="Min-Selected-Items"
            type="number" fullWidth
            value={component.properties?.minSelectedItems || ""}
            onChange={e => h("minSelectedItems", e.target.value)}
            size="small"
          />
          <TextField
            label="Max-Selected-Items"
            type="number" fullWidth
            value={component.properties?.maxSelectedItems || ""}
            onChange={e => h("maxSelectedItems", e.target.value)}
            size="small"
          />
        </Stack>
      )}
    </Stack>
  );
}
