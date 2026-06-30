import type { CollectionEntry } from 'astro:content';

export type BlogPostEntry = CollectionEntry<'blog'>;

function sortByPubDate(posts: BlogPostEntry[]): BlogPostEntry[] {
    return [...posts].sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
}

function sortBySeriesOrder(posts: BlogPostEntry[]): BlogPostEntry[] {
    return [...posts].sort(
        (a, b) => (a.data.seriesOrder ?? 999) - (b.data.seriesOrder ?? 999)
    );
}

export function resolvePrevNext(
    post: BlogPostEntry,
    allPosts: BlogPostEntry[]
): {
    prevPost: BlogPostEntry | null;
    nextPost: BlogPostEntry | null;
    isSeriesNav: boolean;
} {
    if (post.data.series) {
        const seriesPosts = sortBySeriesOrder(
            allPosts.filter((entry) => entry.data.series === post.data.series)
        );
        const index = seriesPosts.findIndex((entry) => entry.id === post.id);

        return {
            prevPost: index > 0 ? seriesPosts[index - 1] : null,
            nextPost: index < seriesPosts.length - 1 ? seriesPosts[index + 1] : null,
            isSeriesNav: true,
        };
    }

    const chronPosts = sortByPubDate(allPosts);
    const index = chronPosts.findIndex((entry) => entry.id === post.id);

    return {
        prevPost: index > 0 ? chronPosts[index - 1] : null,
        nextPost: index < chronPosts.length - 1 ? chronPosts[index + 1] : null,
        isSeriesNav: false,
    };
}