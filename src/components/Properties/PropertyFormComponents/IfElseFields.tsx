import React from "react";
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";

export default function IfElseFields({
  component, onPropertyChange: h
}: Pick<FieldRendererProps, "component"|"onPropertyChange">) {
  return (
    <Stack spacing={2}>
      {[
        {label:"Condition Name",prop:"conditionName"},
        {label:"Compare To Variable",prop:"compareToVariable"},
        {label:"Compare With Value",prop:"compareWithValue"}
      ].map(({label,prop})=>(
        <TextField
          key={prop}
          label={label} required fullWidth
          value={component.properties?.[prop]||""}
          onChange={e=>h(prop,e.target.value)} size="small"
        />
      ))}

      <FormControl fullWidth size="small">
        <InputLabel>Condition</InputLabel>
        <Select
          value={component.properties?.condition1||"equals"}
          onChange={e=>h("condition1",e.target.value)}
          label="Condition"
        >
          {[
            {v:"equals",l:"Equals"},
            {v:"not_equals",l:"Not Equals"},
            {v:"greater_than",l:"Greater Than"},
            {v:"less_than",l:"Less Than"}
          ].map(opt=>(
            <MenuItem key={opt.v} value={opt.v}>{opt.l}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
