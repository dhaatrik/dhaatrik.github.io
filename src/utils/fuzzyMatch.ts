/** Lightweight bigram overlap score (0–1) for static client-side fuzzy filtering. */
export const fuzzyScore = (query: string, target: string): number => {
    const q = query.trim().toLowerCase();
    const t = target.trim().toLowerCase();
    if (!q || !t) return 0;
    if (t.includes(q)) return 1;

    const bigrams = (s: string): string[] => {
        const grams: string[] = [];
        for (let i = 0; i < s.length - 1; i++) {
            grams.push(s.slice(i, i + 2));
        }
        return grams;
    };

    const qGrams = bigrams(q);
    const tGrams = new Set(bigrams(t));
    if (qGrams.length === 0) return 0;

    let hits = 0;
    for (const g of qGrams) {
        if (tGrams.has(g)) hits++;
    }
    return hits / qGrams.length;
};

const queryCache = new Map<string, string[]>();

export const fuzzyMatchText = (query: string, text: string, threshold = 0.45): boolean => {
    // ⚡ Bolt: Cache parsed queries to prevent redundant string splitting and massive GC overhead during filtering loops
    let words = queryCache.get(query);
    if (!words) {
        words = query.split(/\s+/).filter(Boolean);
        // Keep cache size bounded to prevent memory leaks in edge cases
        if (queryCache.size > 100) queryCache.clear();
        queryCache.set(query, words);
    }

    if (words.length === 0) return true;
    return words.every((word) => {
        if (word.startsWith('#')) {
            return text.includes(word.slice(1).toLowerCase());
        }
        if (text.includes(word.toLowerCase())) return true;
        return fuzzyScore(word, text) >= threshold;
    });
};
