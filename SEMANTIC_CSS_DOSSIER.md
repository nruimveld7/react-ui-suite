# SEMANTIC_CSS_DOSSIER

## Repo Overview

Package manager: npm (package-lock.json present).

Workspaces: root package.json lists workspaces "src" (library) and "demo" (demo app).

Build tooling:

- Library build: tsup (see src/tsup.config.ts).
- Demo app: Vite + @vitejs/plugin-react (see demo/vite.config.ts).
- Tests: Vitest (root vitest.config.ts) and Playwright (playwright.config.ts).

CSS tooling:

- Plain CSS files imported directly (no CSS Modules in repo).
- tsup is configured with loader ".css": "copy" for library build.

Component entrypoints and exports:

- Library entrypoint: src/index.ts (exports all components, and imports global styles).
- Component barrels: src/components/*/index.ts.

Where styles are loaded/injected:

- Global CSS imports in src/index.ts: utility-vars.css -> tokens.css -> layout-safety.css.
- Each component imports its own .css file in its TSX file.
- Demo app has its own App.css and index.css under demo/src.

tree -L 3 (excluding node_modules/dist/test-results):

```
.github/
  workflows/
    ci.yml
.gitignore
.npmignore
.prettierignore
.prettierrc
demo/
  component-registry.ts
  index.html
  package.json
  src/
    App.css
    App.tsx
    components/
    index.css
    lib/
    main.tsx
  tests/
    __screenshots__/
    visual.spec.ts
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
eslint.config.js
LICENSE
package-lock.json
package.json
playwright.config.ts
README.md
scripts/
  .tmp/
  dedupe-css-rules.mjs
  find-duplicate-css-rules.mjs
SEMANTIC_CSS_DOSSIER.md
src/
  components/
    Alert/
    Badge/
    Button/
    Card/
    Checkbox/
    ColorPicker/
    Combobox/
    DatalistInput/
    DatePicker/
    Dialog/
    Disclosure/
    Dropdown/
    InputField/
    NumberInput/
    OutputChip/
    Popover/
    ProgressMeter/
    Radio/
    ResizableContainer/
    Select/
    Slider/
    StackedList/
    TabGroup/
    Table/
    Textarea/
    Toggle/
  index.smoke.test.ts
  index.ts
  LICENSE
  package.json
  README.md
  styles/
    css.d.ts
    layout-safety.css
    tokens.css
    utility-vars.css
  tsup.config.ts
  utils/
    ref.ts
tree.txt
tsconfig.json
vitest.config.ts
vitest.setup.ts
```

Relevant package.json scripts:

Root scripts:

```
build: npm run build --workspace react-ui-suite
dev: npm run dev --workspace demo
lint: npm run lint --workspace react-ui-suite
test: npm run test --workspace react-ui-suite
test:visual: playwright test
test:visual:update: playwright test --update-snapshots
test:visual:update:light: playwright test --update-snapshots --project=light
test:visual:update:dark: playwright test --update-snapshots --project=dark
format: prettier . --write
format:check: prettier . --check
```

Library workspace scripts (src/package.json):

```
build: tsup --config tsup.config.ts
dev: tsup --watch --config tsup.config.ts
lint: eslint . --ext .ts,.tsx
test: vitest run --config ../vitest.config.ts
prepublishOnly: npm run build && npm run test && npm run lint
format: prettier . --write
format:check: prettier . --check
publish: npm publish --access public
```

Demo workspace scripts (demo/package.json):

```
dev: vite
build: vite build
preview: vite preview
```

## Component Inventory

| Component | Source path (TSX) | Style path(s) (CSS) | Uses CSS Modules? | Uses global classes? | Uses data-attributes? | Uses aria/state selectors? | Notes on complexity |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alert | src/components/Alert/Alert.tsx | src/components/Alert/Alert.css<br>src/components/Alert/Alert.demo.css | N | Y | Y | state | focus/aria |
| Badge | src/components/Badge/Badge.tsx | src/components/Badge/Badge.css<br>src/components/Badge/Badge.demo.css | N | Y | Y | aria | focus/aria |
| Button | src/components/Button/Button.tsx | src/components/Button/Button.css<br>src/components/Button/Button.demo.css | N | Y | Y | state | focus/aria, animation |
| Card | src/components/Card/Card.tsx | src/components/Card/Card.css<br>src/components/Card/Card.demo.css | N | Y | Y | state | - |
| Checkbox | src/components/Checkbox/Checkbox.tsx | src/components/Checkbox/Checkbox.css<br>src/components/Checkbox/Checkbox.demo.css | N | Y | Y | state | focus/aria, animation |
| ColorPicker | src/components/ColorPicker/ColorPicker.tsx | src/components/ColorPicker/ColorPicker.css<br>src/components/ColorPicker/ColorPicker.demo.css | N | Y | Y | state | positioning, focus/aria, dialog, popover, animation |
| Combobox | src/components/Combobox/Combobox.tsx | src/components/Combobox/Combobox.css<br>src/components/Combobox/Combobox.demo.css | N | Y | Y | state | positioning, focus/aria, listbox, animation |
| DatalistInput | src/components/DatalistInput/DatalistInput.tsx | src/components/DatalistInput/DatalistInput.css<br>src/components/DatalistInput/DatalistInput.demo.css | N | Y | Y | state | positioning, focus/aria, listbox, popover, animation |
| DatePicker | src/components/DatePicker/DatePicker.tsx | src/components/DatePicker/DatePicker.css<br>src/components/DatePicker/DatePicker.demo.css | N | Y | Y | state | positioning, focus/aria, resize, listbox, dialog, popover, animation |
| Dialog | src/components/Dialog/Dialog.tsx | src/components/Dialog/Dialog.css<br>src/components/Dialog/Dialog.demo.css | N | Y | N | state | portal, positioning, focus/aria, dialog |
| Disclosure | src/components/Disclosure/Disclosure.tsx | src/components/Disclosure/Disclosure.css<br>src/components/Disclosure/Disclosure.demo.css | N | Y | Y | state | focus/aria, animation |
| Dropdown | src/components/Dropdown/Dropdown.tsx | src/components/Dropdown/Dropdown.css | N | Y | Y | state | focus/aria, listbox, popover, animation |
| InputField | src/components/InputField/InputField.tsx | src/components/InputField/InputField.css<br>src/components/InputField/InputField.demo.css | N | Y | Y | state | focus/aria, animation |
| NumberInput | src/components/NumberInput/NumberInput.tsx | src/components/NumberInput/NumberInput.css<br>src/components/NumberInput/NumberInput.demo.css | N | Y | Y | state | focus/aria, animation |
| OutputChip | src/components/OutputChip/OutputChip.tsx | src/components/OutputChip/OutputChip.css<br>src/components/OutputChip/OutputChip.demo.css | N | Y | N | - | - |
| Popover | src/components/Popover/Popover.tsx | src/components/Popover/Popover.css | N | Y | Y | - | portal, positioning, focus/aria, resize, popover, animation |
| ProgressMeter | src/components/ProgressMeter/ProgressMeter.tsx | src/components/ProgressMeter/ProgressMeter.css<br>src/components/ProgressMeter/ProgressMeter.demo.css | N | Y | N | state | positioning, focus/aria, animation |
| Radio | src/components/Radio/Radio.tsx | src/components/Radio/Radio.css<br>src/components/Radio/Radio.demo.css | N | Y | Y | state | positioning, focus/aria, animation |
| Select | src/components/Select/Select.tsx | src/components/Select/Select.css<br>src/components/Select/Select.demo.css | N | Y | N | state | positioning, focus/aria, listbox, popover, animation |
| Slider | src/components/Slider/Slider.tsx | src/components/Slider/Slider.css<br>src/components/Slider/Slider.demo.css | N | Y | N | - | positioning, focus/aria, resize, animation |
| StackedList | src/components/StackedList/StackedList.tsx | src/components/StackedList/StackedList.css<br>src/components/StackedList/StackedList.demo.css | N | Y | N | - | focus/aria |
| TabGroup | src/components/TabGroup/TabGroup.tsx | src/components/TabGroup/TabGroup.css<br>src/components/TabGroup/TabGroup.demo.css | N | Y | Y | state | positioning, focus/aria, resize, tablist |
| Table | src/components/Table/Table.tsx | src/components/Table/Table.css<br>src/components/Table/Table.demo.css | N | Y | N | state | positioning, focus/aria, resize, animation |
| Textarea | src/components/Textarea/Textarea.tsx | src/components/Textarea/Textarea.css<br>src/components/Textarea/Textarea.demo.css | N | Y | Y | state | focus/aria, resize, animation |
| ResizableContainer | src/components/ResizableContainer/ResizableContainer.tsx | src/components/ResizableContainer/ResizableContainer.css<br>src/components/ResizableContainer/ResizableContainer.demo.css | N | Y | Y | state | positioning, focus/aria, resize, animation |
| Toggle | src/components/Toggle/Toggle.tsx | src/components/Toggle/Toggle.css<br>src/components/Toggle/Toggle.demo.css | N | Y | Y | state | positioning, focus/aria, animation |

## Current CSS Architecture Diagnosis

Total CSS classes defined (unique class selectors): 2080.

Utility-like class heuristic:

- Any class name containing "__u-" or starting with "u-"/"bg-"/"text-"/"demo-" is considered utility-like (generated single-purpose styles).
- Utility-like class count (by name pattern): 1734.

Top 30 most frequently used classes (from TSX usage), with file references:

```
rui-text-wrap (50) -> src/components/Alert/Alert.tsx:36, src/components/Alert/Alert.tsx:37, src/components/Badge/Badge.tsx:20
rui-root (23) -> src/components/Alert/Alert.tsx:30, src/components/Badge/Badge.tsx:20, src/components/Button/Button.tsx:30
dark (15) -> src/components/ColorPicker/ColorPicker.demo.tsx:12, src/components/ColorPicker/ColorPicker.demo.tsx:12, src/components/ColorPicker/ColorPicker.demo.tsx:20
rui-slider-demo__u-border-width-1px--ca6bcd4b6f (7) -> src/components/Slider/Slider.demo.tsx:16, src/components/Slider/Slider.demo.tsx:143, src/components/Slider/Slider.demo.tsx:157
rui-slider-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 (7) -> src/components/Slider/Slider.demo.tsx:16, src/components/Slider/Slider.demo.tsx:24, src/components/Slider/Slider.demo.tsx:157
rui-slider__u-border-radius-9999px--ac204c1088 (7) -> src/components/Slider/Slider.tsx:365, src/components/Slider/Slider.tsx:376, src/components/Slider/Slider.tsx:387
rui-slider__u-position-absolute--da4dbfbc4f (7) -> src/components/Slider/Slider.tsx:376, src/components/Slider/Slider.tsx:387, src/components/Slider/Slider.tsx:394
rui-table-demo__u-border-width-1px--ca6bcd4b6f (7) -> src/components/Table/Table.demo.tsx:67, src/components/Table/Table.demo.tsx:79, src/components/Table/Table.demo.tsx:144
rui-table-demo__u-rui-border-opacity-1--52f4da2ca5 (7) -> src/components/Table/Table.demo.tsx:67, src/components/Table/Table.demo.tsx:79, src/components/Table/Table.demo.tsx:144
rui-date-picker__u-font-weight-600--e83a7042bc (6) -> src/components/DatePicker/DatePicker.tsx:321, src/components/DatePicker/DatePicker.tsx:335, src/components/DatePicker/DatePicker.tsx:397
rui-slider-demo__u-border-radius-1-5rem--ea189a088a (6) -> src/components/Slider/Slider.demo.tsx:16, src/components/Slider/Slider.demo.tsx:157, src/components/Slider/Slider.demo.tsx:194
rui-slider-demo__u-rui-border-opacity-1--52f4da2ca5 (6) -> src/components/Slider/Slider.demo.tsx:16, src/components/Slider/Slider.demo.tsx:157, src/components/Slider/Slider.demo.tsx:194
rui-slider-demo__u-padding-1rem--8e63407b5c (6) -> src/components/Slider/Slider.demo.tsx:16, src/components/Slider/Slider.demo.tsx:157, src/components/Slider/Slider.demo.tsx:194
rui-slider-demo__u-rui-border-opacity-1--2072c87505 (6) -> src/components/Slider/Slider.demo.tsx:16, src/components/Slider/Slider.demo.tsx:157, src/components/Slider/Slider.demo.tsx:194
rui-slider-demo__u-background-color-rgb-15-23-42-0---43aaa5e5c1 (6) -> src/components/Slider/Slider.demo.tsx:16, src/components/Slider/Slider.demo.tsx:157, src/components/Slider/Slider.demo.tsx:194
rui-tab-group-demo__group (6) -> src/components/TabGroup/TabGroup.demo.tsx:127, src/components/TabGroup/TabGroup.demo.tsx:141, src/components/TabGroup/TabGroup.demo.tsx:156
rui-table-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 (6) -> src/components/Table/Table.demo.tsx:67, src/components/Table/Table.demo.tsx:144, src/components/Table/Table.demo.tsx:168
rui-table-demo__u-display-flex--60fbb77139 (6) -> src/components/Table/Table.demo.tsx:69, src/components/Table/Table.demo.tsx:146, src/components/Table/Table.demo.tsx:159
rui-table-demo__u-rui-text-opacity-1--cc0274aad9 (6) -> src/components/Table/Table.demo.tsx:71, src/components/Table/Table.demo.tsx:148, src/components/Table/Table.demo.tsx:230
rui-table-demo__u-margin-top-0-75rem--eccd13ef4f (6) -> src/components/Table/Table.demo.tsx:82, src/components/Table/Table.demo.tsx:159, src/components/Table/Table.demo.tsx:176
rui-table__u-border-radius-9999px--ac204c1088 (6) -> src/components/Table/Table.tsx:305, src/components/Table/Table.tsx:314, src/components/Table/Table.tsx:318
rui-color-picker-demo__u-font-weight-600--e83a7042bc (5) -> src/components/ColorPicker/ColorPicker.demo.tsx:79, src/components/ColorPicker/ColorPicker.demo.tsx:90, src/components/ColorPicker/ColorPicker.demo.tsx:107
rui-color-picker-demo__u-font-size-0-75rem--359090c2d5 (5) -> src/components/ColorPicker/ColorPicker.demo.tsx:85, src/components/ColorPicker/ColorPicker.demo.tsx:100, src/components/ColorPicker/ColorPicker.demo.tsx:107
rui-color-picker-demo__u-border-width-1px--ca6bcd4b6f (5) -> src/components/ColorPicker/ColorPicker.demo.tsx:107, src/components/ColorPicker/ColorPicker.demo.tsx:160, src/components/ColorPicker/ColorPicker.demo.tsx:210
rui-color-picker__u-position-relative--d89972fe17 (5) -> src/components/ColorPicker/ColorPicker.tsx:508, src/components/ColorPicker/ColorPicker.tsx:521, src/components/ColorPicker/ColorPicker.tsx:529
rui-dialog__margin-0 (5) -> src/components/Dialog/Dialog.tsx:166, src/components/Dialog/Dialog.tsx:169, src/components/Dialog/Dialog.tsx:171
rui-number-input__u-font-size-0-75rem--359090c2d5 (5) -> src/components/NumberInput/NumberInput.tsx:68, src/components/NumberInput/NumberInput.tsx:85, src/components/NumberInput/NumberInput.tsx:106
rui-number-input__u-font-weight-600--e83a7042bc (5) -> src/components/NumberInput/NumberInput.tsx:68, src/components/NumberInput/NumberInput.tsx:85, src/components/NumberInput/NumberInput.tsx:106
rui-radio-demo__u-border-width-1px--ca6bcd4b6f (5) -> src/components/Radio/Radio.demo.tsx:48, src/components/Radio/Radio.demo.tsx:112, src/components/Radio/Radio.demo.tsx:129
rui-radio-demo__u-rui-border-opacity-1--52f4da2ca5 (5) -> src/components/Radio/Radio.demo.tsx:48, src/components/Radio/Radio.demo.tsx:112, src/components/Radio/Radio.demo.tsx:129
```

Top 30 smallest classes by rule declaration count (likely utilities):

```
dark (decls: 0) -> src/components/Card/Card.css
rui-card__u-style--766950d8cd (decls: 0) -> src/components/Card/Card.css
rui-card-demo__u-style--a2af19db46 (decls: 0) -> src/components/Card/Card.demo.css
rui-color-picker__u-style--0c15f6cff5 (decls: 0) -> src/components/ColorPicker/ColorPicker.css
rui-color-picker__u-style--1d2c140820 (decls: 0) -> src/components/ColorPicker/ColorPicker.css
rui-color-picker__u-style--1e4905f70e (decls: 0) -> src/components/ColorPicker/ColorPicker.css
rui-color-picker__u-style--25cf37df2c (decls: 0) -> src/components/ColorPicker/ColorPicker.css
rui-color-picker__u-style--3af28f8de4 (decls: 0) -> src/components/ColorPicker/ColorPicker.css
rui-color-picker__u-style--3c493ef2d8 (decls: 0) -> src/components/ColorPicker/ColorPicker.css
rui-color-picker__u-style--b63063b264 (decls: 0) -> src/components/ColorPicker/ColorPicker.css
rui-color-picker__u-style--e440174b6b (decls: 0) -> src/components/ColorPicker/ColorPicker.css
rui-color-picker__u-style--f31955b705 (decls: 0) -> src/components/ColorPicker/ColorPicker.css
rui-datalist-input__u-style--53929537d6 (decls: 0) -> src/components/DatalistInput/DatalistInput.css
rui-date-picker__u-style--53929537d6 (decls: 0) -> src/components/DatePicker/DatePicker.css
rui-date-picker__u-style--afa7252096 (decls: 0) -> src/components/DatePicker/DatePicker.css
rui-date-picker__u-style--b32a66250a (decls: 0) -> src/components/DatePicker/DatePicker.css
rui-dialog__u-style--01cab00bd2 (decls: 0) -> src/components/Dialog/Dialog.css
rui-dialog__u-style--c70bec9a20 (decls: 0) -> src/components/Dialog/Dialog.css
rui-disclosure__u-style--53929537d6 (decls: 0) -> src/components/Disclosure/Disclosure.css
rui-output-chip__u-style--2e15338efe (decls: 0) -> src/components/OutputChip/OutputChip.css
rui-output-chip__u-style--5c915372ed (decls: 0) -> src/components/OutputChip/OutputChip.css
rui-output-chip__u-style--ac04a0392c (decls: 0) -> src/components/OutputChip/OutputChip.css
rui-output-chip__u-style--e969a1cf72 (decls: 0) -> src/components/OutputChip/OutputChip.css
5 (decls: 1) -> src/components/DatalistInput/DatalistInput.demo.css
alert-demo-grid (decls: 1) -> src/components/Alert/Alert.demo.css
badge-demo-grid (decls: 1) -> src/components/Badge/Badge.demo.css
bg-demo-accent (decls: 1) -> src/components/Button/Button.demo.css
bg-demo-emerald (decls: 1) -> src/components/Button/Button.demo.css
bg-demo-ghost (decls: 1) -> src/components/Button/Button.demo.css
bg-demo-rose (decls: 1) -> src/components/Button/Button.demo.css
```

Conclusion: the CSS is dominated by atomic, generated utility-style classes (e.g. __u-*) that encode single properties and hashed values. This mirrors Tailwind-style composition but without semantic grouping, leading to: high class churn, hard-to-read JSX, excessive selector count, and fragile duplication across demos and components. Maintaining consistent semantics or updating design tokens requires editing many single-purpose rules instead of a small set of semantic component selectors.

## Styling Entry Points and Precedence

Global CSS files and import order (src/index.ts):

- src/styles/utility-vars.css
- src/styles/tokens.css
- src/styles/layout-safety.css

CSS reset/normalize:

- No explicit normalize/reset file; layout-safety.css provides a minimal safety base.

Theme mechanism:

- Theme is driven by [data-theme="light"|"dark"] selectors and many :is(.dark *) selectors.
- Demo app stores theme in localStorage (component-gallery-theme) and Playwright sets colorScheme project to light/dark.

CSS variables usage:

- Tokens defined in src/styles/tokens.css (colors, spacing, radius, shadow) under :root/[data-theme].
- Utility variable initialization in src/styles/utility-vars.css (Tailwind-like CSS variable scaffolding).

Specificity strategy:

- Mostly single-class selectors (e.g., .rui-*) plus generated utility classes and occasional attribute selectors.
- Many selectors use :is(.dark *) for theme overrides; no explicit layering or specificity conventions beyond that.

!important usage count: 5.

Top !important offenders:

```
src/components/Dialog/Dialog.css: 4
src/components/Textarea/Textarea.css: 1
```

Search results (samples):

```
src/styles/tokens.css:1: :root,
src/components/Dialog/Dialog.css:104: padding-left: 0px !important;
src/components/Dialog/Dialog.css:105: padding-right: 0px !important;
src/components/Dialog/Dialog.css:130: padding-top: 0px !important;
src/components/Dialog/Dialog.css:131: padding-bottom: 0px !important;
src/components/Textarea/Textarea.css:73: resize: none !important;
src/components/Alert/Alert.css:85: [data-theme="dark"] .rui-alert--info {
src/components/Alert/Alert.css:99: [data-theme="dark"] .rui-alert--success {
src/components/Alert/Alert.css:113: [data-theme="dark"] .rui-alert--warning {
src/components/Alert/Alert.css:127: [data-theme="dark"] .rui-alert--danger {
src/components/Badge/Badge.css:28: [data-theme="dark"] .rui-badge--neutral {
```

Cascade order (current): global tokens/utility-vars/layout-safety load first, then component-level CSS files (imported inside each component). Demo app CSS (demo/src/App.css, demo/src/index.css) is separate and applies only to demo app. Theme overrides are handled via [data-theme] and .dark selectors, which can override base component selectors due to selector specificity + order.

## Playwright Visual Baseline Setup

Snapshot storage and naming:

- Snapshots stored under demo/tests/__screenshots__/light and demo/tests/__screenshots__/dark.
- Naming template: {snapshotDir}/{projectName}/{testName}/{arg}{ext} (see playwright.config.ts).
- Each component slug creates page.png and example-*.png snapshots.

How tests generate snapshots:

- Playwright test: demo/tests/visual.spec.ts iterates demo component slugs from *.demo.tsx files.
- It loads the demo app (Vite preview) at /?component=<slug> and takes screenshots of detail card and example blocks.

Commands:

- Update snapshots (light): npm run test:visual:update:light -- --grep "<slug>"
- Update snapshots (dark): npm run test:visual:update:dark -- --grep "<slug>"
- Compare snapshots: npm run test:visual

Snapshot counts: light=90, dark=90, total=180.

Config/spec files:

- playwright.config.ts
- demo/tests/visual.spec.ts

Pixelmatch thresholds:

- No explicit per-snapshot threshold configured in Playwright config; defaults apply.

## Component Variant/State Matrix

Source: TSX prop types + demo/test usage + CSS data-attributes.

- Alert:
  - Variants: variant
  - Sizes: -
  - States: -
  - Structural slots: description, title
- Badge:
  - Variants: variant
  - Sizes: -
  - States: -
  - Structural slots: children, icon
- Button:
  - Variants: -
  - Sizes: -
  - States: disabled
  - Structural slots: children
- Card:
  - Variants: muted
  - Sizes: -
  - States: -
  - Structural slots: actions, children, eyebrow, footer, title
- Checkbox:
  - Variants: checkedBorderColor, checkedBoxColor, uncheckedBorderColor, uncheckedBoxColor
  - Sizes: -
  - States: checked, defaultChecked, disabled, indeterminate
  - Structural slots: description, label
- ColorPicker:
  - Variants: -
  - Sizes: -
  - States: expanded, pressed
  - Structural slots: label
- Combobox:
  - Variants: -
  - Sizes: -
  - States: disabled, selected
  - Structural slots: -
- DatalistInput:
  - Variants: -
  - Sizes: -
  - States: disabled, selected
  - Structural slots: description, label
- DatePicker:
  - Variants: type
  - Sizes: -
  - States: disabled
  - Structural slots: description, label
- Dialog:
  - Variants: -
  - Sizes: -
  - States: open
  - Structural slots: children, description, footer, title
- Disclosure:
  - Variants: -
  - Sizes: -
  - States: defaultOpen
  - Structural slots: children, title
- Dropdown:
  - Variants: -
  - Sizes: -
  - States: disabled, expanded, isOpen
  - Structural slots: children, inlineContent, leadingContent
- InputField:
  - Variants: -
  - Sizes: -
  - States: disabled
  - Structural slots: description, label, leadingIcon, trailingLabel
- NumberInput:
  - Variants: -
  - Sizes: scale
  - States: disabled
  - Structural slots: description, label, suffix
- OutputChip:
  - Variants: tone
  - Sizes: -
  - States: -
  - Structural slots: children, label
- Popover:
  - Variants: -
  - Sizes: -
  - States: -
  - Structural slots: children
- ProgressMeter:
  - Variants: -
  - Sizes: -
  - States: -
  - Structural slots: description, label
- Radio:
  - Variants: color
  - Sizes: -
  - States: checked, defaultChecked, disabled
  - Structural slots: description, label
- Select:
  - Variants: -
  - Sizes: -
  - States: disabled, selected
  - Structural slots: description, inlineContent, label, leadingContent
- Slider:
  - Variants: fillMode, orientation, position
  - Sizes: thumbSize, trackThickness
  - States: disabled
  - Structural slots: children, label
- StackedList:
  - Variants: -
  - Sizes: -
  - States: -
  - Structural slots: -
- TabGroup:
  - Variants: align, fill, overflow, position, rotation
  - Sizes: size
  - States: active, defaultActive, disabled, selected
  - Structural slots: -
- Table:
  - Variants: -
  - Sizes: -
  - States: -
  - Structural slots: caption
- Textarea:
  - Variants: resizeDirection
  - Sizes: -
  - States: disabled
  - Structural slots: description, label
- ResizableContainer:
  - Variants: axis, resizing, scrollbar-x, scrollbar-y
  - Sizes: defaultHeight, defaultWidth, height, maxHeight, maxWidth, minHeight, minWidth, width
  - States: -
  - Structural slots: children
- Toggle:
  - Variants: state
  - Sizes: -
  - States: checked, defaultChecked, disabled
  - Structural slots: description, title

## Risk Areas

Components with higher refactor risk:

- Alert: focus, complex selectors, dynamic class composition
- Badge: focus, complex selectors, dynamic class composition
- Button: focus, animation, complex selectors, dynamic class composition
- Card: complex selectors, dynamic class composition
- Checkbox: focus, animation, complex selectors, dynamic class composition
- ColorPicker: positioning, focus, animation, complex selectors, dynamic class composition
- Combobox: positioning, focus, animation, complex selectors, dynamic class composition
- DatalistInput: positioning, focus, animation, complex selectors, dynamic class composition
- DatePicker: positioning, focus, animation, complex selectors, dynamic class composition
- Dialog: portal, positioning, focus, complex selectors, dynamic class composition
- Disclosure: focus, animation, complex selectors, dynamic class composition
- Dropdown: focus, animation, complex selectors, dynamic class composition
- InputField: focus, animation, complex selectors, dynamic class composition
- NumberInput: focus, animation, complex selectors, dynamic class composition
- OutputChip: complex selectors, dynamic class composition
- Popover: portal, positioning, focus, animation, complex selectors, dynamic class composition
- ProgressMeter: positioning, focus, animation, complex selectors, dynamic class composition
- Radio: positioning, focus, animation, complex selectors, dynamic class composition
- Select: positioning, focus, animation, complex selectors, dynamic class composition
- Slider: positioning, focus, animation, complex selectors, dynamic class composition
- StackedList: focus, complex selectors, dynamic class composition
- TabGroup: positioning, focus, complex selectors, dynamic class composition
- Table: positioning, focus, animation, complex selectors, dynamic class composition
- Textarea: focus, animation, complex selectors, dynamic class composition
- ResizableContainer: positioning, focus, animation, complex selectors, dynamic class composition
- Toggle: positioning, focus, animation, complex selectors, dynamic class composition

## Recommended Semantic CSS Target Architecture (Proposal Only)

Naming convention:

- Use semantic BEM-like blocks: rui-<component>, rui-<component>__part, rui-<component>--variant.
- Keep data-attributes for complex state/variant matrices (e.g., TabGroup uses data-align, data-position, data-fill).

Token strategy:

- Preserve src/styles/tokens.css as the token source of truth (colors, spacing, radii).
- Keep utility-vars.css only for unavoidable utility variable scaffolding, but stop generating new __u- classes.

Component stylesheet structure:

- One CSS file per component (already the case), but consolidate atomic utility rules into semantic component selectors.
- Demo-only styling stays in *.demo.css; do not leak demo utilities into component CSS.

Variants/states encoding:

- Prefer data-attributes for multi-axis variants (e.g., TabGroup, DatePicker, Select) and boolean data-state attributes for open/active/disabled.
- Use modifier classes only when variant axis is singular and stable (e.g., rui-alert--info).

Minimal shared primitives (<= 15):

- rui-root, rui-surface, rui-overlay-root (existing layout-safety.css).
- rui-text-wrap, rui-text-truncate (existing).
- rui-focus-ring (new, but implement using existing --rui-color-focus-ring token).
- rui-visually-hidden (if needed for aria).
- rui-divider, rui-stack, rui-inline (if duplication warrants; otherwise keep local).

Grounding in this repo: the current CSS uses huge generated __u- classes with tokens already defined in tokens.css. A semantic refactor should collapse __u-* rules into per-component blocks and re-map data-theme and .dark overrides into a consistent theming layer.

## Refactor Constraints Checklist

- No visual change (Playwright diff must be zero).
- No API changes to component exports or props.
- No new dependencies.
- Avoid !important.
- Keep specificity low and predictable.
- Do not reintroduce utility-class systems.
- Keep dark/light behavior identical.

## Evidence Appendix

Representative utility-like CSS examples (snippets):

```
src/components/Dialog/Dialog.css:1
src/components/Checkbox/Checkbox.css:111
src/components/Table/Table.css:59
src/components/Slider/Slider.demo.css:172
src/components/DatePicker/DatePicker.demo.css:65
src/components/Card/Card.css:201
src/components/Toggle/Toggle.css:201
src/components/ProgressMeter/ProgressMeter.css:170
```

Components with highest class churn (by presence of many __u-* utility classes):

- ColorPicker (src/components/ColorPicker/ColorPicker.css, ColorPicker.demo.css)
- Slider (src/components/Slider/Slider.css, Slider.demo.css)
- Table (src/components/Table/Table.css, Table.demo.css)
- DatePicker (src/components/DatePicker/DatePicker.css, DatePicker.demo.css)
- Checkbox (src/components/Checkbox/Checkbox.css)

Existing tokens/variables worth preserving:

- src/styles/tokens.css (rui-color-*, rui-space-*, rui-radius-*, rui-shadow-*).
- src/styles/utility-vars.css (Tailwind-like CSS var scaffolding used by generated utility classes).

Duplication patterns observed:

- Same utility rules repeated across demo CSS and component CSS (e.g., __u-border-radius-*, __u-font-size-*, __u-background-color-*).
- Theme overrides duplicated with :is(.dark *) selectors across components.

Commands run (with outputs):

```
npm run test --workspace react-ui-suite
failed: spawn EPERM (esbuild/vite).

npm run build --workspace react-ui-suite
failed: spawn EPERM (esbuild).

npm run test:visual
failed: spawn EPERM (playwright).
```

Diagnosis: sandbox blocked child process spawning (EPERM) when esbuild/vite/playwright attempted to launch. Re-run outside sandbox or with escalated permissions.
