import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import path from "path";


export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            '/dev': {
                target: 'http://localhost:6666/',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/dev/, '')
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
})
