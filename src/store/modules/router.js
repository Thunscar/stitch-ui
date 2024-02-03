import {defineStore} from "pinia";
import {getRouters} from "@/api/router.js";
import ParentView from "@/layout/VerticalLayout/parentView/index.vue"
import OuterLink from "@/layout/VerticalLayout/outerLink/index.vue"
import Layout from "@/layout/index.vue"
import {modules} from "@/utils/modules.js"
import router from "@/router/index.js";

export const useRouterStore = defineStore("router", {
    state: () => ({
        routerState: [],
        cacheRouters: []
    }),
    actions: {
        GetRouters() {
            return new Promise((resolve) => {
                getRouters().then(res => {
                    const storeData = JSON.parse(JSON.stringify(res.data))
                    const routerData = JSON.parse(JSON.stringify(res.data))
                    let filterStoreState = filterRouterData(storeData)
                    const formatRoutes = formatRouter(routerData)
                    appendHomePage(filterStoreState)
                    this.routerState = filterStoreState
                    formatRoutes.forEach(item => {
                        router.addRoute('Layout', item)
                    })
                    //添加404路由
                    router.addRoute({path: '/:catchAll(.*)', redirect: '404'})

                    //获取需要缓存的组件名称列表
                    appendHomePage(formatRoutes)
                    this.cacheRouters = getCacheComponentNames(formatRoutes)
                    resolve()
                })
            })
        }
    }
})

//扁平化路由
function formatRouter(routes) {
    let newRoutes = []
    routes.forEach(item => {
        if (item.children && item.children.length > 0) {
            newRoutes.unshift(...formatRouter(item.children))
        } else {
            item.component = loadComponent(item.component)
            newRoutes.push(item)
        }
    })
    return newRoutes
}

//获取需要缓存的组件名称列表
function getCacheComponentNames(routes) {
    let caches = []
    routes.forEach(item => {
        if (item.meta.cache) {
            caches.push(getComponentName(item.path))
        }
    })
    return caches
}

//获取组件名称
function getComponentName(itemPath) {
    return itemPath.substring(itemPath.lastIndexOf('/') + 1)
}


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

function appendHomePage(menuState) {
    menuState.unshift(
        {
            name: '/home',
            path: '/home',
            component: () => import('@/views/home/index.vue'),
            meta: {
                title: '首页',
                icon: 'f-home',
                cache: true
            },
            visible: false,
            children: null
        }
    )
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