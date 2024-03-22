<template>
  <el-dialog v-model="visible" :title="userFormTitle" @close="closeForm" width="620">
    <el-form :model="userInfo" ref="userFormRef" label-width="100" :rules="checkRules" inline>
      <el-form-item label="用户名" prop="userName">
        <el-input placeholder="用户名" v-model="userInfo.userName" class="form-input" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input placeholder="昵称" v-model="userInfo.nickName" class="form-input" />
      </el-form-item>
      <el-form-item label="密码" v-if="!userInfo.userId" prop="password">
        <el-input placeholder="密码(若为空，则设置为默认密码)" v-model="userInfo.password" class="form-input" />
      </el-form-item>
      <el-form-item label="性别">
        <stitch-radio-group v-model="userInfo.sex" dict-type="user_gender" />
      </el-form-item>
      <el-form-item label="所属部门" prop="deptId">
        <el-tree-select placeholder="所属部门" v-model="userInfo.deptId" :data="selectDeptData" check-strictly
          class="select-input" />
      </el-form-item>
      <el-form-item label="角色配置">
        <el-select v-model="userInfo.roleIds" multiple placeholder="角色配置" class="select-input">
          <el-option v-for="item in selectRoleData" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
        </el-select>
      </el-form-item>
      <el-form-item label="岗位配置">
        <el-select v-model="userInfo.postIds" multiple placeholder="岗位配置" class="select-input">
          <el-option v-for="item in selectPostData" :key="item.postId" :label="item.postName" :value="item.postId" />
        </el-select>
      </el-form-item>
      <el-form-item label="电话">
        <el-input placeholder="电话" v-model="userInfo.phone" class="form-input" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input placeholder="邮箱" v-model="userInfo.email" class="form-input" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" placeholder="备注" v-model="userInfo.remark" class="form-input" />
      </el-form-item>
      <el-form-item label="状态">
        <stitch-radio-group v-model="userInfo.status" dict-type="user_status" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submitConfigHandler(userFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>

import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { initSelectTree } from "@/utils/tree.js";
import { getSysUserById, insertSysUser, updateSysUser } from "@/api/perms/user.js";
import '@/assets/css/form/form.css'
import StitchRadioGroup from "@/components/Dict/stitch-radio-group.vue";

const emits = defineEmits(['refreshDataList'])
const userFormTitle = ref('')
const visible = ref(false)
const selectDeptData = ref([])
const selectRoleData = ref([])
const selectPostData = ref([])
const userFormRef = ref()
const userInfo = reactive({
  userId: null,
  userName: '',
  nickName: '',
  sex: '0',
  status: '0',
  deptId: '',
  roleIds: [],
  postIds: [],
  phone: '',
  email: '',
  password: '',
  remark: ''
})

const checkRules = ref({
  userName: {
    required: true,
    message: '用户名不可为空',
    trigger: ['blur']
  },
  nickName: {
    required: true,
    message: '昵称不可为空',
    trigger: ['blur']
  },
  deptId: {
    required: true,
    message: '请选择所述部门',
    trigger: ['blur']
  }
})

//提交表单
const submitConfigHandler = (userFormRef) => {
  userFormRef.validate((valid, fields) => {
    if (valid) {
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
  })
}

//清空表单
const clearForm = () => {
  userInfo.userId = null
  userInfo.userName = ''
  userInfo.nickName = ''
  userInfo.sex = '0'
  userInfo.status = '0'
  userInfo.deptId = ''
  userInfo.roleIds = []
  userInfo.postIds = []
  userInfo.phone = ''
  userInfo.email = ''
  userInfo.password = ''
  userInfo.remark = ''
}

//初始化表单
const initFormData = (userId) => {
  userId = userId ? userId : ''
  getSysUserById(userId).then(res => {
    if (res.user) {
      Object.assign(userInfo, res.user)
    }
    //初始化部门树
    selectDeptData.value = initSelectTree(res.depts, 'deptId', 'deptName')
    //初始化角色选择框
    selectRoleData.value = res.roles
    //初始化岗位选择框
    selectPostData.value = res.posts
  })
}

//生成标题
const initFormTitle = (userId) => {
  if (userId) {
    userFormTitle.value = '修改用户'
  } else {
    userFormTitle.value = '新增用户'
  }
}

//关闭表单事件
function closeForm() {
  visible.value = false
  userFormRef.value.resetFields()
  clearForm()
}

//初始化角色选择配置
function init(userId) {
  //清空表单
  clearForm()
  //设置标题
  initFormTitle(userId)
  //初始化表单数据
  initFormData(userId)
  //展示表单
  visible.value = true
}

// 暴露初始化函数
defineExpose({
  init
})

</script>
<style scoped></style>