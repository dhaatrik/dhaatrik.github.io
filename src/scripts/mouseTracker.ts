// Global mouse spotlight, flashlight background tracking, magnetic targets, and 3D Bento Card Parallax Tilt
// Gated behind media query to run ONLY on devices with hover capabilities (non-touch/desktop)

let mouseX = -1000;
let mouseY = -1000;
let flashlightBg: HTMLElement | null = null;
let flashlightRafId: number | null = null;
let magneticTargets: HTMLElement[] = [];
let magneticRafId: number | null = null;

// Cache magnetic button rects to prevent layout thrashing
let cachedMagnetData: {
    el: HTMLElement;
    rect: { left: number; top: number; width: number; height: number };
}[] = [];

let layoutUpdateTimeout: ReturnType<typeof setTimeout> | null = null;

const cacheMagnetLayouts = () => {
    cachedMagnetData = [];
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    for (let i = 0; i < magneticTargets.length; i++) {
        const el = magneticTargets[i];
        const rect = el.getBoundingClientRect();
        cachedMagnetData.push({
            el,
            rect: {
                left: rect.left + scrollX,
                top: rect.top + scrollY,
                width: rect.width,
                height: rect.height,
            },
        });
    }
};

const updateFlashlight = () => {
    if (flashlightBg) {
        flashlightBg.style.setProperty('--bg-mouse-x', `${mouseX}px`);
        flashlightBg.style.setProperty('--bg-mouse-y', `${mouseY}px`);
    }
    flashlightRafId = null;
};

const updateMagneticTargets = () => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    cachedMagnetData.forEach(({ el, rect }) => {
        const currentRectLeft = rect.left - scrollX;
        const currentRectTop = rect.top - scrollY;

        const centerX = currentRectLeft + rect.width / 2;
        const centerY = currentRectTop + rect.height / 2;
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const distance = Math.hypot(dx, dy);

        const threshold = 55;

        if (distance < threshold) {
            const ratio = 1 - distance / threshold;
            const pullX = dx * 0.16 * ratio;
            const pullY = dy * 0.16 * ratio;
            const scale = 1 + ratio * 0.02;

            el.style.transition = 'none';
            el.style.transform = `translate(${pullX}px, ${pullY}px) scale(${scale})`;
            el.setAttribute('data-magnetic-active', 'true');
        } else if (el.getAttribute('data-magnetic-active') === 'true') {
            el.style.transform = 'translate(0px, 0px) scale(1)';
            if (el.classList.contains('transition-spring')) {
                el.style.transition =
                    'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease';
            } else {
                el.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
            }
            el.setAttribute('data-magnetic-active', 'false');
        }
    });

    magneticRafId = null;
};

const onMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!flashlightRafId) {
        flashlightRafId = requestAnimationFrame(updateFlashlight);
    }

    if (!magneticRafId && cachedMagnetData.length > 0) {
        magneticRafId = requestAnimationFrame(updateMagneticTargets);
    }
};

const handleScrollOrResize = () => {
    if (layoutUpdateTimeout) clearTimeout(layoutUpdateTimeout);
    layoutUpdateTimeout = setTimeout(() => {
        cacheMagnetLayouts();
        if (!flashlightRafId) {
            flashlightRafId = requestAnimationFrame(updateFlashlight);
        }
    }, 150);
};

const initMouseTracker = () => {
    flashlightBg = document.getElementById('flashlight-bg');
    if (!flashlightBg) {
        flashlightBg = document.createElement('div');
        flashlightBg.id = 'flashlight-bg';
        flashlightBg.className = 'pointer-events-none fixed inset-0 z-0';
        document.body.prepend(flashlightBg);
    }

    magneticTargets = Array.from(
        document.getElementsByClassName('magnetic-target')
    ) as HTMLElement[];

    cacheMagnetLayouts();

    document.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('scroll', handleScrollOrResize);
    window.removeEventListener('resize', handleScrollOrResize);

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    // Bind Zero-Lag 3D Bento Card Parallax Tilt & Localized Card Spotlight
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

            const maxTilt = 4.5; // Maximum tilt angle in degrees
            const tiltX = ((yc - y) / yc) * maxTilt;
            const tiltY = ((x - xc) / xc) * maxTilt;

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            cardRafId = null;
        };

        const handleCardEnter = () => {
            // Remove transform transition while actively tracking to eliminate lag
            card.style.transition = 'none';

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
            // Restore smooth cubic-bezier transition for the exit return animation
            card.style.transition =
                'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease';
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
    if (flashlightRafId) {
        cancelAnimationFrame(flashlightRafId);
        flashlightRafId = null;
    }
    if (magneticRafId) {
        cancelAnimationFrame(magneticRafId);
        magneticRafId = null;
    }

    flashlightBg = null;
    magneticTargets = [];
    cachedMagnetData = [];
};

document.addEventListener('astro:page-load', runMouseTracker);
document.addEventListener('astro:before-preparation', destroyMouseTracker);
