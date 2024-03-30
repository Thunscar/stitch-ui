<template>
  <el-dialog v-model="visible" :title="roleFormTitle" width="620" @close="closeForm">
    <el-form :model="roleInfo" ref="roleFormRef" :rules="checkRules" label-width="100" v-loading="loading">
      <el-form-item label="角色名称" prop="roleName">
        <el-input placeholder="角色名称" v-model="roleInfo.roleName" class="form-input"/>
      </el-form-item>
      <el-form-item label="角色编码" prop="roleKey">
        <el-input placeholder="角色编码" v-model="roleInfo.roleKey" class="form-input"/>
      </el-form-item>
      <el-form-item label="排序" prop="roleSort">
        <el-input type="number" :min="0" :max="999" placeholder="排序" v-model="roleInfo.roleSort" class="sort-input"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <stitch-radio-group v-model="roleInfo.status" dict-type="role_status"/>
      </el-form-item>
      <el-form-item label="功能权限">
        <el-tree ref="menuTreeComponent" :data="selectMenuData" :props="defaultProps" node-key="value" show-checkbox
                 v-loading="dataLoading"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" placeholder="备注" v-model="roleInfo.remark" class="form-input"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeForm">取消</el-button>
        <el-button type="primary" @click="submitRoleHandler">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import '@/assets/css/form/form.css'
import {insertSysRole, selectAuthMenu, updateSysRole} from "@/api/perms/role.js";
import {getMenuList} from "@/api/system/menu.js";
import {initSelectTree} from "@/utils/tree.js";
import StitchRadioGroup from "@/components/Dict/stitch-radio-group.vue";

const emits = defineEmits(['refreshDataList'])
const roleFormTitle = ref('')
const visible = ref(false)
const selectMenuData = ref()
const defaultProps = {
  children: 'children',
  label: 'label',
}
const menuTreeComponent = ref()
const roleInfo = reactive({
  roleId: null,
  roleName: '',
  roleKey: '',
  roleSort: '0',
  menuIds: [],
  status: '0',
  remark: ''
})
const roleFormRef = ref()
const checkRules = ref({
  roleName: {
    required: true,
    message: '角色名称不可为空',
    trigger: 'blur'
  },
  roleKey: {
    required: true,
    message: '角色编码不可为空',
    trigger: 'blur'
  }
})
const loading = ref(false)
const dataLoading = ref(false)

//提交表单
function submitRoleHandler() {
  roleFormRef.value.validate((valid) => {
    if (valid) {
      const checkMenus = []
      checkMenus.unshift(...menuTreeComponent.value.getHalfCheckedKeys())
      checkMenus.unshift(...menuTreeComponent.value.getCheckedKeys())
      roleInfo.menuIds = checkMenus
      if (roleInfo.roleId) {
        updateSysRole(roleInfo).then(res => {
          ElMessage.success('修改成功')
          closeForm()
          emits('refreshDataList')
        })
      } else {
        insertSysRole(roleInfo).then(res => {
          ElMessage.success('新增成功')
          closeForm()
          emits('refreshDataList')
        })
      }
    }
  })
}

//重置并清空表单
function closeForm() {
  visible.value = false
  roleFormRef.value.resetFields()
  clearForm()
}

//清空表单
function clearForm() {
  roleInfo.roleId = null
  roleInfo.roleName = ''
  roleInfo.roleKey = ''
  roleInfo.roleSort = '0'
  roleInfo.status = '0'
  roleInfo.menuIds = []
  roleInfo.remark = ''
}

//初始化菜单树选择框
function initSelectMenuData(roleId) {
  loading.value = true
  getMenuList().then(res => {
    selectMenuData.value = initSelectTree(res.data, 'menuId', 'menuName')
    if (roleId) {
      selectAuthMenu(roleId).then(res => {
        const role = res.data
        Object.assign(roleInfo, role)
        //设置菜单权限树已选中的节点
        role.menuIds.forEach(item => menuTreeComponent.value.setChecked(item, true))
      }).finally(() => {
        loading.value = false
      })
    }
  })
}

function init(roleId) {
  //清空表单
  clearForm()
  visible.value = true

  if (roleId) {
    roleFormTitle.value = '修改角色'
  } else {
    roleFormTitle.value = '新增角色'
  }

  //加载菜单树形选择框
  initSelectMenuData(roleId)
}

// 暴露初始化函数
defineExpose({
  init
})

</script>
<style scoped></style>