import React from "react";
import { Stack, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";

export default function UserDetailsFields({
  component, onPropertyChange: h
}: Pick<FieldRendererProps,"component"|"onPropertyChange">) {
  return (
    <Stack spacing={2}>
      {[
        {label:"Required Fields", prop:"requiredFields", options:["name","email","address","dateOfBirth"]},
        {label:"Optional Fields", prop:"optionalFields", options:["phone","gender","occupation"]}
      ].map(({label,prop,options})=>(
        <FormControl fullWidth key={prop} size="small">
          <InputLabel>{label}</InputLabel>
          <Select
            multiple
            value={component.properties?.[prop]||[]}
            onChange={e=>h(prop,e.target.value)}
            label={label}
            renderValue={(sel:any[])=>sel.join(", ")}
          >
            {options.map(o=>(
              <MenuItem key={o} value={o}>{o}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </Stack>
  );
}
