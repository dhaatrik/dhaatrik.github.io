import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // 1. Tailwind class replacements
    content = content.replace(/\[var\(--([^)]+)\)\]/g, '(--$1)');
    content = content.replace(/\bflex-grow\b/g, 'grow');
    content = content.replace(/\bbg-gradient-to-([a-z]+)\b/g, 'bg-linear-to-$1');

    if (filePath.endsWith('BaseHead.astro')) {
        content = content.replace(/replace\(\/</g, "replace(new RegExp('<', 'g')");
    }

    if (filePath.endsWith('HeaderLink.astro')) {
        content = content.replace(/replace\(import\.meta\.env\.BASE_URL/g, "replace((import.meta.env as any).BASE_URL");
    }

    if (filePath.endsWith('BlogPost.astro')) {
        content = content.replace(/headings\.map\(\(heading\)/g, 'headings.map((heading: any)');
        content = content.replace(/max-w-screen-xl/g, 'max-w-7xl');
    }

    if (filePath.endsWith('Header.astro')) {
        content = content.replace(/z-\[100\]/g, 'z-100');
    }

    if (filePath.endsWith('[...slug].astro')) {
        content = content.replace(/sort\(\(a, b\)/g, 'sort((a: any, b: any)');
        content = content.replace(/posts\.map\(\(post, index\)/g, 'posts.map((post: any, index: number)');
    }
    
    if (filePath.endsWith('blog\\index.astro') || filePath.endsWith('blog/index.astro')) {
        content = content.replace(/sort\(\(a, b\)/g, 'sort((a: any, b: any)');
        content = content.replace(/posts\.map\(\(post\)/g, 'posts.map((post: any)');
        content = content.replace(/tags\.map\(\(tag, i\)/g, 'tags.map((tag: string, i: number)');
    }

    if (filePath.endsWith('index.astro') && (filePath.includes('pages\\index.astro') || filePath.includes('pages/index.astro'))) {
        // Fix duplicate import Header
        const lines = content.split('\n');
        let found = false;
        content = lines.filter(line => {
            if (line.includes("import Header from '../components/Header.astro';")) {
                if (found) return false;
                found = true;
            }
            return true;
        }).join('\n');

        content = content.replace(/sort\(\(a, b\) => a\.data\.order/g, 'sort((a: any, b: any) => a.data.order');
        content = content.replace(/sort\(\(a, b\) => b\.data\.pubDate/g, 'sort((a: any, b: any) => b.data.pubDate');
        content = content.replace(/premiumLineup\.map\(\(tech\)/g, 'premiumLineup.map((tech: any)');
        content = content.replace(/projects\.map\(\(project\)/g, 'projects.map((project: any)');
        content = content.replace(/project\.data\.tags\.map\(\(tag\)/g, 'project.data.tags.map((tag: string)');
        content = content.replace(/posts\.map\(\(post\)/g, 'posts.map((post: any)');
    }

    if (filePath.endsWith('global.css')) {
        // Add standard mask property
        if (!content.includes('mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);')) {
            content = content.replace(/-webkit-mask: linear-gradient/g, 'mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);\n        -webkit-mask: linear-gradient');
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Fixed', filePath);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('dist')) {
                walkDir(fullPath);
            }
        } else {
            if (fullPath.endsWith('.astro') || fullPath.endsWith('.css') || fullPath.endsWith('.ts')) {
                fixFile(fullPath);
            }
        }
    }
}

walkDir(path.join(process.cwd(), 'src'));
console.log('Done.');
