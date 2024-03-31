import request from "@/utils/request.js"

export function getOnlineUserList(sysUser) {
    return request({
        method: 'get',
        url: '/sys/online/list',
        params: sysUser
    })
}

export function userOffline(token) {
    return request({
        method: 'post',
        url: '/sys/online/offline/' + token
    })
}