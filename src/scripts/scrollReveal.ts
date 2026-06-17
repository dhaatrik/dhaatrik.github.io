const initScrollReveal = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const singleReveals = document.querySelectorAll('.reveal-on-scroll, .blueprint-reveal');
    const staggers = document.querySelectorAll('.reveal-stagger');

    if (prefersReducedMotion) {
        // Instantly show everything and exit
        singleReveals.forEach((el) => el.classList.add('is-visible'));
        staggers.forEach((parent) => {
            Array.from(parent.children).forEach((child) => {
                (child as HTMLElement).classList.add('is-visible');
            });
        });
        return;
    }

    // Observer for single elements
    const singleObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target as HTMLElement;
                    el.classList.add('is-visible');
                    
                    // Clean up transform on transitionend to prevent conflicts with hover lifts
                    const handleTransitionEnd = (e: TransitionEvent) => {
                        if (e.propertyName === 'transform') {
                            el.classList.remove('reveal-on-scroll');
                            el.style.transform = '';
                            el.removeEventListener('transitionend', handleTransitionEnd);
                        }
                    };
                    el.addEventListener('transitionend', handleTransitionEnd);

                    observer.unobserve(el);
                }
            });
        },
        {
            root: null,
            rootMargin: '0px 0px -8% 0px',
            threshold: 0.02,
        }
    );

    singleReveals.forEach((el) => singleObserver.observe(el));

    // Observer for staggered parents
    const staggerObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const parent = entry.target as HTMLElement;
                    const children = Array.from(parent.children);

                    children.forEach((child, index) => {
                        const htmlChild = child as HTMLElement;
                        htmlChild.style.transitionDelay = `${index * 80}ms`;
                        htmlChild.classList.add('is-visible');

                        // Clean up delays and reveal properties on transitionend
                        const handleStaggerTransitionEnd = (e: TransitionEvent) => {
                            if (e.propertyName === 'transform') {
                                htmlChild.style.transitionDelay = '';
                                htmlChild.style.transform = '';
                                htmlChild.removeEventListener('transitionend', handleStaggerTransitionEnd);
                            }
                        };
                        htmlChild.addEventListener('transitionend', handleStaggerTransitionEnd);
                    });

                    observer.unobserve(parent);
                }
            });
        },
        {
            root: null,
            rootMargin: '0px 0px -8% 0px',
            threshold: 0.02,
        }
    );

    staggers.forEach((parent) => staggerObserver.observe(parent));
};

// Bind to Astro lifecycle
document.addEventListener('astro:page-load', initScrollReveal);
