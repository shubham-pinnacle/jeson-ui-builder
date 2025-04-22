import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";

export default function TextSubHeadingFields({
  component, onPropertyChange: h,
}: Pick<FieldRendererProps, "component" | "onPropertyChange">) {

  const text = component.properties?.text || "";
  const maxChars = 80;
  const isOverLimit = text.length > maxChars;

  return (
    <Stack spacing={2}>
      <TextField
        label="Text SubHeading"
        required fullWidth
        value={component.properties?.text || ""}
        onChange={e => {
          if (e.target.value.length <= maxChars) {
            h("text", e.target.value);
          }
        }}
        size="small"
        error={isOverLimit}
        helperText={`${text.length}/${maxChars} characters`}
        FormHelperTextProps={{
          sx: {
            color: isOverLimit ? 'red' : 'text.secondary',
            fontWeight: isOverLimit ? 600 : 400,
          },
        }}
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
