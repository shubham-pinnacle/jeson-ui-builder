import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";

export default function TextCaptionPropertyForm({
  component,
  onPropertyChange: h,
}: Pick<FieldRendererProps, "component" | "onPropertyChange">) {
  const handleChange = (prop: string, value: any) => h(prop, value);

  const text = component.properties?.text || "";
  const maxLength = 409;
  const isOverLimit = text.length > maxLength;
  return (
    <Stack spacing={2}>
      <TextField
        label = "Text Caption" 
        required
        fullWidth
        value={component.properties?.text || ""}
        onChange={(e) => handleChange("text", e.target.value)}
        size="small"
        error={isOverLimit}
        helperText={`${text.length}/${maxLength} characters`}
        FormHelperTextProps={{
          sx: {
            color: isOverLimit ? 'red' : 'text.secondary',
            fontWeight: isOverLimit ? 600 : 400,
          },
        }}
      />

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
        <InputLabel>Font Weight (Optional)</InputLabel>
        <Select
          value={component.properties?.fontWeight ?? ""}
          onChange={(e) => handleChange("fontWeight", e.target.value)}
          label="Font Weight (Optional)"
        >
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="bold">Bold</MenuItem>
          <MenuItem value="italic">Italic</MenuItem>
          <MenuItem value="bold_italic">Bold Italic</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>Strike Through (Optional)</InputLabel>
        <Select
          value={component.properties?.strikethrough || null}
          onChange={(e) => handleChange("strikethrough", e.target.value)}
          label="Strike Through (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>Markdown (Optional)</InputLabel>
        <Select
          value={component.properties?.markdown ?? "false"}
          onChange={(e) => handleChange("markdown", e.target.value)}
          label="Markdown (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
