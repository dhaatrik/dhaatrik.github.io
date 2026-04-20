import test from 'node:test';
import assert from 'node:assert';
import { remarkReadingTime } from './remark-reading-time.mjs';

test('remarkReadingTime plugin', async (t) => {
    await t.test('calculates reading time and injects it into frontmatter', () => {
        const plugin = remarkReadingTime();
        const tree = {
            type: 'root',
            children: [
                {
                    type: 'paragraph',
                    children: [{ type: 'text', value: 'This is a test with some words to calculate reading time.' }]
                }
            ]
        };
        const data = {
            astro: {
                frontmatter: {}
            }
        };

        plugin(tree, { data });

        assert.ok(data.astro.frontmatter.readingTime);
        assert.strictEqual(typeof data.astro.frontmatter.readingTime, 'string');
        assert.match(data.astro.frontmatter.readingTime, /1 min read/);
    });

    await t.test('handles empty tree', () => {
        const plugin = remarkReadingTime();
        const tree = {
            type: 'root',
            children: []
        };
        const data = {
            astro: {
                frontmatter: {}
            }
        };

        plugin(tree, { data });

        assert.ok(data.astro.frontmatter.readingTime);
        assert.match(data.astro.frontmatter.readingTime, /0 min read/);
    });

    await t.test('handles large amount of text', () => {
        const plugin = remarkReadingTime();
        const words = new Array(1000).fill('word').join(' ');
        const tree = {
            type: 'root',
            children: [
                {
                    type: 'paragraph',
                    children: [{ type: 'text', value: words }]
                }
            ]
        };
        const data = {
            astro: {
                frontmatter: {}
            }
        };

        plugin(tree, { data });

        assert.ok(data.astro.frontmatter.readingTime);
        // Default reading speed is ~200 wpm, so 1000 words should be ~5 min
        assert.match(data.astro.frontmatter.readingTime, /5 min read/);
    });
});
