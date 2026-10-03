import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss()
  ],
  build: {
    rolldownOptions: {
      // index.html is the sidebar, content/ runs on the registration sites,
      // and background.ts opens the side panel and answers the Schedule Planner column.
      input: { sidebar: 'index.html', content: 'src/content/index.ts', background: 'src/background.ts' },
      // manifest.json looks for content.js and background.js by name, so leave the hash off.
      output: { entryFileNames: '[name].js' }
    }
  },
})
