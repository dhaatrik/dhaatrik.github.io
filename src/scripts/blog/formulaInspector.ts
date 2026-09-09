export function setupFormulaInspector(signal: AbortSignal) {
    const mathBlocks = document.querySelectorAll('.katex-display, .katex');
    mathBlocks.forEach((block) => {
        if (block.classList.contains('inspector-processed')) return;
        block.classList.add('inspector-processed');

        const annotation = block.querySelector('annotation[encoding="application/x-tex"]');
        const latex =
            (annotation ? annotation.textContent?.trim() : block.textContent?.trim()) || '';

        const formulas: Record<string, string> = {
            '\\Delta v = v_e \\ln \\frac{m_0}{m_f}':
                'Δv: Velocity Delta // ve: Exhaust Velocity // m0: Initial Mass // mf: Final Mass',
            '\\Delta v = v_e \\ln \\frac{m_{0}}{m_{f}}':
                'Δv: Velocity Delta // ve: Exhaust Velocity // m0: Initial Mass // mf: Final Mass',
            '\\Delta v = I_{sp} \\cdot g_0 \\cdot \\ln \\left( \\frac{m_0}{m_f} \\right)':
                'Δv: Velocity Delta // Isp: Specific Impulse // g0: Standard Gravity // m0: Initial Mass // mf: Final Mass',
            '\\Delta v = I_{sp} \\cdot g_0 \\cdot \\ln \\left( \\frac{m_{0}}{m_{f}} \\right)':
                'Δv: Velocity Delta // Isp: Specific Impulse // g0: Standard Gravity // m0: Initial Mass // mf: Final Mass',
            'F = G \\frac{m_1 m_2}{r^2}':
                'F: Gravitational Force // G: Gravitational Constant // m1, m2: Masses // r: Distance',
            'F = G \\frac{m_{1} m_{2}}{r^{2}}':
                'F: Gravitational Force // G: Gravitational Constant // m1, m2: Masses // r: Distance',
            'E = m c^2': 'E: Energy // m: Mass // c: Speed of Light',
            'PV = nRT':
                'P: Pressure // V: Volume // n: Gas Amount // R: Gas Constant // T: Temperature',
        };

        let definition = '';
        for (const [key, value] of Object.entries(formulas)) {
            const normKey = key.replace(/\s+/g, '');
            const normLatex = latex.replace(/\s+/g, '');
            if (normLatex.includes(normKey) || normKey.includes(normLatex)) {
                definition = value;
                break;
            }
        }

        if (!definition) {
            if (latex.includes('\\Delta v') || latex.includes('v_e')) {
                definition =
                    'Δv: Velocity Delta // ve: Exhaust Velocity // m0: Initial Mass // mf: Final Mass';
            } else if (latex.includes('F =') && latex.includes('G')) {
                definition =
                    'F: Gravitational Force // G: Gravitational Constant // m1, m2: Masses // r: Distance';
            } else {
                definition = 'Formula Parameters: Dynamic breakdown not loaded';
            }
        }

        const htmlBlock = block as HTMLElement;
        htmlBlock.style.cursor = 'pointer';
        htmlBlock.title = 'Click to inspect formula parameters';

        htmlBlock.addEventListener(
            'click',
            (e) => {
                e.stopPropagation();

                const existing = document.getElementById('math-inspector-tooltip');
                if (existing) {
                    existing.remove();
                    if (existing.dataset.anchorId === htmlBlock.id) {
                        return;
                    }
                }

                if (!htmlBlock.id) {
                    htmlBlock.id = `math-block-${Math.random().toString(36).substring(2, 9)}`;
                }

                const tooltip = document.createElement('div');
                tooltip.id = 'math-inspector-tooltip';
                tooltip.dataset.anchorId = htmlBlock.id;
                tooltip.className =
                    'absolute z-50 p-2.5 bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[10px] rounded shadow-xl tracking-wider';
                tooltip.innerHTML = `[ <span class="text-(--accent)">INSPECTING</span> ] &rarr; ${definition}`;

                document.body.appendChild(tooltip);

                const rect = htmlBlock.getBoundingClientRect();
                tooltip.style.left = `${window.scrollX + rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                tooltip.style.top = `${window.scrollY + rect.bottom + 6}px`;

                const tooltipRect = tooltip.getBoundingClientRect();
                if (tooltipRect.left < 10) {
                    tooltip.style.left = '10px';
                } else if (tooltipRect.right > window.innerWidth - 10) {
                    tooltip.style.left = `${window.innerWidth - tooltipRect.width - 10}px`;
                }

                const dismissTooltip = () => {
                    tooltip.remove();
                    document.removeEventListener('click', dismissTooltip);
                };
                setTimeout(() => {
                    document.addEventListener('click', dismissTooltip, { signal });
                }, 10);
            },
            { signal }
        );
    });
}
