import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
    // ⚡ Bolt: Fetch collections concurrently to reduce total wait time
    const [posts, projects] = await Promise.all([getCollection('blog'), getCollection('projects')]);

    const postItems = posts.map((post) => ({
        ...post.data,
        link: `/blog/${post.id}/`,
    }));

    // ⚡ Bolt: Hoist date allocation to prevent redundant object instantiation in loop
    const defaultProjectDate = new Date('2025-01-01');
    const projectItems = projects.map((project) => ({
        title: `Project: ${project.data.title}`,
        description: project.data.description,
        pubDate: defaultProjectDate,
        link: `/#projects`, // Direct user to the homepage projects section
    }));

    return rss({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        site: context.site,
        items: [...postItems, ...projectItems],
    });
}
