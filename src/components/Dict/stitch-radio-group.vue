<template>
  <el-radio-group :model-value="modelValue" @change="$emit('update:modelValue',$event)">
    <el-radio v-for="data in dictStore.GetDictData(props.dictType)" :key="data.dictCode" :label="data.dictValue">
      {{ data.dictLabel }}
    </el-radio>
  </el-radio-group>
</template>
<script setup>

import {useStore} from "@/store/index.js";

const props = defineProps({
  dictType: {
    type: String,
    required: true
  },
  modelValue: {
    type: [Number, String],
    required: true
  }
})
const dictStore = useStore().dict
</script>
<style scoped>

</style>