# 
# 📁folderplus

A powerful, customizable CLI tool to visualize your project structure with icons, filters, sorting, JSON output, and more.

Inspired by the classic `tree` command — but modern, colorful, and developer-friendly.

---

# ✨ Features

- 📁 Beautiful project tree with icons
- 🔍 Filter files or directories only
- 📦 Supports `.gitignore` automatically
- 🎯 Filter by file extensions
- 🚫 Exclude unwanted extensions
- 🧩 Sorting by name or type
- 🧾 JSON output (for tooling & automation)
- 📊 Optional project statistics
- ⚡ Fast and lightweight
- 🖥️ Cross-platform (Windows / Linux / macOS)

---

# 📦 Installation

```
npm install -g folderplus@latest
```
```
npm i folderplus
```
```
npm install folderplus
```

# ✔ Verify installation:

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


# 🎛️ Options & Flags

#### Flag Description
```
--all
```
#### Show hidden files & folders
```
--no-icons
```

#### Disable icons
```
--files-only
```
#### Show only files
```
--dirs-only
```

#### Show only directories
```
--depth <n>
```

#### Limit tree depth
```
--only js,ts
```

#### Sort by directory/file
```
--json
```

#### Output tree as JSON
```
folderplus tree --json > output.json
```
#### Output:
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
# 🧠 How Ignore Works

### folderplus automatically ignores:
```
node_modules
.git
Entries from .gitignore
```
#### You can add more using:
```
--ignore dist,build,temp
```

# 📸 Screenshots

![Preview](https://res.cloudinary.com/smoriginals/image/upload/v1769943852/Screenshot_60_ea9lrr.png)

# 🛠️ Built With
- Node.js
- TypeScript
- Chalk
- Ora

# 🤝 Contributing

__Contributions are welcome!__

- Fork the repo
- Create a feature branch
- Commit your changes
- Open a Pull Request

# 📄 License
#### MIT License © 2026 smoriginals

## ⭐ Support
#### 💫 If you find this tool useful:
- ⭐ Star the repo
- 📢 Share with others

# Acknowledgements

Continuous improvement is crucial for maintaining engagement and user satisfaction. If you need any assistance or feedback on upcoming features, feel free to share!
# Author

- [@smoriginals](https://github.com/smoriginals)
