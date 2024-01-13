import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import locale from 'element-plus/lib/locale/lang/zh-cn.js'
import './permission.js'
import 'animate.css'
import 'nprogress/nprogress.css'
import router from '@/router/index.js'
import {createPinia} from "pinia"
import '@/utils/modules.js'

//引入主题相关文件
import '@/assets/css/theme/default.css'
import '@/assets/css/theme/dark.css'

import App from './App.vue'

const pinia = createPinia();



const app = createApp(App)
app.use(ElementPlus, {locale})
app.use(pinia)
app.use(router)
app.config.productionTip = false;
app.mount('#app')