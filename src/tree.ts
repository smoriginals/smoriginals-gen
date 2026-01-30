import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { FILE_STYLES } from './fileStyle';
import { TreeFilter } from "./types.js";

export function generateTree(
    dir: string,
    prefix = "",
    ignore: Set<string> = new Set(),
    filter: TreeFilter = "all",
    depth = 0,
    maxDepth = Infinity
): void {

    if (depth >= maxDepth) return;

    const entries = fs
        .readdirSync(dir, { withFileTypes: true })
        .filter(entry => !ignore.has(entry.name));

    entries.forEach((entry, index) => {
        const isLast = index === entries.length - 1;
        const pointer = isLast ? "└─ " : "├─ ";
        const line = chalk.dim(prefix + pointer);
        const fullPath = path.join(dir, entry.name);

        // 📁 Directory
        if (entry.isDirectory()) {
            if (filter !== "files") {
                console.log(line + `📁 ${chalk.bold.yellow(entry.name)}`);
            }

            const newPrefix = prefix + (isLast ? "   " : "│  ");
            generateTree(fullPath, newPrefix, ignore, filter, depth + 1, maxDepth);
            return;
        }

        // 📄 File
        if (filter !== "dirs") {
            const ext = path.extname(entry.name).slice(1);
            const style = FILE_STYLES[ext];

            const display = style
                ? `${style.icon} ${style.color(entry.name)}`
                : `📄 ${chalk.gray(entry.name)}`;

            console.log(line + display);
        }
    });
}
