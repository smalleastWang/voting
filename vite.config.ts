import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'VOTING_',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@artifacts': '/artifacts',
    }
  },
  
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        importers: [],
        // 注入全局变量
        additionalData: '@import "@/styles/variable.scss";'
      },
      postcss: {}
    },
    postcss: {
      plugins: [
        autoprefixer()
      ]
    }
  },
})
