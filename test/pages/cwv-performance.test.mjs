import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../');

test('CWV / LCP: BaseHead supports preloadHeroImage and high-priority font preloads', () => {
    const baseHeadPath = path.join(ROOT_DIR, 'src/components/BaseHead.astro');
    const content = fs.readFileSync(baseHeadPath, 'utf8');

    assert.ok(
        content.includes('preloadHeroImage?: boolean'),
        'BaseHead Props must declare optional preloadHeroImage prop'
    );
    assert.ok(
        content.includes('preloadHeroImage = false'),
        'BaseHead destructuring must default preloadHeroImage to false'
    );
    assert.ok(
        content.includes('rel="preload"') &&
            content.includes('as="image"') &&
            content.includes('fetchpriority="high"'),
        'BaseHead must render link rel="preload" as="image" with fetchpriority="high" when preloadHeroImage is true'
    );
    assert.ok(
        content.includes('nunitoUrl') && content.includes('fetchpriority="high"'),
        'BaseHead must preload Nunito font with fetchpriority="high"'
    );
    assert.ok(
        content.includes('poppinsUrl') && content.includes('fetchpriority="high"'),
        'BaseHead must preload Poppins font with fetchpriority="high"'
    );
    assert.ok(
        content.includes('{ passive: true }'),
        'BaseHead resize listener must specify { passive: true }'
    );
});

test('CWV / LCP: index.astro unblocks hero LCP by using immediate CSS reveal classes', () => {
    const indexPath = path.join(ROOT_DIR, 'src/pages/index.astro');
    const content = fs.readFileSync(indexPath, 'utf8');

    assert.ok(
        content.includes('hero-reveal hero-reveal-1'),
        'Hero h1 heading must use immediate CSS .hero-reveal instead of JS .reveal-on-scroll'
    );
    assert.ok(
        content.includes('hero-reveal hero-reveal-2'),
        'Hero body copy must use .hero-reveal-2 for immediate CSS entrance'
    );
    assert.ok(
        content.includes('hero-reveal hero-reveal-3'),
        'Hero CTA container must use .hero-reveal-3 for immediate CSS entrance'
    );

    // Decorative background SVGs must not contend for high network priority
    assert.ok(
        !content.includes(
            'logo_dark.svg" alt="" class="h-[75%] w-[75%] max-w-187.5 object-contain dark:hidden" loading="eager" fetchpriority="high"'
        ),
        'Decorative background dark logo must not use fetchpriority="high"'
    );
    assert.ok(
        !content.includes(
            'logo_light.svg" alt="" class="hidden h-[75%] w-[75%] max-w-187.5 object-contain dark:block" loading="eager" fetchpriority="high"'
        ),
        'Decorative background light logo must not use fetchpriority="high"'
    );

    // Tech badge icons must have dimensions and not contend with LCP
    assert.ok(
        content.includes('height="24"') && content.includes('loading="lazy"'),
        'Tech stack badge icons must have explicit height and lazy loading to prevent CLS and LCP contention'
    );
});

test('CWV / LCP: motion.css defines hero-reveal keyframes with reduced motion guard', () => {
    const motionPath = path.join(ROOT_DIR, 'src/styles/motion.css');
    const content = fs.readFileSync(motionPath, 'utf8');

    assert.ok(content.includes('.hero-reveal'), 'motion.css must define .hero-reveal class');
    assert.ok(
        content.includes('@keyframes hero-fade-in'),
        'motion.css must define @keyframes hero-fade-in'
    );
    assert.ok(
        content.includes('.hero-reveal-1') &&
            content.includes('.hero-reveal-2') &&
            content.includes('.hero-reveal-3'),
        'motion.css must define staggered delay classes for hero entrance'
    );

    // Check reduced motion
    const reducedMotionIdx = content.indexOf('@media (prefers-reduced-motion: reduce)');
    assert.ok(reducedMotionIdx !== -1, 'motion.css must contain prefers-reduced-motion block');
    const reducedMotionSection = content.slice(reducedMotionIdx);
    assert.ok(
        reducedMotionSection.includes('.hero-reveal'),
        'prefers-reduced-motion block must disable hero-reveal animations'
    );
});

test('CWV / LCP: BlogPost enables hero image preloading in BaseHead', () => {
    const blogPath = path.join(ROOT_DIR, 'src/layouts/BlogPost.astro');
    const content = fs.readFileSync(blogPath, 'utf8');

    assert.ok(
        content.includes('preloadHeroImage={Boolean(heroImage)}'),
        'BlogPost layout must pass preloadHeroImage to BaseHead for instant LCP discovery'
    );
});

test('CWV / LCP: projects [...slug] preloads logo and assigns explicit eager dimensions', () => {
    const projectPath = path.join(ROOT_DIR, 'src/pages/projects/[...slug].astro');
    const content = fs.readFileSync(projectPath, 'utf8');

    assert.ok(
        content.includes('preloadHeroImage={Boolean(logo)}'),
        'projects/[...slug].astro must pass preloadHeroImage to BaseHead'
    );
    assert.ok(
        content.includes('width={80}') && content.includes('height={80}'),
        'Project logo Image must set explicit width and height dimensions of 80'
    );
    assert.ok(
        content.includes('loading="eager"') && content.includes('fetchpriority="high"'),
        'Project logo Image must be eagerly loaded with high fetchpriority'
    );
});

test('CWV / CLS: global.css defines unquoted generic sans-serif with system fallbacks', () => {
    const globalCssPath = path.join(ROOT_DIR, 'src/styles/global.css');
    const content = fs.readFileSync(globalCssPath, 'utf8');

    assert.ok(
        !content.includes("--font-sans: 'Nunito', 'sans-serif'"),
        'global.css must not quote generic sans-serif keyword in --font-sans'
    );
    assert.ok(
        !content.includes("--font-heading: 'Poppins', 'sans-serif'"),
        'global.css must not quote generic sans-serif keyword in --font-heading'
    );
    assert.ok(
        content.includes('-apple-system') && content.includes('BlinkMacSystemFont'),
        'global.css font declarations must include system fallbacks to prevent CLS during font swap'
    );
});

test('CWV / INP: Mouse and gesture handlers register passive listeners', () => {
    const mouseTrackerPath = path.join(ROOT_DIR, 'src/scripts/mouseTracker.ts');
    const mouseContent = fs.readFileSync(mouseTrackerPath, 'utf8');

    assert.ok(
        mouseContent.includes(
            "card.addEventListener('mousemove', handleCardMove, { passive: true })"
        ),
        'mouseTracker.ts card mousemove handler must be passive'
    );

    const reticlePath = path.join(ROOT_DIR, 'src/scripts/reticleParallax.ts');
    const reticleContent = fs.readFileSync(reticlePath, 'utf8');

    assert.ok(
        reticleContent.includes('passive: true'),
        'reticleParallax.ts mousemove listener must specify passive: true'
    );
});
