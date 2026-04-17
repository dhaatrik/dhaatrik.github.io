import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

/**
 * Remark plugin that calculates reading time from the Markdown AST
 * and injects it into the frontmatter data via `data.astro.frontmatter`.
 */
export function remarkReadingTime() {
    return function (tree, { data }) {
        const textOnPage = toString(tree);
        const readingTime = getReadingTime(textOnPage);
        data.astro.frontmatter.readingTime = readingTime.text;
    };
}
