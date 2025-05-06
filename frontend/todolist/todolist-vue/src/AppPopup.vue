<!--
 * @Author: pimzh
 * @Date: 2024-06-14 11:20:13
 * @LastEditTime: 2024-11-08 18:20:53
 * @LastEditors: pimzh
 * @Description: 
-->
<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import TodoView from '@/components/TodoView.vue'
import { useDark } from '@vueuse/core'

useDark({
  selector: 'html',
  valueDark: 'dark',
  valueLight: 'light'
})
</script>

<template>
  <el-config-provider :locale="zhCn" size="small">
    <main class="flex flex-col w-full h-full padding-b main--small">
      <TodoView />
    </main>
  </el-config-provider>
</template>

<style>
.padding-b {
  padding-bottom: 20px;
}
#app {
  width: 400px;
  height: 300px;
  margin: auto;
}
#app .todolist .todo-item {
  padding-bottom: 8px;
}
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.main--small {
  .empty {
    font-size: var(--el-font-size-extra-small);
  }
}
.main--large {
  .empty {
    font-size: var(--el-font-size-medium);
  }
}
</style>
