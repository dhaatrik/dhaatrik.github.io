import test from 'node:test';
import assert from 'node:assert';
import { escapeHtml } from '../../src/scripts/blog/exportActions.ts';

test('escapeHtml Utility', async (t) => {
    await t.test('escapes all standard HTML-significant characters (&, <, >, ", \')', () => {
        const input = '<script>alert("XSS & \'attack\'")</script>';
        const expected =
            '&lt;script&gt;alert(&quot;XSS &amp; &#039;attack&#039;&quot;)&lt;/script&gt;';
        assert.strictEqual(escapeHtml(input), expected);
    });

    await t.test('handles strings without any HTML entities unchanged', () => {
        const input = 'Transmission DeltaV Core Physics';
        assert.strictEqual(escapeHtml(input), input);
    });

    await t.test('handles empty strings', () => {
        assert.strictEqual(escapeHtml(''), '');
    });

    await t.test('handles multiple consecutive and nested entities', () => {
        const input = '<<<&&&"""\'\'\'>>>';
        const expected =
            '&lt;&lt;&lt;&amp;&amp;&amp;&quot;&quot;&quot;&#039;&#039;&#039;&gt;&gt;&gt;';
        assert.strictEqual(escapeHtml(input), expected);
    });

    await t.test('correctly escapes titles with quotes, brackets, and ampersands', () => {
        const input = 'Physics & "Quantum" <Calculus> \'Test\'';
        const expected = 'Physics &amp; &quot;Quantum&quot; &lt;Calculus&gt; &#039;Test&#039;';
        assert.strictEqual(escapeHtml(input), expected);
    });
});
