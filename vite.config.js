import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import {createSvgIconsPlugin} from "vite-plugin-svg-icons"
import path from 'path'


export default defineConfig({
    plugins: [
        vue(),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
            symbolId: 'icon-[dir]-[name]'
        })],
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
