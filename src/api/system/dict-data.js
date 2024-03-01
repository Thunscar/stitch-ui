import request from "@/utils/request.js";

export function getDictDataByType(dictType) {
    return request({
        url: '/sys/dict/data/' + dictType,
        method: 'get',
    })
}

export function initDictData() {
    return request({
        url: '/sys/dict/type/init',
        method: 'get'
    })
}