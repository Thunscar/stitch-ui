import {defineStore} from "pinia";
import {getToken, removeToken, setToken} from "@/utils/auth.js";
import {login, logout} from "@/api/login.js";
import {getUserInfo} from "@/api/router.js";

export const useUserStore = defineStore("user", {
    state: () => ({
        name: "", avatar: "", roles: [], permission: [], token: getToken()
    }), actions: {
        Login(userInfo) {
            const username = userInfo.username.trim()
            const password = userInfo.password
            const code = userInfo.code
            const uuid = userInfo.uuid
            return new Promise((resolve, reject) => {
                login(username, password, code, uuid).then(res => {
                    if (res) {
                        setToken(res.token)
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
                    if (res) {
                        this.name = res.user.nikeName
                        this.avatar = res.user.avatar
                        this.roles = res.roles
                        this.permission = res.permission
                        resolve()
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        UserLoginOut() {
            return new Promise((resolve, reject) => {
                logout().then(res => {
                    if (res) {
                        removeToken()
                        this.name = ''
                        this.avatar = ''
                        this.roles = []
                        this.permission = []
                        this.token = ''
                        resolve(res)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
})