import service from "@/utils/request.js";
import {isValidBlob, transParams} from "@/utils/string.js";
import errorMessage from "@/utils/errorMessage.js";
import {saveAs} from 'file-saver'
import {ElMessage} from "element-plus";

export function download(url, params, filename, config) {
    return service.post(url, params, {
        transformRequest: [(params) => transParams(params)],
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        responseType: 'blob',
        ...config
    }).then(async (data) => {
        if (isValidBlob(data)) {
            const blob = new Blob([data])
            saveAs(blob, filename)
        } else {
            const responseText = await data.text
            const responseObj = JSON.parse(responseText)
            const msg = errorMessage[responseObj.code] || responseObj.msg || errorMessage['default']
            ElMessage.error(msg)
        }
    })
}