# FolderPlus

Modern developer-friendly CLI tool to visualize project structures with filtering, JSON output, icons, and customizable ignore rules.

![FolderPlus Logo](./assets/logo.png)

![npm version](https://img.shields.io/npm/v/folderplus)
![license](https://img.shields.io/npm/l/folderplus)
![downloads](https://img.shields.io/npm/dm/folderplus)
![install size](https://packagephobia.com/badge?p=folderplus)
![bundle size](https://img.shields.io/bundlephobia/min/folderplus)
![Node.js](https://img.shields.io/node/v/folderplus)

---

# Cross-platform Support

- Windows
- Linux
- macOS

---

# Preview

![FolderPlus Demo](./assets/demo.png)

---

# Installation

## npm

```bash
npm install -g folderplus@latest
```

## pnpm

```bash
pnpm add -g folderplus
```

## Yarn

```bash
yarn global add folderplus
```

## Bun

```bash
bun add -g folderplus
```

## Local Installation

```bash
npm install folderplus
```

---

# Verify Installation

```bash
folderplus version
```

or

```bash
folderplus --version
```

---

# Usage

## Basic tree

```bash
folderplus tree
```

## Files only

```bash
folderplus tree --files-only
```

## Directories only

```bash
folderplus tree --dirs-only
```

## Limit depth

```bash
folderplus tree --depth 1
```

Shows only the root level.

```bash
folderplus tree --depth 2
```

Shows one nested level inside the root.

## Filter extensions

```bash
folderplus tree --only js,ts
```

> Extensions should be provided without dots.

## Ignore directories

```bash
folderplus tree --ignore dist,build,temp
```

## JSON output

```bash
folderplus tree --json
```

---

# Options

| Flag              | Description                            |
| ----------------- | -------------------------------------- |
| `--no-icons`      | Disable icons                          |
| `--files-only`    | Show only files                        |
| `--dirs-only`     | Show only directories                  |
| `--depth <n>`     | Limit tree depth                       |
| `--only <ext>`    | Filter by extensions, e.g. `js,ts`     |
| `--ignore <dirs>` | Exclude directories, e.g. `dist,build` |
| `--json`          | Output tree as JSON                    |

---

# JSON Output Example

Run inside your project folder:

```bash
folderplus tree --json
```

Example output:

```json
{
  "name": "my-app",
  "type": "directory",
  "children": [
    {
      "name": "src",
      "type": "directory",
      "children": []
    },
    {
      "name": "package.json",
      "type": "file"
    }
  ]
}
```

> The root `name` is the current directory name where the command is executed.

---

# Ignore Behavior

By default, FolderPlus ignores:

- `node_modules`
- `.git`
- Basic entries listed inside the root `.gitignore`

Custom ignores:

```bash
folderplus tree --ignore dist,build,temp
```

> Current `.gitignore` support handles simple root-level entry names and does not currently support advanced glob patterns or negation rules.

---

# Use Cases

- Visualize large codebases
- Generate project structures for documentation
- Export project trees as JSON
- Quickly inspect repositories
- Improve developer workflow and debugging

---

# Features

- Clean project tree visualization
- Optional icons
- Filter files or directories only
- Filter by file extensions
- Custom ignore support
- JSON output for tooling and automation
- Fast and lightweight
- Cross-platform support

---

# Help

```bash
folderplus --help
```

---

# License

MIT

![license](https://img.shields.io/npm/l/folderplus)

---

# Author

Maintained by [__SMORIGINALS__](https://github.com/smoriginals)