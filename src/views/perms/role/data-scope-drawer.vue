<template>
  <el-drawer v-model="visible"
             :close-on-click-modal="false"
             size="400"
             :title="title"
             destroy-on-close>
    <template #default>
      <div>
        <el-form :model="roleInfo" label-width="100" inline>
          <el-form-item label="数据范围">
            <el-select v-model="roleInfo.dataScope">
              <el-option value="0" label="全部数据权限"></el-option>
              <el-option value="1" label="自定义数据权限"></el-option>
              <el-option value="2" label="本部门数据权限"></el-option>
              <el-option value="3" label="本部门及子部门数据权限"></el-option>
              <el-option value="4" label="本人数据权限"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="roleInfo.dataScope === '1'" label="数据权限">
            <el-tree
                ref="deptTreeComponent"
                @check-change="checkChangeHandler"
                :data="deptTreeData"
                :props="defaultProps"
                :default-checked-keys="roleInfo.deptIds"
                :default-expanded-keys="roleInfo.deptIds"
                node-key="value"
                show-checkbox
                :check-strictly="true"
            />
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup>
import {reactive, ref} from "vue";
import {selectDataScope, updateDataScope} from "@/api/perms/role.js";
import {getDeptList} from "@/api/system/dept.js";
import {initSelectTree} from "@/utils/tree.js";
import {ElMessage} from "element-plus";

const deptTreeComponent = ref()
const visible = ref(false)
const title = ref()
const drawerInfo = reactive({
  roleId: '',
  roleName: ''
})
const roleInfo = reactive({
  roleId: '',
  dataScope: '',
  deptIds: []
})
const defaultProps = {
  children: 'children',
  label: 'label',
}
const deptTreeData = ref([])


function cancelClick() {
  visible.value = false
}

function confirmClick() {
  updateDataScope(roleInfo).then(() => {
    ElMessage.success('操作成功')
    visible.value = false
  })
}

function checkChangeHandler() {
  roleInfo.deptIds = deptTreeComponent.value.getCheckedKeys()
}

function initSysRoleInfo() {
  selectDataScope(drawerInfo.roleId).then(res => {
    const role = res.data
    roleInfo.roleId = role.roleId
    roleInfo.dataScope = role.dataScope
    roleInfo.deptIds = role.deptIds
  })
}

function initDeptTreeData() {
  getDeptList().then(res => {
    deptTreeData.value = initSelectTree(res.data, 'deptId', 'deptName')
  })
}

function initDrawer(roleId, roleName) {
  title.value = '数据权限 - ' + roleName
  visible.value = true
  drawerInfo.roleId = roleId
  drawerInfo.roleName = roleName

  initSysRoleInfo()
  initDeptTreeData()
}

defineExpose({
  initDrawer
})
</script>
<style scoped>
</style>