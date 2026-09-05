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

// --- Fluid Waveform / Water Caustics (Calm Liquid Ripple) Engine ---
let spacetimeCanvas: HTMLCanvasElement | null = null;
let spacetimeCtx: CanvasRenderingContext2D | null = null;
let spacetimeRafId: number | null = null;
let themeObserver: MutationObserver | null = null;

const SIM_DOWNSCALE = 6;
let simWidth = 0;
let simHeight = 0;
let simSize = 0;

let waveCurrent: Float32Array = new Float32Array(0);
let wavePrevious: Float32Array = new Float32Array(0);
let waveNext: Float32Array = new Float32Array(0);

interface WaterRipple {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    alpha: number;
    speed: number;
}
let activeRipples: WaterRipple[] = [];
let lastRippleTime = 0;

let offscreenCanvas: HTMLCanvasElement | null = null;
let offscreenCtx: CanvasRenderingContext2D | null = null;
let offscreenImgData: ImageData | null = null;

let canvasWidth = 0;
let canvasHeight = 0;
let isCanvasSleeping = false;
let idleFrames = 0;

const DAMPING = 0.982;

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
    activeRipples = [];

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

    const radius = 5;
    // Gentle, calm water impulse
    const impulse = Math.min(speed * 0.22 + 1.0, 6.5);

    for (let dy = -radius; dy <= radius; dy++) {
        const py = gy + dy;
        if (py <= 1 || py >= simHeight - 2) continue;
        const row = py * simWidth;
        for (let dx = -radius; dx <= radius; dx++) {
            const px = gx + dx;
            if (px <= 1 || px >= simWidth - 2) continue;
            const distSq = dx * dx + dy * dy;
            if (distSq <= radius * radius) {
                // Smooth Gaussian bell curve: prevents harsh spikes, creates pure circular water swell
                const falloff = Math.exp(-distSq / (radius * 1.6));
                waveCurrent[row + px] += impulse * falloff;
            }
        }
    }

    // Spawn expanding concentric water ripple wavefronts at calm intervals
    const now = performance.now();
    if (now - lastRippleTime > 130 && speed > 0.35) {
        lastRippleTime = now;
        activeRipples.push({
            x,
            y,
            radius: 8,
            maxRadius: Math.min(180, 80 + speed * 5),
            alpha: 0.42,
            speed: 1.6,
        });
    }
};

const renderFluidCanvas = () => {
    if (!spacetimeCanvas || !spacetimeCtx) return;

    const isDark = document.documentElement.classList.contains('dark');

    // Gradually decay cursor speed vector
    mouseSpeedX *= 0.85;
    mouseSpeedY *= 0.85;

    let totalWaveEnergy = 0;

    // 2D isotropic 9-point wave propagation step
    for (let y = 1; y < simHeight - 1; y++) {
        const row = y * simWidth;
        const rowAbove = (y - 1) * simWidth;
        const rowBelow = (y + 1) * simWidth;

        for (let x = 1; x < simWidth - 1; x++) {
            const idx = row + x;
            // 9-point Laplacian eliminates square artifacts and yields true circular water ripples
            const cardinal =
                waveCurrent[idx - 1] +
                waveCurrent[idx + 1] +
                waveCurrent[rowAbove + x] +
                waveCurrent[rowBelow + x];
            const diagonal =
                waveCurrent[rowAbove + x - 1] +
                waveCurrent[rowAbove + x + 1] +
                waveCurrent[rowBelow + x - 1] +
                waveCurrent[rowBelow + x + 1];

            let val = (cardinal * 0.5 + diagonal * 0.25) * 0.5 - wavePrevious[idx];

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

    // Render crystal-clear caustics into offscreen ImageData
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

                // Curvature focuses light into thin, razor-crisp caustic lines
                const laplacian =
                    waveCurrent[left] +
                    waveCurrent[right] +
                    waveCurrent[rowAbove + x] +
                    waveCurrent[rowBelow + x] -
                    4 * height;
                const slope = Math.sqrt(gx * gx + gy * gy);

                // Caustic score: focused primarily on wave crests and refraction ridges
                const causticScore = Math.max(0, -laplacian * 0.7 + slope * 0.4);

                if (causticScore > 0.08) {
                    // Non-linear power curve creates thin, crisp liquid ribbons without smoky haze
                    const norm = Math.min(1, (causticScore - 0.08) * 2.5);
                    const caustic = Math.pow(norm, 1.8);

                    if (isDark) {
                        // Crystal-clear aquatic caustics: translucent cerulean to brilliant aqua-cyan and sparkling white peak
                        const r = Math.round(28 + caustic * 227);
                        const g = Math.round(145 + caustic * 110);
                        const b = Math.round(238 + caustic * 17);
                        const alpha = Math.round(caustic * 195);

                        data[ptr] = r;
                        data[ptr + 1] = g;
                        data[ptr + 2] = b;
                        data[ptr + 3] = alpha;
                    } else {
                        // Light mode: clear water ripples casting deep azure caustics
                        const r = Math.round(15 + caustic * 22);
                        const g = Math.round(85 + caustic * 55);
                        const b = Math.round(195 + caustic * 60);
                        const alpha = Math.round(caustic * 160);

                        data[ptr] = r;
                        data[ptr + 1] = g;
                        data[ptr + 2] = b;
                        data[ptr + 3] = alpha;
                    }
                } else {
                    data[ptr + 3] = 0; // 100% transparent: crystal clear!
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

    // Render and update expanding concentric water ripples
    if (activeRipples.length > 0) {
        spacetimeCtx.save();
        spacetimeCtx.lineWidth = 1;

        for (let i = activeRipples.length - 1; i >= 0; i--) {
            const rip = activeRipples[i];
            rip.radius += rip.speed;
            rip.alpha *= 0.965;

            if (rip.alpha < 0.015 || rip.radius >= rip.maxRadius) {
                activeRipples.splice(i, 1);
                continue;
            }

            const progress = rip.radius / rip.maxRadius;
            const strokeAlpha = rip.alpha * (1 - progress);

            spacetimeCtx.strokeStyle = isDark
                ? `rgba(56, 189, 248, ${strokeAlpha.toFixed(3)})`
                : `rgba(2, 132, 199, ${(strokeAlpha * 0.85).toFixed(3)})`;

            spacetimeCtx.beginPath();
            const steps = 36;
            for (let s = 0; s <= steps; s++) {
                const theta = (s / steps) * Math.PI * 2;
                const sx = rip.x + Math.cos(theta) * rip.radius;
                const sy = rip.y + Math.sin(theta) * rip.radius;

                const gx = Math.max(
                    0,
                    Math.min(simWidth - 1, Math.round((sx / canvasWidth) * simWidth))
                );
                const gy = Math.max(
                    0,
                    Math.min(simHeight - 1, Math.round((sy / canvasHeight) * simHeight))
                );
                const waveDistort = waveCurrent[gy * simWidth + gx] || 0;

                const r = rip.radius + waveDistort * 1.5;
                const px = rip.x + Math.cos(theta) * r;
                const py = rip.y + Math.sin(theta) * r;

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
    if (
        totalWaveEnergy < 0.12 &&
        activeRipples.length === 0 &&
        Math.abs(mouseSpeedX) < 0.01 &&
        Math.abs(mouseSpeedY) < 0.01
    ) {
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
    activeRipples = [];
    magneticTargets = [];
    cachedMagnetData = [];
};

document.addEventListener('astro:page-load', runMouseTracker);
document.addEventListener('astro:before-preparation', destroyMouseTracker);
