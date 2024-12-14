import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'CanvasSelect',
      fileName: (format) => `canvas-select-vite.${format}.js`,
      formats: ['es', 'umd']
    },
  },
  plugins: [dts()],
})
