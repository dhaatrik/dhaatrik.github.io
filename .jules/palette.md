## 2025-04-28 - Auto-scrolling and Subtle Link Accessibility

**Learning:** Infinite marquees must be keyboard focusable (`tabindex="0"`, `role="region"`) and pause on `focus-within` to pass WCAG 2.2.2 requirements, as users with visual or cognitive disabilities need time to read auto-scrolling content. Also, subtle text colors (like `text-slate-400`) on white backgrounds often fail WCAG contrast ratios; `text-slate-500` is safer for interactive elements.
**Action:** Always test infinite scroll components with keyboard navigation, ensure animations can be paused via focus/hover, and use tools to verify contrast ratios when opting for subtle UI aesthetics.
