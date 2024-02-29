import {defineStore} from "pinia";
import {getDictData} from "@/api/system/dict-data.js";

export const useDictStore = defineStore('dict', {
    state: () => ({
        dictList: []
    }),
    actions: {
        GetDictData(dictTypeCode) {
            const findDictType = this.dictList.find(item => item.dictTypeCode === dictTypeCode);
            if (findDictType) {
                return findDictType.dictDataList
            }
            getDictData(dictTypeCode).then(res => {
                const dictType = {
                    dictTypeCode: dictTypeCode,
                    dictDataList: res.data
                }
                this.dictList.push(dictType)
            });
            return []
        }
    }
})