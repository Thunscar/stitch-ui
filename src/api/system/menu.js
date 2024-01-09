import request from "@/utils/request.js";

export function getMenuList(sysMenu) {
    return request({
        method: 'get',
        url: '/sys/menu/list',
        params: sysMenu
    })
}

export function getMenuById(menuId) {
    return request({
        method: 'get',
        url: '/sys/menu/' + menuId
    })
}

export function createMenu(sysMenu) {
    return request({
        method: 'post',
        url: '/sys/menu',
        data: sysMenu
    })
}

export function deleteSysMenu(menuId) {
    return request({
        method: 'delete',
        url: '/sys/menu/' + menuId
    })
}

export function updateSysMenu(sysMenu) {
    return request({
        method: 'put',
        url: '/sys/menu',
        data: sysMenu
    })
}