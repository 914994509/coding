<!--
 * @Author: pimzh
 * @Date: 2024-06-14 10:35:02
 * @LastEditTime: 2024-11-11 13:27:10
 * @LastEditors: pimzh
 * @Description: 
-->
<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { computed, provide, ref } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { useStorage } from '@vueuse/core'

import TodoView from '@/components/TodoView.vue'
import TodoSetting from '@/components/TodoSetting.vue'
import SiteContainer from '@/components/SiteContainer.vue'
import {
  TODO_SITELIST,
  TODO_SITETYPE,
  siteListData,
  siteTypeData,
  TODO_SIZE,
  todoSize
} from '@/hooks/config'

interface SiteItem {
  name: string
  icon: string
  url: string
  id: number
  types: number[]
}

const limit = ref(0)
const setLimit = (val: number) => {
  limit.value = val
}
provide('limit', limit)
provide('setLimit', setLimit)
const size = useStorage(TODO_SIZE, todoSize)
const width = computed(() => (size.value === 'small' ? 350 : size.value === 'default' ? 420 : 490))

const siteType = ref<{ id: number; name: string }[]>(siteTypeData.data)
const sitelist = ref<SiteItem[]>(siteListData.data)
const siteTypeList = computed(() => {
  const list = sitelist.value
  const types = siteType.value
  const data = types.map((ele) => {
    return {
      ...ele,
      children: [] as SiteItem[]
    }
  })
  const anyType = { name: '', id: 0, children: [] as SiteItem[] }
  data.push(anyType)
  list.forEach((ele) => {
    if (ele.types.length === 0) {
      anyType.children.push(ele)
      return
    }
    ele.types.forEach((type) => {
      const index = data.findIndex((item) => item.id === type)
      if (index > -1) {
        data[index].children.push(ele)
      } else {
        anyType.children.push(ele)
      }
    })
  })
  return data.filter((ele) => ele.children.length > 0)
})

const getSiteList = () => {
  setTimeout(() => {
    const val = localStorage.getItem(TODO_SITELIST)
    if (!val) {
      localStorage.setItem(TODO_SITELIST, JSON.stringify(siteListData))
      return
    }
    sitelist.value = JSON.parse(val).data
  }, 0)
}
const getSiteTypeList = () => {
  setTimeout(() => {
    const val = localStorage.getItem(TODO_SITETYPE)
    if (!val) {
      localStorage.setItem(TODO_SITETYPE, JSON.stringify(siteTypeData))
      return
    }
    siteType.value = JSON.parse(val).data
  }, 0)
}
getSiteList()
getSiteTypeList()
</script>

<template>
  <el-config-provider :locale="zhCn" :size="size">
    <main class="flex flex-col w-full h-full padding-b" :class="`main--${size}`">
      <header
        class="header w-full flex-shrink-0 max-w-content margin-x-auto margin-t overflow-y-auto padding-x"
      >
        <SiteContainer :data="siteTypeList"></SiteContainer>
      </header>
      <TodoView />
    </main>
    <footer class="fixed bottom-0 left-0 w-full fixed-view">
      <el-popover placement="top-end" :width="width" trigger="click" popper-class="todo-setting">
        <template #reference>
          <el-icon :size="22" style="cursor: pointer"><Setting /></el-icon>
        </template>
        <TodoSetting
          @site-change="getSiteList"
          @site-type-change="getSiteTypeList"
        ></TodoSetting>
      </el-popover>
    </footer>
  </el-config-provider>
</template>

<style scoped lang="scss">
.header {
  height: 25%;
  min-height: 185px;
  max-height: 310px;
}
.fixed-view {
  z-index: 20;
  padding: 20px;
}
.padding-b {
  padding-bottom: 20px;
}
</style>

<style>
#app {
  width: 100%;
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
.todo-setting {
  max-width: calc(100% - 40px);
  max-height: calc(100% - 86px);
}
</style>
