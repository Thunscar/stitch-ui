import {defineStore} from "pinia";
import router from "@/router/index.js";
import {useKeepAliveStore} from "@/store/modules/keepalive.js";
import {persistConfig} from "@/store/config/persistConfig.js";

export const visitedStorageKey = 'visit'
export const useVisitedStore = defineStore('visit', {
    state: () => ({
        visitedViews: [],
        noCloseViews: ['/home']
    }),
    actions: {
        //添加一个tab
        async AddView(view) {
            if (this.visitedViews.every(item => item.path !== view.path)) {
                this.visitedViews.push(view)
            }
            //若需要缓存则
            const keepAliveStore = useKeepAliveStore()
            if (view.cache) {
                await keepAliveStore.AddKeepAlivePath(view.path)
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
            //移除keepAlive
            const keepAliveStore = useKeepAliveStore()
            if (viewPath.cache) {
                await keepAliveStore.RemoveKeepAlivePath(viewPath)
            }
        },
        //设置当前标签页
        async SetVisitedViews(views) {
            this.visitedViews = views
        }
    },
    persist: persistConfig(visitedStorageKey, ['visitedViews', 'noCloseViews'])
})