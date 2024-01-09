import request from "@/utils/request.js";

export function getSysLoginLogList(sysLoginLog) {
    return request({
        method: 'get',
        url: '/sys/log/login/list'
    })
}