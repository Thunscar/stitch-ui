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
    const userStore = useStore().user
    const routerStore = useStore().router

    qprogress.start()
    if (getToken()) {
        if (to.path === '/login') {
            next({path: '/'})
        } else {
            if (userStore.roles.length === 0) {
                userStore.GetUserInfo().then(() => {
                    routerStore.GetRouters().then(()=>{
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


    //应用主题
    const globalStore = useStore().global
    globalStore.ChangeUserTheme()

    //修改title
    if (to.meta.title) {
        document.title = to.meta.title + ' - ' + 'Stitch Admin'
    }
    qprogress.finish()
})

/**
 * 后置路由守卫
 */
router.afterEach(() => {
    qprogress.finish()
})