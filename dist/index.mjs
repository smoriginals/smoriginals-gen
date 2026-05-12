// src/index.ts
import chalk from "chalk";
function status() {
  return "[ folderplus - Ok ]";
}
function version() {
  return "v2.0.3";
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
export {
  help,
  status,
  version
};
