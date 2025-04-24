import { useState } from "react";
import {
  LocalizationProvider,
  DatePicker,
  MobileDatePicker
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { parseISO, format, isBefore, isAfter } from "date-fns";
import { FieldRendererProps } from "./FieldRendererProps";

export default function DatePickerPropertyForm({
  component, onPropertyChange: handleChange,
}: Pick<FieldRendererProps, "component" | "onPropertyChange">) {
  //const { component, onPropertyChange: handleChange } = props;

  const [initValueError, setInitValueError] = useState("");
  const [unavailableDateError, setUnavailableDateError] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const DatePickerComponent = isMobile ? MobileDatePicker : DatePicker;

  // Ensure we have a string[] for unavailableDates
  const unavailableDates: string[] = Array.isArray(component.properties?.unavailableDates)
    ? component.properties.unavailableDates
    : [];

  const isDateOutOfRange = (date: Date | null) => {
    if (!date) return false;
    const min = component.properties?.minDate
      ? parseISO(component.properties.minDate)
      : null;
    const max = component.properties?.maxDate
      ? parseISO(component.properties.maxDate)
      : null;

    if (min && isBefore(date, min)) return true;
    if (max && isAfter(date, max)) return true;
    return false;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={2}>
        {/* Label */}
        <TextField
          label="Label"
          required
          fullWidth
          size="small"
          value={component.properties?.label || ""}
          onChange={(e) => handleChange("label", e.target.value)}
        />

        {/* Output Variable */}
        <TextField
          label="Output Variable"
          required
          fullWidth
          size="small"
          value={component.properties?.outputVariable || ""}
          onChange={(e) => handleChange("outputVariable", e.target.value)}
        />

        {/* Initial Value */}
        <DatePickerComponent
          label="Initial Value (Optional)"
          value={
            component.properties?.initValue
              ? parseISO(component.properties.initValue)
              : null
          }
          onChange={(newValue) => {
            if (newValue && isDateOutOfRange(newValue)) {
              setInitValueError(
                `Initial value must be between ${
                  component.properties?.minDate
                    ? component.properties.minDate
                    : "start"
                } and ${
                  component.properties?.maxDate
                    ? component.properties.maxDate
                    : "end"
                } inclusive.`
              );
            } else {
              setInitValueError("");
              handleChange(
                "initValue",
                newValue ? format(newValue, "yyyy-MM-dd") : null
              );
            }
          }}
          shouldDisableDate={(date) =>
            unavailableDates.includes(format(date, "yyyy-MM-dd"))
          }
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
              error: !!initValueError,
              helperText: initValueError || ""
            },
            day: {
              sx: {
                "&.Mui-selected": {
                  backgroundColor: "#1976d2 !important",
                  color: "#fff !important"
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#1565c0 !important"
                },
                "&.MuiPickersDay-today": {
                  borderColor: "#1976d2"
                }
              }
            }
          }}
        />

        {/* Min Date */}
        <DatePickerComponent
          label="Min Date (Optional)"
          value={
            component.properties?.minDate
              ? parseISO(component.properties.minDate)
              : null
          }
          onChange={(newValue) =>
            handleChange(
              "minDate",
              newValue ? format(newValue, "yyyy-MM-dd") : ""
            )
          }
          slotProps={{
            textField: { fullWidth: true, size: "small" }
          }}
        />

        {/* Max Date */}
        <DatePickerComponent
          label="Max Date (Optional)"
          value={
            component.properties?.maxDate
              ? parseISO(component.properties.maxDate)
              : null
          }
          onChange={(newValue) =>
            handleChange(
              "maxDate",
              newValue ? format(newValue, "yyyy-MM-dd") : ""
            )
          }
          slotProps={{
            textField: { fullWidth: true, size: "small" }
          }}
        />

        {/* Unavailable Dates */}
        <DatePickerComponent
          label="Add Unavailable Date (Optional)"
          value={null}
          onChange={(newValue) => {
            if (!newValue) return;
            const formatted = format(newValue, "yyyy-MM-dd");

            if (isDateOutOfRange(newValue)) {
              setUnavailableDateError(
                `Date must be between ${
                  component.properties?.minDate || "start"
                } and ${
                  component.properties?.maxDate || "end"
                } inclusive.`
              );
              return;
            }

            if (!unavailableDates.includes(formatted)) {
              setUnavailableDateError("");
              handleChange("unavailableDates", [
                ...unavailableDates,
                formatted
              ]);
            }
          }}
          shouldDisableDate={(date) =>
            unavailableDates.includes(format(date, "yyyy-MM-dd"))
          }
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
              value: unavailableDates.join(", "),
              error: !!unavailableDateError,
              helperText:
                unavailableDateError ||
                "Dates that users won’t be able to select",
              // readOnly: true
            },
            day: {
              sx: {
                "&.Mui-selected": {
                  backgroundColor: "#1976d2 !important",
                  color: "#fff !important"
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#1565c0 !important"
                },
                "&.MuiPickersDay-today": {
                  borderColor: "#1976d2"
                },
                "&.Mui-disabled": {
                  backgroundColor: "#bbdefb !important",
                  color: "#1976d2 !important"
                }
              }
            }
          }}
        />

        {/* Enabled */}
        <FormControl fullWidth size="small">
          <InputLabel>Enabled (Optional)</InputLabel>
          <Select
            value={component.properties?.enabled ?? "true"}
            onChange={(e) => handleChange("enabled", e.target.value)}
            label="Enabled (Optional)"
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>

        {/* Visible */}
        <FormControl fullWidth size="small">
          <InputLabel>Visible (Optional)</InputLabel>
          <Select
            value={component.properties?.visible ?? "true"}
            onChange={(e) => handleChange("visible", e.target.value)}
            label="Visible (Optional)"
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>

        {/* Helper Text */}
        <TextField
          label="Helper Text (Optional)"
          fullWidth
          size="small"
          value={component.properties?.helperText || ""}
          onChange={(e) => handleChange("helperText", e.target.value)}
        />
      </Stack>
    </LocalizationProvider>
  );
}
