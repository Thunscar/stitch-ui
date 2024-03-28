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
    }).then((data) => {
        if (isValidBlob(data)) {
            const blob = new Blob([data])
            saveAs(blob, filename)
        } else {
            const fileReader = new FileReader()
            fileReader.readAsText(data, 'utf-8')
            fileReader.onload = ()=>{
                let code = JSON.parse(fileReader.result).code
                let msg = JSON.parse(fileReader.result).msg
                console.log(code)
                if(code === 601){
                    ElMessage.warning(msg)
                }else{
                    ElMessage.error(msg)
                }
            }
        }
    })
}