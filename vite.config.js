import { defineConfig } from 'vite';
import sassGlobImports from 'vite-plugin-sass-glob-import';

const entry = {
    // js
    app: './src/js/app',
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
                assetFileNames: (assetInfo) => {
                    const file = assetInfo.names.at(0);
                    let extType = file.split('.').at(1);
                    return `[name][extname]`;
                },
                chunkFileNames: 'app.min.js',
                entryFileNames: 'app.min.js',
            },
        },
        target: 'es2015',
        outDir: 'app/build/',
        sourcemap: true
    },
});