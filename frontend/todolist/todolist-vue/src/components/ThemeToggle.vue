<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { Moon, Sunny } from '@element-plus/icons-vue'

const isDark = useDark({
  selector: 'html',
  valueDark: 'dark',
  valueLight: 'light'
})
</script>

<template>
  <el-switch
    v-model="isDark"
    :active-action-icon="Moon"
    :inactive-action-icon="Sunny"
    inline-prompt
  />
</template>
