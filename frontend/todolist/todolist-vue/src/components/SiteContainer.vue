<!--
 * @Author: pimzh
 * @Date: 2024-06-18 09:11:23
 * @LastEditTime: 2024-06-26 16:05:08
 * @LastEditors: pimzh
 * @Description: 
-->
<script lang="ts" setup>
defineProps<{
  data: {
    id: number
    name: string
    children: {
      id: number
      name: string
      url: string
      icon: string
    }[]
  }[]
}>()
</script>

<template>
  <div class="site-list-container" :class="{ 'one-child': data.length === 1 }">
    <div v-for="item in data" :key="item.id" class="relative site-list-item">
      <div class="overflow-y-auto h-full">
        <span class="absolute top-0 left-0 type-title">{{ item.name }}</span>
        <ul class="site-list">
          <li v-for="ele in item.children" :key="ele.id" class="text-center">
            <a class="link" target="_blank" :href="ele.url">
              <el-image class="site-card" :src="ele.icon"></el-image>
              <br />
              <span>{{ ele.name }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.type-title {
  font-size: var(--el-font-size-small);
  font-weight: var(--el-font-weight-primary);
  font-style: italic;
  color: var(--el-text-color-regular);
  writing-mode: vertical-lr;
}
.site-list-container:not(.one-child) {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
.site-list-container:not(.one-child) .site-list-item {
  max-height: 96px;
}
.site-list {
  list-style: none;
  display: grid;
  gap: 10px;
  padding: 15px 5px;
  grid-template-columns: repeat(auto-fill, minmax(66px, 1fr));
  background-color: var(--mask-color);
  border-radius: var(--el-border-radius-base);
}
.site-card {
  width: 42px;
  height: 42px;
}
.site-card :deep(.el-image__error) {
  font-size: var(--el-font-size-extra-small);
}
.link {
  text-decoration: none;
  color: var(--el-text-color-regular);
}
</style>
