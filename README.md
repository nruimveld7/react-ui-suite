# react-ui-suite

`react-ui-suite` is a collection of production-ready React components geared toward application UIs (forms, lists, dialogs, pickers, etc.).  
This repository is a small monorepo that contains:

- the **publishable library package** in `src/`
- a **Vite-powered demo/gallery** in `demo/`
- shared tooling and configuration at the **root workspace**

> **ESM-only:** The npm package only publishes ES modules and type declarations under `dist/`.  
> CommonJS consumers (`require("react-ui-suite")`) are **not** supported. Use a modern bundler (Vite, Webpack 5+, Next.js, etc.) or native ESM in Node.

---

## Packages

| Folder  | Description                                                                                                                         |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `.`     | Root workspace named `@react-ui-suite/root`. It orchestrates tooling/scripts for every workspace and is **never published** to npm. |
| `src/`  | Workspace that publishes the `react-ui-suite` library. Components live in `src/components/` alongside their `*.demo.tsx` gallery entries, all compiled to `dist/` via `tsup`. |
| `demo/` | Standalone Vite gallery that auto-registers every component demo (`src/components/**/*.demo.tsx`) via `import.meta.glob`. Useful for local development and QA. |

---

## Installation (for consumers)

Install from npm into any React 19 project:

```bash
npm install react-ui-suite
# or
pnpm add react-ui-suite
# or
yarn add react-ui-suite
```

Peer dependencies (required in the consuming app):

- `react` ^19.2.4
- `react-dom` ^19.2.4

The library marks `react` and `react-dom` as externals; they must come from the host application.

### Basic usage

```tsx
import { Button } from "react-ui-suite";

export function Example() {
  return <Button variant="primary">Save</Button>;
}
```

Because the package is ESM-only, make sure your toolchain supports `import` / `export` and ESM-aware bundling.

---

## Development (this repo)

Clone and install from the root (Node 18+ required):

```bash
git clone https://github.com/nruimveld7/react-ui-suite.git
cd react-ui-suite
npm install
```

### Workspace commands (run from the root)

These scripts are defined in the **root** `package.json` and proxy into the `react-ui-suite` workspace:

```bash
npm run build        # builds the library (src/) via tsup into src/dist
npm run test         # runs Vitest for the library workspace
npm run lint         # lints the library source via ESLint
npm run format       # formats the entire repo with Prettier
npm run format:check # checks formatting without writing changes
npm run dev          # starts the Vite demo gallery (demo/) at http://localhost:5173
npm run test:visual  # runs Playwright visual tests for the demo gallery
npm run publish      # publishes the react-ui-suite workspace to npm (see “Publishing” below)
```

You can also work directly inside the `src/` workspace:

```bash
cd src
npm run build
npm run test
npm run lint
npm run format
```

---

## Library build details

The library workspace (`src/`) uses [`tsup`](https://tsup.egoist.dev/) to build:

- **Entry:** `src/index.ts`
- **Output:** ESM bundle at `src/dist/index.js` + corresponding `src/dist/index.d.ts`
- **Target:** `es2019`
- **ESM-only:** `format: ["esm"]`
- **Externals:** `react`, `react-dom`

`src/package.json` restricts the published files to:

- `dist/`
- `README.md`
- `LICENSE`

so consumers only install the compiled artifacts plus documentation and license.

---

## Demo gallery

The `demo/` workspace is a Vite app that renders a component gallery:

```bash
npm run dev
```

This will:

- start Vite on `http://localhost:5173`
- alias `react-ui-suite` to the local `src/` workspace
- auto-load demo definitions from `src/components/**/*.demo.tsx` via `import.meta.glob`

Add a `<Component>.demo.tsx` file (for example `src/components/Button/Button.demo.tsx`) beside the component to have it show up automatically in the gallery.

Use this gallery to iterate on new components and verify changes visually.

---

## Publishing (maintainers)

Publishing is always coordinated from the **library workspace** (`src/`), but you typically invoke it via the root script.

### 1. Bump the version in `src/package.json`

Use semantic versioning (`0.1.1`, `0.2.0`, `1.0.0`, etc.).

### 2. From the repo root

```bash
npm run publish
```

This runs:

- `npm publish --workspace react-ui-suite --access public`

Inside the `src/` workspace, `prepublishOnly` is configured to run:

```bash
npm run build && npm run test && npm run lint
```

So a publish will only succeed if:

- the library builds,
- the tests pass, and
- linting is clean.

You can also publish directly from `src/` if needed:

```bash
cd src
npm run publish
```

(but `npm run publish` at the root is the normal flow).

---
