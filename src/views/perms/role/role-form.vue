<template>
  <el-dialog v-model="visible"
             :title="roleFormTitle"
             width="600">
    <el-form :model="roleInfo" label-width="100" inline>
      <el-form-item label="角色名称" :required="true">
        <el-input placeholder="角色名称" v-model="roleInfo.roleName" class="form-input"/>
      </el-form-item>
      <el-form-item label="权限标识符" :required="true">
        <el-input placeholder="权限标识符" v-model="roleInfo.roleKey" class="form-input"/>
      </el-form-item>
      <el-form-item label="排序" :required="true">
        <el-input type="number" :min="0" :max="999" placeholder="排序" v-model="roleInfo.roleSort"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="roleInfo.status" style="width: 220px">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="功能权限">
        <el-tree
            ref="menuTreeComponent"
            @check-change="checkChangeHandler"
            :data="selectMenuData"
            :props="defaultProps"
            :default-checked-keys="roleInfo.menuIds"
            node-key="value"
            show-checkbox
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" placeholder="备注" v-model="roleInfo.remark" class="form-input"/>
      </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="submitRoleHandler">确认</el-button>
        </span>
    </template>
  </el-dialog>
</template>
<script setup>
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import '@/assets/css/form/form.css'
import {insertSysRole, selectAuthorizedMenu, selectSysRoleById, updateSysRole} from "@/api/perms/role.js";
import {getMenuList} from "@/api/system/menu.js";
import {initSelectTree} from "@/utils/tree.js";

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

//提交表单
function submitRoleHandler() {
  if (roleInfo.roleId) {
    updateSysRole(roleInfo).then(res => {
      ElMessage.success('修改成功')
      visible.value = false
      emits('refreshDataList')
    })
  } else {
    insertSysRole(roleInfo).then(res => {
      ElMessage.success('新增成功')
      visible.value = false
      emits('refreshDataList')
    })
  }
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
function initSelectMenuData() {
  getMenuList().then(res => {
    if (res.code === 200 && res.data) {
      selectMenuData.value = initSelectTree(res.data, 'menuId', 'menuName')
    }
  })
}

function checkChangeHandler() {
  roleInfo.menuIds = menuTreeComponent.value.getCheckedKeys()
}

function init(roleId) {
  //清空表单
  clearForm()

  visible.value = true

  if (roleId) {
    roleFormTitle.value = '修改角色'
    selectSysRoleById(roleId).then(res => {
      const role = res.data
      roleInfo.roleId = roleId
      roleInfo.roleName = role.roleName
      roleInfo.roleKey = role.roleKey
      roleInfo.status = role.status
      roleInfo.remark = role.remark
      selectAuthorizedMenu(roleId).then(res => {
        roleInfo.menuIds = res.data
      })
    })
  } else {
    roleFormTitle.value = '新增角色'
  }

  //加载菜单树形选择框
  initSelectMenuData()
}

// 暴露初始化函数
defineExpose({
  init
})

</script>
<style scoped>

</style>