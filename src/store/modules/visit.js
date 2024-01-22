import {defineStore} from "pinia";
import router from "@/router/index.js";
import {persistConfig} from "@/store/config/persistConfig.js";

export const visitedStorageKey = 'visit'
export const useVisitedStore = defineStore('visit', {
    state: () => ({
        visitedViews: []
    }),
    actions: {
        //添加一个tab
        async AddView(view) {
            if (this.visitedViews.every(item => item.path !== view.path)) {
                this.visitedViews.push(view)
            }
        },
        //移除一个tab
        async RemoveView(viewName) {
            //为当前标签，需要跳转页面
            if (viewName === router.currentRoute.value.fullPath) {
                console.log('current')
                this.visitedViews.forEach((item, index) => {
                    if (item.path === viewName) {
                        const nextView = this.visitedViews[index + 1] || this.visitedViews[index - 1]
                        router.push(nextView.path)
                    }
                })
            }
            //移除views
            this.visitedViews = this.visitedViews.filter(item => item.path !== viewName)
        },
        //设置当前标签页
        async SetVisitedViews(views) {
            this.visitedViews = views
        }
    },
    persist: persistConfig(visitedStorageKey, ['visitedViews'])
})