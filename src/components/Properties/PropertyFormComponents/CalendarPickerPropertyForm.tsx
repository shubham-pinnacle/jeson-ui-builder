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
import { parseISO, format, isBefore, isAfter, differenceInDays } from "date-fns";
import { FieldRendererProps } from "./FieldRendererProps";

export default function CalendarPickerPropertyForm({
  component, onPropertyChange: handleChange,
}: Pick<FieldRendererProps, "component" | "onPropertyChange">) {
  const [initValueError, setInitValueError] = useState("");
  const [unavailableDateError, setUnavailableDateError] = useState("");
  const [labelError, setLabelError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [helperTextError, setHelperTextError] = useState("");
  const [errorMessageError, setErrorMessageError] = useState("");
  const [minDaysError, setMinDaysError] = useState("");
  const [maxDaysError, setMaxDaysError] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const DatePickerComponent = isMobile ? MobileDatePicker : DatePicker;

  // Ensure we have a string[] for unavailableDates
  const unavailableDates: string[] = Array.isArray(component.properties?.unavailableDates)
    ? component.properties.unavailableDates
    : [];

  const mode = component.properties?.mode || "single";

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

  const validateField = (field: string, value: string, limit: number) => {
    if (value.length > limit) {
      switch (field) {
        case "label":
          setLabelError(`Label must be ${limit} characters or less`);
          break;
        case "title":
          setTitleError(`Title must be ${limit} characters or less`);
          break;
        case "description":
          setDescriptionError(`Description must be ${limit} characters or less`);
          break;
        case "helperText":
          setHelperTextError(`Helper text must be ${limit} characters or less`);
          break;
        case "errorMessage":
          setErrorMessageError(`Error message must be ${limit} characters or less`);
          break;
      }
      return false;
    } else {
      switch (field) {
        case "label":
          setLabelError("");
          break;
        case "title":
          setTitleError("");
          break;
        case "description":
          setDescriptionError("");
          break;
        case "helperText":
          setHelperTextError("");
          break;
        case "errorMessage":
          setErrorMessageError("");
          break;
      }
      return true;
    }
  };

  const handleTextChange = (field: string, value: string, limit: number) => {
    if (validateField(field, value, limit)) {
      handleChange(field, value);
    } else {
      // Still update the value even if it's invalid
      handleChange(field, value);
    }
  };

  const handleRangeInitValueChange = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      if (isDateOutOfRange(startDate) || isDateOutOfRange(endDate)) {
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
        return;
      }

      // Check min days constraint
      const minDays = parseInt(component.properties?.minDays || "0", 10);
      const maxDays = parseInt(component.properties?.maxDays || "0", 10);
      const daysDiff = differenceInDays(endDate, startDate);

      if (minDays > 0 && daysDiff < minDays) {
        setInitValueError(`Range must be at least ${minDays} days`);
        return;
      }

      if (maxDays > 0 && daysDiff > maxDays) {
        setInitValueError(`Range must be at most ${maxDays} days`);
        return;
      }

      setInitValueError("");
      const rangeValue = {
        "start-date": format(startDate, "yyyy-MM-dd"),
        "end-date": format(endDate, "yyyy-MM-dd")
      };
      handleChange("initValue", JSON.stringify(rangeValue));
    } else {
      setInitValueError("");
      handleChange("initValue", null);
    }
  };

  const renderInitValueField = () => {
    if (mode === "single") {
      return (
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
      );
    } else {
      // Range mode
      let startDate = null;
      let endDate = null;

      if (component.properties?.initValue) {
        try {
          const rangeValue = JSON.parse(component.properties.initValue);
          if (rangeValue["start-date"]) {
            startDate = parseISO(rangeValue["start-date"]);
          }
          if (rangeValue["end-date"]) {
            endDate = parseISO(rangeValue["end-date"]);
          }
        } catch (e) {
          // Invalid JSON, ignore
        }
      }

      return (
        <>
          <DatePickerComponent
            label="Initial Start Date (Optional)"
            value={startDate}
            onChange={(newValue) => {
              if (endDate) {
                handleRangeInitValueChange(newValue, endDate);
              } else {
                setInitValueError("");
                if (newValue) {
                  const rangeValue = {
                    "start-date": format(newValue, "yyyy-MM-dd"),
                    "end-date": ""
                  };
                  handleChange("initValue", JSON.stringify(rangeValue));
                } else {
                  handleChange("initValue", null);
                }
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
              }
            }}
          />
          <DatePickerComponent
            label="Initial End Date (Optional)"
            value={endDate}
            onChange={(newValue) => {
              if (startDate) {
                handleRangeInitValueChange(startDate, newValue);
              } else {
                setInitValueError("Please select a start date first");
              }
            }}
            shouldDisableDate={(date) => {
              return unavailableDates.includes(format(date, "yyyy-MM-dd")) ||
                (startDate !== null && isBefore(date, startDate));
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                size: "small"
              }
            }}
          />
        </>
      );
    }
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
          onChange={(e) => handleTextChange("label", e.target.value, 40)}
          error={!!labelError}
          helperText={labelError}
        />

        {/* Title */}
        <TextField
          label="Title (Optional)"
          fullWidth
          size="small"
          value={component.properties?.title || ""}
          onChange={(e) => handleTextChange("title", e.target.value, 80)}
          error={!!titleError}
          helperText={titleError}
        />

        {/* Description */}
        <TextField
          label="Description (Optional)"
          fullWidth
          size="small"
          multiline
          rows={2}
          value={component.properties?.description || ""}
          onChange={(e) => handleTextChange("description", e.target.value, 300)}
          error={!!descriptionError}
          helperText={descriptionError}
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

        {/* Mode */}
        <FormControl fullWidth size="small">
          <InputLabel>Mode</InputLabel>
          <Select
            value={component.properties?.mode || "single"}
            onChange={(e) => handleChange("mode", e.target.value)}
            label="Mode"
          >
            <MenuItem value="single">Single Date</MenuItem>
            <MenuItem value="range">Date Range</MenuItem>
          </Select>
        </FormControl>

        {/* Initial Value */}
        {renderInitValueField()}

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
                "Dates that users won't be able to select",
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

        {/* Range mode specific fields */}
        {mode === "range" && (
          <>
            {/* Include Days */}
            <TextField
              label="Include Days (Optional)"
              fullWidth
              size="small"
              type="text"
              value={component.properties?.includeDays || ""}
              onChange={(e) => handleChange("includeDays", e.target.value)}
              helperText="Comma-separated list of days to include (e.g., 'Mon,Tue,Wed')"
            />

            {/* Min Days */}
            <TextField
              label="Min Days (Optional)"
              fullWidth
              size="small"
              type="number"
              value={component.properties?.minDays || ""}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = parseInt(value, 10);
                const maxDays = parseInt(component.properties?.maxDays || "0", 10);
                
                if (value === "" || isNaN(numValue)) {
                  setMinDaysError("");
                  handleChange("minDays", value);
                } else if (numValue < 0) {
                  setMinDaysError("Min days cannot be negative");
                  handleChange("minDays", value);
                } else if (maxDays > 0 && numValue > maxDays) {
                  setMinDaysError("Min days cannot be greater than max days");
                  handleChange("minDays", value);
                } else {
                  setMinDaysError("");
                  handleChange("minDays", value);
                }
              }}
              error={!!minDaysError}
              helperText={minDaysError}
            />

            {/* Max Days */}
            <TextField
              label="Max Days (Optional)"
              fullWidth
              size="small"
              type="number"
              value={component.properties?.maxDays || ""}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = parseInt(value, 10);
                const minDays = parseInt(component.properties?.minDays || "0", 10);
                
                if (value === "" || isNaN(numValue)) {
                  setMaxDaysError("");
                  handleChange("maxDays", value);
                } else if (numValue < 0) {
                  setMaxDaysError("Max days cannot be negative");
                  handleChange("maxDays", value);
                } else if (minDays > 0 && numValue < minDays) {
                  setMaxDaysError("Max days cannot be less than min days");
                  handleChange("maxDays", value);
                } else {
                  setMaxDaysError("");
                  handleChange("maxDays", value);
                }
              }}
              error={!!maxDaysError}
              helperText={maxDaysError}
            />
          </>
        )}

        {/* Required */}
        <FormControl fullWidth size="small">
          <InputLabel>Required (Optional)</InputLabel>
          <Select
            value={component.properties?.required || "false"}
            onChange={(e) => handleChange("required", e.target.value)}
            label="Required (Optional)"
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>

        {/* Enabled */}
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

        {/* Visible */}
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

        {/* Helper Text */}
        <TextField
          label="Helper Text (Optional)"
          fullWidth
          size="small"
          value={component.properties?.helperText || ""}
          onChange={(e) => handleTextChange("helperText", e.target.value, 80)}
          error={!!helperTextError}
          helperText={helperTextError}
        />

        {/* Error Message */}
        <TextField
          label="Error Message (Optional)"
          fullWidth
          size="small"
          value={component.properties?.errorMessage || ""}
          onChange={(e) => handleTextChange("errorMessage", e.target.value, 80)}
          error={!!errorMessageError}
          helperText={errorMessageError}
        />
      </Stack>
    </LocalizationProvider>
  );
}
