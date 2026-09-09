export const setupHomeHub = () => {
    // --- 0. Project Bento Cards click to open popover ---
    const projectCards = document.getElementsByClassName('bento-card-project');
    Array.from(projectCards).forEach((card) => {
        card.addEventListener('click', (e) => {
            // Ignore clicks on links/buttons inside the card
            if ((e.target as HTMLElement | null)?.closest('.github-link')) {
                return;
            }
            const popoverId = card.getAttribute('data-popover-target');
            if (popoverId) {
                const popover = document.getElementById(popoverId);
                if (popover) {
                    try {
                        (popover as any).showPopover();
                    } catch (err) {
                        console.error('Popover API not supported or failed:', err);
                    }
                }
            }
        });

        card.addEventListener('keydown', (e: Event) => {
            const keyEvent = e as KeyboardEvent;
            if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
                keyEvent.preventDefault();
                (card as HTMLElement).click();
            }
        });

        let lastActiveElement: HTMLElement | null = null;
        const popoverId = card.getAttribute('data-popover-target');
        if (popoverId) {
            const popover = document.getElementById(popoverId);
            if (popover) {
                popover.addEventListener('toggle', (e: any) => {
                    const isOpen = e.newState === 'open';
                    card.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
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
                });
            }
        }
    });

    // --- 1. Dynamic "Identity" Typewriter ---
    let typewriterTimeout: number | null = null;
    let nextDelay = 1200;
    let identities: string[] = [];
    let currentIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let currentText = '';

    function typeEffect() {
        const target = document.getElementById('identity-rotator');
        if (!target) return;

        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;
        if (prefersReducedMotion) {
            currentIdx = (currentIdx + 1) % identities.length;
            target.textContent = identities[currentIdx];
            typewriterTimeout = window.setTimeout(typeEffect, 3000);
            return;
        }

        const fullTxt = identities[currentIdx];
        if (isDeleting) {
            currentText = fullTxt.substring(0, charIdx - 1);
            charIdx--;
        } else {
            currentText = fullTxt.substring(0, charIdx + 1);
            charIdx++;
        }

        target.textContent = currentText;

        let delay = isDeleting ? 30 : 65;

        if (!isDeleting && charIdx === fullTxt.length) {
            delay = 2200; // hold at end
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            currentIdx = (currentIdx + 1) % identities.length;
            delay = 400; // pause before typing next
        }

        nextDelay = delay;
        if (!document.hidden) {
            typewriterTimeout = window.setTimeout(typeEffect, delay);
        } else {
            typewriterTimeout = null;
        }
    }

    const handleVisibilityChange = () => {
        const target = document.getElementById('identity-rotator');
        if (!document.hidden && !typewriterTimeout && target) {
            typewriterTimeout = window.setTimeout(typeEffect, nextDelay);
        } else if (document.hidden && typewriterTimeout) {
            clearTimeout(typewriterTimeout);
            typewriterTimeout = null;
        }
    };

    const startTypewriter = () => {
        const target = document.getElementById('identity-rotator');
        if (typewriterTimeout) {
            clearTimeout(typewriterTimeout);
            typewriterTimeout = null;
        }
        if (target) {
            identities = JSON.parse(target.dataset.identities || '[]');
            if (identities.length > 0) {
                const prefersReducedMotion = window.matchMedia(
                    '(prefers-reduced-motion: reduce)'
                ).matches;
                if (prefersReducedMotion) {
                    currentIdx = 0;
                    target.textContent = identities[0];
                    typewriterTimeout = window.setTimeout(typeEffect, 3000);
                    return;
                }
                currentIdx = 0;
                charIdx = identities[0].length;
                currentText = identities[0];
                target.textContent = currentText;
                isDeleting = true;
                typewriterTimeout = window.setTimeout(typeEffect, 1200);
            }
        }
    };

    const handlePageShow = (e: PageTransitionEvent) => {
        if (e.persisted) {
            startTypewriter();
        }
    };

    const target = document.getElementById('identity-rotator');
    if (target) {
        startTypewriter();
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pageshow', handlePageShow);
    }

    // --- 6. Scroll Telemetry Indicator Connection Setup ---
    const telemetry = document.querySelector('.scroll-telemetry-container') as HTMLElement | null;
    const telemetryText = document.getElementById('scroll-telemetry-text');
    let handleScroll: (() => void) | undefined;
    if (telemetry) {
        let scrollTicking = false;
        handleScroll = () => {
            if (!scrollTicking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const opacity = Math.max(0, 1 - scrollY / 130);
                    const translate = scrollY * 0.12;

                    telemetry.style.opacity = opacity.toString();
                    telemetry.style.transform = `translateY(${translate}px) scale(${0.95 + opacity * 0.05})`;

                    if (telemetryText) {
                        if (scrollY === 0) {
                            telemetryText.textContent = 'SCROLL TO INITIATE';
                        } else if (scrollY > 0 && scrollY < 120) {
                            const pct = Math.min(
                                100,
                                Math.round((scrollY / 120) * 100)
                            );
                            telemetryText.textContent = `LINKING TELEMETRY // ${pct}%`;
                        } else {
                            telemetryText.textContent = 'TELEMETRY ONLINE // 100%';
                        }
                    }

                    if (opacity === 0) {
                        telemetry.style.visibility = 'hidden';
                    } else {
                        telemetry.style.visibility = 'visible';
                    }
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // --- 8. Programmatic Accessibility Focus Routing ---
    if (document.activeElement === document.body || !document.activeElement) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            if (!mainContent.hasAttribute('tabindex')) {
                mainContent.setAttribute('tabindex', '-1');
            }
            mainContent.focus({ preventScroll: true });
        }
    }

    // --- 8.5. Bind View Transition Names to Homepage Blog Cards ---
    const homeBlogCards = document.querySelectorAll(
        'a.bento-card[href*="/transmissions/"]'
    );
    homeBlogCards.forEach((card) => {
        card.addEventListener('click', () => {
            const titleEl = card.querySelector('h3');
            if (titleEl) {
                titleEl.style.setProperty('view-transition-name', 'active-post-title');
            }
        });
    });

    // --- 9. Cleanup Event Listeners on Page Transition ---
    document.addEventListener(
        'astro:before-preparation',
        () => {
            if (typewriterTimeout) clearTimeout(typewriterTimeout);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pageshow', handlePageShow);
            if (handleScroll) window.removeEventListener('scroll', handleScroll);
        },
        { once: true }
    );
};

document.addEventListener('astro:page-load', setupHomeHub);
