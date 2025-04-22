import React from "react";
import { FieldRendererProps } from "./FieldRendererProps";
import { Stack, Button, Box, IconButton, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { BiImageAlt } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";

export default function ImageFields({
  component, onPropertyChange: h
}: Pick<FieldRendererProps, "component"|"onPropertyChange">) {
  return (
    <Stack spacing={2}>
      <Button
        variant="outlined" fullWidth startIcon={<BiImageAlt/>}
        component="label"
        sx={{ height:100, border:"2px dashed #ccc",
             "&:hover":{border:"2px dashed #2196f3"} }}
      >
        Upload Image
        <input
          type="file" hidden accept="image/*"
          onChange={e=>{
            const f=e.target.files?.[0]; if(!f) return;
            if(f.size>5*1024*1024){ alert("Max 5MB"); return; }
            const r=new FileReader();
            r.onload=ev=>{
              const data=ev.target?.result as string;
              h("scaleType","contain");
              h("base64Data", data.split(",")[1]||"");
              h("src", data);
            };
            r.readAsDataURL(f);
          }}
        />
      </Button>

      {component.properties?.src && (
        <Box sx={{
          width:"100%", height:200,
          display:"flex", alignItems:"center",
          justifyContent:"center", position:"relative",
          border:"1px solid #eee", borderRadius:1,
          overflow:"hidden"
        }}>
          <img
            src={component.properties.src}
            alt="Preview"
            style={{
              maxWidth:"100%",
              maxHeight:"100%",
              objectFit:component.properties.scaleType||"contain"
            }}
          />
          <IconButton
            size="small"
            sx={{
              position:"absolute", top:8, right:8,
              bgcolor:"rgba(255,255,255,0.8)",
              "&:hover":{bgcolor:"rgba(255,255,255,0.9)"}
            }}
            onClick={()=>{
              h("src",""); h("base64Data",""); h("scaleType","contain");
            }}
          >
            <FaTimes/>
          </IconButton>
        </Box>
      )}

      <FormControl fullWidth size="small">
        <InputLabel>Scale Type</InputLabel>
        <Select
          value={component.properties?.scaleType||"contain"}
          onChange={e=>h("scaleType",e.target.value)}
          label="Scale Type"
        >
          <MenuItem value="contain">Contain</MenuItem>
          <MenuItem value="cover">Cover</MenuItem>
        </Select>
      </FormControl>

      {["width","height","aspectRatio"].map(prop=>(
        <TextField
          key={prop}
          label={
            prop==="aspectRatio"
              ? "Aspect ratio"
              : prop==="width"
              ? "Width (px)"
              : "Height (px)"
          }
          type="number" fullWidth
          value={component.properties?.[prop]||""}
          onChange={e=>h(prop,e.target.value)}
          size="small"
          inputProps={ prop!=="aspectRatio" ? {min:0} : undefined }
        />
      ))}

      <TextField
        label="Alt Text" fullWidth
        value={component.properties?.altText||""}
        onChange={e=>h("altText",e.target.value)}
        size="small"
      />
    </Stack>
  );
}
