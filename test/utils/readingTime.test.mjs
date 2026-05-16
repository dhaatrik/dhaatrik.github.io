import test from 'node:test';
import assert from 'node:assert';
import { getReadingTime } from '../../src/utils/readingTime.ts';

test('Reading Time Utility', async (t) => {
    await t.test('calculates correct reading time for short text', () => {
        const text = 'This is a short text.';
        assert.strictEqual(getReadingTime(text), 1);
    });

    await t.test('calculates correct reading time for longer text', () => {
        const text = 'word '.repeat(401);
        assert.strictEqual(getReadingTime(text), 3);
    });

    await t.test('handles empty strings', () => {
        assert.strictEqual(getReadingTime(''), 0);
    });

    await t.test('handles whitespace only strings', () => {
        assert.strictEqual(getReadingTime('   \n \t  '), 0);
    });
});
