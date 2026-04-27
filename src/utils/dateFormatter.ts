/**
 * ⚡ Bolt: Cache the Intl.DateTimeFormat instance to avoid costly re-initializations
 * during Astro's Static Site Generation (SSG) process for components rendered in loops.
 */
export const dateFormatter = new Intl.DateTimeFormat('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
});
