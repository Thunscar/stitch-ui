import {useUserStore} from "./user.js";
import {useRouterStore} from "./router.js";
import {useGlobalStore} from "@/store/global.js";

export const useStore = () => {
    return {
        user: useUserStore(),
        router: useRouterStore(),
        global:useGlobalStore()
    }
}