import { defineConfig, loadEnv } from "vite";
import path from "node:path";
import sassGlobImports from "vite-plugin-sass-glob-import";
import htmlMinifier from "vite-plugin-html-minifier";
import { glob } from "glob";

let entrypoints = null;

const entry = {
  // js
  main: "./src/js/app",
  // section css
  editor: "./src/scss/editor.scss",
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const components = glob.sync(
    path.resolve(__dirname, "components/", "*.html"),
  );
  console.log(components);

  const isComponents = env.VITE_IS_COMPONENTS;
  isComponents
    ? (entrypoints = { ...entry, ...components })
    : (entrypoints = entry);
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
          ...components,
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
