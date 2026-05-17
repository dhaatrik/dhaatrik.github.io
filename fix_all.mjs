const fs=require('fs'); 
const path=require('path'); 
function w(d) { 
    for(let f of fs.readdirSync(d)) { 
        let p = path.join(d,f); 
        if(fs.statSync(p).isDirectory()) { 
            w(p); 
        } else if (p.endsWith('.astro') || p.endsWith('.css')) { 
            let c = fs.readFileSync(p,'utf8'); 
            let o = c; 
            c = c.replace(/\[var\(--([^)]+)\)\]/g, '(--$1)'); 
            c = c.replace(/\bflex-grow\b/g, 'grow'); 
            c = c.replace(/\bbg-gradient-to-([a-z]+)\b/g, 'bg-linear-to-$1'); 
            if (p.endsWith('BlogPost.astro')) { 
                c = c.replace(/headings\.map\(\(heading\)/g, 'headings.map((heading: any)'); 
                c = c.replace(/max-w-screen-xl/g, 'max-w-7xl'); 
            } 
            if (p.endsWith('Header.astro')) { 
                c = c.replace(/z-\[100\]/g, 'z-100'); 
            } 
            if (p.endsWith('[...slug].astro')) { 
                c = c.replace(/sort\(\(a, b\)/g, 'sort((a: any, b: any)'); 
                c = c.replace(/posts\.map\(\(post, index\)/g, 'posts.map((post: any, index: number)'); 
            } 
            if (p.endsWith('blog\\index.astro') || p.endsWith('blog/index.astro')) { 
                c = c.replace(/sort\(\(a, b\)/g, 'sort((a: any, b: any)'); 
                c = c.replace(/posts\.map\(\(post\)/g, 'posts.map((post: any)'); 
                c = c.replace(/tags\.map\(\(tag, i\)/g, 'tags.map((tag: string, i: number)'); 
            } 
            if (p.endsWith('global.css') && !c.includes('mask: linear-gradient(#fff 0 0) content-box')) { 
                c = c.replace(/-webkit-mask: linear-gradient/g, 'mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);\n        -webkit-mask: linear-gradient'); 
            } 
            if (p.includes('pages\\index.astro') || p.includes('pages/index.astro')) { 
                const lines = c.split('\n'); 
                let found = false; 
                c = lines.filter(line => { 
                    if (line.includes("import Header from '../components/Header.astro';")) { 
                        if (found) return false; 
                        found = true; 
                    } 
                    return true; 
                }).join('\n'); 
                c = c.replace(/sort\(\(a, b\) => a\.data\.order/g, 'sort((a: any, b: any) => a.data.order'); 
                c = c.replace(/sort\(\(a, b\) => b\.data\.pubDate/g, 'sort((a: any, b: any) => b.data.pubDate'); 
                c = c.replace(/premiumLineup\.map\(\(tech\)/g, 'premiumLineup.map((tech: any)'); 
                c = c.replace(/projects\.map\(\(project\)/g, 'projects.map((project: any)'); 
                c = c.replace(/project\.data\.tags\.map\(\(tag\)/g, 'project.data.tags.map((tag: string)'); 
                c = c.replace(/posts\.map\(\(post\)/g, 'posts.map((post: any)'); 
            } 
            if (p.endsWith('HeaderLink.astro')) { 
                c = c.replace(/replace\(import\.meta\.env\.BASE_URL/g, "replace((import.meta.env as any).BASE_URL"); 
            } 
            if (p.endsWith('BaseHead.astro')) { 
                c = c.replace(/replace\(\/</g, "replace(new RegExp('<', 'g')"); 
            } 
            if (c !== o) { 
                fs.writeFileSync(p, c); 
                console.log('Fixed', p); 
            } 
        } 
    } 
} 
w('src');
