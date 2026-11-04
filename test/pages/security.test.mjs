import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../');

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
        const failureMessage = failures.map((f) => `  - ${f.file}: ${f.tag}`).join('\n');
        assert.fail(
            `Found target="_blank" links missing or having incomplete rel="noopener noreferrer":\n${failureMessage}`
        );
    }
});

test('Security: all JSON-LD schemas serialized in .astro files must escape < brackets', () => {
    const srcDir = path.join(ROOT_DIR, 'src');
    const files = getAllFiles(srcDir).filter((file) => file.endsWith('.astro'));

    let failures = [];

    files.forEach((file) => {
        const content = fs.readFileSync(file, 'utf8');
        // Match <script ... type="application/ld+json" ... set:html={varName} ... />
        const scriptRegex =
            /<script\b[^>]*type=["']application\/ld\+json["'][^>]*set:html=\{([^}]+)\}[^>]*>/g;
        let scriptMatch;

        while ((scriptMatch = scriptRegex.exec(content)) !== null) {
            const varName = scriptMatch[1].trim();

            // Locate declaration of varName in frontmatter
            const varRegex = new RegExp(
                `(?:const|let|var)\\s+${varName}\\s*=\\s*([\\s\\S]*?)(?:\\n---|(?:\\n(?:const|let|var|import)\\s+)|$)`
            );
            const declMatch = varRegex.exec(content);

            if (!declMatch) {
                failures.push({
                    file: path.relative(ROOT_DIR, file),
                    detail: `Could not find declaration for ${varName}`,
                });
                continue;
            }

            const declBody = declMatch[1];
            const hasEscape =
                declBody.includes('.replace(/</g,') &&
                (declBody.includes('\\u003c') || declBody.includes('u003c'));

            if (!hasEscape) {
                failures.push({
                    file: path.relative(ROOT_DIR, file),
                    detail: `Variable ${varName} does not escape '<' via .replace(/</g, '\\\\u003c')`,
                });
            }
        }
    });

    if (failures.length > 0) {
        const failureMessage = failures.map((f) => `  - ${f.file}: ${f.detail}`).join('\n');
        assert.fail(
            `Found JSON-LD schema serialization missing Unicode bracket escaping (.replace(/</g, '\\u003c')):\n${failureMessage}`
        );
    }
});

test('Security: offline HTML export archive must enforce an air-gapped Content-Security-Policy', () => {
    const exportActionsFile = path.join(ROOT_DIR, 'src', 'scripts', 'blog', 'exportActions.ts');
    const content = fs.readFileSync(exportActionsFile, 'utf8');

    assert.ok(
        content.includes('http-equiv="Content-Security-Policy"'),
        'exportActions.ts must contain http-equiv="Content-Security-Policy"'
    );
    assert.ok(
        content.includes("default-src 'none'"),
        "exportActions.ts CSP must set default-src 'none'"
    );
});

test('Security: .gitignore must ignore all .env variants while allowing .env.example', () => {
    const gitignoreFile = path.join(ROOT_DIR, '.gitignore');
    const content = fs.readFileSync(gitignoreFile, 'utf8');

    assert.ok(content.includes('.env.*'), '.gitignore must ignore .env.*');
    assert.ok(content.includes('!.env.example'), '.gitignore must allow !.env.example');
});

test('Security: all GitHub Actions workflows must pin external actions to 40-character commit SHAs', () => {
    const workflowsDir = path.join(ROOT_DIR, '.github', 'workflows');
    const workflowFiles = fs.readdirSync(workflowsDir).filter((file) => file.endsWith('.yml'));

    let unpinned = [];

    workflowFiles.forEach((file) => {
        const fullPath = path.join(workflowsDir, file);
        const content = fs.readFileSync(fullPath, 'utf8');
        const usesRegex = /uses:\s*([\w\-./]+)@(\S+)/g;
        let match;

        while ((match = usesRegex.exec(content)) !== null) {
            const actionName = match[1];
            const ref = match[2];

            // 40-character hex commit SHA
            if (!/^[a-f0-9]{40}$/i.test(ref)) {
                unpinned.push({
                    file,
                    action: `${actionName}@${ref}`,
                });
            }
        }
    });

    if (unpinned.length > 0) {
        const failureMessage = unpinned.map((u) => `  - ${u.file}: ${u.action}`).join('\n');
        assert.fail(
            `Found unpinned external GitHub Actions (must use 40-character commit SHAs):\n${failureMessage}`
        );
    }
});
