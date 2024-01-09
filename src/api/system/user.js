import request from "@/utils/request.js";

export function getSysUserList(sysUser) {
    return request({
        method: 'get',
        url: '/sys/user/list',
        params: sysUser
    })
}

export function getSysUserById(userId) {
    return request({
        method: 'get',
        url: '/sys/user/' + userId
    })
}

export function insertSysUser(sysUser) {
    return request({
        method: 'post',
        url: '/sys/user',
        data: sysUser
    })
}

export function updateSysUser(sysUser) {
    return request({
        method: 'put',
        url: '/sys/user',
        data: sysUser
    })
}

export function deleteSysUser(userId) {
    return request({
        method: 'delete',
        url: '/sys/user/' + userId
    })
}

export function resetSysUserPassword(userId) {
    return request({
        method: 'post',
        url: '/sys/user/reset/' + userId
    })
}

