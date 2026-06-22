const fs = require('fs');
let code = fs.readFileSync('src/pages/index.astro', 'utf8');

const search = `                                const scrollY = window.scrollY;
                                const opacity = Math.max(0, 1 - scrollY / 130);
                                const translate = scrollY * 0.12;

                                telemetry.style.opacity = opacity.toString();
                                telemetry.style.transform = \`translateY(\${translate}px) scale(\${0.95 + opacity * 0.05})\`;

                                if (telemetryText) {
                                    if (scrollY === 0) {
                                        telemetryText.textContent = 'SCROLL TO INITIATE';
                                    } else if (scrollY > 0 && scrollY < 120) {
                                        const pct = Math.min(
                                            100,
                                            Math.round((scrollY / 120) * 100)
                                        );
                                        telemetryText.textContent = \`LINKING TELEMETRY // \${pct}%\`;
                                    } else {
                                        telemetryText.textContent = 'TELEMETRY ONLINE // 100%';
                                    }
                                }

                                if (opacity === 0) {
                                    telemetry.style.visibility = 'hidden';
                                } else {
                                    telemetry.style.visibility = 'visible';
                                }`;

const replace = `                                const scrollY = window.scrollY;

                                // ⚡ Bolt: Early exit to prevent redundant string allocations and DOM updates when scrolled out of view
                                if (scrollY >= 130) {
                                    if (!hasHidden) {
                                        telemetry.style.opacity = '0';
                                        telemetry.style.visibility = 'hidden';
                                        telemetry.style.transform = \`translateY(\${130 * 0.12}px) scale(0.95)\`;
                                        if (telemetryText) telemetryText.textContent = 'TELEMETRY ONLINE // 100%';
                                        hasHidden = true;
                                    }
                                } else {
                                    hasHidden = false;
                                    const opacity = 1 - scrollY / 130;
                                    const translate = scrollY * 0.12;

                                    telemetry.style.opacity = opacity.toString();
                                    telemetry.style.transform = \`translateY(\${translate}px) scale(\${0.95 + opacity * 0.05})\`;
                                    telemetry.style.visibility = 'visible';

                                    if (telemetryText) {
                                        if (scrollY === 0) {
                                            telemetryText.textContent = 'SCROLL TO INITIATE';
                                        } else {
                                            const pct = Math.round((scrollY / 120) * 100);
                                            telemetryText.textContent = \`LINKING TELEMETRY // \${Math.min(100, pct)}%\`;
                                        }
                                    }
                                }`;

code = code.replace(search, replace);
// add hasHidden var
code = code.replace(`let scrollTicking = false;`, `let scrollTicking = false;\n                    let hasHidden = false;`);

fs.writeFileSync('src/pages/index.astro', code);
