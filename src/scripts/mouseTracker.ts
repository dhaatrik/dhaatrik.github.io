// Global mouse spotlight, flashlight background tracking, and 3D Bento Card Parallax Tilt
// Gated behind media query to run ONLY on devices with hover capabilities (non-touch/desktop)

let spotlightRafId: number | null = null;
let mouseX = 0;
let mouseY = 0;
let cardsCollection: HTMLCollectionOf<Element> | null = null;
let flashlightBg: HTMLElement | null = null;
let magneticTargets: HTMLElement[] = [];

// Cache layout rects to prevent layout thrashing on mousemove
let cachedCardsData: {
    card: HTMLElement;
    rect: { left: number; top: number; width: number; height: number };
}[] = [];

let cachedMagnetData: {
    el: HTMLElement;
    rect: { left: number; top: number; width: number; height: number };
}[] = [];

let layoutUpdateTimeout: ReturnType<typeof setTimeout> | null = null;

const cacheLayouts = () => {
    cachedCardsData = [];
    if (cardsCollection) {
        for (let i = 0; i < cardsCollection.length; i++) {
            const card = cardsCollection[i] as HTMLElement;
            const rect = card.getBoundingClientRect();
            cachedCardsData.push({
                card,
                rect: {
                    left: rect.left + window.scrollX,
                    top: rect.top + window.scrollY,
                    width: rect.width,
                    height: rect.height,
                },
            });
        }
    }

    cachedMagnetData = [];
    for (let i = 0; i < magneticTargets.length; i++) {
        const el = magneticTargets[i];
        const rect = el.getBoundingClientRect();
        cachedMagnetData.push({
            el,
            rect: {
                left: rect.left + window.scrollX,
                top: rect.top + window.scrollY,
                width: rect.width,
                height: rect.height,
            },
        });
    }
};

const updateSpotlights = () => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    cachedCardsData.forEach(({ card, rect }) => {
        const currentRectLeft = rect.left - scrollX;
        const currentRectTop = rect.top - scrollY;

        const x = mouseX - currentRectLeft;
        const y = mouseY - currentRectTop;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });

    if (flashlightBg) {
        flashlightBg.style.setProperty('--bg-mouse-x', `${mouseX}px`);
        flashlightBg.style.setProperty('--bg-mouse-y', `${mouseY}px`);
    }

    cachedMagnetData.forEach(({ el, rect }) => {
        const currentRectLeft = rect.left - scrollX;
        const currentRectTop = rect.top - scrollY;

        const centerX = currentRectLeft + rect.width / 2;
        const centerY = currentRectTop + rect.height / 2;
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const distance = Math.hypot(dx, dy);

        const threshold = 80;

        if (distance < threshold) {
            const ratio = 1 - distance / threshold;
            const pullX = dx * 0.35 * ratio;
            const pullY = dy * 0.35 * ratio;
            const scale = 1 + ratio * 0.06;

            el.style.transition = 'none';
            el.style.transform = `translate(${pullX}px, ${pullY}px) scale(${scale})`;
            el.setAttribute('data-magnetic-active', 'true');
        } else if (el.getAttribute('data-magnetic-active') === 'true') {
            el.style.transform = 'translate(0px, 0px) scale(1)';
            if (el.classList.contains('transition-spring')) {
                const supportsLinear =
                    window.CSS && CSS.supports('animation-timing-function', 'linear(0, 1)');
                if (supportsLinear) {
                    el.style.transition =
                        'transform 0.8s var(--ease-spring-bounce), box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease';
                } else {
                    el.style.transition =
                        'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease';
                }
            } else {
                el.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            }
            el.setAttribute('data-magnetic-active', 'false');
        }
    });

    spotlightRafId = null;
};

const onMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!spotlightRafId) {
        spotlightRafId = requestAnimationFrame(updateSpotlights);
    }
};

const handleScrollOrResize = () => {
    if (layoutUpdateTimeout) clearTimeout(layoutUpdateTimeout);
    layoutUpdateTimeout = setTimeout(() => {
        cacheLayouts();
        if (!spotlightRafId) {
            spotlightRafId = requestAnimationFrame(updateSpotlights);
        }
    }, 150);
};

const initMouseTracker = () => {
    flashlightBg = document.getElementById('flashlight-bg');
    if (!flashlightBg) {
        flashlightBg = document.createElement('div');
        flashlightBg.id = 'flashlight-bg';
        document.body.prepend(flashlightBg);
    }

    cardsCollection = document.getElementsByClassName('bento-card');
    magneticTargets = Array.from(document.querySelectorAll('.magnetic-target')) as HTMLElement[];

    cacheLayouts();

    document.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('scroll', handleScrollOrResize);
    window.removeEventListener('resize', handleScrollOrResize);

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
};

const handlePageShow = (e: PageTransitionEvent) => {
    if (e.persisted) {
        initMouseTracker();
    }
};

// Check media query to only bind mouse listeners on capable devices
const runMouseTracker = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    initMouseTracker();
    window.addEventListener('pageshow', handlePageShow);

    // Bind 3D Bento Card Parallax Tilt
    const cards = document.getElementsByClassName('bento-card');
    Array.from(cards).forEach((cardEl) => {
        const card = cardEl as HTMLElement;
        let cardRafId: number | null = null;
        let cardMouseX = 0;
        let cardMouseY = 0;
        let cachedRect: { left: number; top: number; width: number; height: number } | null = null;

        const tilts = card.querySelectorAll('[data-tilt-z]');

        const updateCardTilt = () => {
            if (!cachedRect) return;

            const x = cardMouseX - cachedRect.left;
            const y = cardMouseY - cachedRect.top;

            const xc = cachedRect.width / 2;
            const yc = cachedRect.height / 2;

            const tiltX = (yc - y) / 30;
            const tiltY = (x - xc) / 30;

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            cardRafId = null;
        };

        const handleCardEnter = () => {
            const rect = card.getBoundingClientRect();
            cachedRect = {
                left: rect.left + window.scrollX,
                top: rect.top + window.scrollY,
                width: rect.width,
                height: rect.height,
            };

            tilts.forEach((targetEl) => {
                const target = targetEl as HTMLElement;
                target.style.transform = 'translateZ(10px)';
            });
        };

        const handleCardMove = (e: MouseEvent) => {
            cardMouseX = e.pageX;
            cardMouseY = e.pageY;
            if (!cardRafId && cachedRect) {
                cardRafId = requestAnimationFrame(updateCardTilt);
            }
        };

        const handleCardLeave = () => {
            if (cardRafId) {
                cancelAnimationFrame(cardRafId);
                cardRafId = null;
            }
            card.style.transform =
                'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            tilts.forEach((targetEl) => {
                const target = targetEl as HTMLElement;
                target.style.transform = 'translateZ(0px)';
            });
            cachedRect = null;
        };

        card.addEventListener('mouseenter', handleCardEnter);
        card.addEventListener('mousemove', handleCardMove);
        card.addEventListener('mouseleave', handleCardLeave);
    });
};

const destroyMouseTracker = () => {
    document.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('pageshow', handlePageShow);
    window.removeEventListener('scroll', handleScrollOrResize);
    window.removeEventListener('resize', handleScrollOrResize);
    if (layoutUpdateTimeout) {
        clearTimeout(layoutUpdateTimeout);
        layoutUpdateTimeout = null;
    }
    if (spotlightRafId) {
        cancelAnimationFrame(spotlightRafId);
        spotlightRafId = null;
    }
    cardsCollection = null;
    flashlightBg = null;
    magneticTargets = [];
};

document.addEventListener('astro:page-load', runMouseTracker);
document.addEventListener('astro:before-preparation', destroyMouseTracker);
