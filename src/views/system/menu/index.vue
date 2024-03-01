<template>
  <el-card>
    <div class="search">
      <span><el-input class="s-search-input" placeholder="菜单名称" v-model="queryMenu.menuName"/></span>
      <span>
        <el-select class="s-search-input" placeholder="是否可见" v-model="queryMenu.visible">
          <el-option value="1" label="可见"/>
          <el-option value="0" label="不可见"/>
        </el-select>
      </span>
      <span>
        <stitch-select class="s-search-input" v-model="queryMenu.status" dict-type="menu_status" placeholder="状态"/>
      </span>
      <span>
        <el-button type="primary" @click="queryMenuDataList">搜索</el-button>
        <el-button type="default" @click="resetQueryCondition">重置</el-button>
        <el-button type="primary" text bg @click="createMenuHandler">新增</el-button>
        <el-button type="info" text bg @click="expandAllHandler">展开/折叠</el-button>
      </span>
    </div>
    <el-table :data="menuTreeData"
              :row-key="(record) => record.menuId"
              v-model:expand-row-keys="expandColumns"
              :default-expand-all="false"
              :indent="8"
              border
              :header-cell-style="{'text-align':'center'}">
      <el-table-column prop="menuName" label="菜单名称" width="120" :show-overflow-tooltip="true"/>
      <el-table-column prop="menuType" label="类型" width="90" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.menuType === 'M'">菜单</el-tag>
          <el-tag v-else-if="scope.row.menuType === 'B'" type="warning">按钮</el-tag>
          <el-tag v-else type="danger">未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路由地址" :show-overflow-tooltip="true" align="center"/>
      <el-table-column prop="component" label="组件地址" :show-overflow-tooltip="true" align="center"/>
      <el-table-column prop="orderNum" label="排序" width="90" :show-overflow-tooltip="true" align="center"/>
      <el-table-column prop="icon" label="图标" width="85" align="center">
        <template #default="scope">
          <svg-icon :icon-class="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column prop="visible" label="是否可见" width="90" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.visible === '1'">可见</el-tag>
          <el-tag v-else-if="scope.row.visible === '0'" type="warning">不可见</el-tag>
          <el-tag v-else type="danger">未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isCache" label="是否缓存" width="90" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.isCache === '1'">缓存</el-tag>
          <el-tag v-else-if="scope.row.isCache === '0'" type="warning">不缓存</el-tag>
          <el-tag v-else type="danger">未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isFrame" label="是否外链" width="100" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.isFrame === '0'">非外链</el-tag>
          <el-tag v-else-if="scope.row.isFrame === '1'" type="warning">外链</el-tag>
          <el-tag v-else type="danger">未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="90" align="center">
        <template #default="scope">
          <stitch-tag :tag-value="scope.row.status" dict-type="menu_status"/>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="操作" width="120" min-width="120" fixed="right" align="center">
        <template #default="scope">
          <el-button type="primary" link @click="updateMenuHandler(scope.row.menuId)">修改</el-button>
          <el-button type="danger" link @click="deleteMenu(scope.row.menuId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <menu-form ref="menuFormRef" @refresh-data-list="queryMenuDataList"/>
  </el-card>
</template>
<script>
export default {
  name: 'menus'
}
</script>
<script setup>
import {onActivated, onMounted, onUnmounted, reactive, ref} from "vue";
import {deleteSysMenu, getMenuList} from "@/api/system/menu.js";
import {initTreeData} from "@/utils/tree.js";
import '@/assets/css/table/table.css'
import MenuForm from "@/views/system/menu/menu-form.vue";
import {ElMessage, ElMessageBox} from "element-plus";
import SvgIcon from "@/components/Icon/SvgIcon.vue";
import StitchSelect from "@/components/Dict/stitch-select.vue";
import StitchTag from "@/components/Dict/stitch-tag.vue";

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
  })
}

onMounted(() => {
  queryMenuDataList()
})

</script>
<style scoped>
</style>