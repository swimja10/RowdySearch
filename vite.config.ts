import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // manifest.json sits in the project folder and loads the built files from dist/,
  // so the built files have to point at each other with relative paths.
  base: './',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss()
  ],
  build: {
    // dist/ is committed to git, so keep the built code readable instead of squashing it onto one line.
    minify: false,
    rolldownOptions: {
      // index.html is the sidebar, content/ runs on the registration sites,
      // and background.ts opens the side panel from the toolbar icon.
      input: { sidebar: 'index.html', content: 'src/content/index.ts', background: 'src/background.ts' },
      output: {
        // Plain file names (no hash like sidebar-C70xHswh.css): manifest.json looks for
        // content.js and background.js by name, and it keeps git diffs of dist/ clean.
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
        // Code from npm packages goes in its own files, so dist/sidebar.js is only our own code:
        // Plotly (the charts) in dist/plotly.js, everything else (React, anime.js...) in dist/libraries.js.
        codeSplitting: {
          groups: [
            { name: 'plotly', test: /plotly/, priority: 2 },
            { name: 'libraries', test: /node_modules/, priority: 1 }
          ]
        }
      }
    }
  },
})
