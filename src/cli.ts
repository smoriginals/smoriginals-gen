import * as path from "path";
import { status, version, help } from "./index.js";
import { generateTree } from "./tree.js";
import { generateJsonTree } from "./jsonTree.js";
import { readGitIgnore } from "./ignore.js";
import { TreeFilter } from "./types.js";


const args = process.argv.slice(2);
const cwd = process.cwd();

if (args.length === 0 || args.includes("help")) {
    console.log(help());
    process.exit(0);
}

function getArgValue(flag: string): string | undefined {
    const idx = args.indexOf(flag);
    if (idx === -1) return undefined;
    const val = args[idx + 1];
    return val && !val.startsWith("--") ? val : undefined;
}

switch (args[0]) {
    case "status":
        console.log(status());
        break;

    case "version":
        console.log(version());
        break;

    case "tree": {
        const ignoreArg = getArgValue("--ignore");
        const extraIgnore = ignoreArg
            ? ignoreArg.split(",").map(s => s.trim()).filter(Boolean)
            : [];

        const ignore = new Set<string>([
            "node_modules",
            ".git",
            ...readGitIgnore(cwd),
            ...extraIgnore
        ]);

        const depthArg = getArgValue("--depth");
        const parsedDepth = depthArg !== undefined ? Number(depthArg) : NaN;
        const maxDepth = !isNaN(parsedDepth) && parsedDepth >= 0 ? parsedDepth : Infinity;

        const filter: TreeFilter =
            args.includes("--files-only")
                ? "files"
                : args.includes("--dirs-only")
                    ? "dirs"
                    : "all";

        const icons = !args.includes("--no-icons");

        const onlyArg = getArgValue("--only");
        const onlyExts = onlyArg
            ? new Set(onlyArg.split(",").map(s => s.trim()).filter(Boolean))
            : undefined;

        if (args.includes("--json")) {
            const tree = generateJsonTree(cwd, ignore, 0, maxDepth, filter, onlyExts);
            console.log(JSON.stringify(tree, null, 2));
        } else {
            generateTree(cwd, "", ignore, filter, 0, maxDepth, icons, onlyExts);
        }
        break;
    }

    default:
        console.log(help());
}
