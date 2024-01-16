<template>
  <el-dialog v-model="visible"
             :title="deptFormTitle"
             width="600"
             @close="closeForm">
    <el-form :model="deptInfo" ref="deptFormRef" :rules="checkRules" label-width="100" inline>
      <el-form-item label="部门名称" prop="deptName">
        <el-input placeholder="部门名称" v-model="deptInfo.deptName" class="form-input"/>
      </el-form-item>
      <el-form-item label="上级部门" prop="parentDept">
        <el-tree-select placeholder="上级部门" v-model="deptInfo.parentId" :data="selectDeptData" check-strictly/>
      </el-form-item>
      <el-form-item label="部门排序">
        <el-input type="number" placeholder="部门排序" v-model="deptInfo.orderNum" :min="0" :max="999"/>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input placeholder="联系人" v-model="deptInfo.leader" class="form-input"/>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input placeholder="联系电话" v-model="deptInfo.phone" class="form-input"/>
      </el-form-item>
      <el-form-item label="联系邮箱">
        <el-input placeholder="联系邮箱" v-model="deptInfo.email" class="form-input"/>
      </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeForm">取消</el-button>
          <el-button type="primary" @click="submitDeptForm">确认</el-button>
        </span>
    </template>
  </el-dialog>
</template>
<script setup>

import {reactive, ref} from "vue";
import '@/assets/css/form/form.css'
import {getDeptList, getSysDeptById, insertSysDept, updateSysDept} from "@/api/system/dept.js";
import {initSelectTree} from "@/utils/tree.js";
import {ElMessage} from "element-plus";

const visible = ref(false)
const deptFormTitle = ref()
const selectDeptData = ref([{
  label: '一级部门',
  value: 0
}])
const deptInfo = reactive({
  deptId: null,
  deptName: '',
  parentId: '',
  orderNum: 1,
  leader: '',
  phone: '',
  email: ''
})
const deptFormRef = ref()
const checkRules = {
  deptName: {
    required: true,
    message: '部门名称不可为空',
    trigger: 'blur'
  },
  parentDept: {
    required: true,
    message: '上级部门不可为空',
    trigger: 'blur'
  }
}
const emits = defineEmits(['refreshDataList'])

//初始化菜单树选择框
function initSelectDeptData() {
  getDeptList().then(res => {
    if (res.code === 200 && res.data) {
      selectDeptData.value[0].children = initSelectTree(res.data, 'deptId', 'deptName')
    }
  })
}

//提交部门表单
function submitDeptForm() {
  deptFormRef.value.validate((valid) => {
    if (valid) {
      if (deptInfo.deptId) {
        //修改
        updateSysDept(deptInfo).then(res => {
          ElMessage.success('修改成功')
          closeForm()
          emits('refreshDataList')
        })
      } else {
        //创建
        insertSysDept(deptInfo).then(res => {
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
  deptFormRef.value.resetFields()
  clearForm()
}

function clearForm() {
  deptInfo.deptId = null
  deptInfo.deptName = ''
  deptInfo.parentId = ''
  deptInfo.orderNum = 1
  deptInfo.leader = ''
  deptInfo.phone = ''
  deptInfo.email = ''
}

function init(deptId) {

  clearForm()
  visible.value = true

  if (deptId) {
    deptFormTitle.value = '修改部门信息'
    getSysDeptById(deptId).then(res => {
      const dept = res.data
      deptInfo.deptId = deptId
      deptInfo.deptName = dept.deptName
      deptInfo.parentId = dept.parentId
      deptInfo.orderNum = dept.orderNum
      deptInfo.leader = dept.leader
      deptInfo.phone = dept.phone
      deptInfo.email = dept.email
    })
  } else {
    deptFormTitle.value = '新增部门'
  }

  initSelectDeptData()
}


defineExpose({
  init
})

</script>
<style scoped>

</style>