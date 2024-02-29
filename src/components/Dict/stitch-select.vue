<template>
  <el-select :model-value="modelValue" @change="$emit('update:modelValue',$event)" :placeholder="placeholder">
    <el-option v-for="data in dictStore.GetDictData(props.dictType)" :key="data.dictCode" :label="data.dictLabel"
               :value="data.dictValue">
      {{ data.dictLabel }}
    </el-option>
  </el-select>
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
  },
  placeholder: {
    type: String,
    required: false,
    default: ''
  }
})

const dictStore = useStore().dict
</script>
<style scoped>

</style>