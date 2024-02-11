import {defineStore} from "pinia";
import router from "@/router/index.js";
import {persistConfig} from "@/store/config/persistConfig.js";

export const visitedStorageKey = 'visit'
export const useVisitedStore = defineStore('visit', {
    state: () => ({
        visitedViews: [],
        keepAliveViews: []
    }),
    actions: {
        //添加一个tab
        async AddView(view) {
            if (this.visitedViews.every(item => item.path !== view.path)) {
                this.visitedViews.push(view)
            }
            if (view.cache) {
                //获取组件名称
                const componentName = view.path.substring(view.path.lastIndexOf('/') + 1)
                if (this.keepAliveViews.every(item => item !== componentName)) {
                    this.keepAliveViews.push(componentName)
                }
            }
        },
        //移除一个tab
        async RemoveView(viewPath) {
            //为当前标签，需要跳转页面
            if (viewPath === router.currentRoute.value.fullPath) {
                this.visitedViews.forEach((item, index) => {
                    if (item.path === viewPath) {
                        const nextView = this.visitedViews[index + 1] || this.visitedViews[index - 1]
                        router.push(nextView.path)
                    }
                })
            }
            //移除views
            this.visitedViews = this.visitedViews.filter(item => item.path !== viewPath)
            //移除缓存
            const componentName = viewPath.substring(viewPath.lastIndexOf('/') + 1)
            this.keepAliveViews = this.keepAliveViews.filter(item => item !== componentName)
        }
    },
    persist: persistConfig(visitedStorageKey, ['visitedViews'])
})