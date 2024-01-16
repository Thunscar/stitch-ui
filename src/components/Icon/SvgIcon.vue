<template>
  <svg
      aria-hidden="true"
      class="svg-icon"
      :style="`width:${size};height:${size}`">
    <use :xlink:href="symbolId" :fill="color"/>
  </svg>
</template>

<script setup>
import {computed} from 'vue'

const props = defineProps({
  prefix: {type: String, default: 'icon'},
  iconClass: {type: String, default: ''},
  color: {type: String, default: ''},
  size: {type: String, default: '20px'}
})

const symbolId = computed(() => `#${props.prefix}-${props.iconClass}`)

</script>

<style scoped>
.svg-icon {
  fill: currentColor;
}
</style>

