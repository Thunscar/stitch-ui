import request from "@/utils/request.js";

export function insertSysPost(sysPost) {
    return request({
        url: '/sys/post',
        method: 'post',
        data: sysPost
    })
}

export function querySysPostList(sysPost) {
    return request({
        url: '/sys/post/list',
        method: 'get',
        params: sysPost
    })
}

export function getSysPostById(postId) {
    return request({
        url: '/sys/post/' + postId,
        method: 'get'
    })
}

export function exportSysPost(sysPost) {
    return request({
        url: '/sys/post/export',
        method: 'post',
        data: sysPost
    })
}

export function deleteBatchSysPost(postIds) {
    return request({
        url: '/sys/post/' + postIds,
        method: 'delete'
    })
}

export function updateSysPost(sysPost) {
    return request({
        url: '/sys/post',
        method: 'put',
        data: sysPost
    })
}