/**
 * ⚡ Bolt: Single-pass string scanner to count words and calculate reading time.
 * This avoids massive array allocations caused by String.prototype.split(/\s+/)
 * and is significantly faster during SSG loops.
 */
export function getReadingTime(text: string): number {
    let words = 0;
    let inWord = false;
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        // ASCII codes for space (32), newline (10), carriage return (13), tab (9)
        if (charCode === 32 || charCode === 10 || charCode === 13 || charCode === 9) {
            inWord = false;
        } else {
            if (!inWord) {
                words++;
                inWord = true;
            }
        }
    }
    // Standard reading speed is ~200 words per minute
    return Math.ceil(words / 200);
}
