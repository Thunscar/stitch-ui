import request from "@/utils/request.js";

export function getConfigList(sysConfig) {
    return request({
        method: "get",
        url: "/sys/config/list",
        params: sysConfig
    })
}

export function addConfig(sysConfig) {
    return request({
        method: "post",
        url: "/sys/config",
        data: sysConfig
    })
}

export function updateConfig(sysConfig) {
    return request({
        method: "put",
        url: "/sys/config",
        data: sysConfig
    })
}

export function getConfig(configId) {
    return request({
        method: "get",
        url: "/sys/config/" + configId
    })
}

export function deleteConfig(configIds) {
    return request({
        method: "delete",
        url: "/sys/config/" + configIds
    })
}

export function refreshConfigCache() {
    return request({
        method: "post",
        url: "/sys/config/refresh"
    })
}

