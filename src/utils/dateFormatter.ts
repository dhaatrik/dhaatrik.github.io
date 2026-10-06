/**
 * Reusable Intl.DateTimeFormat instance for consistent date rendering.
 */
export const dateFormatter = new Intl.DateTimeFormat('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
});
