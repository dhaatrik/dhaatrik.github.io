let reticleRafId: number | null = null;
let mouseX = 0;
let mouseY = 0;
let parallaxAbortController: AbortController | null = null;

const updateReticleParallax = () => {
    const reticle = document.getElementById('reticle-bg');
    if (!reticle) {
        reticleRafId = null;
        return;
    }

    const x = (mouseX - window.innerWidth / 2) / (window.innerWidth / 2);
    const y = (mouseY - window.innerHeight / 2) / (window.innerHeight / 2);

    const moveX = x * 8; // max 8px
    const moveY = y * 8; // max 8px
    const rotate = x * 5; // max 5deg

    reticle.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${rotate}deg)`;
    reticleRafId = null;
};

const handleReticleParallax = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!reticleRafId) {
        reticleRafId = window.requestAnimationFrame(updateReticleParallax);
    }
};

export const initReticleParallax = () => {
    cleanupReticleParallax();

    const reticle = document.getElementById('reticle-bg');
    if (!reticle || document.getElementById('workbench-schematic')) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    parallaxAbortController = new AbortController();
    window.addEventListener('mousemove', handleReticleParallax, {
        signal: parallaxAbortController.signal,
    });
};

export const cleanupReticleParallax = () => {
    if (parallaxAbortController) {
        parallaxAbortController.abort();
        parallaxAbortController = null;
    }
    if (reticleRafId) {
        window.cancelAnimationFrame(reticleRafId);
        reticleRafId = null;
    }
};

document.addEventListener('astro:page-load', initReticleParallax);
document.addEventListener('astro:before-preparation', cleanupReticleParallax);
