<!--
 * @Author: pimzh
 * @Date: 2024-06-17 09:10:30
 * @LastEditTime: 2024-06-26 16:29:11
 * @LastEditors: pimzh
 * @Description: 
-->
<script lang="ts" setup>
import { useGlobalSize } from 'element-plus'
defineProps<{
  data: {
    label: string
    value: string
  }[]
  modelValue: string
  total: number
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
const size = useGlobalSize()
</script>

<template>
  <ul class="flex items-end todo-type-list" :class="`todo-type-list--${size}`">
    <li
      v-for="ele in data"
      :key="ele.value"
      :class="{ active: modelValue === ele.value }"
      @click="$emit('update:modelValue', ele.value)"
    >
      <span>{{ ele.label }}</span>
      <span v-show="modelValue === ele.value">({{ total }})</span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
ul {
  list-style: none;
}
.todo-type-list {
  font-style: italic;
  li {
    margin-right: 10px;
    cursor: pointer;
    font-size: var(--el-font-size-large);
    &.active {
      color: var(--el-color-primary);
      font-weight: var(--el-font-weight-primary);
    }
  }
}
.todo-type-list--small {
  li {
    font-size: var(--el-font-size-medium);
  }
}
.todo-type-list--large {
  li {
    font-size: var(--el-font-size-extra-large);
  }
}
</style>
