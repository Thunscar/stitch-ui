import request from "../utils/request.js";

export function getVerifyImage() {
    return request({
        url: '/verifyImage',
        method: 'get',
        headers: {
            isToken: false
        },
        timeout: 20000
    })
}

export function login(username, password, code, uuid) {
    return request({
        url: '/sys/login',
        method: 'post',
        timeout: 5000,
        headers: {
            isToken: false
        },
        data: {
            username: username,
            password: password,
            code: code,
            uuid: uuid
        }
    })
}

export function logout() {
    return request({
        url: '/sys/logout',
        method: 'post'
    })
}