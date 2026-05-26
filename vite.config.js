import { defineConfig, loadEnv } from "vite";
import path from "node:path";
import sassGlobImports from "vite-plugin-sass-glob-import";
import htmlMinifier from "vite-plugin-html-minifier";

let entrypoints = null;

const entry = {
  // js
  main: "./src/js/app",
  // section css
  editor: "./src/scss/editor.scss",
};

export default defineConfig(() => {
  return {
    plugins: [
      sassGlobImports(),
      htmlMinifier({
        minify: true,
      }),
    ],
    build: {
      rollupOptions: {
        input: {
          ...entry,
        },
        output: {
          assetFileNames: ({ names }) => {
            const ext = path.extname(names.find(() => true));
            return `[ext]/[name][extname]`;
          },
          chunkFileNames: "main.min.js",
          entryFileNames: "main.min.js",
        },
      },
      target: "es2015",
      outDir: "app/build/",
      sourcemap: true,
    },
  };
});
