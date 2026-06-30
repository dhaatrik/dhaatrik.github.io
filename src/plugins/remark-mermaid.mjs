import { visit } from 'unist-util-visit';

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * Replace ```mermaid fences with <pre class="mermaid"> before Shiki runs,
 * so syntax highlighting does not swallow diagram source.
 */
export default function remarkMermaid() {
    return (tree) => {
        visit(tree, 'code', (node, index, parent) => {
            if (node.lang !== 'mermaid' || parent == null || index == null) return;
            parent.children[index] = {
                type: 'html',
                value: `<pre class="mermaid">${escapeHtml(node.value)}</pre>`,
            };
        });
    };
}