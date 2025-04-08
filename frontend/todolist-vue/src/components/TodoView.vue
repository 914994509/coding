<!--
 * @Author: pimzh
 * @Date: 2024-11-08 17:45:39
 * @LastEditTime: 2024-11-11 10:15:14
 * @LastEditors: pimzh
 * @Description: 
-->
<script setup lang="ts">
import TodoType from './TodoType.vue'
import TodoForm from './TodoForm.vue'
import Todolist, { type Todo } from './TodoList.vue'
import { computed, ref, inject, type Ref } from 'vue'
import useStorage from '../hooks/useStorage'
import { TODOLIST_KEY, TODO_LIMIT, todoLimit } from '../hooks/config'

const showType = ref('todo')
const todoTypes = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Todo',
    value: 'todo'
  },
  {
    label: 'Done',
    value: 'done'
  }
]
const todos = useStorage<Todo[]>(TODOLIST_KEY, [])
const limit = inject<Ref<number>>('limit', useStorage(TODO_LIMIT, todoLimit))

const handleAdd = (todo: string) => {
  if (!todo.trim()) return
  todos.value.push({
    title: todo,
    done: 0,
    date: Date.now(),
    doneDate: -1
  })
}

const limitDateTime = computed(() => {
  if (!limit.value) {
    return 0
  }
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - limit.value)
  return date.getTime()
})

const handleCheck = (checked: boolean, item: Todo) => {
  Reflect.set(item, 'done', checked ? 1 : 0)
  if (checked) {
    item.doneDate = Date.now()
  } else {
    item.doneDate = -1
  }
}

const handleRemove = (item: Todo) => {
  todos.value.splice(todos.value.indexOf(item), 1)
}
const todolist = computed(() => {
  const liist =
    showType.value === 'all'
      ? todos.value.slice(0)
      : showType.value === 'todo'
        ? todos.value.filter((item) => !item.done)
        : todos.value.filter((item) => item.done)
  return liist.filter((item) => item.date >= limitDateTime.value).sort((a, b) => a.date - b.date)
})

const todolistview = computed(() => {
  return showType.value === 'todo'
    ? todolist.value.slice(0, 6)
    : showType.value === 'all'
      ? todolist.value.slice().sort((a, b) => a.done - b.done)
      : todolist.value
})
</script>

<template>
  <TodoType
    class="w-full flex-shrink-0 max-w-content margin-x-auto padding-x margin-t"
    :total="todolist.length"
    :data="todoTypes"
    v-model="showType"
  ></TodoType>
  <div
    class="todo-input-container w-full flex-shrink-0 max-w-content margin-x-auto padding-x"
    style="margin-top: 12px"
  >
    <TodoForm @add-todo="handleAdd"></TodoForm>
  </div>
  <div class="flex-1 overflow-y-auto padding-x margin-t">
    <Todolist
      class="max-w-content margin-x-auto padding-x"
      :data="todolistview"
      @check="handleCheck"
      @remove="handleRemove"
    ></Todolist>
    <div v-if="todolist.length === 0" class="empty text-center">
      <span v-show="showType === 'todo'">You have done everything!</span>
      <span v-show="showType === 'done'">You have done nothing!</span>
      <span v-show="showType === 'all'">You have nothing to do!</span>
    </div>
  </div>
</template>

<style scoped>
.empty {
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-base);
}
</style>
