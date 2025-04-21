import React from "react";
import {
  Stack, TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";

export default function OptInFields({
  component, onPropertyChange: h, screens
}: Pick<FieldRendererProps, "component"|"onPropertyChange"|"screens">) {
  return (
    <Stack spacing={2}>
      <TextField
        label="Label" fullWidth
        value={component.properties?.label || ""}
        onChange={e => h("label", e.target.value)}
        size="small"
      />

      {["required", "visible"].map(p => (
        <FormControl fullWidth key={p} size="small">
          <InputLabel>{p.charAt(0).toUpperCase() + p.slice(1)}</InputLabel>
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

      {/* Init Value Dropdown */}
      <FormControl fullWidth size="small">
        <InputLabel>Init Value</InputLabel>
        <Select
          value={component.properties?.initValue || "false"}
          onChange={(e) => h("initValue", e.target.value)}
          label="Init Value"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>On Click Action</InputLabel>
        <Select
          value={component.properties?.onClick || ""}
          onChange={e => h("onClick", e.target.value)}
          label="On Click Action"
        >
          <MenuItem value="navigate">Navigate</MenuItem>
          <MenuItem value="dataexchange">Data Exchange</MenuItem>
          <MenuItem value="open_url">Open URL</MenuItem>
          <MenuItem value="none">None</MenuItem>
        </Select>
      </FormControl>

      {component.properties?.onClick === "navigate" && (
        <FormControl fullWidth size="small">
          <InputLabel>Screen Name</InputLabel>
          <Select
            value={component.properties?.screenName || ""}
            onChange={e => h("screenName", e.target.value)}
            label="Screen Name"
          >
            {screens.map(s => (
              <MenuItem key={s.id} value={s.title}>{s.title}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {component.properties?.onClick === "open_url" && (
        <TextField
          label="URL" required fullWidth
          value={component.properties?.url || ""}
          onChange={e => h("url", e.target.value)}
          size="small"
        />
      )}
    </Stack>
  );
}
