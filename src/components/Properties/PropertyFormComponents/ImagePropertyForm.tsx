import { FieldRendererProps } from "./FieldRendererProps";
import { Stack, Button, Box, IconButton, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { BiImageAlt } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";

export default function ImagePropertyForm({
  component, onPropertyChange: handleChange
}: Pick<FieldRendererProps, "component"|"onPropertyChange">) {
  return (
      <Stack spacing={2}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<BiImageAlt />}
          component="label"
          sx={{
            height: "100px",
            border: "2px dashed #ccc",
            "&:hover": {
              border: "2px dashed #2196f3",
            },
          }}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 5 * 1024 * 1024) {
                  // 5MB limit
                  alert("File size should not exceed 5MB");
                  return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                  const base64String = event.target?.result as string;
                  if (base64String) {
                    // Set default scale-type when image is uploaded
                    handleChange("scaleType", "contain");
                    // Store the base64 data
                    handleChange("base64Data", base64String.split(",")[1] || "");
                    // Store the complete data URL for preview
                    handleChange("src", base64String);
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </Button>

        {component.properties?.src && (
          <Box
            sx={{
              width: "100%",
              height: "200px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              border: "1px solid #eee",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <img
              src={component.properties.src}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: component.properties.scaleType || "contain",
              }}
            />
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                },
              }}
              onClick={() => {
                handleChange("src", "");
                handleChange("base64Data", "");
                handleChange("scaleType", "contain");
              }}
            >
              <FaTimes />
            </IconButton>
          </Box>
        )}

        <FormControl fullWidth size="small" required>
          <InputLabel>Scale Type</InputLabel>
          <Select
            value={component.properties?.scaleType || "contain"}
            onChange={(e) => handleChange("scaleType", e.target.value)}
            label="Scale Type *"
          >
            <MenuItem value="contain">Contain</MenuItem>
            <MenuItem value="cover">Cover</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Width (px) (Optional)"
          fullWidth
          type="number"
          value={component.properties?.width || ""}
          onChange={(e) => handleChange("width", e.target.value)}
          size="small"
          inputProps={{ min: 0 }}
        />

        <TextField
          label="Height (px) (Optional)"
          fullWidth
          type="number"
          value={component.properties?.height || ""}
          onChange={(e) => handleChange("height", e.target.value)}
          size="small"
          inputProps={{ min: 0 }}
        />

        <TextField
          label="Aspect-ratio (Optional)"
          fullWidth
          type="number"
          value={component.properties?.aspectRatio || "1"}
          onChange={(e) => handleChange("aspectRatio", e.target.value)}
          size="small"
        />

        <TextField
          label="Alt Text"
          fullWidth
          value={component.properties?.altText || ""}
          onChange={(e) => handleChange("altText", e.target.value)}
          size="small"
        />
  </Stack>

  );
}
