import React from "react";
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem, Autocomplete, Checkbox } from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";
import AllowedMimeTypes from "../AllowedMimeTypes";
import { StyledPopper } from "../PropertiesFormStyles";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function DocumentFields({
  component, onPropertyChange: h
}: Pick<FieldRendererProps, "component"|"onPropertyChange">) {
  return (
    <Stack spacing={2}>
      {["label","description","outputVariable"].map(prop => (
        <TextField
          key={prop}
          label={prop.charAt(0).toUpperCase()+prop.slice(1).replace(/([A-Z])/g," $1")}
          required={prop!=="description"} fullWidth
          value={component.properties?.[prop]||""}
          onChange={e=>h(prop,e.target.value)} size="small"
        />
      ))}

      <FormControl fullWidth size="small">
        <InputLabel>Photo Source</InputLabel>
        <Select
          value={component.properties?.photoSource||"camera"}
          onChange={e=>h("photoSource",e.target.value)}
          label="Photo Source"
        >
          <MenuItem value="camera">Camera Gallery</MenuItem>
          <MenuItem value="gallery">Gallery</MenuItem>
          <MenuItem value="camera">Camera</MenuItem>
        </Select>
      </FormControl>

      <Autocomplete
        multiple fullWidth size="small"
        options={AllowedMimeTypes}
        disableCloseOnSelect
        value={
          AllowedMimeTypes.filter(mt=>
            component.properties?.allowedMimeTypes?.includes(mt.title)
          )
        }
        onChange={(_, newVal)=>h(
          "allowedMimeTypes",
          newVal.map((i:any)=>i.title)
        )}
        getOptionLabel={opt=>opt.title}
        PopperComponent={StyledPopper}
        renderOption={(props,opt,{selected})=>(
          <li key={opt.title} {...props}>
            <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected}/>
            {opt.title}
          </li>
        )}
        renderInput={params=>(
          <TextField
            {...params}
            label="Allowed Mime Types"
            placeholder="Select allowed types"
          />
        )}
      />

      {["minPhotos","maxPhotos","maxFileSize"].map(prop=>(
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
