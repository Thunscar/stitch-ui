<template>
  <el-dialog v-model="visible" :title="dataFormTitle" width="620" @close="closeForm">
    <el-form :model="dictDataInfo" ref="dictDataFormRef" :rules="checkRules" label-width="100" inline>
      <el-form-item label="字典标签" prop="dictLabel">
        <el-input placeholder="字典标签" v-model="dictDataInfo.dictLabel" class="form-input"/>
      </el-form-item>
      <el-form-item label="字典键值" prop="dictValue">
        <el-input placeholder="字典键值" v-model="dictDataInfo.dictValue" class="form-input"/>
      </el-form-item>
      <el-form-item label="标签样式">
        <el-select v-model="dictDataInfo.cssClass">
          <el-option value="primary" label="主要(primary)">
            <el-tag class="select-tag-v">主要(primary)</el-tag>
          </el-option>
          <el-option value="success" label="成功(success)">
            <el-tag type="success" class="select-tag-v">成功(success)</el-tag>
          </el-option>
          <el-option value="info" label="提醒(info)">
            <el-tag type="info" class="select-tag-v">提醒(info)</el-tag>
          </el-option>
          <el-option value="warning" label="警告(warning)">
            <el-tag type="warning" class="select-tag-v">警告(warning)</el-tag>
          </el-option>
          <el-option value="danger" label="危险(danger)">
            <el-tag type="danger" class="select-tag-v">危险(danger)</el-tag>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序">
        <el-input type="number" placeholder="排序" v-model="dictDataInfo.dictSort" :min="0" :max="999"
                  class="sort-input"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" placeholder="备注" v-model="dictDataInfo.remark" class="form-input"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeForm">取消</el-button>
        <el-button type="primary" @click="submitDictHandler">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>

import {reactive, ref} from "vue";
import '@/assets/css/form/form.css'
import {ElMessage} from "element-plus";
import {addDictData, getDictDataByCode, updateDictData} from "@/api/system/dict-data.js";

const emits = defineEmits(['refreshDataList'])
const dataFormTitle = ref('')
const visible = ref(false)
const dictDataInfo = reactive({
  dictCode: null,
  dictLabel: '',
  dictValue: '',
  dictType: '',
  cssClass: 'primary',
  dictSort: 0,
  remark: ''
})
const dictDataFormRef = ref()
const checkRules = ref({
  dictLabel: {
    required: true,
    message: '字典标签不可为空',
    trigger: 'blur'
  },
  dictValue: {
    required: true,
    message: '字典键值不可为空',
    trigger: 'blur'
  }
})

//提交表单
const submitDictHandler = () => {
  dictDataFormRef.value.validate((valid) => {
    if (valid) {
      if (dictDataInfo.dictCode) {
        updateDictData(dictDataInfo).then(res => {
          ElMessage.success('修改成功')
          closeForm()
          emits('refreshDataList')
        })
      } else {
        addDictData(dictDataInfo).then(res => {
          ElMessage.success('新增成功')
          closeForm()
          emits('refreshDataList')
        })
      }
    }
  })
}

//关闭表单事件
const closeForm = () => {
  visible.value = false
  dictDataFormRef.value.resetFields()
  clearForm()
}

//清空表单
const clearForm = () => {
  dictDataInfo.dictCode = null
  dictDataInfo.dictLabel = ''
  dictDataInfo.dictValue = ''
  dictDataInfo.dictType = ''
  dictDataInfo.cssClass = 'primary'
  dictDataInfo.dictSort = 0
  dictDataInfo.remark = ''
}

function init(dictType, dictCode) {
  //清空表单
  clearForm()
  visible.value = true
  dictDataInfo.dictType = dictType

  if (dictCode) {
    dataFormTitle.value = '修改字典数据'
    getDictDataByCode(dictCode).then(res => {
      Object.assign(dictDataInfo,res.data)
    })
  } else {
    dataFormTitle.value = '新增字典数据'
  }
}


defineExpose({
  init
})

</script>
<style scoped>
.select-tag-v {
  width: 100%;
}
</style>