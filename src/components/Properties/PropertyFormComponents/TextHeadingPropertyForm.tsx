import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";

export default function TextHeadingPropertyForm({
  component, onPropertyChange: h,
}: Pick<FieldRendererProps, "component" | "onPropertyChange">) {
  return (
    <Stack spacing={2}>
      <TextField
        label="Text Heading"
        required fullWidth
        value={component.properties?.text || ""}
        onChange={e => h("text", e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Visible</InputLabel>
        <Select
          value={component.properties?.visible || "true"}
          onChange={e => h("visible", e.target.value)}
          label="Visible"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
