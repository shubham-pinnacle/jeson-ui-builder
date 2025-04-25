import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Button,
  List,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { FaTimes } from "react-icons/fa";
import { FieldRendererProps } from "./FieldRendererProps";
import { useEffect } from "react";
import { PropertyOptions } from "../PropertiesFormStyles";
import { useDispatch } from 'react-redux';
import { updateOption } from "../../../slices/optionSlice";
import { useSelector } from "react-redux";

import { RootState } from "../../../store";
export default function RadioFields(props: FieldRendererProps) {
  const {
    component,
    onPropertyChange: h,
    selectedOptions,
    setSelectedOptions,
    fieldValues,
    handleFieldChange,
    handleOptionAdd,
    handleOptionDelete,
  } = props;

  const handleChange = (prop: string, value: any) => h(prop, value);

  const dispatch = useDispatch();
  
  const savedOptions = useSelector((state: RootState) => state.option.arr);

useEffect(() => {
  console.log("Saved in Redux:", savedOptions);
}, [savedOptions]);

const saveOptionsToRedux = () => {
  // Get values from form fields
  const id = fieldValues[`id_id`] || "";
  const description = fieldValues[`description_description`] || "";
  const metadata = fieldValues[`metadata_metadata`] || "";
  
  // Check if at least ID field has a value
  if (!id.trim()) {
    // Don't add empty options to the array
    console.log("ID is required. Option not added.");
    return;
  }
  
  const newOption: any = {
    id: id,
    title: id, // Use ID as title
    description: description,
    metadata: metadata,
  };

  dispatch(updateOption(newOption));
  console.log("Dispatched option:", newOption);

  // Update the data-source property in the component
  const currentDataSource = Array.isArray(component.properties?.["data-source"]) 
    ? [...component.properties["data-source"]] 
    : [];
  
  const updatedDataSource = [...currentDataSource, newOption];
  h("data-source", updatedDataSource);

  // Clear the title/newOption field
  handleChange("newOption", "");

  // Only clear fields after successful addition
  selectedOptions.forEach((opt) => {
    const key = `${opt.title}_${opt.title}`;
    handleFieldChange(key, ""); // reset each field to empty string
  });
};



  useEffect(() => {console.log("selectedOptions",selectedOptions);
    // console.log("component.properties.options",component.properties.options)
  },[selectedOptions])

  // 1) Normalize your "options" (the radio/checkbox choices) into an array:
  const rawOptions = component.properties?.options;
  const optionsArray: any[] = Array.isArray(rawOptions)
    ? rawOptions
    : typeof rawOptions === "string"
    ? (() => {
        try {
          const p = JSON.parse(rawOptions);
          return Array.isArray(p) ? p : [];
        } catch {
          return [];
        }
      })()
    : [];

  // 2) Build an array of { id, title } for your Autocomplete:
  const propertyOptions = optionsArray.map((opt) =>
    typeof opt === "object"
      ? { id: opt.id, title: opt.title }
      : { id: opt, title: opt }
  );



  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <Stack spacing={2}>
      {/* Label, Description, Output Variable */}
      <TextField
        label="Label"
        required
        fullWidth
        size="small"
        value={component.properties?.label || ""}
        onChange={(e) => handleChange("label", e.target.value)}
      />
      {component.type !== "drop-down" && (
        <TextField
          label="Description (Optional)"
          fullWidth
          size="small"
          value={component.properties?.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      )}
      <TextField
        label="Output Variable"
        required
        fullWidth
        size="small"
        value={component.properties?.outputVariable || ""}
        onChange={(e) => handleChange("outputVariable", e.target.value)}
      />

<Autocomplete
        multiple
        id="checkboxes-tags-demo"
        options={PropertyOptions}
        disableCloseOnSelect
        getOptionLabel={(option) => option.title}
        onChange={(event, newValue) => {
          setSelectedOptions(newValue);
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
        renderInput={(params) => (
          <TextField
            {...params}
            label="Properties (optional)"
            
            size="small"
            />
        )}
        fullWidth
      />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Options:
              </Typography>
              <Stack direction="row" >
                <TextField
                  placeholder="Title"
                  size="small"
                  fullWidth
                  sx={{ mb: selectedOptions.length > 0 ?  1 : 0 }}
                  value={component.properties?.newOption || ""}
                  onChange={(e) => handleChange("newOption", e.target.value)}
                />
              </Stack>
              
      {selectedOptions.length > 0 && (
        <Box>
         
          {/* {selectedOptions.map((opt) => (
            <Box
              key={opt.title}
            >

              <TextField
                label={opt.title}
                size="small"
                fullWidth
                sx={{ mb: 1 }}
                value={fieldValues[`${opt.title}_id`] || ""}
                onChange={(e) =>
                  handleFieldChange(`${opt.title}_id`, e.target.value)
                }
              />

            
            </Box>
          ))} */}
          {selectedOptions.map((opt) => (
  <Box key={opt.title}>
    {opt.title === "id" && (
      <TextField
        label="ID"
        size="small"
        fullWidth
        sx={{ mb: 1 }}
        value={fieldValues[`id_id`] || ""}
        onChange={(e) =>
          handleFieldChange(`id_id`, e.target.value)
        }
      />
    )}

    {opt.title === "description" && (
      <TextField
        label="Description"
        size="small"
        fullWidth
        sx={{ mb: 1 }}
        value={fieldValues[`description_description`] || ""}
        onChange={(e) =>
          handleFieldChange(`description_description`, e.target.value)
        }
      />
    )}

    {opt.title === "metadata" && (
      <TextField
        label="Metadata"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={fieldValues[`metadata_metadata`] || ""}
        onChange={(e) =>
          handleFieldChange(`metadata_metadata`, e.target.value)
        }
      />
    )}
  </Box>
))}

        </Box>
      )}
              <Button
                variant="outlined"
                onClick={saveOptionsToRedux}
                size="small"
                sx={{mt:1.5}}
              >
                Add
              </Button>
            </Box>


      {/* === For each selected property, show ID / Description / Metadata checkbox === */}

      {/* === OPTIONS: add / list your actual radio options === */}

      {/* === INIT VALUE DROPDOWN (only the user-added options) === */}
      <FormControl fullWidth size="small">
        <InputLabel>Init Value (Optional)</InputLabel>
        <Select
          value={component.properties?.initValue || ""}
          onChange={(e) => handleChange("initValue", e.target.value)}
          label="Init Value (Optional)"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {optionsArray.map((opt, i) => {
            const title = typeof opt === "object" ? opt.title : opt;
            return (
              <MenuItem key={i} value={title}>
                {title}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      {/* === Standard toggles === */}
      <FormControl fullWidth size="small">
        <InputLabel>Required</InputLabel>
        <Select
          label="Required"
          value={component.properties?.required || "false"}
          onChange={(e) => handleChange("required", e.target.value)}
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>Visible</InputLabel>
        <Select
          label="Visible"
          value={component.properties?.visible || "true"}
          onChange={(e) => handleChange("visible", e.target.value)}
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>Enabled</InputLabel>
        <Select
          label="Enabled"
          value={component.properties?.enabled || "true"}
          onChange={(e) => handleChange("enabled", e.target.value)}
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      {component.type === "check-box" && (
        <>
          <TextField
            label="Min-Selected-Items (Optional)"
            type="number"
            fullWidth
            size="small"
            value={component.properties?.minSelectedItems || ""}
            onChange={(e) =>
              handleChange("minSelectedItems", e.target.value)
            }
          />
          <TextField
            label="Max-Selected-Items (Optional)"
            type="number"
            fullWidth
            size="small"
            value={component.properties?.maxSelectedItems || ""}
            onChange={(e) =>
              handleChange("maxSelectedItems", e.target.value)
            }
          />
        </>
      )}
    </Stack>
  );
}
