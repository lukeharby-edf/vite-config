import js from '@eslint/js';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: { globals: globals.browser },
    },
    globalIgnores(['**/*.js', '**/*.cjs', '**/*.mjs']),
    {
        ignores: ['app/', 'legacy/'], // TODO ignore list of folders for legacy js/scss
    },
]);
