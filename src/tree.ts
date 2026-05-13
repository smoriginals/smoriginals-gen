import chalk from 'chalk'

import * as fs from "fs";
import * as path from "path";
import { FILE_STYLES } from './fileStyle.js';
import { IgnoreMatcher, TreeFilter, TreeSort } from "./types.js";

function sortEntries(entries: fs.Dirent[], sort?: TreeSort): fs.Dirent[] {
    if (!sort) return entries;

    const compareNames = (aName: string, bName: string): number => {
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

export function generateTree(
    rootDir: string,
    dir: string,
    prefix = "",
    shouldIgnore?: IgnoreMatcher,
    filter: TreeFilter = "all",
    sort?: TreeSort,
    depth = 0,
    maxDepth = Infinity,
    icons = true,
    onlyExts?: Set<string>
): void {

    const entries = sortEntries(fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((entry) => {
            if (!shouldIgnore) return true;
            const relativePath = path.relative(rootDir, path.join(dir, entry.name));
            return !shouldIgnore(relativePath, entry.isDirectory());
        }), sort);

    entries.forEach((entry, index) => {
        const isLast = index === entries.length - 1;
        const pointer = isLast ? "└─ " : "├─ ";
        const line = chalk.dim(prefix + pointer);
        const fullPath = path.join(dir, entry.name);

        // Directory
        if (entry.isDirectory()) {
            if (filter !== "files") {
                const label = icons ? `📁 ${chalk.bold.yellow(entry.name)}` : chalk.bold.yellow(entry.name);
                console.log(line + label);
            }

            if (depth + 1 < maxDepth) {
                const newPrefix = prefix + (isLast ? "   " : "│  ");
                generateTree(rootDir, fullPath, newPrefix, shouldIgnore, filter, sort, depth + 1, maxDepth, icons, onlyExts);
            }
            return;
        }

        // File
        if (filter !== "dirs") {
            const ext = path.extname(entry.name).slice(1);
            if (onlyExts && !onlyExts.has(ext)) return;
            const style = FILE_STYLES[ext];

            let display: string;
            if (!icons) {
                display = style ? style.color(entry.name) : chalk.gray(entry.name);
            } else {
                display = style
                    ? `${style.icon} ${style.color(entry.name)}`
                    : `📄 ${chalk.gray(entry.name)}`;
            }

            console.log(line + display);
        }
    });
}
