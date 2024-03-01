import {defineStore} from "pinia";
import {getDictDataByType, initDictData} from "@/api/system/dict-data.js";

export const useDictStore = defineStore('dict', {
    state: () => ({
        dictList: []
    }),
    actions: {
        GetDictData(dictTypeCode) {
            const findDictType = this.dictList.find(item => item.dictTypeCode === dictTypeCode);
            if (findDictType || findDictType === []) {
                return findDictType.dictDataList
            }
            getDictDataByType(dictTypeCode).then(res => {
                const dictType = {
                    dictTypeCode: dictTypeCode,
                    dictDataList: res.data
                }
                this.dictList.push(dictType)
            })
            return []
        },
        InitDictData() {
            initDictData().then(res => {
                this.dictList.unshift(...res.data)
            })
        }
    }
})