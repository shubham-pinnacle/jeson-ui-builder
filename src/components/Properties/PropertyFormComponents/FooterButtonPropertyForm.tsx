import React from "react";
import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";

export default function FooterButtonPropertyForm({
  component,
  onPropertyChange: handleChange,
  screens,
}: Pick<FieldRendererProps, "component" | "onPropertyChange" | "screens">) {
  return (
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
          value={component.properties?.enabled || "false"}
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
        value={component.properties?.centerCaption}
        onChange={(e) => {
          handleChange("centerCaption", e.target.value);
            
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
}
