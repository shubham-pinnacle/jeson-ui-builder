import React, { useEffect, useState } from "react";
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, Typography, Checkbox, Autocomplete } from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";
import { PropertyOptions } from "../PropertiesFormStyles";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CheckboxPropertyForm(props: FieldRendererProps) {
  const { component, onPropertyChange: h } = props;

  // Local state
  const [newOptionTitle, setNewOptionTitle] = useState("");
  const [internalSelectedOptions, setInternalSelectedOptions] = useState<{ title: string }[]>([]);
  const [internalFieldValues, setInternalFieldValues] = useState<{ [key: string]: string }>({});

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (prop: string, value: any) => h(prop, value);
  
  // Only use component-specific options instead of all options from Redux
  const componentOptions = Array.isArray(component.properties["data-source"]) 
    ? component.properties["data-source"] 
    : [];
    
  // Use component-specific options for display
  const initOptions = componentOptions.map((opt: any) => opt.title);

  // Restore selections
  useEffect(() => {
    if (component.properties?.selectedProperties) {
      const storedOpts = component.properties.selectedProperties
        .map((n: string) => PropertyOptions.find((o: { title: string }) => o.title === n))
        .filter(Boolean) as { title: string }[];
      setInternalSelectedOptions(storedOpts);
      const vals: any = {};
      storedOpts.forEach((opt: { title: string }) => {
        const key = `${opt.title}_${opt.title}`;
        const stored = component.properties?.[`stored_${key}`];
        if (stored) vals[key] = stored;
      });
      setInternalFieldValues(vals);
    }
  }, [component.id]);

  // Persist selections
  useEffect(() => {
    const names = internalSelectedOptions.map(o => o.title);
    h("selectedProperties", names);
    Object.entries(internalFieldValues).forEach(([k, v]) => v && h(`stored_${k}`, v));
  }, [internalSelectedOptions, internalFieldValues]);

  // Check if any required input is empty
  const hasEmptyRequired = internalSelectedOptions.some(opt => {
    const key = `${opt.title}_${opt.title}`;
    return !internalFieldValues[key]?.trim();
  });

  const saveOptionsToRedux = () => {
    // Validate before saving
    const newErrors: any = {};
    internalSelectedOptions.forEach(opt => {
      const key = `${opt.title}_${opt.title}`;
      if (!internalFieldValues[key]?.trim()) {
        newErrors[key] = `${opt.title} is required`;
      }
    });
    if (!newOptionTitle.trim()) {
      newErrors["newOptionTitle"] = "Title is required";
    }
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const title = newOptionTitle.trim();
    const id = internalFieldValues[`id_id`] || "";
    const description = internalFieldValues[`description_description`] || "";
    const metadata = internalFieldValues[`metadata_metadata`] || "";

    // Create a unique ID if not provided
    const optionId = id || `${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    
    // Create option object specific to this component only
    const newOption: any = {
      id: optionId,
      title
    };
    
    // Only add these properties if they exist
    if (description) newOption.description = description;
    if (metadata) newOption.metadata = metadata;

    // Prevent duplicate IDs - only check within this component's options
    const existingComponentIds = componentOptions.map(opt => opt.id);
    if (existingComponentIds.includes(newOption.id)) {
      setErrors({ id_id: "This ID already exists in this component. Please use a unique ID." });
      return;
    }

    // Add the new option to this component's data-source property
    // This ensures each checkbox component maintains its own options
    
    // 1. Get the current data-source array for this component (if it exists)
    const currentDataSource = Array.isArray(component.properties["data-source"]) 
      ? [...component.properties["data-source"]] 
      : [];
    
    // 2. Add the new option to the data-source array
    const updatedDataSource = [...currentDataSource, newOption];
    
    // 3. Update the component's data-source property with the new array
    // This ensures the change is properly reflected in the component's properties
    h("data-source", updatedDataSource);
    
    // 4. Log for debugging
    console.log('Updated data-source property:', updatedDataSource);

    // clear
    setNewOptionTitle("");
    setInternalFieldValues({});
    internalSelectedOptions.forEach(opt => h(`stored_${opt.title}_${opt.title}`, ""));
  };

  const handleInternalFieldChange = (name: string, value: string) => {
    setInternalFieldValues(prev => ({ ...prev, [name]: value }));
    h(`stored_${name}`, value);
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Label"
        required
        fullWidth
        value={component.properties?.label || ""}
        onChange={e => h("label", e.target.value)}
        size="small"
      />
      {component.type !== "drop-down" && (
        <TextField
          label="Description"
          fullWidth
          value={component.properties?.description || ""}
          onChange={e => h("description", e.target.value)}
          size="small"
        />
      )}
      <TextField
        label="Output Variable"
        required
        fullWidth
        value={component.properties?.outputVariable || ""}
        onChange={e => h("outputVariable", e.target.value)}
        size="small"
      />

      <Autocomplete
        multiple
        options={PropertyOptions}
        value={internalSelectedOptions}
        disableCloseOnSelect
        getOptionLabel={opt => opt.title}
        onChange={(_, v) => setInternalSelectedOptions(v)}
        renderOption={(props, option, { selected }) => (
          <li {...props} key={option.title}>
            <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
            {option.title}
          </li>
        )}
        renderInput={params => <TextField {...params} label="Properties (optional)" size="small" />}
        fullWidth
      />

      <Box>
        <Typography variant="subtitle2">Options:</Typography>
        <TextField
          placeholder="Title"
          size="small"
          fullWidth
          value={newOptionTitle}
          onChange={e => { setNewOptionTitle(e.target.value); setErrors(prev => ({ ...prev, newOptionTitle: "" })); }}
          error={!!errors.newOptionTitle}
          helperText={errors.newOptionTitle}
          sx={{mb:1.3
          }}
        />

        {internalSelectedOptions.map((opt, i) => {
          const key = `${opt.title}_${opt.title}`;
          const common = {
            key: i,
            size: "small",
            fullWidth: true,
            sx: { mb: 1 },
            value: internalFieldValues[key] || "",
            onChange: (e: any) => handleInternalFieldChange(key, e.target.value),
            error: !!errors[key],
            helperText: errors[key]
          };
          if (opt.title === "id") return <TextField label="ID" {...common} />;
          if (opt.title === "description") return <TextField label="Description" {...common} required />;
          if (opt.title === "metadata") return <TextField label="Metadata" {...common} sx={{ mb: 2 }} />;
          return null;
        })}

        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 1.5 }}
          onClick={saveOptionsToRedux}
          disabled={hasEmptyRequired || !newOptionTitle.trim()}
        >Add</Button>
      </Box>

      <FormControl fullWidth size="small">
        <InputLabel>Init Value (Optional)</InputLabel>
        <Select
          value={component.properties?.initValue || ""}
          onChange={e => handleChange("initValue", e.target.value)}
          label="Init Value (Optional)"
        >
          {initOptions.length === 0 ? <MenuItem value=""><em/></MenuItem> : initOptions.map((opt: string, i: number) => (
            <MenuItem key={i} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {["required","visible","enabled"].map(p => (
        <FormControl fullWidth size="small" key={p}>
          <InputLabel>{p.charAt(0).toUpperCase()+p.slice(1)}</InputLabel>
          <Select value={component.properties?.[p] || 'false'} onChange={e => h(p, e.target.value)} label={p}>
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>
      ))}

      {component.type === "check-box" && (
        <Stack spacing={2}>
          <TextField label="Min-Selected-Items" type="number" fullWidth
            value={component.properties?.minSelectedItems || ""}
            onChange={e => h("minSelectedItems", e.target.value)} size="small" />
          <TextField label="Max-Selected-Items" type="number" fullWidth
            value={component.properties?.maxSelectedItems || ""}
            onChange={e => h("maxSelectedItems", e.target.value)} size="small" />
        </Stack>
      )}
    </Stack>
  );
}
