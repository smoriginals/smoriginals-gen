import * as fs from "fs";
import * as path from "path";
import { IgnoreMatcher, TreeNode, TreeFilter, TreeSort } from "./types.js";

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

export function generateJsonTree(
    rootDir: string,
    dir: string,
    shouldIgnore: IgnoreMatcher | undefined,
    depth: number,
    maxDepth: number,
    filter: TreeFilter = "all",
    sort?: TreeSort,
    onlyExts?: Set<string>
): TreeNode {

    const name = path.basename(dir);
    const children: TreeNode[] = [];

    for (const entry of sortEntries(fs.readdirSync(dir, { withFileTypes: true }), sort)) {
        const fullPath = path.join(dir, entry.name);
        if (shouldIgnore) {
            const relativePath = path.relative(rootDir, fullPath);
            if (shouldIgnore(relativePath, entry.isDirectory())) continue;
        }

        if (entry.isDirectory()) {
            const child = depth + 1 < maxDepth
                ? generateJsonTree(rootDir, fullPath, shouldIgnore, depth + 1, maxDepth, filter, sort, onlyExts)
                : { name: entry.name, type: "directory" as const, children: [] };

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
                const ext = path.extname(entry.name).slice(1);
                if (!onlyExts || onlyExts.has(ext)) {
                    children.push({ name: entry.name, type: "file" });
                }
            }
        }
    }

    return { name, type: "directory", children };
}
