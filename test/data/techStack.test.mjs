import { test, describe } from 'node:test';
import assert from 'node:assert';
import { techGroups } from '../../src/data/techStack.ts';

describe('Tech Stack Data', () => {
    test('techGroups is a non-empty object', () => {
        assert.strictEqual(typeof techGroups, 'object');
        assert.notStrictEqual(techGroups, null);
        assert.ok(Object.keys(techGroups).length > 0);
    });

    test('techGroups contains expected keys', () => {
        const expectedKeys = ['Frontend', 'Backend', 'Cloud_Db', 'AI_Math', 'Model_Orchestration'];
        expectedKeys.forEach((key) => {
            assert.ok(key in techGroups, `Missing expected key: ${key}`);
        });
    });

    test('each group in techGroups is a non-empty array of tech icons', () => {
        for (const [groupName, icons] of Object.entries(techGroups)) {
            assert.ok(Array.isArray(icons), `${groupName} should be an array`);
            assert.ok(icons.length > 0, `${groupName} should not be empty`);

            icons.forEach((icon, index) => {
                assert.strictEqual(
                    typeof icon.name,
                    'string',
                    `Icon at ${groupName}[${index}] should have a string name`
                );
                assert.ok(
                    icon.name.length > 0,
                    `Icon at ${groupName}[${index}] should have a non-empty name`
                );
                assert.strictEqual(
                    typeof icon.src,
                    'string',
                    `Icon at ${groupName}[${index}] should have a string src`
                );
                assert.ok(
                    icon.src.startsWith('https://'),
                    `Icon at ${groupName}[${index}] should have a valid HTTPS src URL`
                );
            });
        }
    });
});
