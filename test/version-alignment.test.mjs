import { test, describe } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as consts from '../src/consts.ts';
import { syncVersions } from '../scripts/sync-versions.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

describe('Repository & Site Version Alignment', () => {
    const pkg = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf8'));
    const manifest = JSON.parse(
        readFileSync(resolve(rootDir, '.release-please-manifest.json'), 'utf8')
    );
    const releaseConfig = JSON.parse(
        readFileSync(resolve(rootDir, 'release-please-config.json'), 'utf8')
    );
    const llmsTxt = readFileSync(resolve(rootDir, 'public/llms.txt'), 'utf8');
    const llmsFullTxt = readFileSync(resolve(rootDir, 'public/llms-full.txt'), 'utf8');

    test('package.json version is a valid semver string', () => {
        assert.match(
            pkg.version,
            /^\d+\.\d+\.\d+$/,
            `package.json version "${pkg.version}" must be valid SemVer`
        );
    });

    test('SITE_VERSION in src/consts.ts matches package.json version with v prefix', () => {
        assert.strictEqual(
            consts.SITE_VERSION,
            `v${pkg.version}`,
            `SITE_VERSION must match v${pkg.version}`
        );
    });

    test('.release-please-manifest.json is aligned with package.json version', () => {
        assert.strictEqual(
            manifest['.'],
            pkg.version,
            `.release-please-manifest.json version "${manifest['.']}" must match package.json version "${pkg.version}"`
        );
    });

    test('release-please-config.json includes public/llms.txt and public/llms-full.txt in extra-files', () => {
        const extraFiles = releaseConfig.packages['.']['extra-files'];
        assert.ok(
            Array.isArray(extraFiles),
            'extra-files must be an array in release-please-config.json'
        );

        const paths = extraFiles.map((f) => (typeof f === 'string' ? f : f.path));
        assert.ok(
            paths.includes('public/llms.txt'),
            'release-please-config.json must track public/llms.txt in extra-files'
        );
        assert.ok(
            paths.includes('public/llms-full.txt'),
            'release-please-config.json must track public/llms-full.txt in extra-files'
        );
    });

    test('public/llms.txt contains synchronized site version and release-please marker', () => {
        const expectedDeclaration = `Site version: v${pkg.version}. <!-- x-release-please-version -->`;
        assert.ok(
            llmsTxt.includes(expectedDeclaration),
            `public/llms.txt must contain "${expectedDeclaration}"`
        );
        assert.doesNotMatch(
            llmsTxt,
            /v4\.8\.1/,
            'public/llms.txt must not contain stale v4.8.1 version strings'
        );
    });

    test('public/llms-full.txt contains synchronized site version and release-please marker', () => {
        const expectedDeclaration = `**Site version: v${pkg.version}.** <!-- x-release-please-version -->`;
        assert.ok(
            llmsFullTxt.includes(expectedDeclaration),
            `public/llms-full.txt must contain "${expectedDeclaration}"`
        );
        assert.doesNotMatch(
            llmsFullTxt,
            /v4\.8\.1/,
            'public/llms-full.txt must not contain stale v4.8.1 version strings'
        );
    });

    test('syncVersions() utility reports 0 pending modifications when repository is aligned', () => {
        const result = syncVersions(true);
        assert.strictEqual(
            result.modifiedCount,
            0,
            'Repository should already be fully synchronized with package.json version'
        );
    });
});
