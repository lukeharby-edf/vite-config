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

const components = {
  accordion: "components/accordion.html",
  calendar: "components/calendar.html",
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isComponents = env.VITE_IS_COMPONENTS === "true";
  isComponents
    ? (entrypoints = { ...entry, ...components })
    : (entrypoints = entry);
  console.log(`isComponents: ${isComponents}`);

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
          ...entrypoints,
        },
        output: {
          assetFileNames: ({ names }) => {
            const ext = path.extname(names.find(() => true));
            return `[name][extname]`;
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
