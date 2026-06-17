import { glossary } from '../../data/glossary';

let postAbortController: AbortController | null = null;
let tocObserver: IntersectionObserver | null = null;

export async function setupPost() {
    if (postAbortController) {
        postAbortController.abort();
    }
    postAbortController = new AbortController();
    const { signal } = postAbortController;

    // Load polyfills if necessary asynchronously without blocking main initialization
    (async () => {
        try {
            if (!HTMLElement.prototype.hasOwnProperty('popover')) {
                // @ts-ignore
                await import('https://unpkg.com/@oddbird/popover-polyfill@latest');
            }
            if (!HTMLButtonElement.prototype.hasOwnProperty('interestForElement')) {
                // @ts-ignore
                await import('https://unpkg.com/interestfor@latest');
            }
            if (!('anchorName' in document.documentElement.style)) {
                // @ts-ignore
                await import('https://unpkg.com/@oddbird/css-anchor-positioning');
            }
        } catch (err) {
            console.warn('Polyfill loading deferred or offline:', err);
        }
    })();

    // 1. Reading Progress Bar (Fallback logic for unsupported browsers)
    const progressBar = document.getElementById('progress-bar');
    const hasScrollTimeline = CSS.supports(
        '(animation-timeline: scroll()) and (animation-range: 0% 100%)'
    );
    const updateProgress = () => {
        if (hasScrollTimeline || !progressBar) return;
        const scrollTotal =
            document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (scrollTotal > 0) {
            const progress = (window.scrollY / scrollTotal) * 100;
            progressBar.style.transform = `scaleX(${progress / 100})`;
        }
    };

    // 2. Export Button Toggle
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

    // 2.1 Export to JSON-LD Metadata Action
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

    // 3. TOC active link tracking (using high-performance IntersectionObserver)
    const tocLinks = document.querySelectorAll('#toc a');
    const sections = document.querySelectorAll('.prose h2, .prose h3, .prose h4');

    const updateActiveToc = (currentSectionId: string) => {
        tocLinks.forEach((link) => {
            const htmlLink = link as HTMLElement;
            if (htmlLink.dataset.slug === currentSectionId) {
                htmlLink.classList.add('!text-(--accent)', '!border-(--accent)', 'font-medium');
                htmlLink.classList.remove(
                    'text-slate-600',
                    'dark:text-slate-400',
                    'border-transparent'
                );
            } else {
                htmlLink.classList.remove('!text-(--accent)', '!border-(--accent)', 'font-medium');
                htmlLink.classList.add(
                    'text-slate-600',
                    'dark:text-slate-400',
                    'border-transparent'
                );
            }
        });
    };

    let activeSectionId = '';
    const visibleSections = new Set<string>();

    const observerOptions = {
        root: null,
        rootMargin: '-130px 0px -60% 0px',
        threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                visibleSections.add(entry.target.id);
            } else {
                visibleSections.delete(entry.target.id);
            }
        });

        let currentActive = '';

        for (const sec of sections) {
            if (visibleSections.has(sec.id)) {
                currentActive = sec.id;
                break;
            }
        }

        // Fallback for short pages: if we have scrolled down but no heading has crossed the threshold
        if (!currentActive && sections.length > 0 && window.scrollY > 10) {
            currentActive = sections[0].id;
        }

        if (currentActive !== activeSectionId) {
            activeSectionId = currentActive;
            updateActiveToc(activeSectionId);
        }
    };

    tocObserver = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((sec) => tocObserver?.observe(sec));

    // Maintain a single fallback scroll listener for the reading progress bar (only if CSS timelines are unsupported)
    if (!hasScrollTimeline && progressBar) {
        let scrollTicking = false;
        const handleScroll = () => {
            if (!scrollTicking) {
                window.requestAnimationFrame(() => {
                    updateProgress();
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true, signal });
        updateProgress();
    }

    // 3.1 RAW / RENDERED Mode Toggle Action
    const toggleModeBtn = document.getElementById('toggle-mode-btn');
    const renderedContainer = document.getElementById('rendered-content-container');
    const rawContainer = document.getElementById('raw-markdown-container');
    if (toggleModeBtn && renderedContainer && rawContainer) {
        toggleModeBtn.addEventListener(
            'click',
            () => {
                const isRaw = rawContainer.classList.contains('hidden');
                if (isRaw) {
                    rawContainer.classList.remove('hidden');
                    renderedContainer.classList.add('hidden');
                    toggleModeBtn.innerText = '[ RAW ]';
                    toggleModeBtn.setAttribute('aria-label', 'Switch to rendered mode');
                    toggleModeBtn.setAttribute('title', 'Switch to rendered mode');
                } else {
                    rawContainer.classList.add('hidden');
                    renderedContainer.classList.remove('hidden');
                    toggleModeBtn.innerText = '[ RENDERED ]';
                    toggleModeBtn.setAttribute('aria-label', 'Switch to raw markdown mode');
                    toggleModeBtn.setAttribute('title', 'Switch to raw markdown mode');
                }
            },
            { signal }
        );
    }

    // 3.3 Interactive Formula Term Inspector
    const mathBlocks = document.querySelectorAll('.katex-display, .katex');
    mathBlocks.forEach((block) => {
        if (block.classList.contains('inspector-processed')) return;
        block.classList.add('inspector-processed');

        const annotation = block.querySelector('annotation[encoding="application/x-tex"]');
        const latex =
            (annotation ? annotation.textContent?.trim() : block.textContent?.trim()) || '';

        const formulas: Record<string, string> = {
            '\\Delta v = v_e \\ln \\frac{m_0}{m_f}':
                'Δv: Velocity Delta // ve: Exhaust Velocity // m0: Initial Mass // mf: Final Mass',
            '\\Delta v = v_e \\ln \\frac{m_{0}}{m_{f}}':
                'Δv: Velocity Delta // ve: Exhaust Velocity // m0: Initial Mass // mf: Final Mass',
            'F = G \\frac{m_1 m_2}{r^2}':
                'F: Gravitational Force // G: Gravitational Constant // m1, m2: Masses // r: Distance',
            'F = G \\frac{m_{1} m_{2}}{r^{2}}':
                'F: Gravitational Force // G: Gravitational Constant // m1, m2: Masses // r: Distance',
            'E = m c^2': 'E: Energy // m: Mass // c: Speed of Light',
            'PV = nRT':
                'P: Pressure // V: Volume // n: Gas Amount // R: Gas Constant // T: Temperature',
        };

        let definition = '';
        for (const [key, value] of Object.entries(formulas)) {
            const normKey = key.replace(/\s+/g, '');
            const normLatex = latex.replace(/\s+/g, '');
            if (normLatex.includes(normKey) || normKey.includes(normLatex)) {
                definition = value;
                break;
            }
        }

        if (!definition) {
            if (latex.includes('\\Delta v') || latex.includes('v_e')) {
                definition =
                    'Δv: Velocity Delta // ve: Exhaust Velocity // m0: Initial Mass // mf: Final Mass';
            } else if (latex.includes('F =') && latex.includes('G')) {
                definition =
                    'F: Gravitational Force // G: Gravitational Constant // m1, m2: Masses // r: Distance';
            } else {
                definition = 'Formula Parameters: Dynamic breakdown not loaded';
            }
        }

        const htmlBlock = block as HTMLElement;
        htmlBlock.style.cursor = 'pointer';
        htmlBlock.title = 'Click to inspect formula parameters';

        htmlBlock.addEventListener('click', (e) => {
            e.stopPropagation();

            const existing = document.getElementById('math-inspector-tooltip');
            if (existing) {
                existing.remove();
                if (existing.dataset.anchorId === htmlBlock.id) {
                    return;
                }
            }

            if (!htmlBlock.id) {
                htmlBlock.id = `math-block-${Math.random().toString(36).substring(2, 9)}`;
            }

            const tooltip = document.createElement('div');
            tooltip.id = 'math-inspector-tooltip';
            tooltip.dataset.anchorId = htmlBlock.id;
            tooltip.className =
                'absolute z-50 p-2.5 bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[10px] rounded shadow-xl tracking-wider';
            tooltip.innerHTML = `[ <span class="text-(--accent)">INSPECTING</span> ] &rarr; ${definition}`;

            document.body.appendChild(tooltip);

            const rect = htmlBlock.getBoundingClientRect();
            tooltip.style.left = `${window.scrollX + rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${window.scrollY + rect.bottom + 6}px`;

            const tooltipRect = tooltip.getBoundingClientRect();
            if (tooltipRect.left < 10) {
                tooltip.style.left = '10px';
            } else if (tooltipRect.right > window.innerWidth - 10) {
                tooltip.style.left = `${window.innerWidth - tooltipRect.width - 10}px`;
            }

            const dismissTooltip = () => {
                tooltip.remove();
                document.removeEventListener('click', dismissTooltip);
            };
            setTimeout(() => {
                document.addEventListener('click', dismissTooltip);
            }, 10);
        });
    });

    // 4. Code Block Hacker Polish
    const codeBlocks = document.getElementsByTagName('pre');
    Array.from(codeBlocks).forEach((pre) => {
        if (pre.parentElement?.classList.contains('code-wrapper-processed')) return;

        const wrapper = document.createElement('div');
        wrapper.className =
            'code-wrapper-processed relative group rounded-lg overflow-hidden border border-slate-700 bg-[#0d1117] my-6 shadow-xl';

        pre.parentNode?.insertBefore(wrapper, pre);

        const codeBlock = pre.querySelector('code');
        let lang = 'CODE';
        if (pre.className.includes('language-')) {
            const match = pre.className.match(/language-(\w+)/);
            if (match) lang = match[1].toUpperCase();
        } else if (codeBlock?.className.includes('language-')) {
            const match = codeBlock.className.match(/language-(\w+)/);
            if (match) lang = match[1].toUpperCase();
        }

        const header = document.createElement('div');
        header.className =
            'flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700 backdrop-blur';
        header.innerHTML = `
                        <div class="flex gap-2 items-center">
                            <div class="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                            <div class="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                            <div class="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                            <div class="code-telemetry hidden ml-3 font-mono text-[9px] text-(--accent) tracking-widest bg-(--accent)/10 border border-(--accent)/20 px-2 py-0.5 rounded select-none"></div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div aria-hidden="true" class="font-mono text-[10px] tracking-widest text-slate-400">${lang}</div>
                            <button class="copy-btn opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-(--accent) cursor-pointer" aria-label="Copy code" aria-live="polite">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                COPY
                            </button>
                        </div>
                    `;

        wrapper.appendChild(header);
        pre.classList.add('!m-0', '!border-0', '!rounded-none');
        wrapper.appendChild(pre);

        if (codeBlock) {
            // Fallback line-wrapper for code blocks that do not use Shiki line wrapping natively
            if (codeBlock.getElementsByClassName('line').length === 0) {
                const rawHtml = codeBlock.innerHTML;
                const linesText = rawHtml.split('\n');
                if (linesText.length > 1 && linesText[linesText.length - 1].trim() === '') {
                    linesText.pop();
                }
                codeBlock.innerHTML = linesText
                    .map((line) => `<span class="line">${line}</span>`)
                    .join('\n');
            }

            const telemetry = header.querySelector('.code-telemetry');

            codeBlock.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const line = target.closest('.line');
                if (!line) return;

                const allLines = codeBlock.getElementsByClassName('line');
                const isFocused = line.classList.contains('focused-line');

                // Reset focus on all lines in this block
                Array.from(allLines).forEach((l) => l.classList.remove('focused-line'));
                if (typeof CSS !== 'undefined' && (CSS as any).highlights) {
                    (CSS as any).highlights.delete('code-focus');
                }

                if (isFocused) {
                    wrapper.classList.remove('focus-active');
                    telemetry?.classList.add('hidden');
                } else {
                    wrapper.classList.add('focus-active');
                    line.classList.add('focused-line');

                    if (
                        typeof CSS !== 'undefined' &&
                        (CSS as any).highlights &&
                        typeof (window as any).Highlight !== 'undefined'
                    ) {
                        try {
                            const range = new Range();
                            range.selectNodeContents(line);
                            const highlight = new (window as any).Highlight(range);
                            (CSS as any).highlights.set('code-focus', highlight);
                        } catch (err) {
                            console.error('Highlight API failed:', err);
                        }
                    }

                    const lineIndex = Array.from(allLines).indexOf(line) + 1;

                    // Scan backwards to find the nearest preceding function signature
                    let funcName = 'GLOBAL';
                    for (let j = lineIndex - 1; j >= 0; j--) {
                        const lineText = allLines[j].textContent || '';
                        // Match standard function declaration signatures across multiple languages
                        const match =
                            lineText.match(
                                /(?:function|def|fn|func|const|let|var)\s+([a-zA-Z0-9_]+)/
                            ) ||
                            lineText.match(/([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/) ||
                            lineText.match(/([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{/);
                        if (match) {
                            funcName = match[1];
                            break;
                        }
                    }

                    if (telemetry) {
                        telemetry.textContent = `LNC: ${lineIndex} // FUNC: ${funcName}`;
                        telemetry.classList.remove('hidden');
                    }
                }
            });
        }

        const copyBtn = header.querySelector('.copy-btn');
        copyBtn?.addEventListener(
            'click',
            async () => {
                try {
                    await navigator.clipboard.writeText(pre.innerText);
                    copyBtn.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                OK
                            `;
                    copyBtn.classList.add('!text-green-400');
                    setTimeout(() => {
                        copyBtn.innerHTML = `
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                    COPY
                                    `;
                        copyBtn.classList.remove('!text-green-400');
                    }, 2000);
                } catch (e) {}
            },
            { signal }
        );
    });

    // 5. Global Glossary Popovers (wrapped in requestIdleCallback to safeguard main-thread responsiveness)
    const initializeGlossary = () => {
        if (signal.aborted) return;

        const proseContainer = document.querySelector('.prose');
        if (!proseContainer) return;

        const textNodes: Text[] = [];
        const walk = document.createTreeWalker(proseContainer, NodeFilter.SHOW_TEXT, null);
        let node;
        while ((node = walk.nextNode())) {
            const parent = node.parentElement;
            if (
                parent &&
                !['PRE', 'CODE', 'A', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(
                    parent.tagName
                )
            ) {
                textNodes.push(node as Text);
            }
        }

        const terms = Object.keys(glossary);
        const popoversContainer = document.getElementById('glossary-popovers-container');
        if (terms.length > 0 && textNodes.length > 0) {
            const regex = new RegExp(
                `\\b(${terms.map((t) => t.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
                'gi'
            );

            let matchCount = 0;
            textNodes.forEach((textNode) => {
                if (signal.aborted) return;

                const content = textNode.nodeValue;
                if (!content) return;

                if (regex.test(content)) {
                    regex.lastIndex = 0;
                    const fragment = document.createDocumentFragment();
                    let lastIndex = 0;
                    let match;

                    while ((match = regex.exec(content)) !== null) {
                        if (match.index > lastIndex) {
                            fragment.appendChild(
                                document.createTextNode(content.substring(lastIndex, match.index))
                            );
                        }

                        const term = match[0];
                        const termLower = term.toLowerCase();
                        const definition = glossary[termLower];
                        matchCount++;

                        const tooltipId = `tooltip-glossary-${termLower}-${matchCount}`;
                        const anchorName = `--tooltip-glossary-${termLower}-${matchCount}`;

                        const trigger = document.createElement('a');
                        trigger.href = 'javascript:void(0)';
                        trigger.className =
                            'relative inline-block border-b border-dashed border-(--accent)/50 text-slate-800 dark:text-slate-200 cursor-help transition-colors hover:text-(--accent) hover:border-(--accent)';
                        trigger.setAttribute('interestfor', tooltipId);
                        trigger.style.setProperty('anchor-name', anchorName);
                        trigger.textContent = term;

                        const popover = document.createElement('div');
                        popover.setAttribute('popover', 'hint');
                        popover.id = tooltipId;
                        popover.className =
                            'glossary-popover p-3 rounded-lg text-xs font-sans font-normal text-slate-700 dark:text-slate-300 text-left normal-case leading-relaxed w-64 max-w-xs z-50 transition-all pointer-events-none premium-glass';
                        popover.style.setProperty('position-anchor', anchorName);
                        popover.style.setProperty('top', 'anchor(bottom)');
                        popover.style.setProperty('left', 'anchor(center)');
                        popover.style.setProperty('margin', 'unset');
                        popover.style.setProperty('transform', 'translateX(-50%)');
                        popover.style.setProperty('position-try', 'flip-block');
                        popover.textContent = definition;

                        if (popoversContainer) {
                            popoversContainer.appendChild(popover);
                        } else {
                            trigger.appendChild(popover);
                        }
                        fragment.appendChild(trigger);

                        lastIndex = match.index + term.length;
                    }

                    if (lastIndex < content.length) {
                        fragment.appendChild(document.createTextNode(content.substring(lastIndex)));
                    }

                    textNode.parentNode?.replaceChild(fragment, textNode);
                }
            });
        }
    };

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => initializeGlossary());
    } else {
        setTimeout(initializeGlossary, 50);
    }
}

// Cleanup event listeners when navigating away
export function cleanupPost() {
    if (postAbortController) {
        postAbortController.abort();
        postAbortController = null;
    }
    if (tocObserver) {
        tocObserver.disconnect();
        tocObserver = null;
    }
}
