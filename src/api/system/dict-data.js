import request from "@/utils/request.js";

export function getDictData(dictType) {
    return request({
        url: '/sys/dict/data/' + dictType,
        method: 'get',
    })
}