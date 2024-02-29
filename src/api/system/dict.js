import request from "@/utils/request.js";

export function getDictList(sysDictType) {
    return request({
        url: '/sys/dict/type/list',
        method: 'get',
        params: sysDictType
    })
}

export function getDict(dictId) {
    return request({
        url: '/sys/dict/type/' + dictId,
        method: 'get',
    })
}

export function updateDict(sysDictType) {
    return request({
        url: '/sys/dict/type/',
        method: 'put',
        data: sysDictType
    })
}


export function addDict(sysDictType) {
    return request({
        url: '/sys/dict/type/',
        method: 'post',
        data: sysDictType
    })
}

export function deleteDict(dictIds) {
    return request({
        url: '/sys/dict/type/' + dictIds,
        method: 'delete',
    })
}

export function refreshDictCache() {
    return request({
        url: '/sys/dict/type/refresh',
        method: 'post'
    })
}