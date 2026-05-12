import { test, describe } from 'node:test';
import assert from 'node:assert';
import { glossary } from '../../src/data/glossary.ts';

describe('Glossary Data', () => {
    test('glossary is a non-empty object', () => {
        assert.strictEqual(typeof glossary, 'object');
        assert.notStrictEqual(glossary, null);
        assert.ok(Object.keys(glossary).length > 0);
    });

    test('each entry in glossary has a non-empty key and value', () => {
        for (const [key, value] of Object.entries(glossary)) {
            assert.strictEqual(typeof key, 'string', `Key "${key}" should be a string`);
            assert.ok(key.length > 0, `Key "${key}" should not be empty`);
            assert.strictEqual(typeof value, 'string', `Value for key "${key}" should be a string`);
            assert.ok(value.length > 0, `Value for key "${key}" should not be empty`);
        }
    });
});
