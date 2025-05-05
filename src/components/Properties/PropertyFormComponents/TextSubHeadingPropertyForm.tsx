import { Stack, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import LimitedTextField from './LimitedTextField';
import { FieldRendererProps } from "./FieldRendererProps";

export default function TextSubHeadingFields({
  component, onPropertyChange: h,
}: Pick<FieldRendererProps, "component" | "onPropertyChange">) {

  const text = component.properties?.text || "";
  const maxChars = 80;
  const isOverLimit = text.length > maxChars;

  return (
    <Stack spacing={2}>
      <LimitedTextField
        field="text"
        label="Text SubHeading"
        required
        fullWidth
        value={component.properties?.text || ""}
        onFieldChange={(field, val) => h(field, val)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible ?? true}
          onChange={e => h("visible", e.target.value)}
          label="Visible (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
