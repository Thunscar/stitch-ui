<template>
  <el-dialog v-model="visible"
             :title="userFormTitle"
             width="600">
    <el-form :model="userInfo" label-width="100" inline>
      <el-form-item label="用户名" :required="true">
        <el-input placeholder="用户名" v-model="userInfo.userName" class="form-input"/>
      </el-form-item>
      <el-form-item label="昵称" :required="true">
        <el-input placeholder="昵称" v-model="userInfo.nikeName" class="form-input"/>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="userInfo.sex">
          <el-radio label="0">男</el-radio>
          <el-radio label="1">女</el-radio>
          <el-radio label="2">位置</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-radio-group v-model="userInfo.userType">
          <el-radio label="00">系统用户</el-radio>
          <el-radio label="01">普通用户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" placeholder="备注" v-model="userInfo.remark" class="form-input"/>
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
import {ElMessage} from "element-plus";

const emits = defineEmits(['refreshDataList'])
const userFormTitle = ref('')
const visible = ref(false)
const userInfo = reactive({
  userId: null,
  userName: '',
  nikeName: '',
  sex: '',
  userType: 'Y',
  deptId: '',
  phone: '',
  email: '',
  password: '',

  remark: ''
})

//提交表单
function submitConfigHandler() {
  if (userInfo.roleId) {
    updateConfig(userInfo).then(res => {
      ElMessage.success('修改成功')
      visible.value = false
      emits('refreshDataList')
    })
  } else {
    addConfig(userInfo).then(res => {
      ElMessage.success('新增成功')
      visible.value = false
      emits('refreshDataList')
    })
  }
}

//清空表单
function clearForm() {
  userInfo.roleId = null
  userInfo.userName = ''
  userInfo.nikeName = ''
  userInfo.sex = ''
  userInfo.userType = 'Y'
  userInfo.remark = ''
}

function init(configId) {
  //清空表单
  clearForm()

  visible.value = true

  if (configId) {
    userFormTitle.value = '修改参数'
    getConfig(configId).then(res => {
      const config = res.data
      userInfo.roleId = configId
      userInfo.userName = config.configName
      userInfo.nikeName = config.configKey
      userInfo.sex = config.configValue
      userInfo.userType = config.configType
      userInfo.remark = config.remark
    })
  } else {
    userFormTitle.value = '新增参数'
  }
}

// 暴露初始化函数
defineExpose({
  init
})

</script>
<style scoped>

</style>