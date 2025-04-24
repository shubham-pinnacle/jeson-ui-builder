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
        options={propertyOptions}
        disableCloseOnSelect
        getOptionLabel={(opt) => opt.title}
        value={fieldValues}
        onChange={(_, newValue) => setSelectedOptions(newValue)}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.title}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Properties (optional)"
            size="small"
          />
        )}
        fullWidth
      />

      {/* === For each selected property, show ID / Description / Metadata checkbox === */}
      {selectedOptions.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Properties Details:
          </Typography>
          {selectedOptions.map((opt) => (
            <Box
              key={opt.title}
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                {opt.title}
              </Typography>

              <TextField
                label="ID"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
                value={fieldValues[`${opt.title}_id`] || ""}
                onChange={(e) =>
                  handleFieldChange(`${opt.title}_id`, e.target.value)
                }
              />

              <TextField
                label="Description"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
                value={fieldValues[`${opt.title}_description`] || ""}
                onChange={(e) =>
                  handleFieldChange(`${opt.title}_description`, e.target.value)
                }
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(fieldValues[`${opt.title}_metadata`])}
                    onChange={(e) =>
                      handleFieldChange(
                        `${opt.title}_metadata`,
                        e.target.checked
                      )
                    }
                  />
                }
                label="Metadata"
              />
            </Box>
          ))}
        </Box>
      )}

      {/* === OPTIONS: add / list your actual radio options === */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Options:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <TextField
            placeholder="Title"
            size="small"
            fullWidth
            value={component.properties?.newOption || ""}
            onChange={(e) => handleChange("newOption", e.target.value)}
          />
        </Stack>
        <Button
          variant="outlined"
          onClick={() => handleOptionAdd("options")}
          size="small"
        >
          Add
        </Button>
        
      </Box>

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
