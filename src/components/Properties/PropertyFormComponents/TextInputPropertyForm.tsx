import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";

export default function TextInputPropertyForm({
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
          value={component.properties?.required === undefined ? "" : String(component.properties.required)}
          onChange={(e) => handleChange("required", e.target.value === "true")}
          label="Required (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      
      <FormControl fullWidth size="small">
        <InputLabel>Input Type (Optional)</InputLabel>
        <Select
          value={component.properties?.inputType || "text"}
          onChange={(e) => handleChange("inputType", e.target.value)}
          label="Input Type (Optional)"
        >
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="number">Number</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="password">Password</MenuItem>
          <MenuItem value="passcode">Passcode</MenuItem>
          <MenuItem value="phone">Phone</MenuItem>
        </Select>
      </FormControl>
      

      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={String(component.properties?.visible ?? "true")}
          onChange={(e) => handleChange("visible", e.target.value === "true")}
          label="Visible (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      
      <TextField
        label="Min‑Chars (Optional)"
        type="number"
        fullWidth
        size="small"
        // always render a string value
        value={asString(component.properties?.minChars, "")}
        // send a true number back into props
        onChange={(e) =>
          handleChange("minChars", e.target.value === "" ? undefined : Number(e.target.value))
        }
      />

      <TextField
        label="Max‑Chars (Optional)"
        type="number"
        fullWidth
        size="small"
        value={asString(component.properties?.maxChars, "")}
        onChange={(e) =>
          handleChange("maxChars", e.target.value === "" ? undefined : Number(e.target.value))
        }
      />
        

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
