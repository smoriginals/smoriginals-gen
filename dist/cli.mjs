#!/usr/bin/env node

// src/cli.ts
import * as fs4 from "fs";

// src/index.ts
import chalk from "chalk";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var packageJsonPath = join(__dirname, "..", "package.json");
function status() {
  return "[ folderplus - Ok ]";
}
function version() {
  try {
    const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8"));
    return typeof pkg.version === "string" && pkg.version.length > 0 ? `v${pkg.version}` : "unknown";
  } catch {
    return "unknown";
  }
}
function help() {
  return `
${chalk.bold.cyan("folderplus")} ${chalk.dim("Developer utility CLI")}

${chalk.bold("Usage:")}
  folderplus <command> [options]

${chalk.bold("Commands:")}
  ${chalk.green("status")}                 Check if folderplus is working
  ${chalk.green("tree")}                   Display project folder structure
  ${chalk.green("version")}                Show CLI version
  ${chalk.green("help")}                   Show this help message

${chalk.bold("Tree Options:")}
  ${chalk.yellow("--depth <n>")}            Limit directory depth
  ${chalk.yellow("--all")}                  Include entries normally ignored by defaults/.gitignore
  ${chalk.yellow("--ignore <a,b,c>")}       Ignore files or folders
  ${chalk.yellow("--sort <name|type>")}     Sort by name or by type (dirs first)
  ${chalk.yellow("--files-only")}           Show only files
  ${chalk.yellow("--dirs-only")}            Show only directories
  ${chalk.yellow("--only <ext,ext>")}       Show only files with given extensions
  ${chalk.yellow("--no-icons")}             Disable emoji icons
  ${chalk.yellow("--json")}                 Output tree as JSON

${chalk.bold("Examples:")}
  folderplus tree
  folderplus tree --depth 2
  folderplus tree --all
  folderplus tree --sort type
  folderplus tree --ignore node_modules,dist
  folderplus tree --files-only
  folderplus tree --dirs-only
  folderplus tree --only ts,js
  folderplus tree --no-icons
  folderplus tree --json > output.json
`;
}

// src/tree.ts
import chalk3 from "chalk";
import * as fs from "fs";
import * as path from "path";

// src/fileStyle.ts
import chalk2 from "chalk";
var FILE_STYLES = {
  // Web
  js: { icon: "\u26A1", color: chalk2.yellow },
  ts: { icon: "\u{1F4A0}", color: chalk2.blue },
  jsx: { icon: "\u269B\uFE0F", color: chalk2.cyan },
  tsx: { icon: "\u{1F300}", color: chalk2.cyan },
  html: { icon: "\u{1F310}", color: chalk2.bold.blueBright },
  css: { icon: "\u{1F3A8}", color: chalk2.bold.magenta },
  php: { icon: "\u{1F418}", color: chalk2.magentaBright },
  asp: { icon: "\u{1F537}", color: chalk2.blueBright },
  // Backend / Scripts
  py: { icon: "\u{1F40D}", color: chalk2.green },
  java: { icon: "\u2615", color: chalk2.magenta },
  go: { icon: "\u{1F439}", color: chalk2.cyan },
  rs: { icon: "\u{1F980}", color: chalk2.redBright },
  scala: { icon: "\u{1F53A}", color: chalk2.red },
  // Systems
  c: { icon: "\u{1F4C0}", color: chalk2.blueBright },
  cpp: { icon: "\u{1F4BB}", color: chalk2.cyan },
  sh: { icon: "\u{1F4DC}", color: chalk2.greenBright },
  ruby: { icon: "\u{1F48E}", color: chalk2.red },
  // Data / Config
  json: { icon: "\u{1F9FE}", color: chalk2.gray },
  yml: { icon: "\u2699\uFE0F", color: chalk2.magenta },
  yaml: { icon: "\u2699\uFE0F", color: chalk2.magenta },
  env: { icon: "\u{1F510}", color: chalk2.bold.red },
  local: { icon: "\u{1F510}", color: chalk2.bold.red },
  xml: { icon: "\u{1F4DC}", color: chalk2.blue },
  // Docs
  md: { icon: "\u{1F4D8}", color: chalk2.bold.white },
  txt: { icon: "\u{1F4C4}", color: chalk2.bold.white },
  pdf: { icon: "\u{1F4C4}", color: chalk2.bold.redBright },
  docx: { icon: "\u{1F4C4}", color: chalk2.blueBright },
  // Misc
  sql: { icon: "\u{1F4CA}", color: chalk2.yellowBright },
  log: { icon: "\u{1F4DC}", color: chalk2.gray }
};

// src/tree.ts
function sortEntries(entries, sort) {
  if (!sort) return entries;
  const compareNames = (aName, bName) => {
    const aLower = aName.toLowerCase();
    const bLower = bName.toLowerCase();
    if (aLower < bLower) return -1;
    if (aLower > bLower) return 1;
    if (aName < bName) return -1;
    if (aName > bName) return 1;
    return 0;
  };
  return [...entries].sort((a, b) => {
    if (sort === "type") {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
    }
    return compareNames(a.name, b.name);
  });
}
function generateTree(rootDir, dir, prefix = "", shouldIgnore, filter = "all", sort, depth = 0, maxDepth = Infinity, icons = true, onlyExts) {
  const entries = sortEntries(fs.readdirSync(dir, { withFileTypes: true }).filter((entry) => {
    if (!shouldIgnore) return true;
    const relativePath = path.relative(rootDir, path.join(dir, entry.name));
    return !shouldIgnore(relativePath, entry.isDirectory());
  }), sort);
  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const pointer = isLast ? "\u2514\u2500 " : "\u251C\u2500 ";
    const line = chalk3.dim(prefix + pointer);
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (filter !== "files") {
        const label = icons ? `\u{1F4C1} ${chalk3.bold.yellow(entry.name)}` : chalk3.bold.yellow(entry.name);
        console.log(line + label);
      }
      if (depth + 1 < maxDepth) {
        const newPrefix = prefix + (isLast ? "   " : "\u2502  ");
        generateTree(rootDir, fullPath, newPrefix, shouldIgnore, filter, sort, depth + 1, maxDepth, icons, onlyExts);
      }
      return;
    }
    if (filter !== "dirs") {
      const ext = path.extname(entry.name).slice(1);
      if (onlyExts && !onlyExts.has(ext)) return;
      const style = FILE_STYLES[ext];
      let display;
      if (!icons) {
        display = style ? style.color(entry.name) : chalk3.gray(entry.name);
      } else {
        display = style ? `${style.icon} ${style.color(entry.name)}` : `\u{1F4C4} ${chalk3.gray(entry.name)}`;
      }
      console.log(line + display);
    }
  });
}

// src/jsonTree.ts
import * as fs2 from "fs";
import * as path2 from "path";
function sortEntries2(entries, sort) {
  if (!sort) return entries;
  const compareNames = (aName, bName) => {
    const aLower = aName.toLowerCase();
    const bLower = bName.toLowerCase();
    if (aLower < bLower) return -1;
    if (aLower > bLower) return 1;
    if (aName < bName) return -1;
    if (aName > bName) return 1;
    return 0;
  };
  return [...entries].sort((a, b) => {
    if (sort === "type") {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
    }
    return compareNames(a.name, b.name);
  });
}
function generateJsonTree(rootDir, dir, shouldIgnore, depth, maxDepth, filter = "all", sort, onlyExts) {
  const name = path2.basename(dir);
  const children = [];
  for (const entry of sortEntries2(fs2.readdirSync(dir, { withFileTypes: true }), sort)) {
    const fullPath = path2.join(dir, entry.name);
    if (shouldIgnore) {
      const relativePath = path2.relative(rootDir, fullPath);
      if (shouldIgnore(relativePath, entry.isDirectory())) continue;
    }
    if (entry.isDirectory()) {
      const child = depth + 1 < maxDepth ? generateJsonTree(rootDir, fullPath, shouldIgnore, depth + 1, maxDepth, filter, sort, onlyExts) : { name: entry.name, type: "directory", children: [] };
      if (filter === "dirs") {
        children.push(child);
        continue;
      }
      if (filter === "files") {
        if (child.children.length > 0) children.push(child);
        continue;
      }
      children.push(child);
    } else {
      if (filter !== "dirs") {
        const ext = path2.extname(entry.name).slice(1);
        if (!onlyExts || onlyExts.has(ext)) {
          children.push({ name: entry.name, type: "file" });
        }
      }
    }
  }
  return { name, type: "directory", children };
}

// src/ignore.ts
import * as fs3 from "fs";
import * as path3 from "path";
import ignore from "ignore";
function toPosix(p) {
  return p.split(path3.sep).join("/");
}
function normalizeRule(rule, base) {
  const trimmed = rule.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  const negated = trimmed.startsWith("!");
  const raw = negated ? trimmed.slice(1) : trimmed;
  if (!raw) return null;
  const dirOnly = raw.endsWith("/");
  const core = dirOnly ? raw.slice(0, -1) : raw;
  if (!core) return null;
  let normalized;
  if (core.includes("/")) {
    if (core.startsWith("/")) {
      normalized = base ? `${base}/${core.slice(1)}` : core.slice(1);
    } else {
      normalized = base ? `${base}/${core}` : core;
    }
  } else {
    normalized = base ? `${base}/**/${core}` : `**/${core}`;
  }
  if (dirOnly) normalized += "/";
  return negated ? `!${normalized}` : normalized;
}
function readRulesAt(root, base) {
  const gitignorePath = path3.join(root, base, ".gitignore");
  if (!fs3.existsSync(gitignorePath)) return [];
  const out = [];
  const content = fs3.readFileSync(gitignorePath, "utf8");
  for (const line of content.split("\n")) {
    const normalized = normalizeRule(line, toPosix(base));
    if (normalized) out.push(normalized);
  }
  return out;
}
function getAncestorBases(relativePath, isDirectory) {
  const posixRel = toPosix(relativePath);
  if (!posixRel || posixRel === ".") return [""];
  const target = isDirectory ? posixRel : path3.posix.dirname(posixRel);
  if (!target || target === ".") return [""];
  const segments = target.split("/").filter(Boolean);
  const bases = [""];
  for (let i = 0; i < segments.length; i += 1) {
    bases.push(segments.slice(0, i + 1).join("/"));
  }
  return bases;
}
function hasDefaultIgnoredSegment(relativePath) {
  const segments = toPosix(relativePath).split("/").filter(Boolean);
  return segments.includes("node_modules") || segments.includes(".git");
}
function createIgnoreMatcher(root, all, extraIgnore) {
  const rulesCache = /* @__PURE__ */ new Map();
  const extraRules = extraIgnore.map((line) => normalizeRule(line, "")).filter((line) => Boolean(line));
  return (relativePath, isDirectory) => {
    const posixRel = toPosix(relativePath);
    if (!posixRel || posixRel === ".") return false;
    if (!all && hasDefaultIgnoredSegment(posixRel)) {
      return true;
    }
    const ig = ignore();
    if (!all) {
      for (const base of getAncestorBases(posixRel, isDirectory)) {
        if (!rulesCache.has(base)) {
          rulesCache.set(base, readRulesAt(root, base));
        }
        const baseRules = rulesCache.get(base);
        if (baseRules.length > 0) ig.add(baseRules);
      }
    }
    if (extraRules.length > 0) {
      ig.add(extraRules);
    }
    const candidate = isDirectory ? `${posixRel}/` : posixRel;
    return ig.ignores(candidate);
  };
}

// src/cli.ts
var args = process.argv.slice(2);
var cwd = process.cwd();
if (args.length === 0 || args.includes("help")) {
  console.log(help());
  process.exit(0);
}
function getArgValue(flag) {
  const idx = args.indexOf(flag);
  if (idx === -1) return void 0;
  const val = args[idx + 1];
  return val && !val.startsWith("--") ? val : void 0;
}
switch (args[0]) {
  case "status":
    console.log(status());
    break;
  case "version":
    console.log(version());
    break;
  case "tree": {
    const all = args.includes("--all");
    const ignoreArg = getArgValue("--ignore");
    const extraIgnore = ignoreArg ? ignoreArg.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const shouldIgnore = createIgnoreMatcher(cwd, all, extraIgnore);
    const depthArg = getArgValue("--depth");
    const parsedDepth = depthArg !== void 0 ? Number(depthArg) : NaN;
    const maxDepth = !isNaN(parsedDepth) && parsedDepth >= 0 ? parsedDepth : Infinity;
    const filter = args.includes("--files-only") ? "files" : args.includes("--dirs-only") ? "dirs" : "all";
    const icons = !args.includes("--no-icons");
    const onlyArg = getArgValue("--only");
    const onlyExts = onlyArg ? new Set(onlyArg.split(",").map((s) => s.trim()).filter(Boolean)) : void 0;
    const sortArg = getArgValue("--sort");
    const sort = sortArg === void 0 ? void 0 : sortArg === "name" || sortArg === "type" ? sortArg : void 0;
    if (sortArg !== void 0 && sort === void 0) {
      fs4.writeSync(2, `Invalid value for --sort: "${sortArg}". Expected one of: name, type.
`);
      process.exit(1);
    }
    const options = { filter, sort };
    if (args.includes("--json")) {
      const tree = generateJsonTree(cwd, cwd, shouldIgnore, 0, maxDepth, options.filter, options.sort, onlyExts);
      console.log(JSON.stringify(tree, null, 2));
    } else {
      generateTree(cwd, cwd, "", shouldIgnore, options.filter, options.sort, 0, maxDepth, icons, onlyExts);
    }
    break;
  }
  default:
    console.log(help());
}
