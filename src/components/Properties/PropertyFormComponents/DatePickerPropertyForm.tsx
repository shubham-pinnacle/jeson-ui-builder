import React, { useEffect, useState } from "react";
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

export default function DatePickerPropertyForm(props: FieldRendererProps) {
  const { component, onPropertyChange: handleChange } = props;

  const [initValueError, setInitValueError] = useState("");
  const [unavailableDateError, setUnavailableDateError] = useState("");

  useEffect(() => {
    if (component.type === "date-picker") {
      const defaultProperties = {
        label: "",
        outputVariable: "",
        initValue: "",
        minDate: "",
        maxDate: "",
        unavailableDates: [] as string[],
        required: "false",
        visible: "true",
        helperText: ""
      };

      if (
        !component.properties ||
        Object.keys(defaultProperties).some(
          (key) => !(key in (component.properties || {}))
        )
      ) {
        handleChange("properties", {
          ...defaultProperties,
          ...(component.properties || {})
        });
      }
    }
  }, [component.id, component.type]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const unavailableDates: string[] =
    (component.properties?.unavailableDates as string[]) || [];

  const DatePickerComponent = isMobile ? MobileDatePicker : DatePicker;

  const minDate = component.properties?.minDate
    ? parseISO(component.properties.minDate)
    : null;
  const maxDate = component.properties?.maxDate
    ? parseISO(component.properties.maxDate)
    : null;

  const isDateOutOfRange = (date: Date | null) => {
    if (!date) return false;
    if (minDate && isBefore(date, minDate)) return true;
    if (maxDate && isAfter(date, maxDate)) return true;
    return false;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={2}>
        <TextField
          label="Label"
          required
          fullWidth
          value={component.properties?.label || ""}
          onChange={(e) => handleChange("label", e.target.value)}
          size="small"
        />
        <TextField
          label="Output Variable"
          required
          fullWidth
          value={component.properties?.outputVariable || ""}
          onChange={(e) => handleChange("outputVariable", e.target.value)}
          size="small"
        />

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
                  minDate ? format(minDate, "yyyy-MM-dd") : "start"
                } and ${
                  maxDate ? format(maxDate, "yyyy-MM-dd") : "end"
                } inclusive.`
              );
            } else {
              setInitValueError("");
              handleChange(
                "initValue",
                newValue ? format(newValue, "yyyy-MM-dd") : ""
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

        <DatePickerComponent
          label="Min Date (Optional)"
          value={minDate}
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

        <DatePickerComponent
          label="Max Date (Optional)"
          value={maxDate}
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

        <DatePickerComponent
          label="Add Unavailable Date (Optional)"
          value={null}
          onChange={(newValue) => {
            if (!newValue) return;
            const formatted = format(newValue, "yyyy-MM-dd");

            if (isDateOutOfRange(newValue)) {
              setUnavailableDateError(
                `Date must be between ${
                  minDate ? format(minDate, "yyyy-MM-dd") : "start"
                } and ${
                  maxDate ? format(maxDate, "yyyy-MM-dd") : "end"
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
              readOnly: true
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

        <FormControl fullWidth size="small">
          <InputLabel>Visible (Optional)</InputLabel>
          <Select
            value={component.properties?.visible || "true"}
            onChange={(e) => handleChange("visible", e.target.value)}
            label="Visible (Optional)"
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Helper Text (Optional)"
          fullWidth
          value={component.properties?.helperText || ""}
          onChange={(e) => handleChange("helperText", e.target.value)}
          size="small"
        />
      </Stack>
    </LocalizationProvider>
  );
}
