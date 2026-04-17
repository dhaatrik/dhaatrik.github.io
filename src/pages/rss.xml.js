import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
    const posts = await getCollection('blog');
    const projects = await getCollection('projects');

    const postItems = posts.map((post) => ({
        ...post.data,
        link: `/blog/${post.id}/`,
    }));

    const projectItems = projects.map((project) => ({
        title: `Project: ${project.data.title}`,
        description: project.data.description,
        // Using an arbitrary default date since projects don't have pubDate
        pubDate: new Date('2025-01-01'),
        link: `/#projects`, // Direct user to the homepage projects section
    }));

    return rss({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        site: context.site,
        items: [...postItems, ...projectItems],
    });
}
