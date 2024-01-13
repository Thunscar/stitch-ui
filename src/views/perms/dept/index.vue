<template>
  <div>
    <div class="search">
      <span><el-input class="s-search-input" placeholder="部门名称" v-model="queryDept.deptName"/></span>
      <span><el-input class="s-search-input" placeholder="联系人" v-model="queryDept.leader"/></span>
      <span style="position: relative;right: 0">
        <el-button type="primary" @click="queryDeptDataList">搜索</el-button>
        <el-button type="default" @click="resetQueryCondition">重置</el-button>
      </span>
    </div>
    <div class="operation">
      <el-button type="primary" size="default" @click="createDeptHandler">新增</el-button>
      <el-button type="info" size="default" @click="expandAllHandler">展开/折叠</el-button>
    </div>
    <div class="table">
      <el-table :data="deptTreeData"
                :row-key="(record) => record.deptId"
                v-model:expand-row-keys="expandColumns"
                max-height="70vh"
                :default-expand-all="false"
                :indent="8"
                border
                :header-cell-style="{'text-align':'center'}">
        <el-table-column prop="deptName" label="部门名称" width="250" :show-overflow-tooltip="true"/>
        <el-table-column prop="orderNum" label="菜单排序" width="85" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="leader" label="联系人" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="phone" label="联系电话" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="email" label="邮箱" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="createUser" label="创建人" width="120" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="createTime" label="创建时间" width="200" :show-overflow-tooltip="true"/>
        <el-table-column label="操作" width="120" min-width="120" fixed="right" align="center">
          <template #default="scope">
            <el-button type="primary" size="default" link @click="updateDeptHandler(scope.row.deptId)">修改</el-button>
            <el-button type="danger" size="default" link @click="deleteDeptHandler(scope.row.deptId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <dept-form ref="deptFormRef" @refresh-data-list="queryDeptDataList"/>
  </div>
</template>
<script setup>
import '@/assets/css/table/table.css'
import {onMounted, reactive, ref} from "vue";
import {deleteSysDept, getDeptList} from "@/api/system/dept.js";
import {initTreeData} from "@/utils/tree.js";
import {ElMessage, ElMessageBox} from "element-plus";
import DeptForm from "@/views/perms/dept/dept-form.vue";

const deptTreeData = ref([])
const deptListData = ref([])
const expandColumns = ref([])
const queryDept = reactive({
  deptName: '',
  leader: ''
})
const deptFormRef = ref()

//展开或折叠事件
function expandAllHandler() {
  if (expandColumns.value.length === 0) {
    //展开
    for (let i = 0; i < deptListData.value.length; i++) {
      expandColumns.value.push(deptListData.value[i].deptId.toString())
    }
  } else {
    //收缩
    expandColumns.value = []
  }
}

//创建部门
function createDeptHandler() {
  deptFormRef.value.init()
}

//更新部门
function updateDeptHandler(deptId) {
  deptFormRef.value.init(deptId)
}

//删除部门
function deleteDeptHandler(deptId) {
  ElMessageBox.confirm('确认删除该部门?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteSysDept(deptId).then(res => {
      queryDeptDataList()
      ElMessage.success('删除成功')
    })
  }).catch(() => {
  })
}

//重置查询表单
function resetQueryCondition() {
  queryDept.deptName = ''
  queryDept.leader = ''
  queryDeptDataList()
}

//获取部门数据
function queryDeptDataList() {
  getDeptList(queryDept).then(res => {
    deptTreeData.value = initTreeData(res.data, 'deptId')
    deptListData.value = res.data
  })
}

onMounted(() => {
  queryDeptDataList()
})


</script>
<style scoped>
</style>