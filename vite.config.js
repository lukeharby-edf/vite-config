import { defineConfig } from 'vite';
import sassGlobImports from 'vite-plugin-sass-glob-import';

const entry = {
    // js
    main: './src/js/app',
    // section css
    'editor': './src/scss/editor.scss'
};

export default defineConfig({
    plugins: [
        sassGlobImports()
    ],
    build: {
        rollupOptions: {
            input: entry,
            output: {
                assetFileNames: () => {
                    return `[name][extname]`;
                },
                chunkFileNames: 'main.min.js',
                entryFileNames: 'main.min.js',
            },
        },
        target: 'es2015',
        outDir: 'app/build/',
        sourcemap: true
    },
});