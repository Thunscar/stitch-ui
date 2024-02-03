import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'virtual:svg-icons-register'
import './permission.js'
import router from '@/router/index.js'
import {createPinia} from "pinia"
import persistPlugin from 'pinia-plugin-persist'
import '@/utils/modules.js'

//引入主题相关文件
import '@/assets/css/theme/default.css'
import '@/assets/css/theme/dark.css'

import App from './App.vue'
import bus from "@/utils/bus.js";

const pinia = createPinia();
pinia.use(persistPlugin)

const app = createApp(App)
app.use(ElementPlus)
app.config.globalProperties.bus = bus
app.use(pinia)
app.use(router)
app.config.productionTip = false;
app.mount('#app')