import axios from "axios";
import {getToken} from "./auth.js";
import {transParams} from "./string.js";
import cache from "@/plugins/cache.js";
import router from "@/router/index.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {useStore} from "@/store/index.js";

export const ReLoginDialog = {
    title: '系统提示',
    message: '登录状态已过期，是否重新登录',
    show: false,
    confirmText: '重新登录',
    cancelText: '取消'
}

const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API, timeout: 10000
})

service.interceptors.request.use(config => {
    //是否需要设置token
    const isToken = (config.headers || {}).isToken === false
    //是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
    if (!isToken && getToken()) {
        config.headers['Authorization'] = "bearer " + getToken()
    }
    if (config.method === 'get' && config.params) {
        //将query参数拼接在url后
        let url = config.url + '?' + transParams(config.params)
        url = url.slice(0, -1)
        config.params = {}
        config.url = url
    }
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
        const requestObj = {
            url: config.url,
            data: typeof config.data === 'object' ? JSON.stringify(config) : config.data,
            time: new Date().getTime()
        }
        const sessionObj = cache.sessionCache.getJSON('sessionObj')
        if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
            cache.sessionCache.setJSON('sessionObj', requestObj)
        } else {
            const s_url = sessionObj.url
            const s_data = sessionObj.data
            const s_time = sessionObj.time
            const interval = 2000
            if (s_data === requestObj.data && s_url === requestObj.url && requestObj.time - s_time < interval) {
                const repeatMsg = '数据正在处理，请勿重复提交'
                ElMessage.warning(repeatMsg)
                return new Promise((resolve, reject) => {
                    reject(new Error(repeatMsg))
                })
            } else {
                cache.sessionCache.setJSON('sessionObj', requestObj)
            }
        }
    }
    return config
}, error => {
    return Promise.reject(error)
})

service.interceptors.response.use(response => {
    const code = response.data.code
    const message = response.data.msg
    if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
        return response.data
    }
    if (code === 500) {
        //系统提示错误
        ElMessage.error(message)
        return Promise.reject(message)
    } else if (code === 601) {
        ElMessage.warning(message)
        return Promise.reject(message)
    } else if (code === 401) {
        // token过期 弹出重新登录框
        ElMessageBox.confirm(ReLoginDialog.message, ReLoginDialog.title, {
            confirmButtonText: ReLoginDialog.confirmText,
            cancelButtonText: ReLoginDialog.cancelText,
            type: 'warning',
            closeOnClickModal: false
        }).then(() => {
            const visitedStore = useStore().visit
            visitedStore.visitedViews = []
            localStorage.clear()
            router.push({path: `/login?redirect=${router.currentRoute.value.fullPath}`}).catch()
        }).catch(() => {
        })
        return Promise.reject(message)
    }
    return response.data
}, error => {
    //请求失败拦截处理
    console.log('err' + error)
    let {message} = error;
    if (message === "Network Error") {
        message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
        message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
        message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    ElMessage.error(message)
    return Promise.reject(error)
})

export default service