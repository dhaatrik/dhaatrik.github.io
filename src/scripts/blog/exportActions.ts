export function setupExportActions(signal: AbortSignal) {
    // Export Button Toggle
    const exportBtn = document.getElementById('export-btn');
    const exportOptions = document.getElementById('export-options');
    if (exportBtn && exportOptions) {
        exportBtn.addEventListener(
            'click',
            () => {
                const isHidden = exportOptions.classList.contains('hidden');
                if (isHidden) {
                    exportOptions.classList.remove('hidden');
                    exportOptions.classList.add('flex');
                    exportBtn.setAttribute('aria-expanded', 'true');
                } else {
                    exportOptions.classList.add('hidden');
                    exportOptions.classList.remove('flex');
                    exportBtn.setAttribute('aria-expanded', 'false');
                }
            },
            { signal }
        );
    }

    // Export to JSON-LD Metadata Action
    const exportJsonBtn = document.getElementById('export-json-btn');
    if (exportJsonBtn) {
        exportJsonBtn.addEventListener(
            'click',
            () => {
                // Extract metadata from document state
                const url = new URL(window.location.href);
                const titleEl = document.querySelector('h1');
                const descriptionEl = document.querySelector('meta[name="description"]');

                const metadata = {
                    '@context': 'https://schema.org',
                    '@type': 'BlogPosting',
                    headline: titleEl?.innerText || 'Transmission Log',
                    description: descriptionEl?.getAttribute('content') || '',
                    datePublished: new Date().toISOString(),
                    author: {
                        '@type': 'Person',
                        name: 'Dhaatrik',
                    },
                    url: url.href,
                };

                const blob = new Blob([JSON.stringify(metadata, null, 4)], {
                    type: 'application/json',
                });
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = `transmission-metadata-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(blobUrl);

                const textSpan = exportJsonBtn.querySelector('span');
                if (textSpan) {
                    const originalText = textSpan.innerText;
                    textSpan.innerText = '~ $ export_completed';
                    textSpan.classList.add('text-(--accent)');
                    setTimeout(() => {
                        textSpan.innerText = originalText;
                        textSpan.classList.remove('text-(--accent)');
                    }, 2000);
                }
            },
            { signal }
        );
    }

    const copyLinkBtn = document.getElementById('copy-link-btn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener(
            'click',
            async () => {
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    const textSpan = copyLinkBtn.querySelector('span');
                    if (textSpan) {
                        const originalText = textSpan.innerText;
                        textSpan.innerText = '~ $ copied_to_clipboard';
                        textSpan.classList.add('text-(--accent)');
                        setTimeout(() => {
                            textSpan.innerText = originalText;
                            textSpan.classList.remove('text-(--accent)');
                        }, 2000);
                    }
                } catch (err) {
                    console.error('Failed to copy', err);
                }
            },
            { signal }
        );
    }

    const exportOfflineBtn = document.getElementById('export-offline-btn');
    if (exportOfflineBtn) {
        exportOfflineBtn.addEventListener(
            'click',
            () => {
                const postTitle = document.querySelector('h1')?.innerText || 'Transmission Log';
                const postDesc =
                    document.querySelector('meta[name="description"]')?.getAttribute('content') ||
                    '';

                // Extract content from `#rendered-content-container`
                const renderedContent =
                    document.getElementById('rendered-content-container')?.innerHTML || '';

                // Build full offline HTML package with escaped brackets to prevent Astro build failures
                const offlineHtml = `\x3c!doctype html\x3e
\x3chtml lang="en"\x3e
    \x3chead\x3e
        \x3cmeta charset="utf-8"\x3e
        \x3cmeta name="viewport" content="width=device-width, initial-scale=1.0"\x3e
        \x3ctitle\x3e${postTitle} - Offline Transmission\x3c/title\x3e
        \x3cstyle\x3e
            :root {
                --bg-main: #f8fafc;
                --text-primary: #0f172a;
                --accent: #3b82f6;
                --border-color: #e2e8f0;
                --bg-card: #f1f5f9;
            }
            @media (prefers-color-scheme: dark) {
                :root {
                    --bg-main: #0b0e14;
                    --text-primary: #f3f4f6;
                    --accent: #60a5fa;
                    --border-color: #1e293b;
                    --bg-card: #151a22;
                }
            }
            body {
                background-color: var(--bg-main);
                color: var(--text-primary);
                font-family: system-ui, -apple-system, sans-serif;
                max-width: 800px;
                margin: 40px auto;
                padding: 0 20px;
                line-height: 1.7;
            }
            .header-block {
                border: 1px solid var(--border-color);
                background: var(--bg-card);
                padding: 24px;
                border-radius: 8px;
                margin-bottom: 40px;
                font-family: monospace;
                font-size: 13px;
            }
            .header-block h1 {
                font-size: 32px;
                font-family: inherit;
                margin-top: 0;
                margin-bottom: 12px;
                color: var(--accent);
                line-height: 1.2;
            }
            .meta-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 16px;
            }
            .meta-label {
                color: #64748b;
                font-size: 11px;
                margin-bottom: 4px;
            }
            .meta-val {
                font-weight: bold;
            }
            .prose h1, .prose h2, .prose h3, .prose h4 {
                color: var(--accent);
                margin-top: 32px;
                margin-bottom: 16px;
            }
            .prose pre {
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                padding: 16px;
                border-radius: 8px;
                overflow-x: auto;
                font-size: 14px;
            }
            .prose code {
                font-family: monospace;
                font-size: 0.9em;
                background: var(--bg-card);
                padding: 2px 6px;
                border-radius: 4px;
            }
            .prose pre code {
                padding: 0;
                background: transparent;
            }
            .prose a {
                color: var(--accent);
                text-decoration: none;
            }
            .prose a:hover {
                text-decoration: underline;
            }
            .footer {
                margin-top: 60px;
                border-top: 1px solid var(--border-color);
                padding: 20px 0;
                text-align: center;
                font-family: monospace;
                font-size: 12px;
                color: #64748b;
            }
        \x3c/style\x3e
    \x3c/head\x3e
    \x3cbody\x3e
        \x3cdiv class="header-block"\x3e
            \x3ch1\x3e${postTitle}\x3c/h1\x3e
            \x3cp style="margin: 0 0 16px 0; color: #64748b;"\x3e${postDesc}\x3c/p\x3e
            \x3cdiv class="meta-grid"\x3e
                \x3cdiv\x3e
                    \x3cdiv class="meta-label"\x3eSOURCE\x3c/div\x3e
                    \x3cdiv class="meta-val"\x3eVELLOR TRANSMISSION LOG\x3c/div\x3e
                \x3c/div\x3e
                \x3cdiv\x3e
                    \x3cdiv class="meta-label"\x3eEXPORT_TIME\x3c/div\x3e
                    \x3cdiv class="meta-val"\x3e${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC\x3c/div\x3e
                \x3c/div\x3e
                \x3cdiv\x3e
                    \x3cdiv class="meta-label"\x3eINTEGRITY\x3c/div\x3e
                    \x3cdiv class="meta-val"\x3eAIR-GAPPED ARCHIVE\x3c/div\x3e
                \x3c/div\x3e
            \x3c/div\x3e
        \x3c/div\x3e
        \x3cdiv class="prose"\x3e
            ${renderedContent}
        \x3c/div\x3e
        \x3cdiv class="footer"\x3e
            [ OFFLINE ARCHIVE GENERATED SUCCESSFULLY // DATA SOVEREIGN ]
        \x3c/div\x3e
    \x3c/body\x3e
\x3c/html\x3e`;

                const blob = new Blob([offlineHtml], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `transmission-archive-${postTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
                a.click();
                URL.revokeObjectURL(url);

                const textSpan = exportOfflineBtn.querySelector('span');
                if (textSpan) {
                    const originalText = textSpan.innerText;
                    textSpan.innerText = '~ $ export_archived';
                    textSpan.classList.add('text-(--accent)');
                    setTimeout(() => {
                        textSpan.innerText = originalText;
                        textSpan.classList.remove('text-(--accent)');
                    }, 2000);
                }
            },
            { signal }
        );
    }
}
