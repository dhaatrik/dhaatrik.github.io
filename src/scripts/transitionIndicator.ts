let progressBar: HTMLDivElement | null = null;
let statusTag: HTMLDivElement | null = null;
let transitionProgress = 0;
let progressInterval: number | undefined;

function createIndicator() {
    if (progressBar && statusTag) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create progress bar element at the top of the viewport
    progressBar = document.createElement('div');
    progressBar.id = 'transition-progress-bar';
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '2px';
    progressBar.style.width = '0%';
    progressBar.style.backgroundColor = 'var(--accent)';
    progressBar.style.zIndex = '99999';
    progressBar.style.transition = prefersReducedMotion ? 'none' : 'width 0.3s ease-out, opacity 0.3s ease-in-out';
    progressBar.style.pointerEvents = 'none';
    progressBar.style.opacity = '0';

    // Create status tag element at the bottom right of the viewport
    statusTag = document.createElement('div');
    statusTag.id = 'transition-status-tag';
    statusTag.className = 'font-mono text-[10px] tracking-widest uppercase';
    statusTag.style.position = 'fixed';
    statusTag.style.bottom = '16px';
    statusTag.style.right = '16px';
    statusTag.style.zIndex = '99999';
    statusTag.style.pointerEvents = 'none';
    statusTag.style.opacity = '0';
    statusTag.style.transition = prefersReducedMotion ? 'none' : 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out';
    statusTag.style.transform = prefersReducedMotion ? 'none' : 'translateY(10px)';
    statusTag.style.backgroundColor = 'rgba(11, 14, 20, 0.95)'; // Matches dark background
    statusTag.style.color = 'var(--accent)';
    statusTag.style.border = '1px solid color-mix(in srgb, var(--accent) 30%, transparent)';
    statusTag.style.padding = '6px 12px';
    statusTag.style.borderRadius = '4px';
    statusTag.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.5)';
    statusTag.style.display = 'flex';
    statusTag.style.alignItems = 'center';
    statusTag.style.gap = '6px';

    document.documentElement.appendChild(progressBar);
    document.documentElement.appendChild(statusTag);
}

function startProgress() {
    createIndicator();
    if (!progressBar || !statusTag) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Clear any existing intervals and reset state
    clearInterval(progressInterval);
    transitionProgress = 0;
    progressBar.style.width = '0%';
    progressBar.style.opacity = '1';
    progressBar.style.transition = prefersReducedMotion ? 'none' : 'width 0.3s ease-out, opacity 0.3s ease-in-out';

    const animateClass = prefersReducedMotion ? '' : 'animate-ping';
    statusTag.innerHTML = `<span class="h-1.5 w-1.5 rounded-full bg-(--accent) ${animateClass}"></span> [ CONNECTING... ]`;
    statusTag.style.opacity = '1';
    statusTag.style.transform = prefersReducedMotion ? 'none' : 'translateY(0)';

    // Simulate progress increments up to 85%
    progressInterval = window.setInterval(() => {
        if (transitionProgress < 85) {
            transitionProgress += Math.random() * 15;
            if (progressBar) {
                progressBar.style.width = `${transitionProgress}%`;
            }
        }
    }, 150);
}

function setSwapping() {
    if (!statusTag || !progressBar) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animateClass = prefersReducedMotion ? '' : 'animate-pulse';
    statusTag.innerHTML = `<span class="h-1.5 w-1.5 rounded-full bg-(--accent) ${animateClass}"></span> [ SWAPPING... ]`;
    progressBar.style.width = '90%';
}

function completeProgress() {
    clearInterval(progressInterval);
    if (!progressBar || !statusTag) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    progressBar.style.transition = prefersReducedMotion ? 'none' : 'width 0.2s ease-out, opacity 0.3s ease-in-out';
    progressBar.style.width = '100%';

    statusTag.innerHTML = `<span class="h-1.5 w-1.5 rounded-full bg-green-500"></span> [ READY ]`;

    // Fade out both elements after page loads fully
    setTimeout(() => {
        if (progressBar) progressBar.style.opacity = '0';
        if (statusTag) {
            statusTag.style.opacity = '0';
            if (!prefersReducedMotion) {
                statusTag.style.transform = 'translateY(10px)';
            }
        }
    }, 400);
}

// Wire up Astro View Transition event hooks
document.addEventListener('astro:before-preparation', startProgress);
document.addEventListener('astro:before-swap', setSwapping);
document.addEventListener('astro:page-load', () => {
    const pb = document.getElementById('transition-progress-bar');
    const st = document.getElementById('transition-status-tag');
    if (pb) {
        progressBar = pb as HTMLDivElement;
        statusTag = st as HTMLDivElement;
        completeProgress();
    }
});
