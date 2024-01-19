import {defineStore} from "pinia";
import {login, logout} from "@/api/login.js";
import {getUserInfo} from "@/api/router.js";
import {persistConfig} from "@/store/config/persistConfig.js";
import {useVisitedStore, visitedStorageKey} from "@/store/modules/visit.js";

export const userStorageKey = 'user'
export const useUserStore = defineStore("user", {
    state: () => ({
        name: "", avatar: "", roles: [], permission: [], token: ''
    }), actions: {
        Login(userInfo) {
            const username = userInfo.username.trim()
            const password = userInfo.password
            const code = userInfo.code
            const uuid = userInfo.uuid
            return new Promise((resolve, reject) => {
                login(username, password, code, uuid).then(res => {
                    if (res) {
                        this.token = res.token
                        resolve()
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetUserInfo() {
            return new Promise((resolve, reject) => {
                getUserInfo().then(res => {
                    this.name = res.user.nikeName
                    this.avatar = res.user.avatar
                    this.roles = res.roles
                    this.permission = res.permission
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        UserLoginOut() {
            const visitedStore = useVisitedStore()
            return new Promise((resolve, reject) => {
                logout().then(res => {
                    visitedStore.visitedViews = []
                    localStorage.removeItem('user')
                    localStorage.removeItem('visit')
                    this.name = ''
                    this.avatar = ''
                    this.roles = []
                    this.permission = []
                    this.token = ''
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    },
    persist: persistConfig(userStorageKey, ['name', 'avatar', 'token'])
})