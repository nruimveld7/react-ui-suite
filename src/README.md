# react-ui-suite

`react-ui-suite` is a collection of production-ready React components built with Tailwind-friendly class names and ergonomic APIs. The publishable package lives in the `src/` workspace as `@react-ui-suite/core`, while a separate Vite demo app showcases every component with rich previews.

> **ESM-only:** The npm package only publishes ES modules and type declarations under `dist/`. Tools that still require CommonJS entry points must add an extra build step (e.g., `tsup --format cjs`) before consumption.

## Packages

| Folder   | Description                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `src/`   | Workspace that publishes `@react-ui-suite/core`. `tsup` compiles this folder to `dist/`.                                  |
| `demos/` | Demo entries that describe each component preview (slug, description, tags, etc.). These files are not published.         |
| `demo/`  | Standalone Vite gallery that auto-registers every demo entry via `import.meta.glob`. Useful for local development and QA. |

## Installation

```bash
npm install @react-ui-suite/core
# or pnpm / yarn
```

Because the components rely on React, include the peer dependencies in your application:

```
react@^18
react-dom@^18
```

## Usage

```tsx
import { Badge, Button, Card } from "@react-ui-suite/core";

export function ExampleCard() {
  return (
    <Card title="Weekly report">
      <Badge variant="success">Live</Badge>
      <p className="mt-3 text-sm text-slate-600">Performance is trending upward for all KPIs.</p>
      <Button className="mt-4 w-full">View details</Button>
    </Card>
  );
}
```

Every component (and its related types) is exported from `src/index.ts`, so tree-shaking works out of the box.

## Development

### Build the library workspace

```bash
npm install          # installs all workspace deps (library + demo)
npm run build        # runs the src workspace build (tsup -> src/dist)
npm test             # executes Vitest in the src workspace
npm run lint         # lints src/ and demo/ via ESLint
```

`tsup` cleans `src/dist/` automatically and marks `react` / `react-dom` as externals so the published artifacts only contain the suite's code. Linting and tests provide fast feedback before shipping any new component primitives.

### Run the local demo gallery

```bash
npm run dev          # starts the demo workspace via Vite on http://localhost:5173
```

The Vite app aliases `react-ui-suite` to `../src`, so you always preview the latest source without publishing. Demo entries live inside `../demos` and are auto-discovered.

## Publishing

`src/package.json` limits the published files to `dist/`, `README.md`, and `LICENSE` so neither the demo app nor the raw source ship to npm. The `prepublishOnly` script automatically runs `build`, `test`, and `lint` so the release payload is always in a healthy state. Once the API begins to stabilize, consider layering in release tooling such as [Changesets](https://github.com/changesets/changesets) or `semantic-release` to track versions/CHANGELOG entries from tagged commits.
