import request from "../utils/request.js";

export function getUserInfo() {
    return request({
        url: '/sys/user/info',
        method: 'get'
    })
}


export function getRouters() {
    return request({
        url: '/sys/routers',
        method: 'get'
    })
}