import * as fs from "fs";
import * as path from "path";
import { TreeNode, TreeFilter } from "./types.js";

export function generateJsonTree(
    dir: string,
    ignore: Set<string>,
    depth: number,
    maxDepth: number,
    filter: TreeFilter = "all",
    onlyExts?: Set<string>
): TreeNode {

    const name = path.basename(dir);
    const children: TreeNode[] = [];

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (ignore.has(entry.name)) continue;

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (filter !== "files") {
                const child = depth + 1 < maxDepth
                    ? generateJsonTree(fullPath, ignore, depth + 1, maxDepth, filter, onlyExts)
                    : { name: entry.name, type: "directory" as const, children: [] };
                children.push(child);
            }
        } else {
            if (filter !== "dirs") {
                const ext = path.extname(entry.name).slice(1);
                if (!onlyExts || onlyExts.has(ext)) {
                    children.push({ name: entry.name, type: "file" });
                }
            }
        }
    }

    return { name, type: "directory", children };
}
