<template>
  <div>
    <div class="search">
      <span><el-input class="s-search-input" placeholder="菜单名称" v-model="queryMenu.menuName"/></span>
      <span>
        <el-select class="s-search-input" placeholder="是否可见" v-model="queryMenu.visible">
          <el-option value="1" label="可见"/>
          <el-option value="0" label="不可见"/>
        </el-select>
      </span>
      <span>
        <el-select class="s-search-input" placeholder="状态" v-model="queryMenu.status">
          <el-option value="0" label="正常"/>
          <el-option value="1" label="停用"/>
        </el-select>
      </span>
      <span style="position: relative;right: 0">
        <el-button type="primary" @click="queryMenuDataList">搜索</el-button>
        <el-button type="default" @click="resetQueryCondition">重置</el-button>
        <el-button type="primary" text bg @click="createMenuHandler">新增</el-button>
      <el-button type="info" text bg @click="expandAllHandler">展开/折叠</el-button>
      </span>
    </div>
    <div class="table">
      <el-table :data="menuTreeData"
                :row-key="(record) => record.menuId"
                v-model:expand-row-keys="expandColumns"
                max-height="70vh"
                :default-expand-all="false"
                :indent="8"
                border
                :header-cell-style="{'text-align':'center'}">
        <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true"/>
        <el-table-column prop="menuType" label="菜单类型" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.menuType === 'M'">菜单</el-tag>
            <el-tag v-else-if="scope.row.menuType === 'B'" type="warning">按钮</el-tag>
            <el-tag v-else type="danger">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由地址" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="component" label="组件地址" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="orderNum" label="菜单排序" width="90" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="icon" label="菜单图标" width="85" align="center">
          <template #default="scope">
            <svg-icon :icon-class="scope.row.icon"/>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="创建人员" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="visible" label="是否可见" width="85" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.visible === '1'">可见</el-tag>
            <el-tag v-else-if="scope.row.visible === '0'" type="warning">不可见</el-tag>
            <el-tag v-else type="danger">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === '0'">正常</el-tag>
            <el-tag v-else-if="scope.row.status === '1'" type="warning">停用</el-tag>
            <el-tag v-else type="danger">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" min-width="120" fixed="right" align="center">
          <template #default="scope">
            <el-button type="primary" link @click="updateMenuHandler(scope.row.menuId)">修改</el-button>
            <el-button type="danger" link @click="deleteMenu(scope.row.menuId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <menu-form ref="menuFormRef" @refresh-data-list="queryMenuDataList"/>
  </div>
</template>
<script setup>
import {onMounted, reactive, ref} from "vue";
import {deleteSysMenu, getMenuList} from "@/api/system/menu.js";
import {initTreeData} from "@/utils/tree.js";
import '@/assets/css/table/table.css'
import MenuForm from "@/views/system/menu/menu-form.vue";
import {ElMessage, ElMessageBox} from "element-plus";
import SvgIcon from "@/components/Icon/SvgIcon.vue";

const menuTreeData = ref([])
const menuListData = ref([])
const expandColumns = ref([])
const queryMenu = reactive({
  menuName: '',
  visible: '',
  status: ''
})
const menuFormRef = ref()

//展开或折叠事件
function expandAllHandler() {
  if (expandColumns.value.length === 0) {
    //展开
    for (let i = 0; i < menuListData.value.length; i++) {
      expandColumns.value.push(menuListData.value[i].menuId.toString())
    }
  } else {
    //收缩
    expandColumns.value = []
  }
}

//清空查询条件
function resetQueryCondition() {
  queryMenu.menuName = ''
  queryMenu.visible = ''
  queryMenu.status = ''
  queryMenuDataList()
}

// 查询菜单列表
function queryMenuDataList() {
  getMenuList(queryMenu).then(res => {
    menuTreeData.value = initTreeData(res.data, 'menuId')
    menuListData.value = res.data
  })
}

//新增菜单
function createMenuHandler() {
  menuFormRef.value.init()
}

//修改菜单
function updateMenuHandler(menuId) {
  menuFormRef.value.init(menuId)
}

//删除菜单
function deleteMenu(menuId) {
  ElMessageBox.confirm('确认删除该菜单?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(() => {
    deleteSysMenu(menuId).then(res => {
      ElMessage.success('删除成功')
      queryMenuDataList()
    })
  }).catch(() => {
  })
}

onMounted(() => {
  queryMenuDataList()
})
</script>
<style scoped>
</style>