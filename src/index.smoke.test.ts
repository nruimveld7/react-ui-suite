import { describe, expect, it } from "vitest";
import * as ReactUiSuite from "./index";

const expectedRuntimeExports = [
  "Alert",
  "Badge",
  "Button",
  "Card",
  "Checkbox",
  "ColorPicker",
  "Combobox",
  "DatalistInput",
  "DatePicker",
  "Dialog",
  "Disclosure",
  "Dropdown",
  "InputField",
  "NumberInput",
  "OutputChip",
  "Popover",
  "Progress",
  "Meter",
  "Radio",
  "Select",
  "Slider",
  "StackedList",
  "TabGroup",
  "Table",
  "Textarea",
  "Toggle",
];

describe("package exports", () => {
  it.each(expectedRuntimeExports)("exposes %s", (exportName) => {
    expect((ReactUiSuite as Record<string, unknown>)[exportName]).toBeTruthy();
  });
});
