<!--
 * @Author: pimzh
 * @Date: 2024-06-26 16:41:52
 * @LastEditTime: 2024-06-26 17:08:52
 * @LastEditors: pimzh
 * @Description: 
-->
<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { type InputInstance } from 'element-plus'

const porps = defineProps<{ item: { title: string } }>()
const isEdit = ref(false)
const input = ref<InputInstance>()

const handleEdit = () => {
  isEdit.value = true
  nextTick(() => {
    input.value?.input?.focus()
    input.value?.input?.select()
  })
}

const handleBlur = () => {
  if (porps.item.title.trim() !== '') {
    isEdit.value = false
  }
}
</script>

<template>
  <div v-if="!isEdit" @dblclick="handleEdit">{{ item.title }}</div>
  <el-input v-else ref="input" v-model="item.title" @blur="handleBlur"></el-input>
</template>
