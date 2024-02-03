<template>
  <el-dialog v-model="visible"
             :title="userFormTitle"
             width="620">
    <el-form :model="userInfo" label-width="100" inline>
      <el-form-item label="用户名">
        <el-input placeholder="用户名" v-model="userInfo.userName" class="form-input"/>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input placeholder="昵称" v-model="userInfo.nickName" class="form-input"/>
      </el-form-item>
      <el-form-item label="密码" v-if="!userInfo.userId">
        <el-input placeholder="密码(若为空，则设置为默认密码)" v-model="userInfo.password" class="form-input"/>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="userInfo.sex">
          <el-radio label="0">男</el-radio>
          <el-radio label="1">女</el-radio>
          <el-radio label="2">未知</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="userInfo.status">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="所属部门">
        <el-tree-select placeholder="所属部门" v-model="userInfo.deptId" :data="selectDeptData" check-strictly/>
      </el-form-item>
      <el-form-item label="角色配置">
        <el-select
            v-model="userInfo.roleIds"
            multiple
            placeholder="角色配置"
            style="width: 240px">
          <el-option v-for="item in selectRoleData" :key="item.roleId" :label="item.roleName" :value="item.roleId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="电话">
        <el-input placeholder="电话" v-model="userInfo.phone" class="form-input"/>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input placeholder="邮箱" v-model="userInfo.email" class="form-input"/>
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
import {getDeptList} from "@/api/system/dept.js";
import {initSelectTree} from "@/utils/tree.js";
import {getSysUserById, insertSysUser, updateSysUser} from "@/api/perms/user.js";
import '@/assets/css/form/form.css'
import {selectSysRoleList} from "@/api/perms/role.js";

const emits = defineEmits(['refreshDataList'])
const userFormTitle = ref('')
const visible = ref(false)
const selectDeptData = ref([])
const selectRoleData = ref([])
const userInfo = reactive({
  userId: null,
  userName: '',
  nickName: '',
  sex: '0',
  status: '0',
  deptId: '',
  roleIds: [],
  phone: '',
  email: '',
  password: '',
  remark: ''
})

//提交表单
function submitConfigHandler() {
  if (userInfo.userId) {
    updateSysUser(userInfo).then(res => {
      ElMessage.success('修改成功')
      visible.value = false
      emits('refreshDataList')
    })
  } else {
    insertSysUser(userInfo).then(res => {
      ElMessage.success('新增成功')
      visible.value = false
      emits('refreshDataList')
    })
  }
}

//清空表单
function clearForm() {
  userInfo.userId = null
  userInfo.userName = ''
  userInfo.nickName = ''
  userInfo.sex = '0'
  userInfo.status = '0'
  userInfo.deptId = ''
  userInfo.roleIds = []
  userInfo.phone = ''
  userInfo.email = ''
  userInfo.password = ''
  userInfo.remark = ''
}

//初始化部门选择数据
function initSelectDeptData() {
  getDeptList().then(res => {
    selectDeptData.value = initSelectTree(res.data, 'deptId', 'deptName')
  })
}

//初始化角色选择配置
function initSelectRoleData() {
  selectSysRoleList().then(res => {
    selectRoleData.value = res.list
  })
}

function init(userId) {
  //清空表单
  clearForm()

  //初始化部门选择树
  initSelectDeptData()
  //出丝滑角色数据
  initSelectRoleData()

  visible.value = true

  if (userId) {
    userFormTitle.value = '修改用户'
    getSysUserById(userId).then(res => {
      const user = res.data
      userInfo.userId = userId
      userInfo.userName = user.userName
      userInfo.nickName = user.nickName
      userInfo.sex = user.sex
      userInfo.deptId = user.deptId
      userInfo.roleIds = user.roleIds
      userInfo.phone = user.phone
      userInfo.email = user.email
      userInfo.status = user.status
      userInfo.remark = user.remark
    })
  } else {
    userFormTitle.value = '新增用户'
  }
}

// 暴露初始化函数
defineExpose({
  init
})

</script>
<style scoped>

</style>