<template>
  <el-card>
    <div class="search">
      <el-input class="s-search-input" placeholder="字典名称" v-model="queryDictType.dictName" />
      <el-input class="s-search-input" placeholder="字典类型" v-model="queryDictType.dictType" />
      <el-button type="primary" @click="queryDictTypeList">搜索</el-button>
      <el-button type="default" @click="resetQueryCondition">重置</el-button>
      <el-button v-auth="'sys:dict:create'" type="primary" text bg @click="createTypeHandler">新增</el-button>
      <el-button v-auth="'sys:dict:delete'" type="danger" text bg @click="deleteBatchTypeHandler"
        :disabled="selectedTypes.length === 0">批量删除</el-button>
      <el-button v-auth="'sys:dict:refresh'" type="success" text bg @click="refreshCacheHandler">刷新缓存</el-button>
    </div>
    <el-table :data="typeList" :row-key="(record) => record.dictId" :default-expand-all="false" :indent="8" border
      :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectDictTypeHandler" v-loading="tableLoading">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="字典名称" prop="dictName" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="字典类型编码" prop="dictType" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="是否内置" prop="isSystem" width="85" align="center">
        <template #default="scope">
          <stitch-tag :tag-value="scope.row.isSystem" dict-type="normal_system" />
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" align="center" />
      <el-table-column prop="createTime" label="创建时间" width="200" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="操作" width="200" min-width="120" fixed="right" align="center">
        <template #default="scope">
          <el-button v-auth="'sys:dict:config'" type="primary" link
            @click="dictConfig(scope.row.dictType, scope.row.dictName)">字典配置
          </el-button>
          <el-button v-auth="'sys:dict:update'" type="primary" link @click="updateTypeHandler(scope.row.dictId)">修改
          </el-button>
          <el-button v-auth="'sys:dict:delete'" type="danger" link @click="deleteTypeHandler(scope.row.dictId)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="queryDictType.pageNum" v-model:page-size="queryDictType.pageSize"
      :page-sizes="[5, 10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="queryDictType.total"
      @size-change="queryDictTypeList" @current-change="queryDictTypeList" class="table-pagination" />
    <dict-form ref="dictFormRef" @refresh-data-list="queryDictTypeList" />
    <dict-data-drawer ref="dictDataDrawerRef" />
  </el-card>
</template>
<script>
export default {
  name: 'dict'
}
</script>
<script setup>
import { onMounted, reactive, ref } from "vue";
import '@/assets/css/table/table.css'
import { deleteDict, getDictList, refreshDictCache } from "@/api/system/dict.js";
import DictForm from "@/views/system/dict/dict-form.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import StitchTag from "@/components/Dict/stitch-tag.vue";
import DictDataDrawer from "@/views/system/dict/data/dict-data-drawer.vue";
import { useStore } from "@/store/index.js";

const queryDictType = reactive({
  dictName: '',
  dictType: '',
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const typeList = ref([])
const selectedTypes = ref([])
const dictFormRef = ref()
const dictDataDrawerRef = ref()
const dictStore = useStore().dict
const tableLoading = ref(false)

//配置字典
const dictConfig = (dictType, dictTypeName) => {
  dictDataDrawerRef.value.initDrawer(dictType, dictTypeName)
}

//更新字典类型信息
const updateTypeHandler = (dictId) => {
  dictFormRef.value.init(dictId)
}

//删除字典类型信息
const deleteTypeHandler = (dictId) => {
  ElMessageBox.confirm('确认删除该字典类型?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteDict(dictId).then(res => {
      ElMessage.success('删除成功')
      queryDictTypeList()
    }).catch(() => {
      queryDictTypeList()
    })
  })
}

//批量删除字典类型信息
const deleteBatchTypeHandler = () => {
  ElMessageBox.confirm('确认删除选中的数据类型?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteDict(selectedTypes.value).then(res => {
      ElMessage.success('删除成功')
      queryDictTypeList()
    }).catch(() => {
      queryDictTypeList()
    })
  })
}

// 选择框选中事件
const selectDictTypeHandler = (rows) => {
  selectedTypes.value = rows.map(row => row.dictId)
}

//新增事件
const createTypeHandler = () => {
  dictFormRef.value.init()
}

//刷新缓存事件
const refreshCacheHandler = () => {
  refreshDictCache().then(() => {
    dictStore.InitDictData()
    ElMessage.success('刷新缓存成功')
  })
}

//重置查询条件
const resetQueryCondition = () => {
  queryDictType.dictType = ''
  queryDictType.dictName = ''
  queryDictType.pageNum = 1
  queryDictType.pageSize = 10
  queryDictType.total = 0
  queryDictTypeList()
}

//查询字典类型列表
const queryDictTypeList = () => {
  tableLoading.value = true
  getDictList(queryDictType).then(res => {
    typeList.value = res.list
    queryDictType.total = res.total
  }).finally(()=>{
    tableLoading.value = false
  })
}

onMounted(() => {
  queryDictTypeList()
})
</script>
<style scoped></style>