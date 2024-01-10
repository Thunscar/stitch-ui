<template>
  <el-dialog v-model="visible"
             :title="menuFormTitle"
             width="600">
    <el-form :model="menuInfo" label-width="100" inline>
      <el-form-item label="菜单类型">
        <el-radio-group v-model="menuInfo.menuType" :disabled="menuTypeDisabled">
          <el-radio label="M">菜单</el-radio>
          <el-radio label="B">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称" :required="true">
        <el-input placeholder="菜单名称" v-model="menuInfo.menuName" class="form-input"/>
      </el-form-item>
      <el-form-item label="菜单排序" :required="true">
        <el-input type="number" placeholder="菜单排序" v-model="menuInfo.orderNum" :min="0" :max="999"/>
      </el-form-item>
      <el-form-item label="上级菜单" :required="true">
        <el-tree-select v-model="menuInfo.parentId" :data="selectMenuData" check-strictly/>
      </el-form-item>
      <el-form-item label="是否外链" v-if="menuInfo.menuType === 'M'">
        <el-radio-group v-model="menuInfo.isFrame">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="路由地址" :required="true" v-if="menuInfo.menuType === 'M'">
        <el-input placeholder="路由地址" v-model="menuInfo.path" class="form-input"/>
      </el-form-item>
      <el-form-item label="组件地址" v-if="menuInfo.menuType === 'M'">
        <el-input placeholder="组件地址" v-model="menuInfo.component" class="form-input"/>
      </el-form-item>
      <el-form-item label="权限标识符">
        <el-input placeholder="权限标识符" v-model="menuInfo.perms" class="form-input"/>
      </el-form-item>
      <el-form-item label="是否可见" v-if="menuInfo.menuType === 'M'">
        <el-radio-group v-model="menuInfo.visible">
          <el-radio label="1">可见</el-radio>
          <el-radio label="0">不可见</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单状态" v-if="menuInfo.menuType === 'M'">
        <el-radio-group v-model="menuInfo.status">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="submitMenuFormHandler">确认</el-button>
        </span>
    </template>
  </el-dialog>
</template>
<script setup>

import {reactive, ref} from "vue"
import {createMenu, getMenuById, getMenuList, updateSysMenu} from "@/api/system/menu.js";
import {initSelectTree} from "@/utils/tree.js";
import '@/assets/css/form/form.css'
import {ElMessage} from "element-plus";

const menuFormTitle = ref('')
const visible = ref(false)
const menuTypeDisabled = ref(false)
const menuInfo = reactive({
  menuId: null,
  menuName: '',
  parentId: 0,
  orderNum: 1,
  path: '',
  component: '',
  isFrame: "0",
  menuType: 'M',
  visible: "1",
  status: "0",
  perms: ''
})
const selectMenuData = ref([{
  label: '顶级',
  value: 0,
  children: null
}])

const emits = defineEmits(['refreshDataList'])

//表单提交
function submitMenuFormHandler() {
  if (menuInfo.menuId) {
    //update
    updateSysMenu(menuInfo).then(res => {
      if (res.code === 200) {
        ElMessage.success('修改成功')
        visible.value = false
        emits('refreshDataList')
      } else {
        ElMessage.error(res.msg)
      }
    })
  } else {
    //save
    createMenu(menuInfo).then(res => {
      if (res.code === 200) {
        ElMessage.success('创建成功')
        visible.value = false
        emits('refreshDataList')
      } else {
        ElMessage.error(res.msg)
      }
    })
  }
}

//初始化菜单树选择框
function initSelectMenuData() {
  getMenuList().then(res => {
    if (res.code === 200 && res.data) {
      selectMenuData.value[0].children = initSelectTree(res.data, 'menuId', 'menuName')
    }
  })
}

//清空表单数据
function clearForm() {
  menuTypeDisabled.value = false
  menuInfo.menuId = null
  menuInfo.menuName = ''
  menuInfo.parentId = 0
  menuInfo.orderNum = 1
  menuInfo.path = ''
  menuInfo.component = ''
  menuInfo.isFrame = '0'
  menuInfo.menuType = 'M'
  menuInfo.visible = '1'
  menuInfo.status = '0'
  menuInfo.perms = ''
}

const init = (menuId) => {
  //清空表单数据
  clearForm()

  visible.value = true

  if (menuId) {
    menuFormTitle.value = '修改菜单'
    getMenuById(menuId).then(res => {
      if (res.code === 200 && res.data) {
        const menuData = res.data
        menuInfo.menuId = menuId
        menuInfo.menuName = menuData.menuName
        menuInfo.parentId = menuData.parentId
        menuInfo.orderNum = menuData.orderNum
        menuInfo.path = menuData.path
        menuInfo.component = menuData.component
        menuInfo.isFrame = menuData.isFrame
        menuInfo.menuType = menuData.menuType
        menuInfo.visible = menuData.visible
        menuInfo.status = menuData.status
        menuInfo.perms = menuData.perms
      } else {
        ElMessage.error(res.msg)
      }
    })
  } else {
    menuFormTitle.value = '新增菜单'
  }

  initSelectMenuData()
}


defineExpose({
  init
})

</script>