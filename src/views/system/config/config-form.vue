<template>
  <el-dialog v-model="visible"
             :title="configFormTitle"
             width="600"
             @close="closeForm">
    <el-form :model="configInfo" ref="configFormRef" :rules="checkRules" label-width="100" inline>
      <el-form-item label="参数名称" prop="configName">
        <el-input placeholder="参数名称" v-model="configInfo.configName" class="form-input"/>
      </el-form-item>
      <el-form-item label="参数键名" prop="configKey">
        <el-input placeholder="参数键名" v-model="configInfo.configKey" class="form-input"/>
      </el-form-item>
      <el-form-item label="参数值">
        <el-input placeholder="参数值" v-model="configInfo.configValue" class="form-input"/>
      </el-form-item>
      <el-form-item label="是否内置">
        <el-radio-group v-model="configInfo.configType">
          <el-radio label="Y">内置</el-radio>
          <el-radio label="N">非内置</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" placeholder="备注" v-model="configInfo.remark" class="form-input"/>
      </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeForm">取消</el-button>
          <el-button type="primary" @click="submitConfigHandler">确认</el-button>
        </span>
    </template>
  </el-dialog>
</template>
<script setup>


import {reactive, ref} from "vue";
import '@/assets/css/form/form.css'
import {addConfig, getConfig, updateConfig} from "@/api/system/config.js";
import {ElMessage} from "element-plus";

const emits = defineEmits(['refreshDataList'])
const configFormTitle = ref('')
const visible = ref(false)
const configInfo = reactive({
  configId: null,
  configName: '',
  configKey: '',
  configValue: '',
  configType: 'Y',
  remark: ''
})
const configFormRef = ref()
const checkRules = ref({
  configName: {
    required: true,
    message: '参数名称不可为空',
    trigger: 'blur'
  },
  configKey: {
    required: true,
    message: '参数键名不可为空',
    trigger: 'blur'
  }
})

//提交表单
function submitConfigHandler() {
  configFormRef.value.validate((valid) => {
    if (valid) {
      if (configInfo.configId) {
        updateConfig(configInfo).then(res => {
          ElMessage.success('修改成功')
          closeForm()
          emits('refreshDataList')
        })
      } else {
        addConfig(configInfo).then(res => {
          ElMessage.success('新增成功')
          closeForm()
          emits('refreshDataList')
        })
      }
    }
  })
}

function closeForm() {
  visible.value = false
  configFormRef.value.resetFields()
  clearForm()
}

//清空表单
function clearForm() {
  configInfo.configId = null
  configInfo.configName = ''
  configInfo.configKey = ''
  configInfo.configValue = ''
  configInfo.configType = 'Y'
  configInfo.remark = ''
}

function init(configId) {
  //清空表单
  clearForm()

  visible.value = true

  if (configId) {
    configFormTitle.value = '修改参数'
    getConfig(configId).then(res => {
      const config = res.data
      configInfo.configId = configId
      configInfo.configName = config.configName
      configInfo.configKey = config.configKey
      configInfo.configValue = config.configValue
      configInfo.configType = config.configType
      configInfo.remark = config.remark
    })
  } else {
    configFormTitle.value = '新增参数'
  }
}


defineExpose({
  init
})

</script>
<style scoped>

</style>