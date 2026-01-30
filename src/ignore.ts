import * as fs from "fs";
import * as path from "path";

export function readGitIgnore(root: string): Set<string> {
    const ignore = new Set<string>();
    const gitignorePath = path.join(root, ".gitignore");

    if (!fs.existsSync(gitignorePath)) return ignore;

    const content = fs.readFileSync(gitignorePath, "utf-8");

    for (const line of content.split("\n")) {
        const rule = line.trim();

        // Ignore comments & empty lines
        if (!rule || rule.startsWith("#")) continue;

        ignore.add(rule.replace(/\/$/, ""));
    }

    return ignore;
}
