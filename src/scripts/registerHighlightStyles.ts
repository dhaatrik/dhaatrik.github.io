// CSS Custom Highlight API pseudo-element styles.
// Injected at runtime because Lightning CSS (Tailwind v4) does not yet parse
// ::highlight() during build — keeping these in global.css triggers build warnings.

const STYLE_ID = 'custom-highlight-styles';

const HIGHLIGHT_CSS = `
::highlight(code-focus) {
    background-color: rgba(59, 130, 246, 0.2);
}
::highlight(search-match) {
    background-color: rgba(var(--neon-glow-1-rgb), 0.25);
}
`;

export function registerHighlightStyles(): void {
    if (typeof CSS === 'undefined' || !(CSS as { highlights?: unknown }).highlights) {
        return;
    }
    if (document.getElementById(STYLE_ID)) {
        return;
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = HIGHLIGHT_CSS;
    document.head.appendChild(style);
}