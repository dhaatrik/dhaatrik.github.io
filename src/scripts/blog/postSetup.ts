import { glossary } from '../../data/glossary';
import { setupExportActions } from './exportActions';
import { setupFormulaInspector } from './formulaInspector';

let postAbortController: AbortController | null = null;

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

    // 2. Export Actions (JSON-LD, offline archive, link copy)
    setupExportActions(signal);

    // 3. TOC active link tracking (deterministic position-based scrollspy)
    const tocLinks = document.querySelectorAll('#toc a');
    const headingElements = Array.from(
        document.querySelectorAll('.prose h2, .prose h3, .prose h4')
    ) as HTMLElement[];

    const updateActiveToc = (currentSectionId: string) => {
        tocLinks.forEach((link) => {
            const htmlLink = link as HTMLElement;
            const indexSpan = htmlLink.querySelector('.toc-index');
            const indicatorSpan = htmlLink.querySelector('.toc-indicator');
            if (htmlLink.dataset.slug === currentSectionId) {
                htmlLink.classList.add(
                    '!text-(--accent)',
                    'font-semibold',
                    'bg-slate-200/50',
                    'dark:bg-white/10'
                );
                htmlLink.classList.remove('text-slate-600', 'dark:text-slate-400');
                if (indexSpan) {
                    indexSpan.classList.add('!text-(--accent)', 'opacity-100');
                    indexSpan.classList.remove(
                        'text-slate-500',
                        'dark:text-slate-400',
                        'opacity-80'
                    );
                }
                if (indicatorSpan) {
                    indicatorSpan.classList.add(
                        '!bg-(--accent)',
                        '!w-[3px]',
                        'shadow-[0_0_8px_var(--accent)]'
                    );
                }
            } else {
                htmlLink.classList.remove(
                    '!text-(--accent)',
                    'font-semibold',
                    'bg-slate-200/50',
                    'dark:bg-white/10'
                );
                htmlLink.classList.add('text-slate-600', 'dark:text-slate-400');
                if (indexSpan) {
                    indexSpan.classList.remove('!text-(--accent)', 'opacity-100');
                    indexSpan.classList.add('text-slate-500', 'dark:text-slate-400', 'opacity-80');
                }
                if (indicatorSpan) {
                    indicatorSpan.classList.remove(
                        '!bg-(--accent)',
                        '!w-[3px]',
                        'shadow-[0_0_8px_var(--accent)]'
                    );
                }
            }
        });
    };

    let activeSectionId = '';

    const evaluateActiveSection = () => {
        if (headingElements.length === 0) return;

        // If user is at or near the bottom of the page, activate the last heading
        const isNearBottom =
            window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
        if (isNearBottom) {
            const lastHeading = headingElements[headingElements.length - 1];
            if (lastHeading.id && lastHeading.id !== activeSectionId) {
                activeSectionId = lastHeading.id;
                updateActiveToc(activeSectionId);
            }
            return;
        }

        // Header offset threshold (220px or top quarter of viewport)
        const scrollThreshold = Math.max(220, Math.floor(window.innerHeight * 0.25));
        let currentActive = '';

        for (const heading of headingElements) {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= scrollThreshold) {
                currentActive = heading.id;
            } else {
                break;
            }
        }

        // If before the first heading but scrolled slightly
        if (!currentActive && headingElements.length > 0) {
            if (window.scrollY > 40) {
                currentActive = headingElements[0].id;
            }
        }

        if (currentActive !== activeSectionId) {
            activeSectionId = currentActive;
            updateActiveToc(activeSectionId);
        }
    };

    let tocTicking = false;
    const handleTocScroll = () => {
        if (!tocTicking) {
            window.requestAnimationFrame(() => {
                evaluateActiveSection();
                tocTicking = false;
            });
            tocTicking = true;
        }
    };

    window.addEventListener('scroll', handleTocScroll, { passive: true, signal });
    window.addEventListener('resize', handleTocScroll, { passive: true, signal });
    evaluateActiveSection();

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
                    toggleModeBtn.innerText = 'RAW MARKDOWN';
                    toggleModeBtn.setAttribute('aria-label', 'Switch to rendered mode');
                    toggleModeBtn.setAttribute('title', 'Switch to rendered mode');
                } else {
                    rawContainer.classList.add('hidden');
                    renderedContainer.classList.remove('hidden');
                    toggleModeBtn.innerText = 'RENDERED';
                    toggleModeBtn.setAttribute('aria-label', 'Switch to raw markdown mode');
                    toggleModeBtn.setAttribute('title', 'Switch to raw markdown mode');
                }
            },
            { signal }
        );
    }

    // 3.3 Interactive Formula Term Inspector
    setupFormulaInspector(signal);

    // 4. Code Block Hacker Polish
    const codeBlocks = document.getElementsByTagName('pre');
    Array.from(codeBlocks).forEach((pre) => {
        const existingWrapper = pre.parentElement?.classList.contains('code-wrapper-processed')
            ? pre.parentElement
            : null;

        const wrapper = existingWrapper ?? document.createElement('div');
        if (!existingWrapper) {
            wrapper.className =
                'code-wrapper-processed relative group rounded-xl overflow-hidden border border-slate-300 dark:border-slate-800 bg-[#0d1117] my-6 shadow-md dark:shadow-2xl transition-all';

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
                'flex items-center justify-between px-4 py-2.5 bg-slate-900/95 dark:bg-[#0f141f]/95 border-b border-slate-800 backdrop-blur select-none';
            header.innerHTML = `
                        <div class="flex gap-2 items-center">
                            <div class="w-2.5 h-2.5 rounded-full bg-[#ff5f56] opacity-80 shadow-xs"></div>
                            <div class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] opacity-80 shadow-xs"></div>
                            <div class="w-2.5 h-2.5 rounded-full bg-[#27c93f] opacity-80 shadow-xs"></div>
                            <div class="code-telemetry hidden ml-3 font-mono text-[9px] text-(--accent) tracking-widest bg-(--accent)/10 border border-(--accent)/20 px-2 py-0.5 rounded select-none"></div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div aria-hidden="true" class="font-mono text-[10px] tracking-widest text-slate-400 uppercase">${lang}</div>
                            <button class="copy-btn opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-(--accent) cursor-pointer" aria-label="Copy code" aria-live="polite">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                COPY
                            </button>
                        </div>
                    `;

            wrapper.appendChild(header);
            pre.classList.add('!m-0', '!border-0', '!rounded-none');
            wrapper.appendChild(pre);
        }

        const codeBlock = pre.querySelector('code');
        const header = wrapper.querySelector(':scope > div');

        if (codeBlock && !existingWrapper) {
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

            const telemetry = header?.querySelector('.code-telemetry');

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

        const copyBtn = header?.querySelector('.copy-btn');
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

                        const trigger = document.createElement('button');
                        trigger.type = 'button';
                        trigger.className =
                            'relative inline border-b border-dashed border-(--accent)/50 text-slate-800 dark:text-slate-200 cursor-help transition-colors hover:text-(--accent) hover:border-(--accent) bg-transparent p-0 font-inherit text-left';
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
}
