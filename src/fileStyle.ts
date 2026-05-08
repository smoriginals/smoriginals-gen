import chalk from 'chalk'

export type FileStyle = {
    icon: string;
    color: (name: string) => string;
};

export const FILE_STYLES: Record<string, FileStyle> = {
    // Web
    js: { icon: "⚡", color: chalk.yellow },
    ts: { icon: "💠", color: chalk.blue },
    jsx: { icon: "⚛️", color: chalk.cyan },
    tsx: { icon: "🌀", color: chalk.cyan },
    html: { icon: "🌐", color: chalk.bold.blueBright },
    css: { icon: "🎨", color: chalk.bold.magenta },
    php: { icon: "🐘", color: chalk.magentaBright },
    asp: { icon: "🔷", color: chalk.blueBright },

    // Backend / Scripts
    py: { icon: "🐍", color: chalk.green },
    java: { icon: "☕", color: chalk.magenta },
    go: { icon: "🐹", color: chalk.cyan },
    rs: { icon: "🦀", color: chalk.redBright },
    scala: { icon: "🔺", color: chalk.red },

    // Systems
    c: { icon: "📀", color: chalk.blueBright },
    cpp: { icon: "💻", color: chalk.cyan },
    sh: { icon: "📜", color: chalk.greenBright },
    ruby: { icon: "💎", color: chalk.red },

    // Data / Config
    json: { icon: "🧾", color: chalk.gray },
    yml: { icon: "⚙️", color: chalk.magenta },
    yaml: { icon: "⚙️", color: chalk.magenta },
    env: { icon: "🔐", color: chalk.bold.red },
    local: { icon: "🔐", color: chalk.bold.red },
    xml: { icon: "📜", color: chalk.blue },

    // Docs
    md: { icon: "📘", color: chalk.bold.white },
    txt: { icon: "📄", color: chalk.bold.white },
    pdf: { icon: "📄", color: chalk.bold.redBright },
    docx: { icon: "📄", color: chalk.blueBright },

    // Misc
    sql: { icon: "📊", color: chalk.yellowBright },
    log: { icon: "📜", color: chalk.gray }
};
