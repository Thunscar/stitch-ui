import request from "@/utils/request.js";

export function getDeptList(sysDept) {
    return request({
        method: 'get',
        url: '/sys/dept/list',
        params: sysDept
    })
}

export function insertSysDept(sysDept) {
    return request({
        method: 'post',
        url: '/sys/dept',
        data: sysDept
    })
}

export function updateSysDept(sysDept) {
    return request({
        method: 'put',
        url: '/sys/dept',
        data: sysDept
    })
}

export function deleteSysDept(deptId) {
    return request({
        method: 'delete',
        url: '/sys/dept/' + deptId
    })
}

export function getSysDeptById(deptId) {
    return request({
        method: 'get',
        url: '/sys/dept/' + deptId
    })
}