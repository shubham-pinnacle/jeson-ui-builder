import React, { useState } from "react";

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

  const text = component.properties?.text || "";
  const maxChars = 25;

  const [touched, setTouched] = useState(false);

  const formatSentenceCase = (value: string) => {
    const trimmed = value.trimStart();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSentenceCase(e.target.value);
    handleChange("text", formatted);
    if (!touched) setTouched(true);
  };

  const isEmptyOrBlank = text.trim() === "";
  const isOverLimit = text.length > maxChars;
  const showError = touched && (isEmptyOrBlank || isOverLimit);

  return (
    <Stack spacing={2}>
      <TextField
        label="Text"
        required
        fullWidth
        value={component.properties?.text || ""}
        onChange={handleTextChange}

        size="small"
        error={showError}
        helperText={
          showError
            ? isEmptyOrBlank
              ? "Text cannot be empty or blank"
              : `${text.length}/${maxChars} characters`
            : `${text.length}/${maxChars} characters`
        }
        FormHelperTextProps={{
          sx: {
            color: showError ? "red" : "text.secondary",
            fontWeight: showError ? 600 : 400,
          },
        }}
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
        <InputLabel>On Click Action * </InputLabel>
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
