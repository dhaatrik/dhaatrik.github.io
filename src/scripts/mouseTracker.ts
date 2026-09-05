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

// --- Calm Liquid Water Ripple & Hydrodynamic Wake Engine ---
let spacetimeCanvas: HTMLCanvasElement | null = null;
let spacetimeCtx: CanvasRenderingContext2D | null = null;
let spacetimeRafId: number | null = null;
let themeObserver: MutationObserver | null = null;

interface WaterWavePacket {
    x: number;
    y: number;
    birthTime: number;
    duration: number; // Duration of wave packet (ms)
    maxRadius: number; // Expanding radius limit
    amplitude: number; // Wave peak amplitude
    wavelength: number; // Distance between concentric crests
    ringCount: number; // Number of harmonic rings in packet
}

interface CursorTrailPoint {
    x: number;
    y: number;
    time: number;
}

let activeRipples: WaterWavePacket[] = [];
let cursorTrail: CursorTrailPoint[] = [];
let lastRippleX = -1000;
let lastRippleY = -1000;
let lastRippleTime = 0;

let canvasWidth = 0;
let canvasHeight = 0;
let isCanvasSleeping = false;
let idleFrames = 0;

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

    wakeFluidCanvas();
};

const spawnWaterDroplet = (
    x: number,
    y: number,
    amplitude = 0.55,
    rings = 2,
    customDuration?: number
) => {
    const dur = customDuration || 1600;
    const maxR = Math.min(220, 110 + amplitude * 120);

    activeRipples.push({
        x,
        y,
        birthTime: performance.now(),
        duration: dur,
        maxRadius: maxR,
        amplitude: Math.min(0.75, Math.max(0.2, amplitude)),
        wavelength: 22,
        ringCount: rings,
    });

    wakeFluidCanvas();
};

const renderFluidCanvas = () => {
    if (!spacetimeCanvas || !spacetimeCtx) return;

    const now = performance.now();
    const isDark = document.documentElement.classList.contains('dark');

    // Clean expired trail points older than 260ms
    while (cursorTrail.length > 0 && now - cursorTrail[0].time > 260) {
        cursorTrail.shift();
    }

    // Smoothly decay mouse speed
    mouseSpeedX *= 0.85;
    mouseSpeedY *= 0.85;

    // Clear canvas
    spacetimeCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 1. Draw Hydrodynamic Liquid Wake Stream behind cursor
    if (cursorTrail.length >= 2) {
        spacetimeCtx.save();
        spacetimeCtx.lineCap = 'round';
        spacetimeCtx.lineJoin = 'round';

        for (let i = 0; i < cursorTrail.length - 1; i++) {
            const p1 = cursorTrail[i];
            const p2 = cursorTrail[i + 1];
            const age = now - p2.time;
            const life = Math.max(0, 1 - age / 260); // 1.0 at cursor tip, 0.0 at tail
            if (life <= 0) continue;

            const width = 1.2 + life * 6.5; // Smoothly tapers from cursor
            const alpha = life * (isDark ? 0.24 : 0.18);

            spacetimeCtx.beginPath();
            spacetimeCtx.moveTo(p1.x, p1.y);
            spacetimeCtx.lineTo(p2.x, p2.y);
            spacetimeCtx.lineWidth = width;
            spacetimeCtx.strokeStyle = isDark
                ? `rgba(56, 189, 248, ${alpha.toFixed(3)})`
                : `rgba(2, 132, 199, ${alpha.toFixed(3)})`;
            spacetimeCtx.stroke();
        }
        spacetimeCtx.restore();
    }

    // 2. Draw Glassy Liquid Droplet Lens at Cursor Tip
    const currentSpeed = Math.hypot(mouseSpeedX, mouseSpeedY);
    if (mouseX >= 0 && mouseY >= 0 && (currentSpeed > 0.05 || cursorTrail.length > 0)) {
        spacetimeCtx.save();
        const lensRadius = Math.min(32, 20 + currentSpeed * 0.8);
        const grad = spacetimeCtx.createRadialGradient(
            mouseX,
            mouseY,
            0,
            mouseX,
            mouseY,
            lensRadius
        );
        if (isDark) {
            grad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
            grad.addColorStop(0.5, 'rgba(3, 105, 161, 0.08)');
            grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        } else {
            grad.addColorStop(0, 'rgba(2, 132, 199, 0.18)');
            grad.addColorStop(0.5, 'rgba(14, 165, 233, 0.06)');
            grad.addColorStop(1, 'rgba(2, 132, 199, 0)');
        }
        spacetimeCtx.fillStyle = grad;
        spacetimeCtx.beginPath();
        spacetimeCtx.arc(mouseX, mouseY, lensRadius, 0, Math.PI * 2);
        spacetimeCtx.fill();
        spacetimeCtx.restore();
    }

    // 3. Render Concentric Water Wave Packets
    if (activeRipples.length > 0) {
        spacetimeCtx.save();

        for (let i = activeRipples.length - 1; i >= 0; i--) {
            const rip = activeRipples[i];
            const elapsed = now - rip.birthTime;
            const progress = elapsed / rip.duration;

            if (progress >= 1.0) {
                activeRipples.splice(i, 1);
                continue;
            }

            // Smooth physical wave dispersion & easing: 1 - exp(-2.6 * p)
            const easeR = 1 - Math.exp(-2.6 * progress);
            const leadRadius = rip.maxRadius * easeR;

            // Physical wave packet envelope: smooth gentle attack, quadratic attenuation
            const attack = Math.min(1, progress * 7.0);
            const decay = Math.pow(1 - progress, 1.6);
            const envelope = attack * decay * rip.amplitude;

            if (envelope < 0.005) continue;

            for (let k = 0; k < rip.ringCount; k++) {
                // Dispersion: spacing expands slightly over time as wave moves out
                const spacing = rip.wavelength * (1 + progress * 0.35);
                const r = leadRadius - k * spacing;
                if (r < 3 || r > rip.maxRadius * 1.05) continue;

                // Secondary and tertiary crests carry naturally less energy
                const ringFactor = Math.pow(0.72, k);
                const ringAmp = envelope * ringFactor;
                // Wave crest widens gracefully as it expands (natural dispersion)
                const strokeWidth = 1.0 + progress * 2.4;

                // A. Wave Body / Soft Liquid Refraction
                const bodyAlpha = ringAmp * (isDark ? 0.24 : 0.18);
                spacetimeCtx.lineWidth = strokeWidth * 2.4;
                spacetimeCtx.strokeStyle = isDark
                    ? `rgba(56, 189, 248, ${bodyAlpha.toFixed(3)})`
                    : `rgba(2, 132, 199, ${bodyAlpha.toFixed(3)})`;
                spacetimeCtx.beginPath();
                spacetimeCtx.arc(rip.x, rip.y, r, 0, Math.PI * 2);
                spacetimeCtx.stroke();

                // B. Crisp Specular Surface Glint along Wave Crest
                const glintAlpha = ringAmp * (isDark ? 0.46 : 0.36);
                spacetimeCtx.lineWidth = strokeWidth * 0.85;
                spacetimeCtx.strokeStyle = isDark
                    ? `rgba(224, 242, 254, ${glintAlpha.toFixed(3)})`
                    : `rgba(14, 165, 233, ${glintAlpha.toFixed(3)})`;
                spacetimeCtx.beginPath();
                spacetimeCtx.arc(rip.x, rip.y, r, 0, Math.PI * 2);
                spacetimeCtx.stroke();

                // C. Subtle Inner Trough Refraction (Creates genuine 3D liquid depth)
                const troughR = r - spacing * 0.38;
                if (troughR > 2) {
                    const troughAlpha = ringAmp * (isDark ? 0.12 : 0.09);
                    spacetimeCtx.lineWidth = strokeWidth * 1.5;
                    spacetimeCtx.strokeStyle = isDark
                        ? `rgba(3, 105, 161, ${troughAlpha.toFixed(3)})`
                        : `rgba(30, 64, 175, ${troughAlpha.toFixed(3)})`;
                    spacetimeCtx.beginPath();
                    spacetimeCtx.arc(rip.x, rip.y, troughR, 0, Math.PI * 2);
                    spacetimeCtx.stroke();
                }
            }
        }

        spacetimeCtx.restore();
    }

    // 4. Auto-sleep System: conserve 100% CPU/GPU when water settles
    if (
        activeRipples.length === 0 &&
        cursorTrail.length === 0 &&
        Math.abs(mouseSpeedX) < 0.01 &&
        Math.abs(mouseSpeedY) < 0.01
    ) {
        idleFrames++;
        if (idleFrames > 25) {
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
    cursorTrail = [];
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

    const now = performance.now();
    const speed = Math.hypot(mouseSpeedX, mouseSpeedY);

    cursorTrail.push({ x: newX, y: newY, time: now });
    while (cursorTrail.length > 0 && now - cursorTrail[0].time > 260) {
        cursorTrail.shift();
    }

    // Check distance traversed since last water ripple
    const distSinceLast = Math.hypot(newX - lastRippleX, newY - lastRippleY);

    // Natural ripple spacing: emit tranquil concentric rings as cursor glides
    if ((distSinceLast >= 42 || (distSinceLast >= 24 && speed > 7)) && now - lastRippleTime > 75) {
        lastRippleX = newX;
        lastRippleY = newY;
        lastRippleTime = now;

        const amp = Math.min(0.65, 0.25 + (speed / 25) * 0.35);
        const maxR = Math.min(220, 95 + speed * 3.5);
        const dur = Math.min(1800, 1300 + speed * 15);
        const rings = speed > 10 ? 3 : 2;

        activeRipples.push({
            x: newX,
            y: newY,
            birthTime: now,
            duration: dur,
            maxRadius: maxR,
            amplitude: amp,
            wavelength: 22,
            ringCount: rings,
        });
    }

    wakeFluidCanvas();

    if (!magneticRafId && cachedMagnetData.length > 0) {
        magneticRafId = requestAnimationFrame(updateMagneticTargets);
    }
};

const onPointerDown = (e: MouseEvent) => {
    spawnWaterDroplet(e.clientX, e.clientY, 0.7, 3, 1900);
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
    document.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('scroll', handleScrollOrResize);
    window.removeEventListener('resize', handleScrollOrResize);

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('pointerdown', onPointerDown, { passive: true });
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
    document.removeEventListener('pointerdown', onPointerDown);
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
    activeRipples = [];
    cursorTrail = [];
    magneticTargets = [];
    cachedMagnetData = [];
};

document.addEventListener('astro:page-load', runMouseTracker);
document.addEventListener('astro:before-preparation', destroyMouseTracker);
