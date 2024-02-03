<template>
  <el-drawer v-model="visible"
             :close-on-click-modal="false"
             size="60%"
             :title="title"
             destroy-on-close>
    <template #default>
      <div>
        <div class="search">
          <span><el-input class="s-search-input" placeholder="角色名" v-model="queryRole.roleName"/></span>
          <span>
            <el-select class="s-search-input" @change="conferStatusChange" placeholder="授予状态"
                       v-model="conferStatus">
              <el-option :value="0" label="已授予"/>
              <el-option :value="1" label="未授予"/>
            </el-select>
          </span>
          <span>
            <el-button type="primary" @click="queryRoleList">搜索</el-button>
            <el-button type="default" @click="resetQueryCondition">重置</el-button>
          </span>
          <span>
            <el-button type="primary" text bg v-if="conferStatus === 1"
                       :disabled="conferStatus === 0 || selectRoles.length === 0"
                       @click="conferBatchUser">授予用户
          </el-button>
          </span>
          <span>
            <el-button type="success" text bg v-if="conferStatus === 0"
                       :disabled="conferStatus === 1 || selectRoles.length === 0"
                       @click="cancelBatchConferRole">取消授予
            </el-button>
          </span>
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
            <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" fixed="left"
                             align="center"/>
            <el-table-column label="角色编码" prop="roleKey" :show-overflow-tooltip="true" align="center"/>
            <el-table-column label="状态" prop="status" width="90" align="center">
              <template #default="scope">
                <el-tag v-if="scope.row.status === '0'">正常</el-tag>
                <el-tag v-else-if="scope.row.status === '1'" type="warning">停用</el-tag>
                <el-tag v-else type="danger">未知</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="排序" prop="roleSort" :show-overflow-tooltip="true" width="80" align="center"/>
            <el-table-column prop="createTime" label="创建时间" width="200" :show-overflow-tooltip="true"
                             align="center"/>
            <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" align="center"/>
            <el-table-column label="操作" min-width="160" fixed="right" align="center">
              <template #default="scope">
                <el-button type="primary" v-if="conferStatus === 1" link
                           @click="conferRole(scope.row.roleId)">授予角色
                </el-button>
                <el-button type="primary" v-else-if="conferStatus === 0" link
                           @click="cancelConferRole(scope.row.roleId)">取消授予
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
      </div>
    </template>
  </el-drawer>
</template>
<script setup>

import {reactive, ref} from "vue";
import {getAllocatedRoles, getUnallocatedRoles} from "@/api/perms/user.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {conferRoles} from "@/api/perms/role.js";

const visible = ref(false)
const title = ref()
const conferStatus = ref(0)
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


//复选框被选中事件
const selectRoleHandler = (rows) => {
  selectRoles.value = rows.map(row => row.roleId)
}

//是否授予选择框改变事件
const conferStatusChange = () => {
  queryRoleList()
}

const queryRoleList = () => {
  if (conferStatus.value === 0) {
    selectAllocatedRoles()
  } else {
    selectUnallocatedRoles()
  }
}

const selectAllocatedRoles = () => {
  getAllocatedRoles(queryRole).then(res => {
    roleList.value = res.list
    queryRole.total = res.total
  }).catch(() => {
  })
}

const selectUnallocatedRoles = () => {
  getUnallocatedRoles(queryRole).then(res => {
    roleList.value = res.list
  }).catch(() => {
  })
}

const resetQueryCondition = () => {
  queryRole.roleName = ''
  queryRole.pageNum = 1
  queryRole.pageSize = 10
  queryRole.total = 0
  queryRoleList()
}

const conferBatchUser = () => {
  ElMessageBox.confirm('确认要将选中的角色授予用户[' + queryRole.userName + ']?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info'
      }
  ).then(() => {
    const userRole = {
      roleId: queryUser.roleId,
      userIds: selectedUsers.value
    }
    conferRoles(userRole).then(() => {
      ElMessage.success('授予成功')
      queryUserList()
    })
  }).catch(() => {
  })
}

const cancelBatchConferRole = () => {

}

const conferRole = (roleId) => {

}

const cancelConferRole = (roleId) => {

}

function initDrawer(userId, userName) {

  title.value = '分配角色 - ' + userName
  visible.value = true

  queryRole.userId = userId
  queryRole.userName = userName


}

defineExpose({
  initDrawer
})

</script>
<style scoped>

</style>