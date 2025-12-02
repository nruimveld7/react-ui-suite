# react-ui-suite

`react-ui-suite` is a collection of production-ready React components built with Tailwind-friendly class names and ergonomic APIs. The library ships as a lightweight ESM bundle (via `tsup`) while a separate Vite demo app showcases every component with rich previews.

## Packages

| Folder | Description |
| --- | --- |
| `src/` | Publishable component source. `tsup` compiles this folder to `dist/`. |
| `demos/` | Demo entries that describe each component preview (slug, description, tags, etc.). These files are not published. |
| `demo/` | Standalone Vite gallery that auto-registers every demo entry via `import.meta.glob`. Useful for local development and QA. |

## Installation

```bash
npm install react-ui-suite
# or pnpm / yarn
```

Because the components rely on React, include the peer dependencies in your application:

```
react@^18
react-dom@^18
```

## Usage

```tsx
import { Badge, Button, Card } from "react-ui-suite";

export function ExampleCard() {
  return (
    <Card title="Weekly report">
      <Badge variant="success">Live</Badge>
      <p className="mt-3 text-sm text-slate-600">
        Performance is trending upward for all KPIs.
      </p>
      <Button className="mt-4 w-full">View details</Button>
    </Card>
  );
}
```

Every component (and its related types) is exported from `src/index.ts`, so tree-shaking works out of the box.

## Development

### Build the library

```bash
npm install          # installs dev-only build tooling (tsup + typescript)
npm run build        # emits ESM + d.ts files to dist/
```

`tsup` cleans the `dist/` folder automatically and marks `react` / `react-dom` as externals so the published artifacts only contain the suite’s code.

### Run the local demo gallery

```bash
cd demo
npm install          # installs the demo-only dev dependencies
npm run dev          # starts Vite on http://localhost:5173
```

The Vite app aliases `react-ui-suite` to `../src`, so you always preview the latest source without publishing. Demo entries live inside `../demos` and are auto-discovered.

## Publishing

`package.json` limits the published files to `dist/`, `README.md`, and `LICENSE` so neither the demo app nor the raw source ship to npm. Run `npm publish --dry-run` to verify the payload before releasing.
