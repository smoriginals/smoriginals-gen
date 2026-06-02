import * as fs from 'fs';
import * as path from 'path';

// Get file size with proper formatting
export function getFileSize(filePath: string): string {
    try {
        const stats = fs.statSync(filePath);
        return formatBytes(stats.size);
    } catch {
        return '0 B';
    }
}

// Get total size of a directory
export function getDirectorySize(dirPath: string): number {
    let totalSize = 0;

    try {
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);

            if (stats.isFile()) {
                totalSize += stats.size;
            } else if (stats.isDirectory()) {
                // Skip node_modules and .git for performance
                if (item !== 'node_modules' && item !== '.git') {
                    totalSize += getDirectorySize(itemPath);
                }
            }
        }
    } catch (error) {
        // Skip permission errors
    }

    return totalSize;
}

// Get import count for a file
export function getImportCount(filePath: string): number {
    const ext = path.extname(filePath).toLowerCase();
    const sourceExts = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];

    if (!sourceExts.includes(ext)) {
        return 0;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const importMatches = content.match(/import\s+.*?from\s+['"][^'"]+['"]|require\s*\(\s*['"][^'"]+['"]\s*\)/g);
        return importMatches ? importMatches.length : 0;
    } catch {
        return 0;
    }
}

// Format bytes to human readable
function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}