import React, { useState } from "react";
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { FieldRendererProps } from "./FieldRendererProps";

export default function TextCaptionPropertyForm({
  component,
  onPropertyChange: h,
}: Pick<FieldRendererProps, "component" | "onPropertyChange">) {
  // Initialize text array for markdown mode
  const [textItems, setTextItems] = useState<string[]>([]);
  
  // Handle component property changes
  const handleChange = (prop: string, value: any) => {
    // If markdown is being set to true, convert text to array format and set fontWeight to normal and strikethrough to false
    if (prop === "markdown" && value === "true") {
      // Get current values to update
      const currentText = component.properties?.text || "";
      let textArray;
      
      if (typeof currentText === "string") {
        // Split by newlines to create separate array elements
        textArray = currentText.split("\n");
        if (textArray.length === 0) {
          textArray = [""];
        }
      } else {
        textArray = currentText;
      }
      
      // Update all properties at once for immediate JSON update
      h("fontWeight", "");
      h("strikethrough", undefined);
      h("text", textArray);
      h(prop, value);
      
      // Update local state after updating all properties
      setTextItems(textArray);
    } else if (prop === "markdown" && value === "false") {
      // When switching from markdown to non-markdown, convert array to string
      const currentText = component.properties?.text || "";
      // Convert array to string when coming from markdown mode
      if (Array.isArray(currentText)) {
        // Join with newlines
        const stringText = currentText.join("\n");
        h("text", stringText);
        h("strikethrough", component.properties?.strikethrough);
      } else {
        h("text", currentText); // Keep existing text
      }
      
      h(prop, value);
    } else {
      // Handle property change normally
      h(prop, value);
    }
  };
  
  // Handle updates to individual text items in the array
  const handleTextItemChange = (index: number, value: string) => {
    const newTextItems = [...textItems];
    newTextItems[index] = value;
    setTextItems(newTextItems);
    h("text", newTextItems);
  };
  
  // Add a new text item
  const addTextItem = () => {
    const newTextItems = [...textItems, ""];
    setTextItems(newTextItems);
    h("text", newTextItems);
  };
  
  // Delete a text item
  const deleteTextItem = (index: number) => {
    const newTextItems = textItems.filter((_, i: number) => i !== index);
    if (newTextItems.length === 0) {
      newTextItems.push("");
    }
    setTextItems(newTextItems);
    h("text", newTextItems);
  };
  
  // Get text content based on current state
  const textContent = component.properties?.text || "";
  const maxLength = 409; // Based on the documentation for TextCaption
  const isOverLimit = typeof textContent === "string" ? 
    textContent.length > maxLength : 
    textContent.join("").length > maxLength;
  const isMarkdown = component.properties?.markdown?.toString() === "true";
  
  // Synchronize component text with local state when component changes or markdown is toggled
  React.useEffect(() => {
    if (isMarkdown) {
      // Only update if the values aren't already set correctly in the json editor
      if (component.properties?.fontWeight !== "") {
        h("fontWeight", "");
      }
      if (component.properties?.strikethrough !== undefined) {
        h("strikethrough", undefined);
      }
      
      // Initialize text items from component properties
      const currentText = component.properties?.text || "";
      if (Array.isArray(currentText)) {
        setTextItems(currentText);
      } else if (typeof currentText === "string") {
        const textArray = currentText.split("\n");
        setTextItems(textArray);
        h("text", textArray); // Convert to array in component props
      }
    } else {
      // If not in markdown mode, ensure text is a string, not an array
      const currentText = component.properties?.text || "";
      if (Array.isArray(currentText)) {
        // Convert array to string when in non-markdown mode
        const stringText = currentText.join("\n");
        h("text", stringText);
      }
    }
  }, [isMarkdown, component.properties?.fontWeight, component.properties?.strikethrough, component.properties?.text]);
  
  return (
    <Stack spacing={2}>
      {!isMarkdown ? (
        // Standard text field for non-markdown mode
        <TextField
          label="Text Caption"
          required
          fullWidth
          multiline
          rows={4}
          value={typeof textContent === "string" ? textContent : textContent.join("\n")}
          onChange={(e) => handleChange("text", e.target.value)}
          size="small"
          error={isOverLimit}
          helperText={`${typeof textContent === "string" ? textContent.length : textContent.join("").length}/${maxLength} characters`}
          FormHelperTextProps={{
            sx: {
              color: isOverLimit ? 'red' : 'text.secondary',
              fontWeight: isOverLimit ? 600 : 400,
            },
          }}
        />
      ) : (
        // Text caption fields for markdown mode
        <>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Text (Markdown Enabled)
          </Typography>
          
          {textItems.map((item: string, index: number) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                label={`Text ${index + 1}`}
                fullWidth
                value={item}
                onChange={(e) => handleTextItemChange(index, e.target.value)}
                size="small"
                sx={{ mr: 1 }}
              />
              <IconButton 
                color="error" 
                onClick={() => deleteTextItem(index)}
                disabled={textItems.length <= 1} // Prevent deleting the last item
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          
          <Button 
            variant="outlined" 
            onClick={addTextItem} 
            sx={{ alignSelf: 'flex-end' }}
          >
            ADD
          </Button>
        </>
      )}

      <FormControl fullWidth size="small">
        <InputLabel>Visible (Optional)</InputLabel>
        <Select
          value={component.properties?.visible?.toString() ?? "true"}
          onChange={(e) => handleChange("visible", e.target.value)}
          label="Visible (Optional)"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" disabled={isMarkdown}>
        <InputLabel>Font Weight (Optional)</InputLabel>
        <Select
          value={isMarkdown ? "" : (component.properties?.fontWeight ?? "")}
          onChange={(e) => handleChange("fontWeight", e.target.value)}
          label="Font Weight (Optional)"
        >
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="bold">Bold</MenuItem>
          <MenuItem value="italic">Italic</MenuItem>
          <MenuItem value="bold_italic">Bold Italic</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" disabled={isMarkdown}>
        <InputLabel>Strike Through (Optional)</InputLabel>
        <Select
          value={isMarkdown ? "" : (component.properties?.strikethrough ?? "")}
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
          value={component.properties?.markdown?.toString() ?? "false"}
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
