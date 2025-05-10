import {
  Stack,
  TextField,
  FormControl,
  InputLabel, 
  Select,
  MenuItem,
} from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";

export default function FooterButtonPropertyForm({
  component,
  onPropertyChange: handleChange,
  screens,
}: Pick<FieldRendererProps, "component" | "onPropertyChange" | "screens">) {

  const getHelperText = (field: string, limit: number) => {
    const value = component.properties?.[field] || "";
    return `${value.length}/${limit} characters`;
  };

  const isOverLimit = (field: string, limit: number) => {
    const value = component.properties?.[field] || "";
    return value.length > limit;
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Label"
        required
        fullWidth
        value={component.properties?.label ?? ""}
        onChange={(e) => handleChange("label", e.target.value)}
        size="small"
        error={isOverLimit("label", 35)}
        helperText={getHelperText("label", 35)}
        FormHelperTextProps={{
          sx: {
            color: isOverLimit("label", 35) ? "red" : "text.secondary",
            fontWeight: isOverLimit("label", 35) ? 600 : 400,
          },
        }}
      />

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
        label="Left Caption"
        fullWidth
        value={component.properties?.leftCaption || ""}
        onChange={(e) => {
          handleChange("leftCaption", e.target.value);
          if (e.target.value && component.properties?.centerCaption) {
            handleChange("centerCaption", "");
          }
        }}
        disabled={!!component.properties?.centerCaption}
        size="small"
        error={isOverLimit("leftCaption", 15)}
        helperText={getHelperText("leftCaption", 15)}
        FormHelperTextProps={{
          sx: {
            color: isOverLimit("leftCaption", 15) ? "red" : "text.secondary",
            fontWeight: isOverLimit("leftCaption", 15) ? 600 : 400,
          },
        }}
      />
      <TextField
        label="Center Caption"
        fullWidth
        value={component.properties?.centerCaption}
        onChange={(e) => {
          handleChange("centerCaption", e.target.value);
            
        }}
        disabled={
          !!component.properties?.leftCaption ||
          !!component.properties?.rightCaption
        }
        size="small"
        error={isOverLimit("centerCaption", 15)}
        helperText={getHelperText("centerCaption", 15)}
        FormHelperTextProps={{
          sx: {
            color: isOverLimit("centerCaption", 15) ? "red" : "text.secondary",
            fontWeight: isOverLimit("centerCaption", 15) ? 600 : 400,
          },
        }}
      />
      <TextField
        label="Right Caption"
        fullWidth
        value={component.properties?.rightCaption || ""}
        onChange={(e) => {
          handleChange("rightCaption", e.target.value);
          if (e.target.value && component.properties?.centerCaption) {
            handleChange("centerCaption", "");
          }
        }}
        disabled={!!component.properties?.centerCaption}
        size="small"
        error={isOverLimit("rightCaption", 15)}
        helperText={getHelperText("rightCaption", 15)}
        FormHelperTextProps={{
          sx: {
            color: isOverLimit("rightCaption", 15) ? "red" : "text.secondary",
            fontWeight: isOverLimit("rightCaption", 15) ? 600 : 400,
          },
        }}
      />

      <FormControl fullWidth size="small">
        <InputLabel>On Click Action * </InputLabel>
        <Select
          value={component.properties?.onClickAction || ""}
          onChange={(e) => handleChange("onClickAction", e.target.value)}
          label="On Click Action"
        >
          <MenuItem value="complete">Complete</MenuItem>
          <MenuItem value="navigate">Navigate</MenuItem>
          <MenuItem value="data_exchange">Data Exchange</MenuItem>
        </Select>
      </FormControl>

      {component.properties?.onClickAction === "navigate" && (
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
    </Stack>
  );
}
