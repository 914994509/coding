<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue'
import BasicSetting from './BasicSetting.vue'
import SiteSetting from './SiteSetting.vue'
import SiteTypeSetting from './SiteTypeSetting.vue'
import useGlobal from '@/hooks/useGlobal'

const { size } = useGlobal()

const style = computed(() => {
  return {
    height: size.value === 'small' ? '200px' : size.value === 'default' ? '250px' : '300px'
  }
})

defineOptions({
  inheritAttrs: false
})

const basic = ref<InstanceType<typeof BasicSetting>>()
const siteType = ref<InstanceType<typeof SiteTypeSetting>>()
const site = ref<InstanceType<typeof SiteSetting>>()
const refMap = {
  basic,
  siteType,
  site
}

const handleSiteChange = (tab: keyof typeof refMap) => {
  nextTick(() => {
    refMap[tab].value?.getData()
  })
}
</script>

<template>
  <el-tabs
    class="settings-tabs"
    tab-position="left"
    :style="style"
    model-value="basic"
    @tab-change="handleSiteChange"
  >
    <el-tab-pane name="basic" label="基础设置">
      <BasicSetting ref="basic" v-bind="$attrs" />
    </el-tab-pane>
    <el-tab-pane lazy name="siteType" label="网站分类">
      <SiteTypeSetting ref="siteType" v-bind="$attrs" />
    </el-tab-pane>
    <el-tab-pane lazy name="site" label="网站设置">
      <SiteSetting ref="site" v-bind="$attrs" />
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
.settings-tabs :deep(.el-tabs__item) {
  padding-left: 0px;
  padding-right: 12px;
}
.settings-tabs :deep(.el-tabs__content) {
  height: 100%;
  overflow-y: auto;
}
.settings-tabs :deep(.el-tabs__content)::-webkit-scrollbar {
  width: 4px;
}
.settings-tabs :deep(.el-tabs__content)::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 2px;
}
.settings-tabs :deep(.el-tabs__content)::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
