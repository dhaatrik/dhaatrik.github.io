import { test } from 'node:test';
import assert from 'node:assert';
import { GET } from '../rss.xml.js';

test('rss GET endpoint returns correctly formatted rss data', async () => {
    const context = {
        site: new URL('https://example.com')
    };

    const result = await GET(context);

    assert.strictEqual(result.title, 'Test Title');
    assert.strictEqual(result.description, 'Test Description');
    assert.strictEqual(result.site.toString(), 'https://example.com/');

    assert.strictEqual(result.items.length, 2);

    const postItem = result.items.find(item => item.title === 'First Post');
    assert.ok(postItem);
    assert.strictEqual(postItem.description, 'This is my first post');
    assert.strictEqual(postItem.pubDate.getTime(), new Date('2024-01-01').getTime());
    assert.strictEqual(postItem.link, '/blog/my-first-post/');

    const projectItem = result.items.find(item => item.title === 'Project: My Project');
    assert.ok(projectItem);
    assert.strictEqual(projectItem.description, 'This is a test project');
    assert.strictEqual(projectItem.pubDate.getTime(), new Date('2025-01-01').getTime());
    assert.strictEqual(projectItem.link, '/#projects');
});
