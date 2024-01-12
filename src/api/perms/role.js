import request from "@/utils/request.js";

export function selectSysRoleList(sysRole) {
    return request({
        url: '/sys/role/list',
        method: 'get',
        params: sysRole
    })
}

export function selectSysRoleById(roleId) {
    return request({
        url: '/sys/role/' + roleId,
        method: 'get'
    })
}

export function insertSysRole(sysRole) {
    return request({
        url: '/sys/role',
        method: 'post',
        data: sysRole
    })
}

export function updateSysRole(sysRole) {
    return request({
        url: '/sys/role',
        method: 'put',
        data: sysRole
    })
}

export function deleteBatchSysRoles(roleIds) {
    return request({
        url: '/sys/role/' + roleIds,
        method: 'delete'
    })
}

export function selectAuthorizedMenu(roleId) {
    return request({
        url: '/sys/role/auth/' + roleId,
        method: 'get'
    })
}


export function selectAllocatedUsers(sysUser) {
    return request({
        url: '/sys/user/allocated',
        method: 'get',
        params: sysUser
    })
}

export function selectUnAllocatedUsers(sysUser){
    return request({
        url:'/sys/user/unallocated',
        method:'get',
        params:sysUser
    })
}
