export function setupFormulaInspector() {
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

        htmlBlock.addEventListener('click', (e) => {
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
            try {
                tooltip.setAttribute('popover', 'auto');
            } catch {
                // Older browser fallback
            }
            tooltip.className =
                'fixed inset-auto z-50 m-0 p-3 bg-slate-950/95 dark:bg-[#0b0e14]/95 border border-slate-700/80 dark:border-white/15 text-slate-300 font-mono text-[10px] rounded-lg shadow-[0_16px_36px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.1)] tracking-wider max-w-sm backdrop-blur-md transition-all';

            const parts = definition.split('//').map((p) => p.trim());
            const itemsHtml = parts
                .map((part) => {
                    const colonIdx = part.indexOf(':');
                    if (colonIdx !== -1) {
                        const sym = part.substring(0, colonIdx).trim();
                        const desc = part.substring(colonIdx + 1).trim();
                        return `<div class="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/80 border border-slate-800 text-slate-300"><span class="font-bold text-(--accent)">${sym}</span><span class="text-slate-500">:</span><span>${desc}</span></div>`;
                    }
                    return `<div class="px-2 py-1 rounded bg-slate-900/80 border border-slate-800 text-slate-300">${part}</div>`;
                })
                .join('');

            tooltip.innerHTML = `
                <div class="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5 select-none">
                    <div class="flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-red-400/80 shadow-xs"></span>
                        <span class="w-2 h-2 rounded-full bg-amber-400/80 shadow-xs"></span>
                        <span class="w-2 h-2 rounded-full bg-emerald-400/80 shadow-xs"></span>
                        <span class="ml-2 font-bold tracking-widest text-(--accent) text-[9px] uppercase">[ INSPECTING ] MATH.RADAR</span>
                    </div>
                    <span class="text-[9px] text-slate-500 tracking-wider">ESC TO DISMISS</span>
                </div>
                <div class="flex flex-wrap gap-1.5">${itemsHtml}</div>
            `;

            document.body.appendChild(tooltip);

            const rect = htmlBlock.getBoundingClientRect();
            const top = Math.min(window.innerHeight - 160, Math.max(10, rect.bottom + 6));
            const left = Math.max(
                10,
                Math.min(window.innerWidth - 330, rect.left + rect.width / 2 - 160)
            );
            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;

            // Native Popover API activation
            if (typeof tooltip.showPopover === 'function') {
                try {
                    tooltip.showPopover();
                } catch {
                    // Fallback to standard DOM visibility
                }
            }

            const dismissTooltip = () => {
                if (typeof tooltip.hidePopover === 'function') {
                    try {
                        tooltip.hidePopover();
                    } catch {
                        tooltip.remove();
                    }
                } else {
                    tooltip.remove();
                }
            };

            // Remove when popover toggles to closed
            tooltip.addEventListener('toggle', (evt: any) => {
                if (evt.newState === 'closed') {
                    tooltip.remove();
                    document.removeEventListener('click', dismissTooltip);
                    document.removeEventListener('keydown', handleEsc);
                }
            });

            const handleEsc = (evt: KeyboardEvent) => {
                if (evt.key === 'Escape') {
                    dismissTooltip();
                }
            };

            setTimeout(() => {
                document.addEventListener('click', dismissTooltip);
                document.addEventListener('keydown', handleEsc);
            }, 10);
        });
    });
}
