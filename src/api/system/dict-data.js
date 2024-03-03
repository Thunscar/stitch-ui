import request from "@/utils/request.js";

export function getDictDataByType(dictType) {
    return request({
        url: '/sys/dict/data/' + dictType,
        method: 'get',
    })
}

export function getDictDataList(dictData) {
    return request({
        url: '/sys/dict/data/list',
        method: 'get',
        params: dictData
    })
}

export function getDictDataByCode(dictCode) {
    return request({
        url: '/sys/dict/data/code/' + dictCode,
        method: 'get'
    })
}

export function addDictData(dictData) {
    return request({
        url: '/sys/dict/data',
        method: 'post',
        data: dictData
    })
}

export function updateDictData(dictData) {
    return request({
        url: '/sys/dict/data',
        method: 'put',
        data: dictData
    })
}

export function deleteDictData(dictType, dictCodes) {
    return request({
        url: '/sys/dict/data/' + dictType + '/' + dictCodes,
        method: 'delete'
    })
}


