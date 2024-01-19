import {defineStore} from "pinia";

export const useKeepAliveStore = defineStore('keepAlive', {
    state: () => ({
        keepAlivePaths: []
    }),
    actions: {
        async AddKeepAlivePath(path) {
            if (!this.keepAlivePaths.includes(path)) {
                this.keepAlivePaths.push(path)
            }
        },
        async RemoveKeepAlivePath(path) {
            this.keepAlivePaths.filter(item => item !== path)
        },
        async SetKeepAlivePaths(paths) {
            this.keepAlivePaths = paths
        }
    }
})