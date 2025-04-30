import { useEffect, useState } from "react";
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, Typography, Checkbox, Autocomplete } from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";
import { PropertyOptions } from "../PropertiesFormStyles";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { Option, PropertyOption, addOption, setOptions, setSelectedProperties, initComponentState } from "../../../slices/componentOptionsSlice";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CheckboxPropertyForm(props: FieldRendererProps) {
  const { component, onPropertyChange: h, fieldValues, handleFieldChange } = props;

  // Local state for the new option title input
  const [newOptionTitle, setNewOptionTitle] = useState("");
  
  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Redux integration
  const dispatch = useDispatch();
  
  // Initialize Redux for this component if needed
  useEffect(() => {
    dispatch(initComponentState({ componentId: component.id }));
  }, [component.id, dispatch]);
  
  // Get this component's state from Redux
  const componentState = useSelector((state: RootState) => 
    state.componentOptions[component.id] || { options: [], selectedProperties: [] }
  );
  
  // Extract options and selectedProperties from component state
  const componentOptions = componentState.options;
  const selectedOptions = componentState.selectedProperties;
  
  // This effect syncs component.properties["data-source"] with Redux store on component mount/change
  useEffect(() => {
    console.log(`>>> Component selected: ${component?.id}`);
    
    if (component && component.properties) {
      // Get existing options from component properties
      const dataSource = Array.isArray(component.properties["data-source"]) 
        ? [...component.properties["data-source"]] 
        : [];
      
      console.log(`>>> Component ${component.id} data-source:`, dataSource);
      console.log(`>>> Redux store options for ${component.id}:`, componentOptions);
        
      // Only initialize Redux if component has data but Redux doesn't yet have it stored
      if (dataSource.length > 0 && componentOptions.length === 0) {
        // Use setTimeout to avoid blocking the UI thread during component selection
        setTimeout(() => {
          console.log(`>>> Initializing Redux for ${component.id} with:`, dataSource);
          dispatch(setOptions({
            componentId: component.id,
            options: dataSource
          }));
        }, 100);
      }
    }
  }, [component?.id, dispatch, componentOptions]);
  
  // Update component properties from Redux data when options change
  useEffect(() => {
    // Only update component properties if there are real options
    if (componentOptions && componentOptions.length > 0) {
      console.log(`Options for component ${component.id} retrieved from Redux:`, componentOptions);
      
      // Check if the current component properties data-source differs from Redux
      // This prevents unnecessary updates that might interfere with component selection
      const currentDataSource = component.properties["data-source"] || [];
      const needsUpdate = JSON.stringify(currentDataSource) !== JSON.stringify(componentOptions);
      
      if (needsUpdate) {
        // Safely update with a slight delay to avoid interfering with component selection
        setTimeout(() => {
          h("data-source", [...componentOptions]);
          console.log(`Synced Redux options back to component ${component.id} properties`);
        }, 100);
      }
    }
  }, [componentOptions, component.id, h]);

  // Create a list of option titles for the dropdown
  const initOptions = componentOptions.map((opt: Option) => opt.title);
  
  // Log events for debugging
  useEffect(() => {
    console.log(`Checkbox component selected: ${component.id}`);
    console.log(`Component data-source for ${component.id}:`, component.properties["data-source"]);
    console.log(`Component options in Redux for ${component.id}:`, componentOptions);
    console.log(`Selected properties for ${component.id}:`, selectedOptions);
  }, [component.id, componentOptions, selectedOptions]);

  const handleChange = (prop: string, value: any) => h(prop, value);

  // Check if any required field input is empty
  const hasEmptyRequired = () => {
    return !newOptionTitle.trim() || selectedOptions.some(opt => {
      if (opt.title === "id" || opt.title === "description") {
        const key = `${opt.title}_${opt.title}`;
        return !fieldValues[key]?.trim();
      }
      return false;
    });
  };

  const saveOptionsToRedux = () => {
    // Validate before saving
    const newErrors: any = {};
    if (!newOptionTitle.trim()) {
      newErrors["newOptionTitle"] = "Title is required";
    }
    
    selectedOptions.forEach(opt => {
      if (opt.title === "id" || opt.title === "description") {
        const key = `${opt.title}_${opt.title}`;
        if (!fieldValues[key]?.trim()) {
          newErrors[key] = `${opt.title} is required`;
        }
      }
    });
    
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const title = newOptionTitle.trim();
    const id = fieldValues[`id_id`] || "";
    const description = fieldValues[`description_description`] || "";
    const metadata = fieldValues[`metadata_metadata`] || "";

    // Create a unique ID if not provided
    const optionId = id || `${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    
    // Create option object specific to this component only
    const newOption: Option = {
      id: optionId,
      title
    };
    
    // Only add these properties if they exist
    if (description) newOption.description = description;
    if (metadata) newOption.metadata = { value: metadata };

    // Prevent duplicate IDs - only check within this component's options
    const existingComponentIds = componentOptions.map(opt => opt.id);
    if (existingComponentIds.includes(newOption.id)) {
      setErrors({ id_id: "This ID is already in use for this component" });
      return;
    }
    
    // Dispatch action to add the option to this specific component in Redux
    dispatch(addOption({
      componentId: component.id,
      option: newOption
    }));
    
    console.log(`Added option to Redux store for component ${component.id}:`, newOption);
    
    // Reset form fields
    setNewOptionTitle("");
    
    // Clear the field values
    selectedOptions.forEach((opt) => {
      const key = `${opt.title}_${opt.title}`;
      handleFieldChange(key, ""); // reset each field to empty string
    });
  };

  // Helper function to clear validation errors
  const clearError = (name: string) => {
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
        value={selectedOptions}
        disableCloseOnSelect
        getOptionLabel={option => option.title}
        onChange={(_, newValue) => {
          // When properties are selected from Autocomplete, update Redux
          dispatch(setSelectedProperties({
            componentId: component.id,
            properties: newValue as PropertyOption[]
          }));
        }}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.title}
            </li>
          );
        }}
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
          onChange={(e) => { 
            setNewOptionTitle(e.target.value); 
            clearError("newOptionTitle"); 
          }}
          error={!!errors.newOptionTitle}
          helperText={errors.newOptionTitle}
          // sx={{mb:1.3 } }
        />

        {/* Render property fields only when they are selected in Autocomplete */}
        <Box sx={{ mt: 1}}>
          {["id", "description", "metadata"].map((field) =>
            selectedOptions.find((opt) => opt.title === field) ? (
              <TextField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                size="small"
                fullWidth
                sx={{ mb: 1 }}
                required={field === "id" || field === "description"}
                value={fieldValues[`${field}_${field}`] || ""}
                onChange={(e) =>
                  handleFieldChange(`${field}_${field}`, e.target.value)
                }
                error={!!errors[`${field}_${field}`]}
                helperText={errors[`${field}_${field}`]}
              />
            ) : null
          )}
        </Box>

        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 1 }}
          onClick={saveOptionsToRedux}
          disabled={hasEmptyRequired()}
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
          <Select value={component.properties?.[p]?.toString() ?? 'false'} onChange={e => h(p, e.target.value)} label={p}>
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
