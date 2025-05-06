<!--
 * @Author: pimzh
 * @Date: 2024-06-17 09:10:30
 * @LastEditTime: 2024-06-27 15:36:48
 * @LastEditors: pimzh
 * @Description: 
-->
<script lang="ts" setup>
import { useGlobalSize } from 'element-plus'
import TodoListTitle from './TodoListTitle.vue'

export declare interface Todo {
  title: string
  done: 0 | 1
  date: number
  doneDate: number
}

defineProps<{
  data: Todo[]
}>()

const size = useGlobalSize()

const toDayStr = (day: number) => {
  // 年 月 周 日 前天 昨天
  if (day < 7) {
    if (day === 0) return 0
    if (day === 1) return '昨天'
    if (day === 2) return '前天'
    return `${day}天前`
  }
  if (day > 365) {
    return `${Math.floor(day / 365)}年前`
  }
  if (day > 30) {
    return `${Math.floor(day / 30)}月前`
  }
  return `${Math.floor(day / 7)}周前`
}

const getDay = (datetime: number) => {
  const date = new Date()
  date.setHours(23, 59, 59, 999)
  const todayTime = date.getTime()
  const day = Math.floor((todayTime - datetime) / 86400000)
  return toDayStr(day)
}
const emits = defineEmits<{
  (e: 'remove', item: Todo): void
  (e: 'check', checked: boolean, item: Todo): void
}>()

const handleRedo = (item: Todo) => {
  item.date = Date.now()
  emits('check', false, item)
}
</script>

<template>
  <ul class="todolist" :class="`todolist--${size}`">
    <li
      v-for="item in data"
      :key="item.date"
      class="todo-item relative"
      :class="{ done: item.done }"
    >
      <div v-if="getDay(item.date)" class="absolute date-tag-wrapper">
        <span class="date-tag" :class="{ done: item.done }">{{ getDay(item.date) }}</span>
      </div>
      <TodoListTitle :item="item" />
      <div class="actions absolute none">
        <div v-if="item.done">
          <span class="action text-primary" @click="handleRedo(item)">redo</span>
          <span class="action text-danger" @click="$emit('remove', item)">delete</span>
        </div>
        <div v-else>
          <span class="action text-danger" @click="$emit('remove', item)">undo</span>
          <span class="action text-success" @click="$emit('check', true, item)">done</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
ul {
  list-style: none;
}
.todolist {
  font-size: var(--el-font-size-base);
  .todo-item:first-child {
    border-top-left-radius: var(--el-border-radius-base);
    border-top-right-radius: var(--el-border-radius-base);
  }
  .todo-item:last-child {
    border-bottom-left-radius: var(--el-border-radius-base);
    border-bottom-right-radius: var(--el-border-radius-base);
  }
}
.todolist--small {
  font-size: var(--el-font-size-extra-small);
  .todo-item {
    padding: 14px 12px;
    line-height: calc(var(--el-component-size-small) + 2px);
  }
}
.todolist--large {
  font-size: var(--el-font-size-base);
  .todo-item {
    padding: 10px 18px;
    line-height: calc(var(--el-component-size-large) + 2px);
  }
}

.todo-item {
  padding: 13px 16px;
  line-height: calc(var(--el-component-size) + 2px);
  border-bottom: 1px solid var(--el-border-color-light);
  background-color: var(--mask-color);
  > span {
    vertical-align: middle;
  }
  .el-checkbox {
    margin-left: 10px;
    vertical-align: middle;
  }
  &.done {
    text-decoration: line-through;
    color: var(--el-text-color-secondary);
  }
  &:hover :not(.el-input) + .actions {
    display: block;
  }
}
.actions {
  top: 4px;
  left: 4px;
  line-height: normal;
}
.actions .action {
  margin-right: 10px;
  cursor: pointer;
}
.date-tag {
  border: 1px solid var(--el-color-warning);
  color: var(--el-color-warning);
  padding: 1px 4px;
  border-radius: var(--el-border-radius-small);
  font-size: 0.9em;
  &.done {
    border-color: var(--el-color-success);
    color: var(--el-color-success);
  }
}
.date-tag-wrapper {
  user-select: none;
  + div {
    margin-left: 4em;
    width: calc(100% - 4em);
  }
}

.text-primary {
  color: var(--el-color-primary);
}
.text-danger {
  color: var(--el-color-danger);
}
.text-success {
  color: var(--el-color-success);
}
</style>
