import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import LimitedTextField from './LimitedTextField';
import { FieldRendererProps } from "./FieldRendererProps";
import { useToast } from '../../ToastContext';
import { useState } from 'react';

export default function TextInputPropertyForm({
  component,
  onPropertyChange: h,
}: Pick<FieldRendererProps, "component" | "onPropertyChange">) {
  const { showToast } = useToast();
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const handleChange = (prop: string, value: any) => {
    if (typeof value === 'string' && value.length > 80) {
      const trimmed = value.slice(0, 80);
      h(prop, trimmed);
      setErrors(prev => ({ ...prev, [prop]: true }));
      showToast({ message: `${prop} cannot exceed 80 characters`, type: 'error' });
    } else {
      h(prop, value);
      setErrors(prev => ({ ...prev, [prop]: false }));
    }
  };

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

      <LimitedTextField
        field="outputVariable"
        label="Output Variable"
        required
        fullWidth
        value={component.properties?.outputVariable || ""}
        onFieldChange={handleChange}
        forbidSpaces
        size="small"
      />

      <LimitedTextField
        field="initValue"
        label="Init Value (Optional)"
        fullWidth
        value={component.properties?.initValue || ""}
        onFieldChange={handleChange}
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
        label="Min-Chars (Optional)"
        type="number"
        fullWidth
        value={component.properties?.minChars === undefined ? "" : component.properties.minChars}
        onChange={(e) => handleChange("minChars", Number(e.target.value))}
        size="small"
      />

      <TextField
        label="Max-Chars (Optional)"
        type="number"
        fullWidth
        value={component.properties?.maxChars === undefined ? 80 : component.properties.maxChars}
        onChange={(e) => handleChange("maxChars", Number(e.target.value))}
        size="small"
      />

      <LimitedTextField
        field="helperText"
        label="Helper Text (Optional)"
        fullWidth
        value={component.properties?.helperText || ""}
        onFieldChange={handleChange}
        size="small"
        maxChars={30}
      />
    </Stack>
  );
}
