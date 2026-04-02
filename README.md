# 📁 folderplus

A powerful, customizable CLI tool to visualize your project structure with icons, filters, sorting, JSON output, and more.

Inspired by the classic `tree` command — but modern, colorful, and developer-friendly.

---

## ✨ Features

- Beautiful project tree with icons
- Filter files or directories only
- Supports `.gitignore` automatically
- Filter by file extensions
- Exclude unwanted extensions
- Sorting by name or type
- JSON output for tooling and automation
- Fast and lightweight
- Cross-platform: Windows, Linux, macOS

---

## 📦 Installation

```
npm install -g folderplus@latest
```
```
npm i folderplus
```
```
npm install folderplus
```

Verify installation:

```
folderplus version
```
# 🚀 Usage

- Basic tree
```
folderplus tree
```

- Files only
```
folderplus tree --files-only
```
- Directories only
```
folderplus tree --dirs-only
```

- Limit depth
```
folderplus tree --depth 2
```


# 🎛️ Options

| Flag | Description |
|---|---|
| `--all` | Show hidden files and folders |
| `--no-icons` | Disable icons |
| `--files-only` | Show only files |
| `--dirs-only` | Show only directories |
| `--depth <n>` | Limit tree depth |
| `--only <ext>` | Filter by extensions, e.g. `js,ts` |
| `--ignore <dirs>` | Exclude directories, e.g. `dist,build` |
| `--json` | Output tree as JSON |

---

## 🧾 JSON Output Example

```
folderplus tree --json
```
```
Json
{
  "name": "project",
  "type": "directory",
  "children": [
    { "name": "src", "type": "directory" },
    { "name": "index.js", "type": "file" }
  ]
}
```

---

## 🧠 Ignore Behavior

By default, folderplus ignores:

- `node_modules`
- `.git`
- Entries listed in `.gitignore`

Add custom ignores:
```
--ignore dist,build,temp
```

---

## Author

Maintained by [@smoriginals](https://github.com/smoriginals)
