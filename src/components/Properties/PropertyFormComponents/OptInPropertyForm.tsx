import {
  Stack, TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";

export default function OptInPropertyForm({
  component, onPropertyChange: handleChange, screens
}: Pick<FieldRendererProps, "component"|"onPropertyChange"|"screens">) {

  const label = component.properties?.label || "";
  const labelLimit = 120;

  const getHelperText = () => `${label.length}/${labelLimit} characters`;
  const isOverLimit = () => label.length > labelLimit;

  return (
        <Stack spacing={2}>
      <TextField
        label="Label"
        required
        fullWidth
        value={component.properties?.label || ""}
        onChange={(e) => handleChange("label", e.target.value)}
        size="small"
        error={isOverLimit()}
        helperText={getHelperText()}
        FormHelperTextProps={{
          sx: {
            color: isOverLimit() ? "red" : "text.secondary",
            fontWeight: isOverLimit() ? 600 : 400,
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

      <FormControl fullWidth size="small">
        <InputLabel>Required (Optional)</InputLabel>
        <Select
          value={component.properties?.required || null}
          onChange={(e) => handleChange("required", e.target.value)}
          label="Required (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible ?? true}
          onChange={(e) => handleChange("visible", e.target.value)}
          label="Visible (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>Init Value (Optional)</InputLabel>
        <Select
          value={component.properties?.initValue || null}
          onChange={(e) => handleChange("initValue", e.target.value)}
          label="Init Value (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>On Click Action (Optional)</InputLabel>
        <Select
          value={component.properties?.onClick || ""}
          onChange={(e) => handleChange("onClick", e.target.value)}
          label="On Click Action (Optional)"
        >
          <MenuItem value="navigate">Navigate</MenuItem>
          <MenuItem value="data_exchange">Data Exchange</MenuItem>
          <MenuItem value="open_url">Open URL</MenuItem>
        </Select>
      </FormControl>

      {component.properties?.onClick === "navigate" && (
        <FormControl fullWidth size="small">
          <InputLabel>Screen Name</InputLabel>
          <Select
            value={component.properties?.screenName || ""}
            onChange={(e) => handleChange("screenName", e.target.value)}
            label="Screen Name"
          >
            {screens.map((screen) => (
              <MenuItem key={screen.id} value={screen.id}>
                {screen.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {component.properties?.onClick === "open_url" && (
        <TextField
          label="URL"
          fullWidth
          required
          value={component.properties?.url || ""}
          onChange={(e) => handleChange("url", e.target.value)}
          size="small"
        />
      )}
    </Stack>

  );
}
