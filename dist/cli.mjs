#!/usr/bin/env node

// src/index.ts
import chalk from "chalk";
function status() {
  return "[ folderplus - Ok ]";
}
function version() {
  return "v2.0.1";
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
  ${chalk.yellow("--ignore <a,b,c>")}       Ignore files or folders
  ${chalk.yellow("--files-only")}           Show only files
  ${chalk.yellow("--dirs-only")}            Show only directories
  ${chalk.yellow("--only <ext,ext>")}       Show only files with given extensions
  ${chalk.yellow("--no-icons")}             Disable emoji icons
  ${chalk.yellow("--json")}                 Output tree as JSON

${chalk.bold("Examples:")}
  folderplus tree
  folderplus tree --depth 2
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
function generateTree(dir, prefix = "", ignore = /* @__PURE__ */ new Set(), filter = "all", depth = 0, maxDepth = Infinity, icons = true, onlyExts) {
  const entries = fs.readdirSync(dir, { withFileTypes: true }).filter((entry) => !ignore.has(entry.name));
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
        generateTree(fullPath, newPrefix, ignore, filter, depth + 1, maxDepth, icons, onlyExts);
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
function generateJsonTree(dir, ignore, depth, maxDepth, filter = "all", onlyExts) {
  const name = path2.basename(dir);
  const children = [];
  for (const entry of fs2.readdirSync(dir, { withFileTypes: true })) {
    if (ignore.has(entry.name)) continue;
    const fullPath = path2.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (filter !== "files") {
        const child = depth + 1 < maxDepth ? generateJsonTree(fullPath, ignore, depth + 1, maxDepth, filter, onlyExts) : { name: entry.name, type: "directory", children: [] };
        children.push(child);
      }
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
function readGitIgnore(root) {
  const ignore = /* @__PURE__ */ new Set();
  const gitignorePath = path3.join(root, ".gitignore");
  if (!fs3.existsSync(gitignorePath)) return ignore;
  const content = fs3.readFileSync(gitignorePath, "utf-8");
  for (const line of content.split("\n")) {
    const rule = line.trim();
    if (!rule || rule.startsWith("#")) continue;
    ignore.add(rule.replace(/\/$/, ""));
  }
  return ignore;
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
    const ignoreArg = getArgValue("--ignore");
    const extraIgnore = ignoreArg ? ignoreArg.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const ignore = /* @__PURE__ */ new Set([
      "node_modules",
      ".git",
      ...readGitIgnore(cwd),
      ...extraIgnore
    ]);
    const depthArg = getArgValue("--depth");
    const parsedDepth = depthArg !== void 0 ? Number(depthArg) : NaN;
    const maxDepth = !isNaN(parsedDepth) && parsedDepth >= 0 ? parsedDepth : Infinity;
    const filter = args.includes("--files-only") ? "files" : args.includes("--dirs-only") ? "dirs" : "all";
    const icons = !args.includes("--no-icons");
    const onlyArg = getArgValue("--only");
    const onlyExts = onlyArg ? new Set(onlyArg.split(",").map((s) => s.trim()).filter(Boolean)) : void 0;
    if (args.includes("--json")) {
      const tree = generateJsonTree(cwd, ignore, 0, maxDepth, filter, onlyExts);
      console.log(JSON.stringify(tree, null, 2));
    } else {
      generateTree(cwd, "", ignore, filter, 0, maxDepth, icons, onlyExts);
    }
    break;
  }
  default:
    console.log(help());
}
