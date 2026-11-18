import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

// Plotly's build with box plots, by its full path, so it's found from the extension's folder too.
const plotly = fileURLToPath(new URL("./node_modules/plotly.js-cartesian-dist-min/plotly-cartesian.min.js", import.meta.url));

export default defineConfig({
  site: "https://rowdysearch.com",
  // Every page is a folder with an index.html in it, so its address ends in a slash.
  trailingSlash: "always",
  build: { format: "directory" },
  // A link's page starts loading when it's pointed at or touched, so the click feels instant.
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  // React is only for Analytical Mode (/compare/), which reuses the extension's components.
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // The extension's components live in ../src, next to their own copy of these packages.
      // The site must use one copy of each, its own, or React sees two of itself and breaks.
      dedupe: ["react", "react-dom", "tailwind-merge"],
      alias: {
        // The extension's charts load Plotly's "basic" build, which has no box plot. On the site
        // the same import gets the "cartesian" build, which does.
        "plotly.js-basic-dist": plotly,
      },
    },
    // The site shares code with the extension (../src) and reads ../data/professors.json.
    server: { fs: { allow: [".."] } },
  },
});
