// Global Gravitational Spacetime Warp Canvas, Magnetic Buttons, and Zero-Lag 3D Card Tilt
// Gated behind media query to run ONLY on devices with hover capabilities (non-touch/desktop)

let mouseX = -1000;
let mouseY = -1000;
let mouseSpeedX = 0;
let mouseSpeedY = 0;
let magneticRafId: number | null = null;
let magneticTargets: HTMLElement[] = [];

// Cache magnetic button rects to prevent layout thrashing
let cachedMagnetData: {
    el: HTMLElement;
    rect: { left: number; top: number; width: number; height: number };
}[] = [];

let layoutUpdateTimeout: ReturnType<typeof setTimeout> | null = null;

// --- Spacetime Canvas Living Dot Matrix Engine ---
let spacetimeCanvas: HTMLCanvasElement | null = null;
let spacetimeCtx: CanvasRenderingContext2D | null = null;
let spacetimeRafId: number | null = null;
let themeObserver: MutationObserver | null = null;

const CELL_SIZE = 32;
let gridCols = 0;
let gridRows = 0;
let gridNodeCount = 0;

let baseX: Float32Array = new Float32Array(0);
let baseY: Float32Array = new Float32Array(0);
let currX: Float32Array = new Float32Array(0);
let currY: Float32Array = new Float32Array(0);
let vx: Float32Array = new Float32Array(0);
let vy: Float32Array = new Float32Array(0);

let canvasWidth = 0;
let canvasHeight = 0;
let isCanvasSleeping = false;
let idleFrames = 0;

const R_INFLUENCE = 180;
const R_INFLUENCE_SQ = R_INFLUENCE * R_INFLUENCE;
const SPRING_K = 0.075;
const DAMPING = 0.86;

const resizeSpacetimeGrid = () => {
    if (!spacetimeCanvas || !spacetimeCtx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    spacetimeCanvas.width = Math.floor(canvasWidth * dpr);
    spacetimeCanvas.height = Math.floor(canvasHeight * dpr);
    spacetimeCanvas.style.width = `${canvasWidth}px`;
    spacetimeCanvas.style.height = `${canvasHeight}px`;
    spacetimeCtx.scale(dpr, dpr);

    gridCols = Math.ceil(canvasWidth / CELL_SIZE) + 2;
    gridRows = Math.ceil(canvasHeight / CELL_SIZE) + 2;
    gridNodeCount = gridCols * gridRows;

    baseX = new Float32Array(gridNodeCount);
    baseY = new Float32Array(gridNodeCount);
    currX = new Float32Array(gridNodeCount);
    currY = new Float32Array(gridNodeCount);
    vx = new Float32Array(gridNodeCount);
    vy = new Float32Array(gridNodeCount);

    for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
            const idx = r * gridCols + c;
            const x = c * CELL_SIZE;
            const y = r * CELL_SIZE;
            baseX[idx] = x;
            baseY[idx] = y;
            currX[idx] = x;
            currY[idx] = y;
            vx[idx] = 0;
            vy[idx] = 0;
        }
    }

    wakeSpacetimeGrid();
};

const renderSpacetimeGrid = () => {
    if (!spacetimeCanvas || !spacetimeCtx) return;

    spacetimeCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    const isDark = document.documentElement.classList.contains('dark');

    // Gradually decay velocity impulse
    mouseSpeedX *= 0.85;
    mouseSpeedY *= 0.85;

    let totalMovement = 0;

    // Physics step: Gravitational well + Hooke's Law spring restoring forces
    for (let i = 0; i < gridNodeCount; i++) {
        const dx = currX[i] - mouseX;
        const dy = currY[i] - mouseY;
        const distSq = dx * dx + dy * dy;

        if (distSq < R_INFLUENCE_SQ) {
            const dist = Math.sqrt(distSq);
            const norm = 1 - dist / R_INFLUENCE;
            // Gravitational pull toward cursor: quadratic falloff
            const pull = norm * norm * 24;
            const dirX = dist > 0.001 ? dx / dist : 0;
            const dirY = dist > 0.001 ? dy / dist : 0;

            // Kinetic wake impulse along cursor velocity vector
            const wake = norm * 0.28;
            vx[i] += mouseSpeedX * wake - dirX * pull * 0.12;
            vy[i] += mouseSpeedY * wake - dirY * pull * 0.12;
        }

        // Hooke's Law restoring force toward rest coordinate
        const springX = (baseX[i] - currX[i]) * SPRING_K;
        const springY = (baseY[i] - currY[i]) * SPRING_K;

        vx[i] = (vx[i] + springX) * DAMPING;
        vy[i] = (vy[i] + springY) * DAMPING;

        currX[i] += vx[i];
        currY[i] += vy[i];

        totalMovement += Math.abs(vx[i]) + Math.abs(vy[i]);
    }

    // Pass 1: Batch render all ambient (undisturbed) dots across the page
    spacetimeCtx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.12)';
    spacetimeCtx.beginPath();
    for (let i = 0; i < gridNodeCount; i++) {
        const dx = currX[i] - mouseX;
        const dy = currY[i] - mouseY;
        const distSq = dx * dx + dy * dy;
        const dispX = currX[i] - baseX[i];
        const dispY = currY[i] - baseY[i];
        const dispSq = dispX * dispX + dispY * dispY;

        if (distSq >= R_INFLUENCE_SQ && dispSq < 0.2) {
            spacetimeCtx.moveTo(currX[i] + 1, currY[i]);
            spacetimeCtx.arc(currX[i], currY[i], 1, 0, Math.PI * 2);
        }
    }
    spacetimeCtx.fill();

    // Pass 2: Render active, gravitationally warped and lensed dots
    for (let i = 0; i < gridNodeCount; i++) {
        const dx = currX[i] - mouseX;
        const dy = currY[i] - mouseY;
        const distSq = dx * dx + dy * dy;
        const dispX = currX[i] - baseX[i];
        const dispY = currY[i] - baseY[i];
        const dispSq = dispX * dispX + dispY * dispY;

        if (distSq < R_INFLUENCE_SQ || dispSq >= 0.2) {
            let t = 0;
            if (distSq < R_INFLUENCE_SQ) {
                t = 1 - Math.sqrt(distSq) / R_INFLUENCE;
            } else {
                t = Math.min(1, Math.sqrt(dispSq) / 10);
            }

            // Radius scales dynamically with gravitational proximity & kinetic displacement
            const radius = 1 + t * 1.5;
            spacetimeCtx.beginPath();
            spacetimeCtx.arc(currX[i], currY[i], radius, 0, Math.PI * 2);

            if (isDark) {
                // Dynamic bloom: ambient white (0.12) up to radiant cyan-white (0.85)
                const alpha = Math.min(0.9, 0.12 + t * 0.75);
                spacetimeCtx.fillStyle = `rgba(220, 248, 255, ${alpha.toFixed(3)})`;
            } else {
                // Dynamic bloom in light mode: ambient slate (0.12) up to vibrant indigo (0.75)
                const alpha = Math.min(0.85, 0.12 + t * 0.65);
                spacetimeCtx.fillStyle = `rgba(37, 99, 235, ${alpha.toFixed(3)})`;
            }
            spacetimeCtx.fill();

            // Radiant celestial core for high proximity in dark mode
            if (isDark && t > 0.65) {
                spacetimeCtx.beginPath();
                spacetimeCtx.arc(currX[i], currY[i], radius * 0.5, 0, Math.PI * 2);
                spacetimeCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                spacetimeCtx.fill();
            }
        }
    }

    // Auto-sleep system: conserve CPU/battery when the grid has settled and mouse is still
    if (totalMovement < 0.04 && Math.abs(mouseSpeedX) < 0.01 && Math.abs(mouseSpeedY) < 0.01) {
        idleFrames++;
        if (idleFrames > 30) {
            isCanvasSleeping = true;
            spacetimeRafId = null;
            return;
        }
    } else {
        idleFrames = 0;
    }

    spacetimeRafId = requestAnimationFrame(renderSpacetimeGrid);
};

const wakeSpacetimeGrid = () => {
    if (isCanvasSleeping || !spacetimeRafId) {
        isCanvasSleeping = false;
        idleFrames = 0;
        if (!spacetimeRafId) {
            spacetimeRafId = requestAnimationFrame(renderSpacetimeGrid);
        }
    }
};

const onMouseLeave = () => {
    mouseX = -1000;
    mouseY = -1000;
    mouseSpeedX = 0;
    mouseSpeedY = 0;
    wakeSpacetimeGrid();
};

// --- Magnetic Targets Engine ---
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
    const newX = e.clientX;
    const newY = e.clientY;
    mouseSpeedX = newX - mouseX;
    mouseSpeedY = newY - mouseY;
    mouseX = newX;
    mouseY = newY;

    wakeSpacetimeGrid();

    if (!magneticRafId && cachedMagnetData.length > 0) {
        magneticRafId = requestAnimationFrame(updateMagneticTargets);
    }
};

const handleScrollOrResize = () => {
    if (layoutUpdateTimeout) clearTimeout(layoutUpdateTimeout);
    layoutUpdateTimeout = setTimeout(() => {
        cacheMagnetLayouts();
        resizeSpacetimeGrid();
    }, 150);
};

const initMouseTracker = () => {
    // Ensure Spacetime Canvas exists
    spacetimeCanvas = document.getElementById('spacetime-grid') as HTMLCanvasElement | null;
    if (!spacetimeCanvas) {
        spacetimeCanvas = document.createElement('canvas');
        spacetimeCanvas.id = 'spacetime-grid';
        spacetimeCanvas.className = 'pointer-events-none fixed inset-0 z-0 h-full w-full';
        spacetimeCanvas.setAttribute('aria-hidden', 'true');
        document.body.prepend(spacetimeCanvas);
    }
    spacetimeCtx = spacetimeCanvas.getContext('2d', { alpha: true });

    magneticTargets = Array.from(
        document.getElementsByClassName('magnetic-target')
    ) as HTMLElement[];

    cacheMagnetLayouts();
    resizeSpacetimeGrid();

    if (!themeObserver) {
        themeObserver = new MutationObserver(() => {
            wakeSpacetimeGrid();
        });
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });
    }

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseleave', onMouseLeave);
    window.removeEventListener('scroll', handleScrollOrResize);
    window.removeEventListener('resize', handleScrollOrResize);

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    // Bind Zero-Lag 3D Bento Card Parallax Tilt
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

            const maxTilt = 4.5;
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
    document.removeEventListener('mouseleave', onMouseLeave);
    window.removeEventListener('pageshow', handlePageShow);
    window.removeEventListener('scroll', handleScrollOrResize);
    window.removeEventListener('resize', handleScrollOrResize);

    if (themeObserver) {
        themeObserver.disconnect();
        themeObserver = null;
    }

    if (layoutUpdateTimeout) {
        clearTimeout(layoutUpdateTimeout);
        layoutUpdateTimeout = null;
    }
    if (magneticRafId) {
        cancelAnimationFrame(magneticRafId);
        magneticRafId = null;
    }
    if (spacetimeRafId) {
        cancelAnimationFrame(spacetimeRafId);
        spacetimeRafId = null;
    }

    spacetimeCanvas = null;
    spacetimeCtx = null;
    magneticTargets = [];
    cachedMagnetData = [];
};

document.addEventListener('astro:page-load', runMouseTracker);
document.addEventListener('astro:before-preparation', destroyMouseTracker);
