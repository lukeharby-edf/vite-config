import { defineConfig } from "vite";
import htmlMinifier from "vite-plugin-html-minifier";
import fs from 'fs';
import { transformAsync } from '@babel/core';

const widgets = {
    accordion: "widgets/accordion.html",
    calendar: "widgets/calendar.html",
};

const processHTMLWidgets = {
    name: 'process-html-widgets',
    async load(id) {
        if (id.endsWith('.html') && id.includes('widgets')) {
            let html = fs.readFileSync(id, 'utf-8');
            
            // Transpile inline JavaScript
            html = await transformInlineScripts(html);
            
            return `export default ${JSON.stringify(html)};`;
        }
    }
}; 
  
async function transformInlineScripts(html) {
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
    let match;

    while ((match = scriptRegex.exec(html)) !== null) {
        const code = match[1];
        const result = await transformAsync(code, {
            presets: [['@babel/preset-env']]
        });
        html = html.replace(match[0], `<script>${result.code}</script>`);
    }
    return html; 
}

export default defineConfig({
    publicDir: false,
    plugins: [
        processHTMLWidgets,
        htmlMinifier({
            minify: true,
        }),
    ],
    build: {
        rollupOptions: {
            input: widgets,
        },
        outDir: "app/",
        sourcemap: true,
    },
});