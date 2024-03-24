<template>
  <el-card>
    <div class="search">
      <span><el-input class="s-search-input" placeholder="角色名称" v-model="queryRole.roleName" /></span>
      <span>
        <stitch-select class="s-search-input" v-model="queryRole.status" dict-type="role_status" placeholder="状态" />
      </span>
      <span>
        <el-button type="primary" @click="queryRoleList">搜索</el-button>
        <el-button type="default" @click="resetQueryCondition">重置</el-button>
        <el-button v-auth="'sys:role:create'" type="primary" text bg @click="createRoleHandler">新增</el-button>
        <el-button v-auth="'sys:role:delete'" type="danger" text bg :disabled="selectedRoles.length === 0"
          @click="deleteBatchRoleHandler">批量删除</el-button>
        <el-button v-auth="'sys:role:export'" type="info" text bg @click="exportExcelHandler">导出Excel</el-button>
      </span>
    </div>
    <el-table :data="roleList" :row-key="(record) => record.roleId" :default-expand-all="false" :indent="8" border
      :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectRoleHandler">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" fixed="left" align="center" />
      <el-table-column label="角色编码" prop="roleKey" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="状态" prop="status" width="90" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status === '0'">正常</el-tag>
          <el-tag v-else-if="scope.row.status === '1'" type="warning">停用</el-tag>
          <el-tag v-else type="danger">未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="roleSort" :show-overflow-tooltip="true" width="80" align="center" />
      <el-table-column prop="createTime" label="创建时间" width="200" :show-overflow-tooltip="true" align="center" />
      <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="操作" width="180" min-width="160" fixed="right" align="center">
        <template #default="scope">
          <el-button v-auth="'sys:role:update'" type="primary" link
            @click="updateRoleHandler(scope.row.roleId)">修改</el-button>
          <el-button v-auth="'sys:role:delete'" type="danger" link
            @click="deleteRoleHandler(scope.row.roleId)">删除</el-button>
          <el-button type="primary" link>
            <el-dropdown>
              <el-button type="primary" link style="outline: 0 !important;">更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <span v-auth="'sys:role:dataScope'">
                    <el-dropdown-item @click="allocatedDataAuthority(scope.row.roleId, scope.row.roleName)">数据权限
                    </el-dropdown-item>
                  </span>
                  <span v-auth="'sys:role:allocatedUser'">
                    <el-dropdown-item @click="allocatedUsers(scope.row.roleId, scope.row.roleName)">分配用户
                    </el-dropdown-item>
                  </span>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="queryRole.pageNum" v-model:page-size="queryRole.pageSize"
      :page-sizes="[5, 10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="queryRole.total"
      @size-change="queryRoleList" @current-change="queryRoleList" class="table-pagination" />
    <data-scope-drawer ref="dataScopeDrawerRef" />
    <allocate-user-drawer ref="allocatedUserDrawerRef" />
    <role-form ref="roleFormRef" @refresh-data-list="queryRoleList" />
  </el-card>
</template>
<script>
export default {
  name: 'role'
}
</script>
<script setup>

import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { deleteBatchSysRoles, selectSysRoleList } from "@/api/perms/role.js";
import { download } from "@/api/download.js";
import RoleForm from "@/views/perms/role/role-form.vue";
import '@/assets/css/table/table.css'
import DataScopeDrawer from "@/views/perms/role/data-scope-drawer.vue";
import AllocateUserDrawer from "@/views/perms/role/allocate-user-drawer.vue";
import StitchSelect from "@/components/Dict/stitch-select.vue";

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
      ElMessage.success('删除成功')
      queryRoleList()
    })
  })
}

//导出角色信息
function exportExcelHandler() {
  download('/sys/role/export', { ...queryRole }, `role_${new Date().getTime()}.xlsx`)
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
      }
    })
  })
}

// 分配数据权限
function allocatedDataAuthority(roleId, roleName) {
  dataScopeDrawerRef.value.initDrawer(roleId, roleName)
}

// 为角色分配用户
function allocatedUsers(roleId, roleName) {
  allocatedUserDrawerRef.value.initDrawer(roleId, roleName)
}

function queryRoleList() {
  selectSysRoleList(queryRole).then(res => {
    roleList.value = res.list
    queryRole.total = res.total
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
<style scoped></style>