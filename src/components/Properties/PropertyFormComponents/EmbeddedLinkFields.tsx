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

export default function EmbeddedLinkFields({
  component,
  onPropertyChange: h,
  screens,
}: Pick<FieldRendererProps, "component" | "onPropertyChange" | "screens">) {
  const handleChange = (prop: string, value: any) => h(prop, value);

  return (
    <Stack spacing={2}>
      <TextField
        label="Text"
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

      <FormControl fullWidth size="small">
        <InputLabel>On Click Action</InputLabel>
        <Select
          value={component.properties?.onClick || ""}
          onChange={(e) => handleChange("onClick", e.target.value)}
          label="On Click Action"
        >
          <MenuItem value="open_url">Open URL</MenuItem>
          <MenuItem value="navigate">Navigate</MenuItem>
          <MenuItem value="data_exchange">Data Exchange</MenuItem>
        </Select>
      </FormControl>

      {component.properties?.onClick === "open_url" && (
        <TextField
          label="URL"
          required
          fullWidth
          value={component.properties?.url || ""}
          onChange={(e) => handleChange("url", e.target.value)}
          size="small"
        />
      )}

      {component.properties?.onClick === "navigate" && (
        <FormControl fullWidth size="small">
          <InputLabel>Screen Name</InputLabel>
          <Select
            value={component.properties?.screenName || ""}
            onChange={(e) => handleChange("screenName", e.target.value)}
            label="Screen Name"
          >
            {screens.map((screen) => (
              <MenuItem key={screen.id} value={screen.title}>
                {screen.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Stack>
  );
}
