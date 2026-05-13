import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const cliPath = path.join(repoRoot, "dist", "cli.mjs");
const cliUrl = pathToFileURL(cliPath).href;

function runTree(args) {
    return spawnSync(process.execPath, [cliPath, "tree", ...args], {
        cwd: repoRoot,
        encoding: "utf8"
    });
}

async function runCliInProcess(args, cwd) {
    const originalArgv = process.argv;
    const originalCwd = process.cwd();
    const originalLog = console.log;
    const originalExit = process.exit;

    let stdout = "";
    let status = 0;

    console.log = (...values) => {
        stdout += `${values.map(String).join(" ")}\n`;
    };

    process.exit = ((code = 0) => {
        throw new Error(`__EXIT__${code}`);
    });

    try {
        process.argv = [process.execPath, cliPath, ...args];
        process.chdir(cwd);
        await import(`${cliUrl}?run=${Date.now()}-${Math.random()}`);
    } catch (error) {
        if (error instanceof Error && error.message.startsWith("__EXIT__")) {
            status = Number(error.message.replace("__EXIT__", ""));
        } else {
            throw error;
        }
    } finally {
        process.argv = originalArgv;
        process.chdir(originalCwd);
        console.log = originalLog;
        process.exit = originalExit;
    }

    return { status, stdout };
}

function createTempEntries(prefix, entries) {
    for (const entry of entries) {
        const fullPath = path.join(repoRoot, `${prefix}-${entry.path}`);

        if (entry.type === "dir") {
            fs.mkdirSync(fullPath, { recursive: true });
            continue;
        }

        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, entry.contents ?? "x");
    }
}

function removeTempEntries(prefix, entries) {
    for (const entry of entries) {
        const fullPath = path.join(repoRoot, `${prefix}-${entry.path}`);
        fs.rmSync(fullPath, { recursive: true, force: true });
    }
}

test("rejects invalid --sort values", { concurrency: false }, () => {
    const result = runTree(["--sort", "size"]);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Invalid value for --sort/);
});

test("sorts text tree by name with --sort name", { concurrency: false }, async (t) => {
    const prefix = `.sortname-${Date.now()}`;
    const entries = [
        { type: "file", path: "zeta.txt" },
        { type: "dir", path: "beta" },
        { type: "file", path: "alpha.txt" },
        { type: "dir", path: "aardvark" }
    ];

    createTempEntries(prefix, entries);
    t.after(() => removeTempEntries(prefix, entries));

    const result = await runCliInProcess(["tree", "--sort", "name", "--no-icons", "--depth", "1"], repoRoot);
    assert.equal(result.status, 0);

    const lines = result.stdout
        .split("\n")
        .map((line) => line.replace(/\u001b\[[0-9;]*m/g, "").trim())
        .filter((line) => line.includes(prefix));

    assert.deepEqual(lines, [
        `├─ ${prefix}-aardvark`,
        `├─ ${prefix}-alpha.txt`,
        `├─ ${prefix}-beta`,
        `├─ ${prefix}-zeta.txt`
    ]);
});

test("sorts text tree by name deterministically with mixed case and numeric names", { concurrency: false }, async (t) => {
    const prefix = `.sortname-case-${Date.now()}`;
    const entries = [
        { type: "file", path: "item10.txt" },
        { type: "file", path: "Item2.txt" },
        { type: "file", path: "item2.txt" },
        { type: "file", path: "Item10.txt" },
        { type: "file", path: "item1.txt" }
    ];

    createTempEntries(prefix, entries);
    t.after(() => removeTempEntries(prefix, entries));

    const result = await runCliInProcess(["tree", "--sort", "name", "--no-icons", "--depth", "1"], repoRoot);
    assert.equal(result.status, 0);

    const lines = result.stdout
        .split("\n")
        .map((line) => line.replace(/\u001b\[[0-9;]*m/g, "").trim())
        .filter((line) => line.includes(prefix));

    assert.deepEqual(lines, [
        `├─ ${prefix}-item1.txt`,
        `├─ ${prefix}-Item10.txt`,
        `├─ ${prefix}-item10.txt`,
        `├─ ${prefix}-Item2.txt`,
        `├─ ${prefix}-item2.txt`
    ]);
});

test("sorts JSON tree with directories before files for --sort type", { concurrency: false }, async (t) => {
    const prefix = `.sorttype-${Date.now()}`;
    const entries = [
        { type: "file", path: "a.txt" },
        { type: "dir", path: "z-dir" },
        { type: "file", path: "m.txt" },
        { type: "dir", path: "b-dir" }
    ];

    createTempEntries(prefix, entries);
    t.after(() => removeTempEntries(prefix, entries));

    const result = await runCliInProcess(["tree", "--sort", "type", "--json", "--depth", "1"], repoRoot);
    assert.equal(result.status, 0);

    const tree = JSON.parse(result.stdout);
    const childNames = tree.children
        .map((child) => child.name)
        .filter((name) => name.startsWith(prefix));

    assert.deepEqual(childNames, [
        `${prefix}-b-dir`,
        `${prefix}-z-dir`,
        `${prefix}-a.txt`,
        `${prefix}-m.txt`
    ]);
});

test("--all includes default and .gitignore-ignored entries", { concurrency: false }, async (t) => {
    const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), "folderplus-all-"));
    t.after(() => fs.rmSync(fixtureDir, { recursive: true, force: true }));

    fs.writeFileSync(path.join(fixtureDir, ".gitignore"), "ignored-by-gitignore.txt\n");
    fs.mkdirSync(path.join(fixtureDir, "node_modules", "pkg"), { recursive: true });
    fs.mkdirSync(path.join(fixtureDir, ".git"), { recursive: true });
    fs.writeFileSync(path.join(fixtureDir, "node_modules", "pkg", "index.js"), "x");
    fs.writeFileSync(path.join(fixtureDir, ".git", "HEAD"), "ref: refs/heads/main\n");
    fs.writeFileSync(path.join(fixtureDir, "ignored-by-gitignore.txt"), "x");

    const result = await runCliInProcess(["tree", "--json", "--all"], fixtureDir);
    assert.equal(result.status, 0);

    const tree = JSON.parse(result.stdout);
    const names = tree.children.map((child) => child.name);

    assert.ok(names.includes("node_modules"));
    assert.ok(names.includes(".git"));
    assert.ok(names.includes("ignored-by-gitignore.txt"));
});

test("--all still respects explicit --ignore", { concurrency: false }, async (t) => {
    const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), "folderplus-all-ignore-"));
    t.after(() => fs.rmSync(fixtureDir, { recursive: true, force: true }));

    fs.writeFileSync(path.join(fixtureDir, ".gitignore"), "ignored-by-gitignore.txt\n");
    fs.mkdirSync(path.join(fixtureDir, "node_modules", "pkg"), { recursive: true });
    fs.mkdirSync(path.join(fixtureDir, ".git"), { recursive: true });
    fs.writeFileSync(path.join(fixtureDir, "node_modules", "pkg", "index.js"), "x");
    fs.writeFileSync(path.join(fixtureDir, ".git", "HEAD"), "ref: refs/heads/main\n");
    fs.writeFileSync(path.join(fixtureDir, "ignored-by-gitignore.txt"), "x");

    const result = await runCliInProcess(["tree", "--json", "--all", "--ignore", "node_modules"], fixtureDir);
    assert.equal(result.status, 0);

    const tree = JSON.parse(result.stdout);
    const names = tree.children.map((child) => child.name);

    assert.ok(!names.includes("node_modules"));
    assert.ok(names.includes(".git"));
    assert.ok(names.includes("ignored-by-gitignore.txt"));
});

test("help output documents all and sort flags", { concurrency: false }, async () => {
    const result = await runCliInProcess(["help"], repoRoot);
    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes("--all"));
    assert.ok(result.stdout.includes("--sort <name|type>"));
});

test("gitignore supports glob and negation", { concurrency: false }, async (t) => {
    const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), "folderplus-gitignore-glob-"));
    t.after(() => fs.rmSync(fixtureDir, { recursive: true, force: true }));

    fs.writeFileSync(path.join(fixtureDir, ".gitignore"), "*.log\n!important.log\n");
    fs.writeFileSync(path.join(fixtureDir, "a.log"), "x");
    fs.writeFileSync(path.join(fixtureDir, "important.log"), "x");

    const result = await runCliInProcess(["tree", "--json"], fixtureDir);
    assert.equal(result.status, 0);

    const tree = JSON.parse(result.stdout);
    const names = tree.children.map((child) => child.name);
    assert.equal(names.includes("a.log"), false);
    assert.equal(names.includes("important.log"), true);
});

test("gitignore supports nested ignore files", { concurrency: false }, async (t) => {
    const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), "folderplus-gitignore-nested-"));
    t.after(() => fs.rmSync(fixtureDir, { recursive: true, force: true }));

    fs.mkdirSync(path.join(fixtureDir, "apps"), { recursive: true });
    fs.writeFileSync(path.join(fixtureDir, "apps", ".gitignore"), "skip.txt\n");
    fs.writeFileSync(path.join(fixtureDir, "apps", "skip.txt"), "x");
    fs.writeFileSync(path.join(fixtureDir, "apps", "keep.txt"), "x");

    const result = await runCliInProcess(["tree", "--json"], fixtureDir);
    assert.equal(result.status, 0);

    const tree = JSON.parse(result.stdout);
    const apps = tree.children.find((child) => child.name === "apps");
    assert.ok(apps);
    const names = apps.children.map((child) => child.name);
    assert.equal(names.includes("skip.txt"), false);
    assert.equal(names.includes("keep.txt"), true);
});

test("files-only parity: nested files appear in json and text", { concurrency: false }, async (t) => {
    const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), "folderplus-parity-files-"));
    t.after(() => fs.rmSync(fixtureDir, { recursive: true, force: true }));

    fs.mkdirSync(path.join(fixtureDir, "nested"), { recursive: true });
    fs.writeFileSync(path.join(fixtureDir, "nested", "x.ts"), "x");

    const text = await runCliInProcess(["tree", "--files-only", "--no-icons"], fixtureDir);
    const json = await runCliInProcess(["tree", "--files-only", "--json"], fixtureDir);

    assert.equal(text.status, 0);
    assert.equal(json.status, 0);
    assert.equal(text.stdout.includes("x.ts"), true);

    const parsed = JSON.parse(json.stdout);
    assert.equal(JSON.stringify(parsed).includes("x.ts"), true);
});
