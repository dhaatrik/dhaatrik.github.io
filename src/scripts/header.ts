let headerAbortController: AbortController | null = null;
let headerScrollTicking = false;

export const setupHeader = () => {
    if (headerAbortController) {
        headerAbortController.abort();
    }
    headerAbortController = new AbortController();
    const { signal } = headerAbortController;

    let lastScroll = window.scrollY;
    const header = document.getElementById('main-header');
    const nav = document.getElementById('main-nav');
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    const backdrop = document.getElementById('mobile-nav-backdrop');

    if (!header || !nav) return;

    const hasScrollTimeline = CSS.supports(
        '(animation-timeline: scroll()) and (animation-range: 0% 100%)'
    );

    const updateHeader = () => {
        if (signal.aborted) return;
        const currentScroll = window.scrollY;

        // Shrink header and toggle glass canopy on scroll (JS fallback)
        if (!hasScrollTimeline) {
            if (currentScroll > 30) {
                nav.classList.remove('py-4');
                nav.classList.add('py-2');
                header.classList.add('is-scrolled');
            } else {
                nav.classList.add('py-4');
                nav.classList.remove('py-2');
                header.classList.remove('is-scrolled');
            }
        }

        // Hide on scroll down, show on scroll up - more deliberate threshold
        const isDrawerOpen = toggleBtn && toggleBtn.classList.contains('open');
        if (!isDrawerOpen) {
            if (currentScroll <= 0) {
                header.style.transform = 'translateY(0)';
            } else if (currentScroll > lastScroll && currentScroll > 150) {
                // Scrolling down past threshold
                header.style.transform = 'translateY(-100%)';
            } else if (
                currentScroll < lastScroll &&
                (lastScroll - currentScroll > 10 || currentScroll < 50)
            ) {
                // Scrolling up (with a small buffer to prevent jitter)
                header.style.transform = 'translateY(0)';
            }
        }

        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        headerScrollTicking = false;
    };

    const onScroll = () => {
        if (!headerScrollTicking) {
            window.requestAnimationFrame(updateHeader);
            headerScrollTicking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true, signal });
    updateHeader();

    // Hamburger Drawer Control
    if (toggleBtn && drawer && backdrop) {
        let startX = 0;
        let currentX = 0;
        let isSwiping = false;

        const getFocusableElements = () => {
            return drawer.querySelectorAll('a, button');
        };

        const handleFocusTrap = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;
            const focusables = getFocusableElements();
            if (focusables.length === 0) return;
            const first = focusables[0] as HTMLElement;
            const last = focusables[focusables.length - 1] as HTMLElement;

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        };

        const openMenu = () => {
            drawer.classList.remove('translate-x-full');
            drawer.classList.add('translate-x-0');
            drawer.classList.add('open');
            backdrop.classList.remove('opacity-0', 'pointer-events-none');
            backdrop.classList.add('opacity-100', 'pointer-events-auto');
            toggleBtn.classList.add('open');
            toggleBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';

            // Mark background inert for accessibility (Modern Web Guidance)
            const mainEl = document.querySelector('main');
            const footerEl = document.querySelector('footer');
            if (mainEl) mainEl.setAttribute('inert', '');
            if (footerEl) footerEl.setAttribute('inert', '');

            // Clear inline style overrides
            drawer.style.transform = '';
            backdrop.style.opacity = '';

            const focusables = getFocusableElements();
            if (focusables.length > 0) {
                (focusables[0] as HTMLElement).focus();
            }
            document.addEventListener('keydown', handleFocusTrap, { signal });
        };

        const closeMenu = () => {
            drawer.classList.remove('translate-x-0');
            drawer.classList.add('translate-x-full');
            drawer.classList.remove('open');
            backdrop.classList.remove('opacity-100', 'pointer-events-auto');
            backdrop.classList.add('opacity-0', 'pointer-events-none');
            toggleBtn.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';

            // Restore background interactivity
            const mainEl = document.querySelector('main');
            const footerEl = document.querySelector('footer');
            if (mainEl) mainEl.removeAttribute('inert');
            if (footerEl) footerEl.removeAttribute('inert');

            // Clear inline style overrides immediately so the transition runs smoothly
            drawer.style.transform = '';
            backdrop.style.opacity = '';

            document.removeEventListener('keydown', handleFocusTrap);
            toggleBtn.focus();
        };

        toggleBtn.addEventListener(
            'click',
            () => {
                const isOpen = toggleBtn.classList.contains('open');
                if (isOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }
            },
            { signal }
        );

        backdrop.addEventListener('click', closeMenu, { signal });

        // Swipe Right to Close Drawer Gestures
        let startTime = 0;
        drawer.addEventListener(
            'touchstart',
            (e) => {
                startX = e.touches[0].clientX;
                currentX = startX;
                startTime = Date.now();
                isSwiping = true;
                drawer.style.transition = 'none';
                backdrop.style.transition = 'none';
            },
            { passive: true, signal }
        );

        drawer.addEventListener(
            'touchmove',
            (e) => {
                if (!isSwiping) return;
                currentX = e.touches[0].clientX;
                const diffX = currentX - startX;
                if (diffX > 0) {
                    const width = drawer.offsetWidth;
                    const progress = Math.min(1, Math.max(0, diffX / width));
                    // Exponential friction curve for luxurious damping
                    const easedProgress = (1 - Math.exp(-3 * progress)) / (1 - Math.exp(-3));
                    const translateX = easedProgress * width;
                    drawer.style.transform = `translateX(${translateX}px)`;
                    backdrop.style.opacity = (1 - easedProgress).toString();
                }
            },
            { passive: true, signal }
        );

        drawer.addEventListener(
            'touchend',
            () => {
                if (!isSwiping) return;
                isSwiping = false;
                drawer.style.transition = '';
                backdrop.style.transition = '';
                const diffX = currentX - startX;
                const elapsed = Date.now() - startTime;
                const velocity = diffX / elapsed; // px per ms

                if (diffX > 75 || (velocity > 0.3 && diffX > 25)) {
                    closeMenu();
                } else {
                    drawer.style.transform = '';
                    backdrop.style.opacity = '';
                }
                startX = 0;
                currentX = 0;
            },
            { signal }
        );

        // ESC key to close drawer
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && toggleBtn.classList.contains('open')) {
                closeMenu();
            }
        };
        document.addEventListener('keydown', handleKeyDown, { signal });

        // Synchronize SPA path name in the telemetry log
        const updateTelemetryPath = () => {
            const telemetryPathEl = document.getElementById('mobile-telemetry-path');
            if (telemetryPathEl) {
                const pathname = window.location.pathname;
                const cleanPath = pathname.replace(/\/$/, '');
                telemetryPathEl.textContent =
                    cleanPath === '' ? '~/home' : `~/home${cleanPath}`;
            }
        };
        updateTelemetryPath();

        // Populate live SYS.LOAD and SYS.LATENCY from the Performance Navigation Timing API
        const updateDrawerTelemetry = () => {
            const coresEl = document.getElementById('drawer-sys-cores');
            const rttEl = document.getElementById('drawer-sys-rtt');

            if (coresEl) {
                const cores = navigator.hardwareConcurrency ?? null;
                coresEl.textContent = cores ? `${cores}` : '—';
            }

            if (rttEl) {
                try {
                    const entries = performance.getEntriesByType(
                        'navigation'
                    ) as PerformanceNavigationTiming[];
                    const navEntry = entries[0];
                    if (navEntry && navEntry.responseStart > 0) {
                        const latencyMs = Math.round(
                            navEntry.responseStart - navEntry.requestStart
                        );
                        const label =
                            latencyMs < 50 ? 'FAST' : latencyMs < 200 ? 'STABLE' : 'SLOW';
                        rttEl.textContent = `${latencyMs}ms // ${label}`;
                    } else {
                        rttEl.textContent = '—';
                    }
                } catch {
                    rttEl.textContent = '—';
                }
            }
        };
        updateDrawerTelemetry();
    }
};

// Global Direct Hotkeys (1 -> Home, 2 -> Personnel, 3 -> Projects, 4 -> Pedagogy, 5 -> Transmissions)
const navKeyRoutes: Record<string, string> = {
    '1': '/',
    '2': '/personnel',
    '3': '/projects',
    '4': '/pedagogy',
    '5': '/transmissions',
};

if (!(window as any).__hasGlobalNavHotkeys) {
    (window as any).__hasGlobalNavHotkeys = true;
    window.addEventListener('keydown', (e: KeyboardEvent) => {
        // Ignore if modifier keys are pressed (e.g. Cmd+1, Ctrl+1, Alt+1)
        if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;

        // Ignore when typing inside any interactive input element or open search dialog
        const activeEl = document.activeElement;
        const isTyping =
            activeEl instanceof HTMLInputElement ||
            activeEl instanceof HTMLTextAreaElement ||
            activeEl instanceof HTMLSelectElement ||
            activeEl?.getAttribute('contenteditable') === 'true' ||
            activeEl?.closest('search, [popover], dialog');

        if (isTyping) return;

        const targetPath = navKeyRoutes[e.key];
        if (targetPath) {
            const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
            const cleanTarget = targetPath.replace(/\/$/, '') || '/';
            if (currentPath === cleanTarget) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const targetLink =
                    document.querySelector<HTMLAnchorElement>(
                        `.desktop-nav-links a[data-nav-key="${e.key}"]`
                    ) ||
                    document.querySelector<HTMLAnchorElement>(
                        `#mobile-nav-drawer a[data-nav-key="${e.key}"]`
                    );
                if (targetLink) {
                    e.preventDefault();
                    targetLink.click();
                }
            }
        }
    });
}

document.addEventListener('astro:page-load', setupHeader);

document.addEventListener('astro:before-preparation', () => {
    // Ensure menu is closed when initiating transition to prevent overflow lock
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    if (toggleBtn && toggleBtn.classList.contains('open')) {
        drawer?.classList.add('translate-x-full');
        drawer?.classList.remove('translate-x-0');
        drawer?.classList.remove('open');
        backdrop?.classList.add('opacity-0', 'pointer-events-none');
        backdrop?.classList.remove('opacity-100', 'pointer-events-auto');
        toggleBtn.classList.remove('open');
        document.body.style.overflow = '';
        document.querySelector('main')?.removeAttribute('inert');
        document.querySelector('footer')?.removeAttribute('inert');
    }

    if (headerAbortController) {
        headerAbortController.abort();
        headerAbortController = null;
    }
});
