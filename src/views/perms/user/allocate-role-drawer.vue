<template>
  <el-drawer v-model="visible" :close-on-click-modal="false" size="60%" :title="title" @closed="clearDrawer"
             destroy-on-close>
    <template #default>
      <div>
        <div class="search">
          <el-input class="s-search-input" placeholder="角色名" v-model="queryRole.roleName"/>
          <el-select class="s-search-input" @change="onAllocateStatusChange" placeholder="分配状态"
                     v-model="allocateStatus">
            <el-option :value="0" label="已分配"/>
            <el-option :value="1" label="未分配"/>
          </el-select>
          <el-button type="primary" @click="queryRoleList">搜索</el-button>
          <el-button type="default" @click="resetQueryCondition">重置</el-button>
          <el-button type="primary" text bg v-if="allocateStatus === 1"
                     :disabled="allocateStatus === 0 || selectRoles.length === 0" @click="allocateBatchRoles">分配角色
          </el-button>
          <el-button type="success" text bg v-if="allocateStatus === 0"
                     :disabled="allocateStatus === 1 || selectRoles.length === 0"
                     @click="cancelAllocateBatchRoles">取消分配
          </el-button>
        </div>
        <div class="table">
          <el-table :data="roleList" :row-key="(record) => record.roleId" max-height="64vh" :default-expand-all="false"
                    :indent="8" border :header-cell-style="{ 'text-align': 'center' }"
                    @selection-change="selectRoleHandler"
                    class="table-content" v-loading="tableLoading">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" fixed="left"
                             align="center"/>
            <el-table-column label="角色编码" prop="roleKey" :show-overflow-tooltip="true" align="center"/>
            <el-table-column label="排序" prop="roleSort" :show-overflow-tooltip="true" width="80" align="center"/>
            <el-table-column prop="createTime" label="创建时间" width="200" :show-overflow-tooltip="true"
                             align="center"/>
            <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" align="center"/>
            <el-table-column label="操作" min-width="160" fixed="right" align="center">
              <template #default="scope">
                <el-button type="primary" v-if="allocateStatus === 1" link @click="allocateRole(scope.row.roleId)">分配角色
                </el-button>
                <el-button type="primary" v-else-if="allocateStatus === 0" link
                           @click="cancelAllocateRole(scope.row.roleId)">取消分配
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-model:current-page="queryRole.pageNum" v-model:page-size="queryRole.pageSize"
                         :page-sizes="[5, 10, 20, 50]" layout="total, sizes, prev, pager, next, jumper"
                         :total="queryRole.total"
                         @size-change="queryRoleList" @current-change="queryRoleList" class="table-pagination"/>
        </div>
      </div>
    </template>
  </el-drawer>
</template>
<script setup>

import {reactive, ref} from "vue";
import {allocateRoles, cancelAllocateRoles, getAllocatedRoles, getUnallocatedRoles} from "@/api/perms/user.js";
import {ElMessage, ElMessageBox} from "element-plus";

const visible = ref(false)
const title = ref()
const allocateStatus = ref(0)
const roleList = ref([])
const selectRoles = ref([])
const queryRole = reactive({
  roleName: '',
  userId: '',
  userName: '',
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const tableLoading = ref(false)


//复选框被选中事件
const selectRoleHandler = (rows) => {
  selectRoles.value = rows.map(row => row.roleId)
}

//是否分配选择框改变事件
const onAllocateStatusChange = () => {
  queryRoleList()
}

//查询分配角色列表
const queryRoleList = () => {
  if (allocateStatus.value === 0) {
    selectAllocatedRoles()
  } else {
    selectUnallocatedRoles()
  }
}

//查询已分配给改用户的角色
const selectAllocatedRoles = () => {
  tableLoading.value = true
  getAllocatedRoles(queryRole).then(res => {
    roleList.value = res.list
    queryRole.total = res.total
  }).finally(() => {
    tableLoading.value = false
  })
}

//查询未分配给改用户的角色
const selectUnallocatedRoles = () => {
  tableLoading.value = true
  getUnallocatedRoles(queryRole).then(res => {
    roleList.value = res.list
    queryRole.total = res.total
  }).finally(() => {
    tableLoading.value = false
  })
}

//清空查询条件并查询
const resetQueryCondition = () => {
  queryRole.roleName = ''
  queryRole.pageNum = 1
  queryRole.pageSize = 10
  queryRole.total = 0
  queryRoleList()
}

//批量分配角色
const allocateBatchRoles = () => {
  ElMessageBox.confirm('确认要将选中的角色分配给用户[' + queryRole.userName + ']?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info'
      }
  ).then(() => {
    const userRole = {
      userId: queryRole.userId,
      roleIds: selectRoles.value.toString()
    }
    allocateRoles(userRole).then(() => {
      ElMessage.success('分配成功')
      queryRoleList()
    })
  })
}

//批量取消分配给用户的角色
const cancelAllocateBatchRoles = () => {
  ElMessageBox.confirm('确认要取消分配给用户选中的角色?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info'
      }
  ).then(() => {
    const userRole = {
      userId: queryRole.userId,
      roleIds: selectRoles.value.toString()
    }
    cancelAllocateRoles(userRole).then(() => {
      ElMessage.success('取消分配成功')
      queryRoleList()
    })
  })
}

//分配给用户角色
const allocateRole = (roleId) => {
  ElMessageBox.confirm('确认要将该角色分配给用户[' + queryRole.userName + ']?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info'
      }
  ).then(() => {
    const userRole = {
      userId: queryRole.userId,
      roleIds: roleId
    }
    allocateRoles(userRole).then(() => {
      ElMessage.success('分配成功')
      queryRoleList()
    })
  })
}

//取消分配给用户的角色
const cancelAllocateRole = (roleId) => {
  ElMessageBox.confirm('确认要取消用户分配的该角色?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info'
      }
  ).then(() => {
    const userRole = {
      userId: queryRole.userId,
      roleIds: roleId
    }
    cancelAllocateRoles(userRole).then(() => {
      ElMessage.success('取消分配成功')
      queryRoleList()
    })
  })
}

//初始化drawer
const initDrawer = (userId, userName) => {
  //清空drawer
  allocateStatus.value = 0

  //设置title并展示
  title.value = '分配角色 - ' + userName
  visible.value = true

  queryRole.userId = userId
  queryRole.userName = userName

  //查询查询角色列表
  queryRoleList()
}

const clearDrawer = () => {
  queryRole.roleName = ''
  queryRole.userId = ''
  queryRole.userName = ''
  queryRole.pageNum = 1
  queryRole.pageSize = 10
  queryRole.total = 0
}

defineExpose({
  initDrawer
})

</script>
<style scoped></style>