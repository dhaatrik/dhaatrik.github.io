export function resolve(specifier, context, nextResolve) {
    if (specifier === 'astro:content') {
        return {
            url: new URL('./mock-astro-content.mjs', import.meta.url).href,
            shortCircuit: true,
        };
    }
    if (specifier === '@astrojs/rss') {
        return {
            url: new URL('./mock-astrojs-rss.mjs', import.meta.url).href,
            shortCircuit: true,
        };
    }
    if (specifier.endsWith('/consts') || specifier === '../consts') {
        return {
            url: new URL('./mock-consts.mjs', import.meta.url).href,
            shortCircuit: true,
        };
    }
    return nextResolve(specifier, context);
}
