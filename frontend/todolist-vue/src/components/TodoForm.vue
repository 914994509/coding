<!--
 * @Author: pimzh
 * @Date: 2024-06-17 09:10:30
 * @LastEditTime: 2024-11-08 18:19:03
 * @LastEditors: pimzh
 * @Description: 
-->
<script lang="ts" setup>
import { ref } from 'vue'
import { useGlobalSize } from 'element-plus'
const todo = ref('')
const size = useGlobalSize()
const $emit = defineEmits<{
  (e: 'add-todo', todo: string): void
}>()
const onSubmit = () => {
  $emit('add-todo', todo.value)
  todo.value = ''
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <input
      v-model="todo"
      class="todo-input w-full"
      :class="`todo-input--${size}`"
      type="text"
      placeholder="What needs to be done? Press enter to add!"
    />
  </form>
</template>

<style scoped lang="scss">
$--input-height: 60px;
.todo-input {
  padding: 4px 20px;
  outline: none;
  color: var(--el-text-color-primary);
  border: none;
  border-bottom: 2px solid var(--el-border-color);
  height: $--input-height;
  line-height: $--input-height - 6px;
  font-size: var(--el-font-size-medium);
  background-color: var(--mask-color);
  &::placeholder {
    color: var(--el-text-color-placeholder);
  }
  &:focus {
    border-color: var(--el-border-color-darker);
  }
}
.todo-input--small {
  font-size: var(--el-font-size-base);
  height: $--input-height - 4px;
  line-height: $--input-height - 6px;
}
.todo-input--large {
  height: $--input-height + 4px;
  line-height: $--input-height - 6px;
  font-size: var(--el-font-size-large);
}
</style>
