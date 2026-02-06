import fs from "node:fs/promises";
import path from "node:path";
import postcss from "postcss";

function parseArgs(argv) {
  const args = {
    src: "src",
    includeDist: false,
    verbose: false,
    min: 2,
    json: false,
    limit: 100,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--src") {
      args.src = argv[i + 1] ?? args.src;
      i += 1;
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
    if (arg === "--json") {
      args.json = true;
      continue;
    }
    if (arg === "--min") {
      const parsed = Number(argv[i + 1]);
      if (!Number.isNaN(parsed) && parsed >= 2) args.min = parsed;
      i += 1;
      continue;
    }
    if (arg === "--limit") {
      const parsed = Number(argv[i + 1]);
      if (!Number.isNaN(parsed) && parsed >= 0) args.limit = parsed;
      i += 1;
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

function nodeSummary(node) {
  if (node.type === "rule") return normalizeWhitespace(node.selector ?? "");
  if (node.type === "atrule") return `@${node.name} ${normalizeWhitespace(node.params ?? "")}`.trim();
  return node.type;
}

function loc(node, file) {
  const line = node?.source?.start?.line ?? null;
  const col = node?.source?.start?.column ?? null;
  return { file, line, col };
}

function walkRules(root, cb) {
  root.each((node) => {
    if (node.type === "rule" || node.type === "atrule") {
      cb(node);
      if (node.type === "atrule" && node.nodes) walkRules(node, cb);
    }
  });
}

function shouldIndexNode(node) {
  if (node.type === "atrule" && String(node.name).toLowerCase() === "import") return false;
  return true;
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
        "Usage: node scripts/find-duplicate-css-rules.mjs [--src <dir>] [--min <n>] [--limit <n>] [--verbose] [--json] [--include-dist]",
        "",
        "Finds exact duplicate CSS rules across different files (normalized match; ignores comments).",
        "This script only reports duplicates; it does not modify files.",
        "",
        "Options:",
        "  --src <dir>       Directory to scan (default: src)",
        "  --min <n>         Minimum occurrences to report (default: 2)",
        "  --limit <n>       Max duplicate groups to print (default: 100; 0 = unlimited)",
        "  --verbose         Include a short summary of each duplicated rule",
        "  --json            Output machine-readable JSON",
        "  --include-dist    Also scan <src>/dist output (default: off)",
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

  const index = new Map(); // canonical -> { hint, occurrences: [{file,line,col}] }
  const totals = { filesScanned: 0, rulesIndexed: 0 };

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

    const rel = path.relative(process.cwd(), filePath);
    walkRules(root, (node) => {
      if (node.type !== "rule" && node.type !== "atrule") return;
      if (!shouldIndexNode(node)) return;
      const key = canonicalNode(node);
      const entry = index.get(key) ?? {
        hint: nodeSummary(node),
        occurrences: [],
      };
      entry.occurrences.push(loc(node, rel));
      index.set(key, entry);
      totals.rulesIndexed += 1;
    });
  }

  const groups = [];
  for (const [key, entry] of index.entries()) {
    if (entry.occurrences.length < args.min) continue;
    const files = new Set(entry.occurrences.map((o) => o.file));
    if (files.size < 2) continue; // only across files
    groups.push({ key, hint: entry.hint, occurrences: entry.occurrences });
  }

  groups.sort((a, b) => b.occurrences.length - a.occurrences.length);

  if (args.json) {
    process.stdout.write(
      JSON.stringify(
        {
          totals,
          duplicateGroups: groups.map((g) => ({
            hint: g.hint,
            occurrences: g.occurrences,
          })),
        },
        null,
        2
      ) + "\n"
    );
    return;
  }

  const limit = args.limit === 0 ? groups.length : Math.min(groups.length, args.limit);
  for (let i = 0; i < limit; i += 1) {
    const g = groups[i];
    process.stdout.write(
      `Duplicate group (${g.occurrences.length} occurrences in ${
        new Set(g.occurrences.map((o) => o.file)).size
      } files)${args.verbose ? `: ${g.hint}` : ""}\n`
    );
    for (const occ of g.occurrences) {
      const at = `${occ.file}${occ.line ? `:${occ.line}${occ.col ? `:${occ.col}` : ""}` : ""}`;
      process.stdout.write(`  - ${at}\n`);
    }
  }

  process.stdout.write(
    [
      "",
      "Summary:",
      `  Files scanned: ${totals.filesScanned}`,
      `  Rules indexed: ${totals.rulesIndexed}`,
      `  Duplicate groups across files: ${groups.length}`,
      `  Printed: ${limit}`,
      "",
    ].join("\n")
  );
}

await main();
