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

// --- Fluid Waveform / Magnetic Flux Caustics (Liquid Ferrofluid) Engine ---
let spacetimeCanvas: HTMLCanvasElement | null = null;
let spacetimeCtx: CanvasRenderingContext2D | null = null;
let spacetimeRafId: number | null = null;
let themeObserver: MutationObserver | null = null;

const SIM_DOWNSCALE = 10;
let simWidth = 0;
let simHeight = 0;
let simSize = 0;

let waveCurrent: Float32Array = new Float32Array(0);
let wavePrevious: Float32Array = new Float32Array(0);
let waveNext: Float32Array = new Float32Array(0);

let offscreenCanvas: HTMLCanvasElement | null = null;
let offscreenCtx: CanvasRenderingContext2D | null = null;
let offscreenImgData: ImageData | null = null;

let canvasWidth = 0;
let canvasHeight = 0;
let isCanvasSleeping = false;
let idleFrames = 0;

const DAMPING = 0.974;

const resizeFluidCanvas = () => {
    if (!spacetimeCanvas || !spacetimeCtx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    spacetimeCanvas.width = Math.floor(canvasWidth * dpr);
    spacetimeCanvas.height = Math.floor(canvasHeight * dpr);
    spacetimeCanvas.style.width = `${canvasWidth}px`;
    spacetimeCanvas.style.height = `${canvasHeight}px`;
    spacetimeCtx.scale(dpr, dpr);

    simWidth = Math.max(32, Math.floor(canvasWidth / SIM_DOWNSCALE));
    simHeight = Math.max(24, Math.floor(canvasHeight / SIM_DOWNSCALE));
    simSize = simWidth * simHeight;

    waveCurrent = new Float32Array(simSize);
    wavePrevious = new Float32Array(simSize);
    waveNext = new Float32Array(simSize);

    offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = simWidth;
    offscreenCanvas.height = simHeight;
    offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: false });
    if (offscreenCtx) {
        offscreenImgData = offscreenCtx.createImageData(simWidth, simHeight);
    }

    wakeFluidCanvas();
};

const injectFluidEnergy = (x: number, y: number, speed: number) => {
    if (simWidth === 0 || simHeight === 0) return;

    const gx = Math.round((x / canvasWidth) * simWidth);
    const gy = Math.round((y / canvasHeight) * simHeight);

    const radius = 3;
    const impulse = Math.min(speed * 0.35 + 1.5, 12);

    for (let dy = -radius; dy <= radius; dy++) {
        const py = gy + dy;
        if (py <= 1 || py >= simHeight - 2) continue;
        const row = py * simWidth;
        for (let dx = -radius; dx <= radius; dx++) {
            const px = gx + dx;
            if (px <= 1 || px >= simWidth - 2) continue;
            const distSq = dx * dx + dy * dy;
            if (distSq <= radius * radius) {
                const falloff = 1 - Math.sqrt(distSq) / radius;
                waveCurrent[row + px] += impulse * falloff * falloff;
            }
        }
    }
};

const renderFluidCanvas = () => {
    if (!spacetimeCanvas || !spacetimeCtx) return;

    const isDark = document.documentElement.classList.contains('dark');

    // Gradually decay cursor speed vector
    mouseSpeedX *= 0.85;
    mouseSpeedY *= 0.85;

    let totalWaveEnergy = 0;

    // 2D wave propagation step
    for (let y = 1; y < simHeight - 1; y++) {
        const row = y * simWidth;
        const rowAbove = (y - 1) * simWidth;
        const rowBelow = (y + 1) * simWidth;

        for (let x = 1; x < simWidth - 1; x++) {
            const idx = row + x;
            let val =
                (waveCurrent[idx - 1] +
                    waveCurrent[idx + 1] +
                    waveCurrent[rowAbove + x] +
                    waveCurrent[rowBelow + x]) *
                    0.5 -
                wavePrevious[idx];

            val *= DAMPING;
            waveNext[idx] = val;
            totalWaveEnergy += Math.abs(val);
        }
    }

    // Pointer swap buffers
    const temp = wavePrevious;
    wavePrevious = waveCurrent;
    waveCurrent = waveNext;
    waveNext = temp;

    // Render caustics into offscreen ImageData
    if (offscreenImgData && offscreenCtx) {
        const data = offscreenImgData.data;
        let ptr = 0;

        for (let y = 0; y < simHeight; y++) {
            const row = y * simWidth;
            const rowAbove = (y > 0 ? y - 1 : 0) * simWidth;
            const rowBelow = (y < simHeight - 1 ? y + 1 : simHeight - 1) * simWidth;

            for (let x = 0; x < simWidth; x++) {
                const idx = row + x;
                const left = x > 0 ? idx - 1 : idx;
                const right = x < simWidth - 1 ? idx + 1 : idx;

                const gx = waveCurrent[right] - waveCurrent[left];
                const gy = waveCurrent[rowBelow + x] - waveCurrent[rowAbove + x];
                const height = waveCurrent[idx];

                const grad = Math.sqrt(gx * gx + gy * gy);
                const caustic = Math.min(1, grad * 0.42 + Math.max(0, height) * 0.1);

                if (caustic > 0.015) {
                    if (isDark) {
                        // Liquid ferrofluid caustics: sapphire into luminous cyan and bright crests
                        const t = Math.min(1, caustic * 1.5);
                        const r = Math.round(25 + t * 200);
                        const g = Math.round(110 + t * 115);
                        const b = Math.round(235 + t * 20);
                        const alpha = Math.round(Math.min(210, caustic * 240));

                        data[ptr] = r;
                        data[ptr + 1] = g;
                        data[ptr + 2] = b;
                        data[ptr + 3] = alpha;
                    } else {
                        // Light mode crystalline water caustics
                        const t = Math.min(1, caustic * 1.4);
                        const r = Math.round(20 + t * 20);
                        const g = Math.round(60 + t * 40);
                        const b = Math.round(140 + t * 90);
                        const alpha = Math.round(Math.min(160, caustic * 180));

                        data[ptr] = r;
                        data[ptr + 1] = g;
                        data[ptr + 2] = b;
                        data[ptr + 3] = alpha;
                    }
                } else {
                    data[ptr + 3] = 0;
                }
                ptr += 4;
            }
        }

        offscreenCtx.putImageData(offscreenImgData, 0, 0);
    }

    // Clear main canvas and draw hardware-upscaled bilinear caustics
    spacetimeCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (offscreenCanvas) {
        spacetimeCtx.imageSmoothingEnabled = true;
        spacetimeCtx.imageSmoothingQuality = 'high';
        spacetimeCtx.drawImage(offscreenCanvas, 0, 0, canvasWidth, canvasHeight);
    }

    // Draw magnetic flux caustic contour rings around cursor during motion
    if (
        mouseX >= 0 &&
        mouseY >= 0 &&
        (Math.abs(mouseSpeedX) > 0.1 || Math.abs(mouseSpeedY) > 0.1)
    ) {
        const rings = [28, 56, 84, 115];
        spacetimeCtx.save();
        spacetimeCtx.lineWidth = 1.2;

        for (let k = 0; k < rings.length; k++) {
            const baseRadius = rings[k];
            const ringAlpha = Math.max(0, (1 - baseRadius / 140) * 0.38);
            spacetimeCtx.strokeStyle = isDark
                ? `rgba(34, 211, 238, ${ringAlpha.toFixed(3)})`
                : `rgba(37, 99, 235, ${(ringAlpha * 0.8).toFixed(3)})`;

            spacetimeCtx.beginPath();
            const steps = 36;
            for (let s = 0; s <= steps; s++) {
                const theta = (s / steps) * Math.PI * 2;
                const sx = mouseX + Math.cos(theta) * baseRadius;
                const sy = mouseY + Math.sin(theta) * baseRadius;

                const gx = Math.max(
                    0,
                    Math.min(simWidth - 1, Math.round((sx / canvasWidth) * simWidth))
                );
                const gy = Math.max(
                    0,
                    Math.min(simHeight - 1, Math.round((sy / canvasHeight) * simHeight))
                );
                const waveDistort = waveCurrent[gy * simWidth + gx] || 0;

                const rad = baseRadius + waveDistort * 2.8;
                const px = mouseX + Math.cos(theta) * rad;
                const py = mouseY + Math.sin(theta) * rad;

                if (s === 0) {
                    spacetimeCtx.moveTo(px, py);
                } else {
                    spacetimeCtx.lineTo(px, py);
                }
            }
            spacetimeCtx.closePath();
            spacetimeCtx.stroke();
        }
        spacetimeCtx.restore();
    }

    // Auto-sleep system: conserve CPU/battery when fluid settles
    if (totalWaveEnergy < 0.15 && Math.abs(mouseSpeedX) < 0.01 && Math.abs(mouseSpeedY) < 0.01) {
        idleFrames++;
        if (idleFrames > 35) {
            isCanvasSleeping = true;
            spacetimeRafId = null;
            spacetimeCtx.clearRect(0, 0, canvasWidth, canvasHeight);
            return;
        }
    } else {
        idleFrames = 0;
    }

    spacetimeRafId = requestAnimationFrame(renderFluidCanvas);
};

const wakeFluidCanvas = () => {
    if (isCanvasSleeping || !spacetimeRafId) {
        isCanvasSleeping = false;
        idleFrames = 0;
        if (!spacetimeRafId) {
            spacetimeRafId = requestAnimationFrame(renderFluidCanvas);
        }
    }
};

const onMouseLeave = () => {
    mouseX = -1000;
    mouseY = -1000;
    mouseSpeedX = 0;
    mouseSpeedY = 0;
    wakeFluidCanvas();
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

    const speed = Math.hypot(mouseSpeedX, mouseSpeedY);
    wakeFluidCanvas();
    injectFluidEnergy(newX, newY, speed);

    if (!magneticRafId && cachedMagnetData.length > 0) {
        magneticRafId = requestAnimationFrame(updateMagneticTargets);
    }
};

const handleScrollOrResize = () => {
    if (layoutUpdateTimeout) clearTimeout(layoutUpdateTimeout);
    layoutUpdateTimeout = setTimeout(() => {
        cacheMagnetLayouts();
        resizeFluidCanvas();
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
    resizeFluidCanvas();

    if (!themeObserver) {
        themeObserver = new MutationObserver(() => {
            wakeFluidCanvas();
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
    offscreenCanvas = null;
    offscreenCtx = null;
    offscreenImgData = null;
    magneticTargets = [];
    cachedMagnetData = [];
};

document.addEventListener('astro:page-load', runMouseTracker);
document.addEventListener('astro:before-preparation', destroyMouseTracker);
