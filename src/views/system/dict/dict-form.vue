<template>
  <el-dialog v-model="visible"
             :title="dictFormTitle"
             width="620"
             @close="closeForm">
    <el-form :model="dictInfo" ref="dictFormRef" :rules="checkRules" label-width="100" inline>
      <el-form-item label="字典名称" prop="dictName">
        <el-input placeholder="字典名称" v-model="dictInfo.dictName" class="form-input"/>
      </el-form-item>
      <el-form-item label="类型编码" prop="dictType">
        <el-input placeholder="类型编码" v-model="dictInfo.dictType" class="form-input"/>
      </el-form-item>
      <el-form-item label="状态">
        <stitch-radio-group v-model="dictInfo.status" dict-type="normal_status"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" placeholder="备注" v-model="dictInfo.remark" class="form-input"/>
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
import {addDict, getDict, updateDict} from "@/api/system/dict.js";
import {ElMessage} from "element-plus";
import StitchRadioGroup from "@/components/Dict/stitch-radio-group.vue";

const emits = defineEmits(['refreshDataList'])
const dictFormTitle = ref('')
const visible = ref(false)
const dictInfo = reactive({
  dictId: null,
  dictName: '',
  dictType: '',
  status: '0',
  remark: ''
})
const dictFormRef = ref()
const checkRules = ref({
  dictName: {
    required: true,
    message: '字典名称不可为空',
    trigger: 'blur'
  },
  dictType: {
    required: true,
    message: '字典类型编码不可为空',
    trigger: 'blur'
  }
})

//提交表单
const submitDictHandler = () => {
  dictFormRef.value.validate((valid) => {
    if (valid) {
      if (dictInfo.dictId) {
        updateDict(dictInfo).then(res => {
          ElMessage.success('修改成功')
          closeForm()
          emits('refreshDataList')
        })
      } else {
        addDict(dictInfo).then(res => {
          ElMessage.success('新增成功')
          closeForm()
          emits('refreshDataList')
        })
      }
    }
  })
}

const closeForm = () => {
  visible.value = false
  dictFormRef.value.resetFields()
  clearForm()
}

//清空表单
const clearForm = () => {
  dictInfo.dictId = null
  dictInfo.dictName = ''
  dictInfo.dictType = ''
  dictInfo.status = '0'
  dictInfo.remark = ''
}

function init(dictId) {
  //清空表单
  clearForm()

  visible.value = true

  if (dictId) {
    dictFormTitle.value = '修改字典'
    getDict(dictId).then(res => {
      const dict = res.data
      dictInfo.dictId = dictId
      dictInfo.dictName = dict.dictName
      dictInfo.dictType = dict.dictType
      dictInfo.status = dict.status
      dictInfo.remark = dict.remark
    })
  } else {
    dictFormTitle.value = '新增字典'
  }
}


defineExpose({
  init
})

</script>
<style scoped>

</style>