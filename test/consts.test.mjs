import { test, describe } from 'node:test';
import assert from 'node:assert';
import * as consts from '../src/consts.ts';

describe('Constants', () => {
    test('SITE_TITLE is a non-empty string', () => {
        assert.strictEqual(typeof consts.SITE_TITLE, 'string');
        assert.ok(consts.SITE_TITLE.length > 0, 'SITE_TITLE should not be empty');
    });

    test('SITE_DESCRIPTION is a non-empty string', () => {
        assert.strictEqual(typeof consts.SITE_DESCRIPTION, 'string');
        assert.ok(consts.SITE_DESCRIPTION.length > 0, 'SITE_DESCRIPTION should not be empty');
    });

    test('SOCIAL_LINKS is a valid object with HTTPS URLs', () => {
        assert.strictEqual(typeof consts.SOCIAL_LINKS, 'object');
        assert.ok(consts.SOCIAL_LINKS !== null, 'SOCIAL_LINKS should not be null');

        const links = Object.values(consts.SOCIAL_LINKS);
        assert.ok(links.length > 0, 'SOCIAL_LINKS should not be empty');

        links.forEach((url) => {
            assert.strictEqual(typeof url, 'string', 'Each social link should be a string');
            assert.ok(url.startsWith('https://'), 'Each social link should be a valid HTTPS URL');
        });
    });

    test('SOCIAL_LINKS contains expected platforms', () => {
        const expectedPlatforms = ['github', 'linkedin', 'twitter', 'medium'];
        expectedPlatforms.forEach((platform) => {
            assert.ok(platform in consts.SOCIAL_LINKS, `Missing expected platform: ${platform}`);
        });
    });

    test('NAV_ITEMS is a non-empty array with expected structure', () => {
        assert.ok(Array.isArray(consts.NAV_ITEMS), 'NAV_ITEMS should be an array');
        assert.ok(consts.NAV_ITEMS.length > 0, 'NAV_ITEMS should not be empty');

        consts.NAV_ITEMS.forEach((item) => {
            assert.strictEqual(typeof item.href, 'string', 'Each nav item should have a string href');
            assert.strictEqual(
                typeof item.label,
                'string',
                'Each nav item should have a string label'
            );
            assert.ok(item.href.length > 0, 'Nav item href should not be empty');
            assert.ok(item.label.length > 0, 'Nav item label should not be empty');
        });
    });
});
