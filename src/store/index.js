import {useUserStore} from "./modules/user.js";
import {useRouterStore} from "./modules/router.js";
import {useGlobalStore} from "@/store/modules/global.js";
import {useVisitedStore} from "@/store/modules/visit.js";

export const useStore = () => {
    return {
        user: useUserStore(),
        router: useRouterStore(),
        global: useGlobalStore(),
        visit: useVisitedStore()
    }
}