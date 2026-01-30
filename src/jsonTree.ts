import * as fs from "fs";
import * as path from "path";
import { TreeNode, TreeFilter } from "./types.js";

export function generateJsonTree(
    dir: string,
    ignore: Set<string>,
    depth: number,
    maxDepth: number,
    filter: TreeFilter = "all"
): TreeNode {

    const name = path.basename(dir);

    if (depth >= maxDepth) {
        return { name, type: "directory", children: [] };
    }

    const children: TreeNode[] = [];

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (ignore.has(entry.name)) continue;

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (filter !== "files") {
                children.push(
                    generateJsonTree(
                        fullPath,
                        ignore,
                        depth + 1,
                        maxDepth,
                        filter
                    )
                );
            }
        } else {
            if (filter !== "dirs") {
                children.push({ name: entry.name, type: "file" });
            }
        }
    }

    return { name, type: "directory", children };
}
