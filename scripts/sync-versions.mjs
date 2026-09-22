import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

/**
 * Synchronizes version declarations across the repository with package.json.
 * @param {boolean} [dryRun=false] If true, reports planned changes without writing.
 * @returns {{ version: string, versionTag: string, modifiedCount: number }}
 */
export function syncVersions(dryRun = false) {
    const pkgPath = resolve(rootDir, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    const version = pkg.version;
    const versionTag = `v${version}`;

    const filesToSync = [
        {
            path: resolve(rootDir, 'public/llms.txt'),
            replacers: [
                {
                    // Update site version declaration line and ensure release-please marker is present
                    pattern:
                        /Site version:\s*v\d+\.\d+\.\d+(\.?)(\s*<!--\s*x-release-please-version\s*-->)?/g,
                    replacement: `Site version: ${versionTag}. <!-- x-release-please-version -->`,
                },
                {
                    // Clean up hardcoded patch versions in section headers
                    pattern: /## Footer Diagnostics \(v\d+\.\d+\.\d+\)/g,
                    replacement: '## Footer Diagnostics',
                },
                {
                    // Clean up hardcoded patch versions in bullet points
                    pattern: /v\d+\.\d+\.\d+:\s*(soil chemistry & crop physiology)/g,
                    replacement: '$1',
                },
            ],
        },
        {
            path: resolve(rootDir, 'public/llms-full.txt'),
            replacers: [
                {
                    // Update site version declaration line and ensure release-please marker is present
                    pattern:
                        /\*\*Site version:\s*v\d+\.\d+\.\d+(\.?)\*\*(\s*<!--\s*x-release-please-version\s*-->)?/g,
                    replacement: `**Site version: ${versionTag}.** <!-- x-release-please-version -->`,
                },
            ],
        },
    ];

    // Also synchronize dist artifacts if build has already completed
    const distLlms = resolve(rootDir, 'dist/llms.txt');
    if (existsSync(distLlms)) {
        filesToSync.push({
            path: distLlms,
            replacers: [
                {
                    pattern:
                        /Site version:\s*v\d+\.\d+\.\d+(\.?)(\s*<!--\s*x-release-please-version\s*-->)?/g,
                    replacement: `Site version: ${versionTag}. <!-- x-release-please-version -->`,
                },
                {
                    pattern: /## Footer Diagnostics \(v\d+\.\d+\.\d+\)/g,
                    replacement: '## Footer Diagnostics',
                },
            ],
        });
    }

    const distLlmsFull = resolve(rootDir, 'dist/llms-full.txt');
    if (existsSync(distLlmsFull)) {
        filesToSync.push({
            path: distLlmsFull,
            replacers: [
                {
                    pattern:
                        /\*\*Site version:\s*v\d+\.\d+\.\d+(\.?)\*\*(\s*<!--\s*x-release-please-version\s*-->)?/g,
                    replacement: `**Site version: ${versionTag}.** <!-- x-release-please-version -->`,
                },
            ],
        });
    }

    let modifiedCount = 0;

    for (const item of filesToSync) {
        if (!existsSync(item.path)) continue;
        const original = readFileSync(item.path, 'utf8');
        let updated = original;

        for (const { pattern, replacement } of item.replacers) {
            updated = updated.replace(pattern, replacement);
        }

        if (original !== updated) {
            if (!dryRun) {
                writeFileSync(item.path, updated, 'utf8');
            }
            modifiedCount++;
            console.log(`[sync-versions] Synchronized ${item.path} -> ${versionTag}`);
        }
    }

    if (modifiedCount === 0) {
        console.log(`[sync-versions] All files already synchronized with ${versionTag}`);
    }

    return { version, versionTag, modifiedCount };
}

// When invoked directly from the CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
    syncVersions();
}
