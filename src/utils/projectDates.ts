import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export const getGitLastModified = (projectId: string): Date => {
    let filePath = path.join(process.cwd(), 'src', 'content', 'projects', projectId);
    if (!fs.existsSync(filePath)) {
        if (fs.existsSync(filePath + '.md')) {
            filePath = filePath + '.md';
        } else if (fs.existsSync(filePath + '.mdx')) {
            filePath = filePath + '.mdx';
        }
    }

    if (import.meta.env.DEV) {
        try {
            if (fs.existsSync(filePath)) {
                return fs.statSync(filePath).mtime;
            }
        } catch {
            /* fall through */
        }
        return new Date();
    }

    try {
        if (fs.existsSync(filePath)) {
            const stdout = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
                encoding: 'utf-8',
                stdio: ['ignore', 'pipe', 'ignore'],
            }).trim();
            if (stdout) {
                return new Date(stdout);
            }
        }
    } catch {
        /* fall through */
    }
    try {
        if (fs.existsSync(filePath)) {
            return fs.statSync(filePath).mtime;
        }
    } catch {
        /* fall through */
    }
    return new Date();
};

// ⚡ Bolt: Cache Intl.DateTimeFormat to avoid costly re-instantiations during SSG loops
const relativeDateFormatter = new Intl.DateTimeFormat('en-us', {
    month: 'short',
    year: 'numeric',
});

export const getRelativeTimeString = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return 'just now';
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
        if (diffDays === 0) {
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMins = Math.floor(diffMs / (1000 * 60));
                if (diffMins <= 1) return 'just now';
                return `${diffMins}m ago`;
            }
            return `${diffHours}h ago`;
        }
        return `${diffDays}d ago`;
    }

    return relativeDateFormatter.format(date);
};
