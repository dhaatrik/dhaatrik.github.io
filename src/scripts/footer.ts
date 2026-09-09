let footerAbortController: AbortController | null = null;

export const setupFooter = () => {
    // Clean up any existing state
    if (footerAbortController) {
        footerAbortController.abort();
    }

    footerAbortController = new AbortController();
    const { signal } = footerAbortController;

    // Load Popover polyfill dynamically if missing
    (async () => {
        if (!HTMLElement.prototype.hasOwnProperty('popover')) {
            try {
                // @ts-ignore
                await import('https://unpkg.com/@oddbird/popover-polyfill@latest');
            } catch (err) {
                console.warn('Popover polyfill deferred or offline:', err);
            }
        }
    })();

    // 1. Calculate relative time for recent transmissions (automatically updates)
    const updateRelativeTimes = () => {
        const indicators = document.getElementsByClassName('relative-time-indicator');
        const now = new Date().getTime();

        Array.from(indicators).forEach((el) => {
            const timestampStr = el.getAttribute('data-timestamp');
            if (!timestampStr) return;
            const date = new Date(timestampStr).getTime();
            const diffMs = now - date;

            let relativeText = '';
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            const diffMonths = Math.floor(diffMs / 2592000000);
            const diffYears = Math.floor(diffMs / 31536000000);

            if (diffMins < 1) {
                relativeText = 'just now';
            } else if (diffMins < 60) {
                relativeText = `${diffMins}m ago`;
            } else if (diffHours < 24) {
                relativeText = `${diffHours}h ago`;
            } else if (diffDays < 30) {
                relativeText = `${diffDays}d ago`;
            } else if (diffMonths < 12) {
                relativeText = `${diffMonths}mo ago`;
            } else {
                relativeText = `${diffYears}y ago`;
            }

            el.textContent = `// ${relativeText}`;
        });
    };
    updateRelativeTimes();

    // 2. Sequential Cyber Scramble Text Deceleration Sequence
    const cyberIcons = document.getElementsByClassName('cyber-icon');
    const hexChars = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
    ];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    Array.from(cyberIcons).forEach((icon) => {
        const container = icon.querySelector('.icon-container');
        if (!container || prefersReducedMotion) return;

        const originalHTML = container.innerHTML;
        let scrambleInterval: number | undefined;

        icon.addEventListener(
            'mouseenter',
            () => {
                if (scrambleInterval) {
                    clearInterval(scrambleInterval);
                }
                const platform = icon.getAttribute('data-icon') || '';
                const target = {
                    x: ['5', '8'],
                    github: ['4', '7'],
                    linkedin: ['4', 'C'],
                }[platform] || ['F', 'F'];

                let step = 0;

                scrambleInterval = window.setInterval(() => {
                    if (step === 0 || step === 1) {
                        const char1 = hexChars[Math.floor(Math.random() * hexChars.length)];
                        const char2 = hexChars[Math.floor(Math.random() * hexChars.length)];
                        container.innerHTML = `<span class="font-mono text-[10px] font-bold text-(--accent) opacity-80">0x${char1}${char2}</span>`;
                    } else if (step === 2) {
                        const char2 = hexChars[Math.floor(Math.random() * hexChars.length)];
                        container.innerHTML = `<span class="font-mono text-[10px] font-bold text-(--accent) opacity-80">0x${target[0]}${char2}</span>`;
                    } else if (step === 3) {
                        container.innerHTML = `<span class="font-mono text-[10px] font-bold text-(--accent) opacity-80">0x${target[0]}${target[1]}</span>`;
                    } else {
                        clearInterval(scrambleInterval);
                        scrambleInterval = undefined;
                        container.innerHTML = originalHTML;
                    }
                    step++;
                }, 60);
            },
            { signal }
        );

        icon.addEventListener(
            'mouseleave',
            () => {
                if (scrambleInterval) {
                    clearInterval(scrambleInterval);
                    scrambleInterval = undefined;
                }
                container.innerHTML = originalHTML;
            },
            { signal }
        );
    });

    // Bind dynamic aria-expanded state and focus management to popover toggles
    const popovers = ['books-popover'];
    let lastActiveElement: HTMLElement | null = null;
    popovers.forEach((id) => {
        const popover = document.getElementById(id);
        if (popover) {
            popover.addEventListener(
                'toggle',
                (e: any) => {
                    const isOpen = e.newState === 'open';
                    const triggers = document.querySelectorAll(
                        `[aria-controls="${id}"], [popovertarget="${id}"]`
                    );
                    triggers.forEach((trigger) => {
                        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                    });

                    if (isOpen) {
                        lastActiveElement = document.activeElement as HTMLElement | null;
                        const closeBtn = popover.querySelector(
                            'button[aria-label], button[popovertarget]'
                        ) as HTMLElement | null;
                        if (closeBtn) {
                            requestAnimationFrame(() => {
                                closeBtn.focus();
                            });
                        }
                    } else {
                        if (lastActiveElement) {
                            lastActiveElement.focus();
                            lastActiveElement = null;
                        }
                    }
                },
                { signal }
            );
        }
    });

    // 3. Telemetry loop (Uptime and fluctuating CPU load)
    const uptimeEl = document.getElementById('footer-uptime');
    const startTime = Date.now();

    const formatUptime = (ms: number) => {
        const totalSecs = Math.floor(ms / 1000);
        const hrs = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        return `${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
    };

    const updateTelemetry = () => {
        if (uptimeEl) {
            const elapsed = Date.now() - startTime;
            uptimeEl.textContent = `SYS.SESSION // ${formatUptime(elapsed)}`;
        }
    };

    // Run immediately to avoid a 1s delay
    updateTelemetry();

    const telemetryInterval = window.setInterval(updateTelemetry, 1000);

    // 4. Return to Orbit button
    const returnBtn = document.getElementById('return-to-orbit-btn');
    if (returnBtn) {
        returnBtn.addEventListener(
            'click',
            () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            { signal }
        );
    }

    signal.addEventListener('abort', () => {
        clearInterval(telemetryInterval);
    });
};

document.addEventListener('astro:page-load', setupFooter);

document.addEventListener('astro:before-preparation', () => {
    if (footerAbortController) {
        footerAbortController.abort();
        footerAbortController = null;
    }
});
