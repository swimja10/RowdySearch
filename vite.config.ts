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
    rolldownOptions: {
      // index.html is the sidebar, content/ runs on the registration sites,
      // and background.ts opens the side panel from the toolbar icon.
      input: { sidebar: 'index.html', content: 'src/content/index.ts', background: 'src/background.ts' },
      // Plain file names (no hash like sidebar-C70xHswh.css): manifest.json looks for
      // content.js and background.js by name, and dist/ is committed to git.
      output: { entryFileNames: '[name].js', assetFileNames: '[name][extname]' }
    }
  },
})
