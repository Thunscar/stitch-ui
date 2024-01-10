/**
 * 前置路由守卫
 */
import router from "@/router/index.js";
import {getToken} from "@/utils/auth.js";
import {useStore} from "@/store/index.js";
import {qprogress} from "@/utils/qprogress.js";

/*路由白名单*/
const RouteWhiteList = ['/login', '/register']

/*路由守卫*/
router.beforeEach((to, from, next) => {
    qprogress.start()
    if (getToken()) {
        if (to.path === '/login') {
            next({path: '/'})
        } else {
            if (useStore().user.roles.length === 0) {
                useStore().user.GetUserInfo().then(() => {
                    useStore().router.GetRouters().then(routes => {
                        routes.forEach(item => {
                            router.addRoute('Layout', item)
                        })
                        router.addRoute({
                            path: '/:catchAll(.*)',
                            redirect: '404'
                        })
                        next({...to, replace: true})
                    })
                })
            } else {
                next()
            }
        }
    } else {
        //无token
        if (RouteWhiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?redirect=${to.fullPath}`)
        }
    }
    qprogress.finish()
    const globalStore = useStore().global
    globalStore.ChangeUserTheme()
})

/**
 * 后置路由守卫
 */
router.afterEach(() => {
    qprogress.finish()
})