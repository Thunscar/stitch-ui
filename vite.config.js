import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

import {createSvgIconsPlugin} from "vite-plugin-svg-icons"
import path from 'path'

export default (runEnv) => {
    //获取环境变量
    const env = loadEnv(runEnv.mode, process.cwd())
    return defineConfig({
        base: '/',
        plugins: [
            vue(),
            createSvgIconsPlugin({
                iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
                symbolId: 'icon-[dir]-[name]'
            })],
        server: {
            proxy: {
                [env.VITE_APP_BASE_API]: {
                    target: 'http://localhost:6666',
                    changeOrigin: true,
                    rewrite: (path) => path.replace([env.VITE_APP_BASE_API], '')
                }
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        }
    })
}
