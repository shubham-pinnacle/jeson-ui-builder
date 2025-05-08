import { Stack, TextField, FormControl, InputLabel, Select, MenuItem,Typography } from "@mui/material";
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

  // ensure we coerce anything (string|number) into a safe string for the input
  const asString = (v: any, fallback = "") =>
    v === undefined || v === null ? fallback : String(v);

  return (
    <Stack spacing={2}>
      <TextField
        label="Label"
        required
        fullWidth
        value={component.properties?.label ?? ""}
        onChange={(e) => handleChange("label", e.target.value)}
        size="small"
        error={isOverLimit("label", 20)}
        helperText={getHelperText("label", 20)}
        FormHelperTextProps={{
          sx: {
            color: isOverLimit("label", 20) ? "red" : "text.secondary",
            fontWeight: isOverLimit("label", 20) ? 600 : 400,
          },
        }}
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
          value={String(component.properties?.visible ?? "true")}
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
        value={asString(component.properties?.maxLength, "" )}
        onChange={(e) => handleChange("maxLength", e.target.value === "" ? undefined : Number(e.target.value))}
        size="small"
      />
      
      {/* Message to show when maxLength exceeds 600 */}
      {isMaxLengthExceeded && (
        <Typography color="error" variant="body2">
          Max Length cannot exceed 600 characters.
        </Typography>
      )}


      <TextField
        label="Helper Text (Optional)"
        fullWidth
        value={component.properties?.helperText || ""}
        onChange={(e) => handleChange("helperText", e.target.value)}
        size="small"
        error={isOverLimit("helperText", 80)}
        helperText={getHelperText("helperText", 80)}
        FormHelperTextProps={{
          sx: {
            color: isOverLimit("helperText", 80) ? "red" : "text.secondary",
            fontWeight: isOverLimit("helperText", 80) ? 600 : 400,
          },
        }}
      />
    </Stack>
  );
}
