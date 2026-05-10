import { test, describe } from 'node:test';
import assert from 'node:assert';
import { dateFormatter } from '../../src/utils/dateFormatter.ts';

describe('Date Formatter Utility', () => {
    test('dateFormatter is an instance of Intl.DateTimeFormat', () => {
        assert.ok(dateFormatter instanceof Intl.DateTimeFormat);
    });

    test('formats dates correctly in en-us style', () => {
        const date = new Date(2024, 4, 10); // May 10, 2024
        const formatted = dateFormatter.format(date);
        assert.strictEqual(formatted, 'May 10, 2024');
    });

    test('formats different months correctly', () => {
        const tests = [
            { year: 2024, month: 0, day: 1, expected: 'Jan 1, 2024' },
            { year: 2024, month: 11, day: 25, expected: 'Dec 25, 2024' },
        ];
        tests.forEach(({ year, month, day, expected }) => {
            const date = new Date(year, month, day);
            assert.strictEqual(dateFormatter.format(date), expected);
        });
    });

    test('is configured with correct options', () => {
        const options = dateFormatter.resolvedOptions();
        assert.strictEqual(options.locale.toLowerCase(), 'en-us');
        assert.strictEqual(options.year, 'numeric');
        assert.strictEqual(options.month, 'short');
        assert.strictEqual(options.day, 'numeric');
    });
});
