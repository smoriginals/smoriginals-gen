#!/usr/bin/env node

// src/index.ts
import chalk from "chalk";
function status() {
  return "O_O SMORIGINALS O_O";
}
function version() {
  return "v0.1.0";
}
function help() {
  return `
${chalk.bold.cyan("SMORIGINALS")} ${chalk.dim("O_O Developer utility CLI")}

${chalk.bold("Usage:")}
  smoriginals <command> [options]

${chalk.bold("Commands:")}
  ${chalk.green("status")}                 Check if smoriginals is working
  ${chalk.green("tree")}                   Display project folder structure
  ${chalk.green("version")}                Show CLI version
  ${chalk.green("help")}                   Show this help message

${chalk.bold("Tree Options:")}
  ${chalk.yellow("--depth <n>")}            Limit directory depth
  ${chalk.yellow("--ignore <a,b,c>")}       Ignore files or folders
  ${chalk.yellow("--files-only")}           Show only files
  ${chalk.yellow("--dirs-only")}            Show only directories
  ${chalk.yellow("--json")}                 Output tree as JSON

${chalk.bold("Examples:")}
  smoriginals tree
  smoriginals tree --depth 3
  smoriginals tree --ignore node_modules,dist
  smoriginals tree --files-only
  smoriginals tree --dirs-only
  smoriginals tree --json > output.json
`;
}
export {
  help,
  status,
  version
};
