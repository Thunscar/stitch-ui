<template>
  <el-drawer v-model="visible"
             :close-on-click-modal="false"
             size="900"
             :title="title"
             @closed="clearDrawer"
             destroy-on-close>
    <template #default>
      <el-card>
        <div class="search">
          <span><el-input class="s-search-input" placeholder="字典名称" v-model="queryDictData.dictLabel"/></span>
          <span>
            <el-button type="primary" @click="queryDictDataList">搜索</el-button>
            <el-button type="default" @click="resetQueryCondition">重置</el-button>
            <el-button type="primary" text bg @click="createDictDataHandler">新增</el-button>
          </span>
        </div>
        <el-table :data="dictDataList" :row-key="(record) => record.dictCode" :default-expand-all="false" :indent="8"
                  border :header-cell-style="{ 'text-align': 'center' }">
          <el-table-column label="字典编码" prop="dictCode" :show-overflow-tooltip="true" align="center"/>
          <el-table-column label="字典标签" prop="dictLabel" :show-overflow-tooltip="true" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.cssClass==='primary'?'':scope.row.cssClass">{{ scope.row.dictLabel }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="字典键值" prop="dictValue" :show-overflow-tooltip="true" align="center"/>
          <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" align="center"/>
          <el-table-column label="创建时间" prop="createTime" :show-overflow-tooltip="true" align="center"/>
          <el-table-column label="操作" width="200" min-width="120" fixed="right" align="center">
            <template #default="scope">
              <el-button type="primary" link @click="updateDictDataHandler(scope.row.dictCode)">修改
              </el-button>
              <el-button type="danger" link @click="deleteDictDataHandler(scope.row.dictCode)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="queryDictData.pageNum" v-model:page-size="queryDictData.pageSize"
                       :page-sizes="[5, 10, 20, 50]" layout="total, sizes, prev, pager, next, jumper"
                       :total="queryDictData.total"
                       @size-change="queryDictDataList" @current-change="queryDictDataList" class="table-pagination"/>
      </el-card>
      <dict-data-form ref="dictDataFormRef" @refresh-data-list="queryDictDataList"/>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="closeClick">关闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup>
import {reactive, ref} from "vue";
import {deleteDictData, getDictDataList} from "@/api/system/dict-data.js";
import '@/assets/css/table/table.css'
import DictDataForm from "@/views/system/dict/data/dict-data-form.vue";
import {ElMessage, ElMessageBox} from "element-plus";

const visible = ref(false)
const title = ref()
const dictDataFormRef = ref()
const drawerInfo = reactive({
  dictType: '',
  dictTypeName: ''
})
const queryDictData = reactive({
  dictType: '',
  dictLabel: '',
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const dictDataList = ref([])

//取消按钮点击事件
const closeClick = () => {
  visible.value = false
}

//新增字典数据
const createDictDataHandler = () => {
  dictDataFormRef.value.init(drawerInfo.dictType)
}

//修改字典数据
const updateDictDataHandler = (dictCode) => {
  dictDataFormRef.value.init(drawerInfo.dictType, dictCode)
}

//删除字典数据
const deleteDictDataHandler = (dictCode) => {
  ElMessageBox.confirm('确认删除选中的字典数据?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteDictData(drawerInfo.dictType, dictCode).then(res => {
      ElMessage.success('删除成功')
      queryDictDataList()
    })
  })
}

//查询字典数据
const queryDictDataList = () => {
  getDictDataList(queryDictData).then(res => {
    dictDataList.value = res.list
    queryDictData.total = res.total
  })
}

//重置
const resetQueryCondition = () => {
  queryDictData.dictLabel = ''
  queryDictData.pageNum = 1
  queryDictData.pageSize = 10
  queryDictData.total = 0
  queryDictDataList()
}

//清空drawer
const clearDrawer = () => {
  queryDictData.dictLabel = ''
  queryDictData.pageNum = 1
  queryDictData.pageSize = 10
  queryDictData.total = 0
}

//初始化drawer
const initDrawer = (dictType, dictTypeName) => {
  title.value = '字典配置 - ' + dictTypeName
  visible.value = true
  drawerInfo.dictType = dictType
  drawerInfo.dictTypeName = dictTypeName
  queryDictData.dictType = dictType

  queryDictDataList()
}

defineExpose({
  initDrawer
})
</script>
<style scoped>
</style>