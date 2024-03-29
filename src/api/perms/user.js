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

export function deleteSysUser(userIds) {
    return request({
        method: 'delete',
        url: '/sys/user/' + userIds
    })
}

export function resetSysUserPassword(userId) {
    return request({
        method: 'post',
        url: '/sys/user/reset/' + userId
    })
}

export function getAllocatedRoles(sysRole) {
    return request({
        method: 'get',
        url: '/sys/role/allocated',
        params: sysRole
    })
}

export function getUnallocatedRoles(sysRole) {
    return request({
        method: 'get',
        url: '/sys/role/unallocated',
        params: sysRole
    })
}

export function allocateRoles(sysUserRole) {
    return request({
        method: 'post',
        url: '/sys/user/allocate',
        params: sysUserRole
    })
}

export function cancelAllocateRoles(sysUserRole) {
    return request({
        method: 'post',
        url: '/sys/user/allocate/cancel',
        params: sysUserRole
    })
}

export function unlockUserAccount(userId) {
    return request({
        method: 'post',
        url: '/sys/user/unlock/' + userId
    })
}
