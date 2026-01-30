import * as path from "path";
import * as fs from "fs";
import { status, version, help } from "./index.js";
import { generateTree } from "./tree.js";
import { generateJsonTree } from "./jsonTree.js";
import { readGitIgnore } from "./ignore.js";
const args = process.argv.slice(2);
const cwd = process.cwd();

if (args.length === 0 || args.includes("help")) {
    console.log(help());
    process.exit(0);
}

switch (args[0]) {
    case "status":
        console.log(status());
        break;

    case "version":
        console.log(version());
        break;

    case "tree": {
        const ignore = new Set<string>([
            "node_modules",
            ".git",
            ...readGitIgnore(cwd)
        ]);

        const depthIndex = args.indexOf("--depth");
        const depth =
            depthIndex !== -1 ? Number(args[depthIndex + 1]) : Infinity;

        const filter =
            args.includes("--files-only")
                ? "files"
                : args.includes("--dirs-only")
                    ? "dirs"
                    : "all";

        if (args.includes("--json")) {
            const tree = generateJsonTree(cwd, ignore, 0, depth, filter);
            console.log(JSON.stringify(tree, null, 2));
        } else {
            generateTree(cwd, "", ignore, filter, 0, depth);
        }
        break;
    }

    default:
        console.log(help());
}
