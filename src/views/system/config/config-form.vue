<template>
  <el-dialog v-model="visible"
             :title="configFormTitle"
             width="600">
    <el-form :model="configInfo" label-width="100" inline>
      <el-form-item label="参数名称" :required="true">
        <el-input placeholder="参数名称" v-model="configInfo.configName" class="form-input"/>
      </el-form-item>
      <el-form-item label="参数键名" :required="true">
        <el-input placeholder="参数键名" v-model="configInfo.configKey" class="form-input"/>
      </el-form-item>
      <el-form-item label="参数值" :required="true">
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
          <el-button @click="visible = false">取消</el-button>
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

//提交表单
function submitConfigHandler() {
  if (configInfo.configId) {
    updateConfig(configInfo).then(res => {
      if (res.code === 200) {
        ElMessage.success('修改成功')
        visible.value = false
        emits('refreshDataList')
      } else {
        ElMessage.error(res.msg)
      }
    })
  } else {
    addConfig(configInfo).then(res => {
      if (res.code === 200) {
        ElMessage.success('新增成功')
        visible.value = false
        emits('refreshDataList')
      } else {
        ElMessage.error(res.msg)
      }
    })
  }
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
      if (res.code === 200 && res.data) {
        const config = res.data
        configInfo.configId = configId
        configInfo.configName = config.configName
        configInfo.configKey = config.configKey
        configInfo.configValue = config.configValue
        configInfo.configType = config.configType
        configInfo.remark = config.remark
      } else {
        ElMessage.error(res.msg)
      }
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