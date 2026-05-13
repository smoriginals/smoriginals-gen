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
export {
  help,
  status,
  version
};
