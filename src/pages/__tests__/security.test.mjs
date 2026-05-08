import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../../');

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            }
        } else {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
}

test('Security: all target="_blank" links must have rel="noopener noreferrer"', () => {
    const srcDir = path.join(ROOT_DIR, 'src');
    const files = getAllFiles(srcDir).filter((file) => file.endsWith('.astro'));

    let failures = [];

    files.forEach((file) => {
        const content = fs.readFileSync(file, 'utf8');
        // Regex to find <a> tags, including multi-line
        const aTagRegex = /<a\s+(.*?)>/gis;
        let match;

        while ((match = aTagRegex.exec(content)) !== null) {
            const attributes = match[1];

            // Check if target="_blank" or target='_blank' is present
            const hasTargetBlank = /target\s*=\s*["']_blank["']/i.test(attributes);

            if (hasTargetBlank) {
                // Check for rel attribute
                const relMatch = /rel\s*=\s*["'](.*?)["']/i.exec(attributes);
                const relValue = relMatch ? relMatch[1].toLowerCase() : '';

                const hasNoopener = relValue.includes('noopener');
                const hasNoreferrer = relValue.includes('noreferrer');

                if (!hasNoopener || !hasNoreferrer) {
                    failures.push({
                        file: path.relative(ROOT_DIR, file),
                        tag: match[0].replace(/\s+/g, ' ').trim(),
                    });
                }
            }
        }
    });

    if (failures.length > 0) {
        const failureMessage = failures
            .map((f) => `  - ${f.file}: ${f.tag}`)
            .join('\n');
        assert.fail(`Found target="_blank" links missing or having incomplete rel="noopener noreferrer":\n${failureMessage}`);
    }
});
