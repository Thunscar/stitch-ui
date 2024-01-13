import {defineStore} from "pinia";
import {getRouters} from "@/api/router.js";
import ParentView from "@/layout/VerticalLayout/parentView/index.vue"
import OuterLink from "@/layout/VerticalLayout/outerLink/index.vue"
import Layout from "@/layout/index.vue"
import {modules} from "@/utils/modules.js"
import {useGlobalStore} from "@/store/global.js"

export const useRouterStore = defineStore("router", {
    state: () => ({
        routerState: []
    }),
    actions: {
        GetRouters() {
            return new Promise((resolve) => {
                getRouters().then(res => {
                    const storeData = JSON.parse(JSON.stringify(res.data))
                    const routerData = JSON.parse(JSON.stringify(res.data))
                    let filterStoreState = filterRouterData(storeData)
                    let filterRouter = filterRouterData(routerData)
                    addHomePage(filterStoreState)
                    this.routerState = filterStoreState
                    resolve(filterRouter)
                })
            })
        }
    }
})

// 过滤后台传来的路由字符串，转化为数组对象
function filterRouterData(asyncRouterMap, lastRouter = false, filterChild = false) {
    return asyncRouterMap.filter(route => {
        if (route.component) {
            if (route.component === "Layout") {
                route.component = Layout
            } else if (route.component === "ParentView") {
                route.component = ParentView
            } else if (route.component === "OuterLink") {
                route.component = OuterLink
            } else {
                route.component = loadComponent(route.component)
            }
        }
        if (route.children != null && route.children && route.children.length) {
            route.children = filterRouterData(route.children, route, filterChild)
        } else {
            delete route['children']
            delete route['redirect']
        }
        return true
    })
}

function addHomePage(menuState) {
    if (useGlobalStore().homeEnable) {
        menuState.unshift(
            {
                name: '/home',
                path: '/home',
                component: () => import('@/views/home/index.vue'),
                meta: {
                    title: '首页',
                    icon: 'home'
                },
                visible: true,
                children: null
            }
        )
    }
}

/**
 * 加载组件
 * @param view 组件地址
 * @returns {*}
 */
function loadComponent(view) {
    let component;
    if (view.lastIndexOf('.vue') !== -1 && view.substring(view.lastIndexOf('.vue'), view.length - 1)) {
        component = modules[`/src/views${view}`]
    } else {
        component = modules[`/src/views${view}/index.vue`]
    }
    return component;
}