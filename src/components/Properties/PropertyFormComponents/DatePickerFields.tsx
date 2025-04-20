import React, { useEffect } from "react";
import { LocalizationProvider, DatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { parseISO, format } from "date-fns";
import { FieldRendererProps } from "./FieldRendererProps";

export default function DatePickerFields(props: FieldRendererProps) {
  const {
    component, onPropertyChange: h, isMobile
  } = props;

  // ensure defaults exist
  useEffect(()=>{
    if(component.type==="date-picker") {
      const defaults = { label:"", outputVariable:"", initValue:"", minDate:"", maxDate:"", unavailableDates:"" };
      const missing = Object.keys(defaults).filter(k=>!(k in (component.properties||{})));
      if(missing.length>0) {
        h("properties", { ...(component.properties||{}), ...defaults });
      }
    }
  },[component.id]);

  const DateComp = isMobile ? MobileDatePicker : DatePicker;
  const splitDates = (component.properties?.unavailableDates||"").split(",").map(d=>d.trim()).filter(Boolean);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={2}>
        {["label","outputVariable"].map(prop=>(
          <TextField
            key={prop}
            label={prop.charAt(0).toUpperCase()+prop.slice(1).replace(/([A-Z])/g," $1")}
            required fullWidth
            value={component.properties?.[prop]||""}
            onChange={e=>h(prop,e.target.value)}
            size="small"
          />
        ))}

        {["initValue","minDate","maxDate"].map((prop,i)=>(
          <DateComp
            key={prop}
            label={prop==="initValue"?"Initial Value":"Min/Max Date"}
            value={component.properties?.[prop]?parseISO(component.properties[prop]):null}
            onChange={nv=>h(prop, nv?format(nv,"yyyy-MM-dd"):"")}
            shouldDisableDate={prop==="initValue"? (d)=>splitDates.includes(format(d,"yyyy-MM-dd")) : undefined}
            slotProps={{
              textField:{ fullWidth:true, size:"small" },
              day:{ sx:{
                '&.Mui-selected':{bgcolor:'primary.main',color:'#fff'},
                '&:hover':{bgcolor:'primary.dark'},
              }}
            }}
          />
        ))}

        <DateComp
          label="Add Unavailable Dates"
          value={null}
          onChange={nv=>{
            if(!nv) return;
            const f = format(nv,"yyyy-MM-dd");
            const cur = splitDates;
            if(!cur.includes(f)) {
              h("unavailableDates", [...cur,f].join(", "));
            }
          }}
          shouldDisableDate={d=>splitDates.includes(format(d,"yyyy-MM-dd"))}
          sx={{
            '& .MuiOutlinedInput-root .Mui-focused fieldset':{borderColor:'#1976d2'}
          }}
          slotProps={{
            textField:{
              fullWidth:true, size:"small",
              value:component.properties?.unavailableDates||"",
            },
            day:{ sx:{
              '&.Mui-disabled':{bgcolor:'#bbdefb',color:'#1976d2'}
            }}
          }}
        />

        {["required","visible"].map(prop=>(
          <FormControl fullWidth key={prop} size="small">
            <InputLabel>{prop.charAt(0).toUpperCase()+prop.slice(1)}</InputLabel>
            <Select
              value={component.properties?.[prop]||"false"}
              onChange={e=>h(prop,e.target.value)}
              label={prop}
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </Select>
          </FormControl>
        ))}

        <TextField
          label="Helper Text" fullWidth
          value={component.properties?.helperText||""}
          onChange={e=>h("helperText",e.target.value)}
          size="small"
        />
      </Stack>
    </LocalizationProvider>
  );
}
