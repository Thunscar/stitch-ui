/**
 * 拼接query参数
 * @config params 参数
 * @returns {string}
 */
export function transParams(params) {
    let result = ''
    for (const paramKey of Object.keys(params)) {
        const paramValue = params[paramKey]
        const paramKeyEnCode = encodeURIComponent(paramKey)
        if (paramValue !== null && paramValue !== '' && typeof (paramValue) !== 'undefined') {
            if (typeof paramValue === 'object') {
                for (const key of Object.keys(paramValue)) {
                    if (paramValue[key] !== null && paramValue[key] !== '' && typeof (paramValue[key]) !== 'undefined') {
                        let params = paramKey + '[' + key + ']'
                        const subPart = encodeURIComponent(params)
                        result += subPart + '=' + encodeURIComponent(paramValue[key]) + '&'
                    }
                }
            } else {
                result += paramKeyEnCode + '=' + encodeURIComponent(paramValue) + '&'
            }
        }
    }
    return result
}

/**
 * 判断是否是Blob类型的参数
 * @param data
 * @returns {boolean}
 */
export function isValidBlob(data) {
    return data.type !== 'application/json'
}