import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

/**
 * Synchronizes version declarations across repository source files with package.json.
 * @param {boolean} [dryRun=false] If true, reports planned changes without writing.
 * @returns {{ version: string, versionTag: string, modifiedCount: number }}
 */
export function syncVersions(dryRun = false) {
    const pkgPath = resolve(rootDir, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    const version = pkg.version;
    const versionTag = `v${version}`;

    let modifiedCount = 0;

    // Synchronize .release-please-manifest.json if present and out of sync
    const manifestPath = resolve(rootDir, '.release-please-manifest.json');
    if (existsSync(manifestPath)) {
        try {
            const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
            if (manifest['.'] !== version) {
                manifest['.'] = version;
                if (!dryRun) {
                    writeFileSync(manifestPath, JSON.stringify(manifest, null, 4) + '\n', 'utf8');
                }
                modifiedCount++;
                console.log(`[sync-versions] Synchronized ${manifestPath} -> ${version}`);
            }
        } catch (err) {
            console.error(`[sync-versions] Warning: Failed to parse ${manifestPath}:`, err);
        }
    }

    const filesToSync = [
        {
            path: resolve(rootDir, 'public/llms.txt'),
            replacers: [
                {
                    // Update site version declaration line and ensure release-please marker is present
                    pattern:
                        /Site version:\s*v?[0-9]+\.[0-9]+\.[0-9]+(?:-[a-zA-Z0-9.]+)?(\.?)(\s*<!--\s*x-release-please-version\s*-->)?/gi,
                    replacement: `Site version: ${versionTag}. <!-- x-release-please-version -->`,
                },
            ],
        },
        {
            path: resolve(rootDir, 'public/llms-full.txt'),
            replacers: [
                {
                    // Update site version declaration line and ensure release-please marker is present
                    pattern:
                        /\*\*Site version:\s*v?[0-9]+\.[0-9]+\.[0-9]+(?:-[a-zA-Z0-9.]+)?(\.?)\*\*(\s*<!--\s*x-release-please-version\s*-->)?/gi,
                    replacement: `**Site version: ${versionTag}.** <!-- x-release-please-version -->`,
                },
            ],
        },
    ];

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
const isDirectRun = Boolean(
    process.argv[1] &&
    (process.platform === 'win32'
        ? resolve(fileURLToPath(import.meta.url)).toLowerCase() ===
          resolve(process.argv[1]).toLowerCase()
        : resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1]))
);

if (isDirectRun) {
    syncVersions();
}
