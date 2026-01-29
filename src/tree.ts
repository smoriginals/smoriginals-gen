import * as fs from "fs";
import * as path from "path";
import chalk from 'chalk';
import { FILE_STYLES } from './fileStyle';

export function generateTree(
    dir: string,
    prefix: string = "",
    ignore: Set<string> = new Set(),
    depth= 0,
    maxDepth = Infinity,

): void {

    if (depth >= maxDepth) return;
    const entries: fs.Dirent[] = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach((entry: fs.Dirent, index: number) => {
        if (ignore.has(entry.name)) return;

        const isLast = index === entries.length - 1;
        const pointer = isLast ? "└─ " : "├─ ";

        const line = chalk.dim(prefix + pointer);

        let displayName: string;

        if (entry.isDirectory()) {
            displayName = `📁 ${chalk.bold.yellow(entry.name)}`;
        } else {
            const ext = path.extname(entry.name).slice(1);
            const style = FILE_STYLES[ext];

            if (style) {
                displayName = `${style.icon} ${style.color(entry.name)}`;
            } else {
                displayName = `📄 ${chalk.gray(entry.name)}`;
            }
        }

        console.log(line + displayName);

        if (entry.isDirectory()) {
            const newPrefix = prefix + (isLast ? "   " : "│  ");
            generateTree(path.join(dir, entry.name), newPrefix, ignore,depth+1,maxDepth);
        }
    });
}

