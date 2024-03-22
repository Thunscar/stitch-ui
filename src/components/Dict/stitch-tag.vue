<template>
  <el-tag v-if="dictData !== undefined && dictData != []" :type="dictData.cssClass === 'primary'?'':dictData.cssClass">
    {{ dictData.dictLabel }}
  </el-tag>
  <el-tag v-else type="danger">未知</el-tag>
</template>
<script setup>

import {useStore} from "@/store/index.js";
import {computed} from "vue";

const props = defineProps({
  dictType: {
    type: String,
    required: true
  },
  tagValue: {
    type: [Number, String],
    required: true
  }
})
const dictStore = useStore().dict

const dictData = computed(() => {
  const dataList = dictStore.GetDictData(props.dictType)
  return dataList.find(data => data.dictValue === props.tagValue)
})
</script>