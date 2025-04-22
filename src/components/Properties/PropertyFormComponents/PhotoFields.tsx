import React from "react";
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";

export default function PhotoFields({
  component, onPropertyChange: h
}: Pick<FieldRendererProps, "component"|"onPropertyChange">) {
  return (
    <Stack spacing={2}>
      {[
        { label: "Label", prop: "label", req: true },
        { label: "Description", prop: "description", req: false },
        { label: "Output Variable", prop: "outputVariable", req: true }
      ].map(({ label, prop, req }) => (
        <TextField
          key={prop}
          label={label} required={req} fullWidth
          value={component.properties?.[prop]||""}
          onChange={e=>h(prop,e.target.value)}
          size="small"
        />
      ))}

      <FormControl fullWidth size="small">
        <InputLabel>Photo Source</InputLabel>
        <Select
          value={component.properties?.photoSource||"camera"}
          onChange={e=>h("photoSource",e.target.value)}
          label="Photo Source"
        >
          <MenuItem value="camera_gallery">Camera Gallery</MenuItem>
          <MenuItem value="gallery">Gallery</MenuItem>
          <MenuItem value="camera">Camera</MenuItem>
        </Select>
      </FormControl>

      {["minPhotos","maxPhotos","maxFileSize"].map(prop => (
        <TextField
          key={prop}
          label={
            prop==="maxFileSize"
              ? "Maximum file size in MB"
              : prop==="minPhotos"
              ? "Minimum Photos"
              : "Maximum Photos"
          }
          type="number" fullWidth
          value={component.properties?.[prop]||""}
          onChange={e=>h(prop,e.target.value)}
          size="small"
        />
      ))}

      {["visible","enabled"].map(p=>(
        <FormControl fullWidth key={p} size="small">
          <InputLabel>{p.charAt(0).toUpperCase()+p.slice(1)}</InputLabel>
          <Select
            value={component.properties?.[p]||"true"}
            onChange={e=>h(p,e.target.value)}
            label={p}
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>
      ))}
    </Stack>
  );
}
