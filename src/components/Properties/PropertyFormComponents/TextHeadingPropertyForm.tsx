import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setText } from '../../../slices/TextHeading/textSlice';

export default function TextHeadingPropertyForm({
  component,
  onPropertyChange: h,
}: Pick<FieldRendererProps, "component" | "onPropertyChange">) {
  const dispatch = useDispatch();
  const globalText = useSelector((state: RootState) => state.text.value);
  const localText = component.properties?.text || "";
  const text = globalText || localText;

  const [touched, setTouched] = useState(false);
  const trimmedText = text.trim();
  const maxChars = 80;
  const isOverLimit = text.length > maxChars;
  const isEmpty = touched && trimmedText === "";

  const handleChange = (value: string) => {
    setTouched(true);
    if (value.length <= maxChars) {
      dispatch(setText(value));       
      h("text", value);               
    }
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Text Heading"
        required
        fullWidth
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        size="small"
        error={isOverLimit || isEmpty}
        helperText={
          isEmpty
            ? "Text Heading cannot be empty."
            : `${text.length}/${maxChars} characters`
        }
        FormHelperTextProps={{
          sx: {
            color: isOverLimit || isEmpty ? "error.main" : "text.secondary",
            fontWeight: isOverLimit || isEmpty ? 600 : 400,
          },
        }}
        onBlur={() => setTouched(true)}
      />
      <FormControl fullWidth size="small">
        <InputLabel>Visible</InputLabel>
        <Select
          value={component.properties?.visible || "true"}
          onChange={(e) => h("visible", e.target.value)}
          label="Visible"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
