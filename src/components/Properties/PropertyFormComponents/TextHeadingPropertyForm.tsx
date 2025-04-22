import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { FieldRendererProps } from "./FieldRendererProps";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store'
import { setText } from '../../../slices/TextHeading/textSlice';

export default function TextHeadingPropertyForm({
  component, onPropertyChange: h,
}: Pick<FieldRendererProps, "component" | "onPropertyChange">) {
  
  const dispatch = useDispatch();
  const text = useSelector((state: RootState) => state.text.value);
  
  return (
    <Stack spacing={2}>
      <TextField
        label="Text Heading"
        required fullWidth
        value={text || ""}
        onChange={e => dispatch(setText(e.target.value))}
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
