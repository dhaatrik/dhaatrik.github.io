#!/usr/bin/env node
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const VERIFY_DIR = path.join(ROOT, '.verify');
const PID_FILE = path.join(VERIFY_DIR, 'preview.pid');
const EVIDENCE_DIR = path.join(VERIFY_DIR, 'evidence');
const PORT = 4325;
const BASE_URL = `http://localhost:${PORT}`;

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

async function pingUrl(url, timeoutMs = 2000) {
    return new Promise((resolve) => {
        const req = http.get(url, { timeout: timeoutMs }, (res) => {
            resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });
    });
}

async function doctor() {
    console.log('[doctor] Checking verification environment...');
    const nodeMajor = parseInt(process.versions.node.split('.')[0], 10);
    if (nodeMajor < 22) {
        console.error(`[doctor] Node >= 22 required. Found ${process.version}`);
        process.exit(1);
    }
    console.log(`[doctor] Node version: ${process.version} (OK)`);

    const distExists = fs.existsSync(path.join(ROOT, 'dist', 'index.html'));
    if (!distExists) {
        console.log('[doctor] Production build missing. Building static site now...');
        execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
    } else {
        console.log('[doctor] Production dist/index.html found (OK)');
    }

    const isRunning = await pingUrl(BASE_URL);
    if (isRunning) {
        console.log(`[doctor] Preview server already running and responsive at ${BASE_URL}`);
    } else {
        console.log(`[doctor] Port ${PORT} is ready to be launched`);
    }
    console.log('[doctor] Doctor check passed.');
}

async function launch() {
    ensureDir(VERIFY_DIR);
    if (fs.existsSync(PID_FILE)) {
        const existingPid = parseInt(fs.readFileSync(PID_FILE, 'utf8').trim(), 10);
        const alive = await pingUrl(BASE_URL);
        if (alive) {
            console.log(
                `[launch] Preview server is already running (PID: ${existingPid}) at ${BASE_URL}`
            );
            return;
        }
    }

    // Ensure build is fresh
    if (!fs.existsSync(path.join(ROOT, 'dist', 'index.html'))) {
        console.log('[launch] Running build...');
        execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
    }

    console.log(`[launch] Starting preview server on port ${PORT}...`);
    const astroBin = path.join(ROOT, 'node_modules', 'astro', 'bin', 'astro.mjs');
    const child = spawn(process.execPath, [astroBin, 'preview', '--port', String(PORT)], {
        cwd: ROOT,
        detached: true,
        stdio: 'ignore',
    });

    child.unref();
    fs.writeFileSync(PID_FILE, String(child.pid), 'utf8');
    console.log(
        `[launch] Preview server process spawned (PID: ${child.pid}). Waiting for readiness...`
    );

    const maxWaitMs = 30000;
    const start = Date.now();
    let ready = false;
    while (Date.now() - start < maxWaitMs) {
        if (await pingUrl(BASE_URL)) {
            ready = true;
            break;
        }
        await new Promise((r) => setTimeout(r, 500));
    }

    if (!ready) {
        console.error(
            `[launch] Preview server failed to respond at ${BASE_URL} within ${maxWaitMs / 1000}s`
        );
        await cleanup();
        process.exit(1);
    }
    console.log(`[launch] Preview server is live and responsive at ${BASE_URL}`);
}

async function cleanup() {
    console.log('[cleanup] Cleaning up verification server...');
    if (fs.existsSync(PID_FILE)) {
        const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8').trim(), 10);
        try {
            if (process.platform === 'win32') {
                execSync(`taskkill /pid ${pid} /T /F`, { stdio: 'ignore' });
            } else {
                process.kill(-pid, 'SIGTERM');
            }
            console.log(`[cleanup] Terminated process tree for PID ${pid}`);
        } catch {
            // Already stopped
        }
        try {
            fs.unlinkSync(PID_FILE);
        } catch {}
    } else {
        console.log('[cleanup] No active PID file found.');
    }
    console.log('[cleanup] Complete. Evidence artifacts preserved in .verify/evidence/');
}

async function drive(feature = 'theme-toggle') {
    const alive = await pingUrl(BASE_URL);
    if (!alive) {
        console.log('[drive] Server not running. Launching first...');
        await launch();
    }

    const { chromium } = await import('playwright');
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    const featureEvidenceDir = path.join(EVIDENCE_DIR, feature);
    ensureDir(featureEvidenceDir);

    try {
        console.log(`[drive] Executing drive recipe for feature: ${feature}...`);

        if (feature === 'theme-toggle') {
            await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
            const initialDark = await page.evaluate(() =>
                document.documentElement.classList.contains('dark')
            );

            await page.screenshot({ path: path.join(featureEvidenceDir, '01-initial-state.png') });

            const themeBtn = page.locator('#theme-toggle');
            await themeBtn.click();
            await page.waitForTimeout(400);

            const toggledDark = await page.evaluate(() =>
                document.documentElement.classList.contains('dark')
            );
            if (initialDark === toggledDark) {
                throw new Error('Theme toggle did not switch dark class on <html> element');
            }

            await page.screenshot({ path: path.join(featureEvidenceDir, '02-toggled-state.png') });

            const proof = {
                feature: 'theme-toggle',
                timestamp: new Date().toISOString(),
                initialMode: initialDark ? 'dark' : 'light',
                toggledMode: toggledDark ? 'dark' : 'light',
                verified: true,
            };
            fs.writeFileSync(
                path.join(featureEvidenceDir, 'proof.json'),
                JSON.stringify(proof, null, 2)
            );
            console.log(
                `[drive] Theme toggle verified! ${proof.initialMode} -> ${proof.toggledMode}`
            );
        } else if (feature === 'books-popover') {
            await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
            const popoverBtn = page.locator('button[popovertarget="books-popover"]').first();
            await popoverBtn.scrollIntoViewIfNeeded();
            await popoverBtn.click();

            const popover = page.locator('#books-popover');
            await popover.waitFor({ state: 'visible' });

            const role = await popover.getAttribute('role');
            const isModal = await popover.getAttribute('aria-modal');

            await page.screenshot({
                path: path.join(featureEvidenceDir, '01-books-popover-open.png'),
            });

            if (role !== 'dialog' || isModal !== 'true') {
                throw new Error(
                    `Expected role="dialog" and aria-modal="true", got role="${role}" aria-modal="${isModal}"`
                );
            }

            const closeBtn = popover.locator('button[popovertargetaction="hide"]');
            await closeBtn.click();
            await page.waitForTimeout(300);

            const proof = {
                feature: 'books-popover',
                timestamp: new Date().toISOString(),
                role,
                ariaModal: isModal,
                dialogOpenedAndClosed: true,
            };
            fs.writeFileSync(
                path.join(featureEvidenceDir, 'proof.json'),
                JSON.stringify(proof, null, 2)
            );
            console.log('[drive] Books popover verified with dialog semantics!');
        } else if (feature === 'transmission-search') {
            await page.goto(`${BASE_URL}/transmissions/`, { waitUntil: 'domcontentloaded' });
            const searchInput = page.locator('#search-logs');
            await searchInput.fill('deltav');
            await page.waitForTimeout(500);

            const cards = page.locator('.blog-post-card:visible');
            const count = await cards.count();
            if (count === 0) {
                throw new Error('Search for "deltav" yielded zero visible cards');
            }

            await page.screenshot({ path: path.join(featureEvidenceDir, '01-search-results.png') });

            const proof = {
                feature: 'transmission-search',
                timestamp: new Date().toISOString(),
                query: 'deltav',
                visibleResults: count,
            };
            fs.writeFileSync(
                path.join(featureEvidenceDir, 'proof.json'),
                JSON.stringify(proof, null, 2)
            );
            console.log(`[drive] Transmission search verified with ${count} results!`);
        } else {
            throw new Error(`Unknown feature: ${feature}`);
        }

        console.log(`[drive] Evidence successfully stored in ${featureEvidenceDir}`);
    } finally {
        await browser.close();
    }
}

const command = process.argv[2] || 'doctor';
const arg = process.argv[3];

switch (command) {
    case 'doctor':
        await doctor();
        break;
    case 'launch':
        await launch();
        break;
    case 'drive':
        await drive(arg);
        break;
    case 'cleanup':
        await cleanup();
        break;
    default:
        console.log(
            'Usage: node scripts/verify-dhaatrik.mjs [doctor|launch|drive <feature>|cleanup]'
        );
        process.exit(1);
}
