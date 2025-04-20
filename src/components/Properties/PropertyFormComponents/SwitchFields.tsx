import React from "react";
import { Stack, TextField, Box, Button, FormControl, InputLabel, Select, MenuItem, List, ListItemText, ListItemSecondaryAction, IconButton } from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";
import { FaTimes } from "react-icons/fa";

export default function SwitchFields({
  component, onPropertyChange: h, handleOptionAdd, handleOptionDelete
}: Pick<FieldRendererProps,"component"|"onPropertyChange"|"handleOptionAdd"|"handleOptionDelete">) {
  return (
    <Stack spacing={2}>
      <TextField
        label="Switch On" required fullWidth
        value={component.properties?.switchOn||""}
        onChange={e=>h("switchOn",e.target.value)} size="small"
      />
      <TextField
        label="Compare To Variable" required fullWidth
        value={component.properties?.compareToVariable||""}
        onChange={e=>h("compareToVariable",e.target.value)} size="small"
      />
      <Box>
        <TextField
          label="Add Case" fullWidth
          value={component.properties?.newOption||""}
          onChange={e=>h("newOption",e.target.value)} size="small"
        />
        <Button variant="outlined" sx={{mt:1}} fullWidth onClick={()=>handleOptionAdd("cases")}>
          Add Case
        </Button>
      </Box>
      <List>
        {(component.properties?.cases||[]).map((c:string)=>(
          <ListItemSecondaryAction key={c}>
            <ListItemText primary={c}/>
            <IconButton size="small" edge="end"
              onClick={()=>handleOptionDelete("cases",c)}
            ><FaTimes/></IconButton>
          </ListItemSecondaryAction>
        ))}
      </List>
    </Stack>
  );
}
