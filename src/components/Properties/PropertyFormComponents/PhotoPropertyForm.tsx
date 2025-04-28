import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";

export default function PhotoPropertyForm({
  component, onPropertyChange: handleChange
}: Pick<FieldRendererProps, "component"|"onPropertyChange">) {

  const text = component.properties?.label || "";
  const maxChars = 80;
  const isOverLimit = text.length > maxChars;

  const descriptionText = component.properties?.description || "";
  const descriptionMaxChars = 300;
  const isDescriptionOverLimit = descriptionText.length > descriptionMaxChars;

  return (
    <Stack spacing={2}>
      <TextField
        label="Label"
        required
        fullWidth
        value={component.properties?.label || ""}
        onChange={(e) => handleChange("label", e.target.value)}
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
      <TextField
        label="Description (Optional)"
        fullWidth
        value={component.properties?.description || ""}
        onChange={(e) => handleChange("description", e.target.value)}
        size="small"
        error={isDescriptionOverLimit}
        helperText={`${descriptionText.length}/${descriptionMaxChars} characters`}
        FormHelperTextProps={{
          sx: {
            color: isDescriptionOverLimit ? 'red' : 'text.secondary',
            fontWeight: isDescriptionOverLimit ? 600 : 400,
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
        <InputLabel>Photo Source (Optional)</InputLabel>
        <Select
          value={component.properties?.photoSource || "Camera Gallery"}
          onChange={(e) => handleChange("photoSource", e.target.value)}
          label="Photo Source (Optional)"
        >
          <MenuItem value="camera_gallery">Camera Gallery</MenuItem>
          <MenuItem value="gallery">Gallery</MenuItem>
          <MenuItem value="camera">Camera</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Minimum Photos (Optional)"
        type="number"
        fullWidth
        value={component.properties?.minPhotos || "0"}
        onChange={(e) => handleChange("minPhotos", e.target.value)}
        size="small"
      />
      <TextField
        label="Maximum Photos"
        required
        type="number"
        fullWidth
        value={component.properties?.maxPhotos || "30"}
        onChange={(e) => handleChange("maxPhotos", e.target.value)}
        size="small"
      />
      <TextField
        label="Maximum file size in MB"
        type="number"
        fullWidth
        value={component.properties?.maxFileSize || "25"}
        onChange={(e) => handleChange("maxFileSize", e.target.value)}
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible || true}
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
          value={component.properties?.enabled || "true"}
          onChange={(e) => handleChange("enabled", e.target.value)}
          label="Enabled (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
    </Stack>

  );
}
