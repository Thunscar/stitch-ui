<template>
  <div>
    <div class="search">
      <span><el-input class="s-search-input" placeholder="角色名称" v-model="queryRole.roleName"/></span>
      <span>
        <el-select class="s-search-input" placeholder="状态" v-model="queryRole.status">
          <el-option value="0" label="正常"/>
          <el-option value="1" label="停用"/>
        </el-select>
      </span>
      <span style="position: relative;right: 0">
        <el-button type="primary" @click="queryRoleList">搜索</el-button>
        <el-button type="default" @click="resetQueryCondition">重置</el-button>
      </span>
    </div>
    <div class="operation">
      <el-button type="primary" size="default" @click="createRoleHandler">新增</el-button>
      <el-button type="danger" size="default" :disabled="selectedRoles.length === 0"
                 @click="deleteBatchRoleHandler">批量删除
      </el-button>
      <el-button type="info" size="default" @click="exportExcelHandler">导出Excel</el-button>
    </div>
    <div class="table">
      <el-table :data="roleList"
                :row-key="(record) => record.roleId"
                max-height="64vh"
                :default-expand-all="false"
                :indent="8"
                border
                :header-cell-style="{'text-align':'center'}"
                @selection-change="selectRoleHandler"
                class="table-content">
        <el-table-column type="selection" width="50" align="center"/>
        <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" fixed="left" width="200"
                         align="center"/>
        <el-table-column label="权限标识符" prop="roleKey" :show-overflow-tooltip="true" width="200" align="center"/>
        <el-table-column label="状态" prop="status" width="80" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === '0'">正常</el-tag>
            <el-tag v-else-if="scope.row.status === '1'" type="warning">停用</el-tag>
            <el-tag v-else type="danger">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="roleSort" :show-overflow-tooltip="true" width="80" align="center"/>
        <el-table-column prop="createTime" label="创建时间" width="200" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="remark" label="备注" width="200" :show-overflow-tooltip="true" align="center"/>
        <el-table-column label="操作" min-width="160" fixed="right" align="center">
          <template #default="scope">
            <el-button type="primary" size="default" link @click="updateRoleHandler(scope.row.roleId)">修改</el-button>
            <el-button type="danger" size="default" link @click="deleteRoleHandler(scope.row.roleId)">删除</el-button>
            <el-button type="primary" size="default" link>
              <el-dropdown>
                <el-button type="primary" size="default" link>更多</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="allocatedDataAuthority(scope.row.roleId)">数据权限</el-dropdown-item>
                    <el-dropdown-item @click="allocatedUsers(scope.row.roleId,scope.row.roleName)">分配用户
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          v-model:current-page="queryRole.pageNum"
          v-model:page-size="queryRole.pageSize"
          :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryRole.total"
          @size-change="queryRoleList"
          @current-change="queryRoleList"
          class="table-pagination"
      />
    </div>
    <data-scope-drawer ref="dataScopeDrawerRef"/>
    <allocated-user-drawer ref="allocatedUserDrawerRef"/>
    <role-form ref="roleFormRef" @refresh-data-list="queryRoleList"/>
  </div>
</template>
<script setup>

import {onMounted, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {deleteBatchSysRoles, selectSysRoleList} from "@/api/perms/role.js";
import RoleForm from "@/views/perms/role/role-form.vue";
import '@/assets/css/table/table.css'
import DataScopeDrawer from "@/views/perms/role/data-scope-drawer.vue";
import AllocatedUserDrawer from "@/views/perms/role/allocated-user-drawer.vue";

const dataScopeDrawerRef = ref(false)
const allocatedUserDrawerRef = ref(false)
const roleFormRef = ref()
const roleList = ref([])
const selectedRoles = ref([])
const queryRole = reactive({
  roleName: '',
  status: '',
  pageNum: 1,
  pageSize: 10,
  total: 0
})

//新增角色
function createRoleHandler() {
  roleFormRef.value.init()
}

//勾选事件
function selectRoleHandler(rows) {
  selectedRoles.value = rows.map(row => row.roleId)
}

//批量删除角色信息
function deleteBatchRoleHandler() {
  ElMessageBox.confirm('确认删除选中的角色?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteBatchSysRoles(selectedRoles.value).then(res => {
      if (res.code === 200) {
        ElMessage.success('删除成功')
        queryRoleList()
      } else {
        ElMessage.error(res.msg)
      }
    })
  })
}

//导出角色信息
function exportExcelHandler() {
  download('/sys/role/export', {...queryRole}, `role_${new Date().getTime()}.xlsx`)
}

//更新角色信息
function updateRoleHandler(roleId) {
  roleFormRef.value.init(roleId)
}

//删除角色
function deleteRoleHandler(userId) {
  ElMessageBox.confirm('确认删除该角色?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteBatchSysRoles(userId).then(res => {
      if (res.code === 200) {
        ElMessage.success('删除成功')
        queryRoleList()
      } else {
        ElMessage.error(res.msg)
      }
    })
  })
}

// 分配数据权限
function allocatedDataAuthority(userId) {

}

// 为角色分配用户
function allocatedUsers(roleId, roleName) {
  allocatedUserDrawerRef.value.initDrawer(roleId, roleName)
}

function queryRoleList() {
  selectSysRoleList(queryRole).then(res => {
    if (res.code === 200 && res.list) {
      roleList.value = res.list
      queryRole.total = res.total
    } else {
      ElMessage.error(res.msg)
    }
  })
}

function resetQueryCondition() {
  queryRole.roleName = ''
  queryRole.status = ''
  queryRole.pageNum = 1
  queryRole.pageSize = 10
  queryRole.total = 0
  queryRoleList()
}


onMounted(() => {
  queryRoleList()
})

</script>
<style scoped>
</style>