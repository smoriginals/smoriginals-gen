import chalk from 'chalk'
import * as fs from "fs";
import * as path from "path";
import { FILE_STYLES } from './fileStyle.js';
import { IgnoreMatcher, TreeFilter, TreeSort } from "./types.js";

// Helper functions for size calculation
function getFileSize(filePath: string): string {
    try {
        const stats = fs.statSync(filePath);
        return formatBytes(stats.size);
    } catch {
        return '';
    }
}

function getDirectorySize(dirPath: string): number {
    let totalSize = 0;
    try {
        const items = fs.readdirSync(dirPath);
        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);
            if (stats.isFile()) {
                totalSize += stats.size;
            } else if (stats.isDirectory() && item !== 'node_modules' && item !== '.git') {
                totalSize += getDirectorySize(itemPath);
            }
        }
    } catch (error) {
        // Skip permission errors
    }
    return totalSize;
}

function getFormattedDirectorySize(dirPath: string): string {
    const size = getDirectorySize(dirPath);
    if (size === 0) return '';
    return chalk.gray(` [${formatBytes(size)}]`);
}

function getImportCount(filePath: string): number {
    const ext = path.extname(filePath).toLowerCase();
    const sourceExts = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];
    if (!sourceExts.includes(ext)) return 0;

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const matches = content.match(/import\s+.*?from\s+['"][^'"]+['"]|require\s*\(\s*['"][^'"]+['"]\s*\)/g);
        return matches ? matches.length : 0;
    } catch {
        return 0;
    }
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Function to print summary at the end
function printSummary(rootDir: string, currentDir: string): void {
    // Use the directory we're actually scanning (currentDir) for summary
    const scanDir = currentDir;
    let totalFolders = 0;
    let totalFiles = 0;
    let totalSize = 0;

    function walk(dir: string) {
        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const itemPath = path.join(dir, item);
                const stats = fs.statSync(itemPath);

                if (stats.isDirectory()) {
                    if (item !== 'node_modules' && item !== '.git') {
                        totalFolders++;
                        walk(itemPath);
                    }
                } else if (stats.isFile()) {
                    totalFiles++;
                    totalSize += stats.size;
                }
            }
        } catch (error) {
            // Skip permission errors
        }
    }

    walk(scanDir);

    console.log(chalk.bold('\n' + '='.repeat(50)));
    console.log(chalk.bold(`📊 ${totalFolders} folders, ${totalFiles} files, ${formatBytes(totalSize)}`));
    console.log(chalk.bold('='.repeat(50)));
}

function sortEntries(entries: fs.Dirent[], sort?: TreeSort): fs.Dirent[] {
    if (!sort) return entries;

    const compareNames = (aName: string, bName: string): number => {
        const aLower = aName.toLowerCase();
        const bLower = bName.toLowerCase();

        if (aLower < bLower) return -1;
        if (aLower > bLower) return 1;
        if (aName < bName) return -1;
        if (aName > bName) return 1;
        return 0;
    };

    return [...entries].sort((a, b) => {
        if (sort === "type") {
            if (a.isDirectory() && !b.isDirectory()) return -1;
            if (!a.isDirectory() && b.isDirectory()) return 1;
        }

        return compareNames(a.name, b.name);
    });
}

export function generateTree(
    rootDir: string,
    dir: string,
    prefix = "",
    shouldIgnore?: IgnoreMatcher,
    filter: TreeFilter = "all",
    sort?: TreeSort,
    depth = 0,
    maxDepth = Infinity,
    icons = true,
    onlyExts?: Set<string>
): void {

    const entries = sortEntries(fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((entry) => {
            if (!shouldIgnore) return true;
            // Fix: Use the correct relative path for ignore matching
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(rootDir, fullPath);
            return !shouldIgnore(relativePath, entry.isDirectory());
        }), sort);

    entries.forEach((entry, index) => {
        const isLast = index === entries.length - 1;
        const pointer = isLast ? "└─ " : "├─ ";
        const line = chalk.dim(prefix + pointer);
        const fullPath = path.join(dir, entry.name);

        // Directory
        if (entry.isDirectory()) {
            if (filter !== "files") {
                // Get size info for directories
                const sizeInfo = getFormattedDirectorySize(fullPath);
                const label = icons
                    ? `📁 ${chalk.bold.yellow(entry.name)}${sizeInfo}`
                    : `${chalk.bold.yellow(entry.name)}${sizeInfo}`;
                console.log(line + label);
            }

            if (depth + 1 < maxDepth) {
                const newPrefix = prefix + (isLast ? "   " : "│  ");
                generateTree(rootDir, fullPath, newPrefix, shouldIgnore, filter, sort, depth + 1, maxDepth, icons, onlyExts);
            }
            return;
        }

        // File
        if (filter !== "dirs") {
            const ext = path.extname(entry.name).slice(1);
            if (onlyExts && !onlyExts.has(ext)) return;
            const style = FILE_STYLES[ext];

            // Get size and import info for files
            const sizeInfo = getFileSize(fullPath);
            const importCount = getImportCount(fullPath);
            const sizeText = sizeInfo ? chalk.gray(` (${sizeInfo})`) : '';
            const importText = importCount > 0 ? chalk.cyan(` [${importCount} imports]`) : '';

            let display: string;
            if (!icons) {
                display = style
                    ? `${style.color(entry.name)}${sizeText}${importText}`
                    : `${chalk.gray(entry.name)}${sizeText}${importText}`;
            } else {
                display = style
                    ? `${style.icon} ${style.color(entry.name)}${sizeText}${importText}`
                    : `📄 ${chalk.gray(entry.name)}${sizeText}${importText}`;
            }

            console.log(line + display);
        }
    });

    // Print summary at the end (only at the top level of the command)
    // When depth is 0, that means we're at the starting directory
    if (depth === 0) {
        printSummary(rootDir, dir);
    }
}