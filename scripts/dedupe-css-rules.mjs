import fs from "node:fs/promises";
import path from "node:path";
import postcss from "postcss";

function parseArgs(argv) {
  const args = {
    src: "src",
    write: false,
    verbose: false,
    includeDist: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--src") {
      args.src = argv[i + 1] ?? args.src;
      i += 1;
      continue;
    }
    if (arg === "--write") {
      args.write = true;
      continue;
    }
    if (arg === "--include-dist") {
      args.includeDist = true;
      continue;
    }
    if (arg === "--verbose") {
      args.verbose = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      args.help = true;
      continue;
    }
  }

  return args;
}

function normalizeWhitespace(value) {
  return value.trim().replace(/\s+/g, " ");
}

function canonicalNode(node) {
  if (node.type === "rule") {
    const selector = normalizeWhitespace(node.selector ?? "");
    const body = canonicalChildren(node.nodes ?? []);
    return `rule|${selector}|${body}`;
  }
  if (node.type === "atrule") {
    const name = normalizeWhitespace(node.name ?? "");
    const params = normalizeWhitespace(node.params ?? "");
    const body = canonicalChildren(node.nodes ?? []);
    return `atrule|${name}|${params}|${body}`;
  }
  return `${node.type}|${normalizeWhitespace(node.toString())}`;
}

function canonicalChildren(nodes) {
  if (!nodes?.length) return "";
  const parts = [];
  for (const child of nodes) {
    if (child.type === "comment") continue;
    if (child.type === "decl") {
      parts.push(
        `decl|${normalizeWhitespace(child.prop)}:${normalizeWhitespace(child.value)}${
          child.important ? "!important" : ""
        }`
      );
      continue;
    }
    if (child.type === "rule" || child.type === "atrule") {
      parts.push(canonicalNode(child));
      continue;
    }
    parts.push(`${child.type}|${normalizeWhitespace(child.toString())}`);
  }
  return parts.join(";");
}

function sourceLine(node) {
  return node?.source?.start?.line ?? null;
}

function sourceColumn(node) {
  return node?.source?.start?.column ?? null;
}

function dedupeContainer(container, report, seenByScope) {
  const seen = new Map();
  const scopeId = `${container.type}:${container.name ?? ""}:${container.params ?? ""}:${
    container.selector ?? ""
  }`;
  seenByScope.add(scopeId);

  container.each((node) => {
    if (node.type !== "rule" && node.type !== "atrule") return;
    const key = canonicalNode(node);
    const prev = seen.get(key);
    if (!prev) {
      seen.set(key, node);
      return;
    }

    report.duplicates.push({
      node,
      first: prev,
    });
    node.remove();
  });

  container.each((node) => {
    if (node.type === "atrule" && node.nodes) {
      dedupeContainer(node, report, seenByScope);
    }
  });
}

async function listCssFiles(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await listCssFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".css")) {
      out.push(fullPath);
    }
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(
      [
        "Usage: node scripts/dedupe-css-rules.mjs [--src <dir>] [--write] [--verbose]",
        "",
        "Finds duplicate CSS rules within the same file (exact match after normalization) and removes duplicates.",
        "",
        "Options:",
        "  --src <dir>   Directory to scan (default: src)",
        "  --write       Write changes back to disk (default: dry-run)",
        "  --include-dist  Also scan <src>/dist output (default: off)",
        "  --verbose     Print per-duplicate details (default: summary)",
        "",
      ].join("\n")
    );
    return;
  }

  const rootDir = path.resolve(process.cwd(), args.src);
  const cssFiles = (await listCssFiles(rootDir)).filter((filePath) => {
    if (args.includeDist) return true;
    const normalized = filePath.replaceAll("\\", "/");
    return !normalized.includes("/dist/");
  });
  cssFiles.sort();

  const totals = {
    filesScanned: 0,
    filesChanged: 0,
    duplicatesRemoved: 0,
  };

  for (const filePath of cssFiles) {
    totals.filesScanned += 1;
    const original = await fs.readFile(filePath, "utf8");
    let root;
    try {
      root = postcss.parse(original, { from: filePath });
    } catch (error) {
      process.stderr.write(`Failed to parse ${filePath}: ${String(error)}\n`);
      continue;
    }

    const report = { duplicates: [] };
    const seenByScope = new Set();
    dedupeContainer(root, report, seenByScope);

    if (!report.duplicates.length) continue;

    totals.filesChanged += 1;
    totals.duplicatesRemoved += report.duplicates.length;

    const rel = path.relative(process.cwd(), filePath);
    process.stdout.write(
      `${args.write ? "Fix" : "Would fix"} ${rel}: removed ${report.duplicates.length} duplicate rule${
        report.duplicates.length === 1 ? "" : "s"
      }\n`
    );

    if (args.verbose) {
      for (const dup of report.duplicates) {
        const firstLine = sourceLine(dup.first);
        const firstCol = sourceColumn(dup.first);
        const dupLine = sourceLine(dup.node);
        const dupCol = sourceColumn(dup.node);
        const hint =
          dup.node.type === "rule"
            ? normalizeWhitespace(dup.node.selector ?? "")
            : `@${dup.node.name} ${normalizeWhitespace(dup.node.params ?? "")}`.trim();
        process.stdout.write(
          `  - ${hint} (duplicate at ${dupLine ?? "?"}:${dupCol ?? "?"}, first at ${
            firstLine ?? "?"
          }:${firstCol ?? "?"})\n`
        );
      }
    }

    if (args.write) {
      const next = root.toString();
      if (next !== original) {
        await fs.writeFile(filePath, next.endsWith("\n") ? next : `${next}\n`, "utf8");
      }
    }
  }

  process.stdout.write(
    [
      "",
      "Summary:",
      `  Files scanned: ${totals.filesScanned}`,
      `  Files ${args.write ? "changed" : "with duplicates"}: ${totals.filesChanged}`,
      `  Duplicates ${args.write ? "removed" : "found"}: ${totals.duplicatesRemoved}`,
      "",
    ].join("\n")
  );
}

await main();
