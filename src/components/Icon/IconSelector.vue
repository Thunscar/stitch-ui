<template>
  <el-popover
      placement="bottom"
      width="400px"
      v-model:visible="showPopover"
      trigger="click">
    <template #reference>
      <el-button text plain>
        <div v-if="props.icon">
          <svg-icon :icon-class="props.icon"/>
        </div>
        <div v-else class="select-info">
          <img class="icon-select" src="@/assets/img/select.svg" alt="">
          <span>请选择图标</span>
        </div>
      </el-button>
    </template>
    <div class="icon-view">
      <el-button text plain v-for="(item,index) in menuIcons" :key="index" @click="selectedIconClick(item)">
        <svg-icon :icon-class="item"/>
      </el-button>
    </div>
  </el-popover>
</template>
<script setup>

import SvgIcon from "@/components/Icon/SvgIcon.vue";
import {ref} from "vue";

const showPopover = ref(false)
const props = defineProps({
  icon: {
    type: String,
    required: false
  }
})
const emit = defineEmits(['iconSelected'])
const menuIcons = ref([
  'home',
  'user'
])

//选择
function selectedIconClick(item) {
  showPopover.value = false
  emit('iconSelected', item)
}
</script>
<style scoped>
.icon-view {
  display: flex;
  flex-flow: row nowrap;
}

.select-info {
  display: flex;
  line-height: 20px;
}

.icon-select {
  width: 18px;
  height: 18px;
}
</style>

