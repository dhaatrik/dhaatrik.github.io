import { visit } from 'unist-util-visit';

/**
 * Rehype plugin to make markdown tables keyboard-accessible and WCAG compliant
 * by wrapping them in a focusable region with ARIA landmarks.
 */
export default function rehypeAccessibleTable() {
    return (tree) => {
        visit(tree, 'element', (node, index, parent) => {
            if (node.tagName === 'table' && parent && parent.tagName !== 'div') {
                if (!node.properties) node.properties = {};
                node.properties.tabIndex = 0;
                node.properties.role = 'region';
                node.properties['aria-label'] =
                    node.properties['aria-label'] || 'Scrollable data table';

                const wrapper = {
                    type: 'element',
                    tagName: 'div',
                    properties: {
                        className: ['table-container'],
                        tabIndex: 0,
                        role: 'region',
                        'aria-label': 'Scrollable data table',
                    },
                    children: [node],
                };
                parent.children[index] = wrapper;
            }
        });
    };
}
