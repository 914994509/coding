<!--
 * @Author: pimzh
 * @Date: 2024-06-17 09:10:30
 * @LastEditTime: 2024-11-11 10:19:25
 * @LastEditors: pimzh
 * @Description: 
-->
<script setup lang="ts">
import { computed, ref, watchEffect, inject } from 'vue'
import { useStorage } from '@vueuse/core'
import ThemeToggle from './ThemeToggle.vue'
import { useGlobalSize } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import {
  TODO_LIMIT,
  todoLimit,
  TODO_BG_SHOW_IMG,
  TODO_BG_IMG,
  TODO_SIZE,
  todoSize
} from '@/hooks/config'

const form = ref({
  limit: useStorage(TODO_LIMIT, todoLimit),
  showBgImg: useStorage(TODO_BG_SHOW_IMG, false),
  bgImg: useStorage(TODO_BG_IMG, ''),
  size: useStorage(TODO_SIZE, todoSize)
})

const setLimit = inject<(val: number) => void>('setLimit', () => {})
watchEffect(() => {
  const bgImg = form.value.bgImg
  const showBgImg = form.value.showBgImg
  if (showBgImg && bgImg) {
    document.body.style.background = `url(${bgImg}) center center / cover no-repeat fixed`
  } else {
    document.body.style.background = ''
  }
})

defineExpose({
  getData() {}
})

const size = useGlobalSize()
const labelWidth = computed(() => {
  return size.value === 'small' ? '76px' : '84px'
})
</script>

<template>
  <el-form :model="form" :label-width="labelWidth" label-position="left">
    <el-form-item label="外观">
      <ThemeToggle></ThemeToggle>
    </el-form-item>
    <el-form-item label="UI大小">
      <el-radio-group v-model="form.size">
        <el-radio value="small">小</el-radio>
        <el-radio value="default">中</el-radio>
        <el-radio value="large">大</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <template #label>
        <span>可见时限</span>
        <el-tooltip content="todo列表显示限制，0表示不限制" placement="top">
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </template>
      <el-input-number v-model="form.limit" :min="0" :max="100" @change="setLimit" />
      <span style="margin-left: 5px">天</span>
    </el-form-item>
    <el-form-item label="背景图">
      <el-switch v-model="form.showBgImg" active-text="开启" inactive-text="关闭"></el-switch>
      <el-input
        v-show="form.showBgImg"
        v-model="form.bgImg"
        placeholder="请输入背景图链接"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.el-input-number {
  width: 130px;
}
.el-radio {
  margin-right: 8px;
}
</style>
