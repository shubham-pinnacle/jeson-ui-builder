import { Stack, TextField, FormControl, InputLabel, Select, MenuItem,Typography } from "@mui/material";
import LimitedTextField from './LimitedTextField';
import { FieldRendererProps } from "./FieldRendererProps";

export default function TextAreaPropertyForm({
  component,
  onPropertyChange: h,
}: Pick<FieldRendererProps, "component" | "onPropertyChange">) {
  const handleChange = (prop: string, value: any) => h(prop, value);

  const getHelperText = (field: string, limit: number) => {
    const value = component.properties?.[field] || "";
    return `${value.length}/${limit} characters`;
  };

  const isOverLimit = (field: string, limit: number) => {
    const value = component.properties?.[field] || "";
    return value.length > limit;
  };

  const maxLength = component.properties?.maxLength || 0;
  const isMaxLengthExceeded = maxLength > 600;

  return (
    <Stack spacing={2}>
      <LimitedTextField
        field="label"
        label="Label"
        required
        fullWidth
        value={component.properties?.label || ""}
        onFieldChange={handleChange}
        size="small"
      />

      <TextField
        label="Output Variable"
        required
        fullWidth
        value={component.properties?.outputVariable || ""}
        onChange={(e) => handleChange("outputVariable", e.target.value)}
        size="small"
      />

      <TextField
        label="Init Value (Optional)"
        fullWidth
        value={component.properties?.initValue || ""}
        onChange={(e) => handleChange("initValue", e.target.value)}
        size="small"
      />

      <FormControl fullWidth size="small">
        <InputLabel>Required (Optional)</InputLabel>
        <Select
          value={
            component.properties?.required === undefined
              ? ""
              : String(component.properties.required)
          }
          onChange={(e) => handleChange("required", e.target.value === "true")}
          label="Required (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible ?? "true"}
          onChange={(e) => handleChange("visible", e.target.value)}
          label="Visible (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>Enabled (Optional)</InputLabel>
        <Select
          value={component.properties?.enabled === undefined ? "" : String(component.properties.enabled)}
          onChange={(e) => handleChange("enabled", e.target.value === "true")}
          label="Enabled (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Max-Length (Optional)"
        type="number"
        fullWidth
        value={component.properties?.maxLength === undefined ? 80 : component.properties.maxLength}
        onChange={(e) => handleChange("maxLength", e.target.value)}
        size="small"
      />
      
      {/* Message to show when maxLength exceeds 600 */}
      {isMaxLengthExceeded && (
        <Typography color="error" variant="body2">
          Max Length cannot exceed 600 characters.
        </Typography>
      )}


      <LimitedTextField
        field="helperText"
        label="Helper Text (Optional)"
        fullWidth
        value={component.properties?.helperText || ""}
        onFieldChange={handleChange}
        size="small"
        maxChars={20}
      />
    </Stack>
  );
}
