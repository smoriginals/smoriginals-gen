import chalk from "chalk";

export type FileStyle = {
    icon: string;
    color: (name: string) => string;
};

export const FILE_STYLES: Record<string, FileStyle> = {
    // Web
    js: { icon: "🟡", color: chalk.yellow },
    ts: { icon: "🔵", color: chalk.blue },
    jsx: { icon: "⚛️", color: chalk.cyan },
    tsx: { icon: "⚛️", color: chalk.cyan },

    // Backend / scripts
    py: { icon: "🐍", color: chalk.green },
    java: { icon: "☕", color: chalk.red },
    go: { icon: "🐹", color: chalk.cyan },
    rs: { icon: "🦀", color: chalk.redBright },

    // Systems
    c: { icon: "📘", color: chalk.blueBright },
    cpp: { icon: "📘", color: chalk.blueBright },

    // Data / config
    json: { icon: "🧾", color: chalk.gray },
    yml: { icon: "⚙️", color: chalk.magenta },
    yaml: { icon: "⚙️", color: chalk.magenta },
    env: { icon: "🔐", color: chalk.red },
    // Docs
    md: { icon: "📘", color: chalk.blue },
    txt: { icon: "📄", color: chalk.white },
};
