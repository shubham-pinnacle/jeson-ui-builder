import {TextField, Stack, FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import React from 'react';
import { Component } from '../../types';

interface Props { component: Component; }

const PropertiesFormTextHeading: React.FC<Props> = ({ component }) => {
  <>
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
  </>
}

export default PropertiesFormTextHeading
