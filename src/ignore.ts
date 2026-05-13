import * as fs from "node:fs";
import * as path from "node:path";
import ignore from "ignore";

function toPosix(p: string): string {
    return p.split(path.sep).join("/");
}

function normalizeRule(rule: string, base: string): string | null {
    const trimmed = rule.trim();
    if (!trimmed || trimmed.startsWith("#")) return null;

    const negated = trimmed.startsWith("!");
    const raw = negated ? trimmed.slice(1) : trimmed;
    if (!raw) return null;

    const dirOnly = raw.endsWith("/");
    const core = dirOnly ? raw.slice(0, -1) : raw;
    if (!core) return null;

    let normalized: string;

    if (core.includes("/")) {
        if (core.startsWith("/")) {
            normalized = base ? `${base}/${core.slice(1)}` : core.slice(1);
        } else {
            normalized = base ? `${base}/${core}` : core;
        }
    } else {
        normalized = base ? `${base}/**/${core}` : `**/${core}`;
    }

    if (dirOnly) normalized += "/";
    return negated ? `!${normalized}` : normalized;
}

function readRulesAt(root: string, base: string): string[] {
    const gitignorePath = path.join(root, base, ".gitignore");
    if (!fs.existsSync(gitignorePath)) return [];

    const out: string[] = [];
    const content = fs.readFileSync(gitignorePath, "utf8");

    for (const line of content.split("\n")) {
        const normalized = normalizeRule(line, toPosix(base));
        if (normalized) out.push(normalized);
    }

    return out;
}

function getAncestorBases(relativePath: string, isDirectory: boolean): string[] {
    const posixRel = toPosix(relativePath);
    if (!posixRel || posixRel === ".") return [""];

    const target = isDirectory ? posixRel : path.posix.dirname(posixRel);
    if (!target || target === ".") return [""];

    const segments = target.split("/").filter(Boolean);
    const bases = [""];

    for (let i = 0; i < segments.length; i += 1) {
        bases.push(segments.slice(0, i + 1).join("/"));
    }

    return bases;
}

function hasDefaultIgnoredSegment(relativePath: string): boolean {
    const segments = toPosix(relativePath).split("/").filter(Boolean);
    return segments.includes("node_modules") || segments.includes(".git");
}

export function createIgnoreMatcher(
    root: string,
    all: boolean,
    extraIgnore: string[]
): (relativePath: string, isDirectory: boolean) => boolean {
    const rulesCache = new Map<string, string[]>();

    const extraRules = extraIgnore
        .map((line) => normalizeRule(line, ""))
        .filter((line): line is string => Boolean(line));

    return (relativePath: string, isDirectory: boolean): boolean => {
        const posixRel = toPosix(relativePath);
        if (!posixRel || posixRel === ".") return false;

        if (!all && hasDefaultIgnoredSegment(posixRel)) {
            return true;
        }

        const ig = ignore();

        if (!all) {
            for (const base of getAncestorBases(posixRel, isDirectory)) {
                if (!rulesCache.has(base)) {
                    rulesCache.set(base, readRulesAt(root, base));
                }
                const baseRules = rulesCache.get(base)!;
                if (baseRules.length > 0) ig.add(baseRules);
            }
        }

        if (extraRules.length > 0) {
            ig.add(extraRules);
        }

        const candidate = isDirectory ? `${posixRel}/` : posixRel;
        return ig.ignores(candidate);
    };
}
