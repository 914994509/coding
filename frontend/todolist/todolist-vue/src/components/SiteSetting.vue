<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { TODO_SITELIST, siteListData, TODO_SITETYPE, siteTypeData } from '@/hooks/config'
import useGlobal from '@/hooks/useGlobal'
import draggable from 'vuedraggable'

interface SiteItem {
  id: number
  name: string
  icon: string
  url: string
  types: number[]
  checked?: 0 | 1
}

const emits = defineEmits<{
  (e: 'site-change'): void
}>()

const { size, width } = useGlobal()
const dragdisable = ref(false)

defineExpose({
  getData() {
    getSiteTypes()
  }
})
const siteTypes = ref<{ name: string; id: number }[]>([])
const siteEmpty = computed(() => siteTypes.value.length === 0)
const typeFilter = ref(0)
const showFilter = ref(false)

const getSiteTypes = () => {
  const val = localStorage.getItem(TODO_SITETYPE)
  if (val) {
    siteTypes.value = JSON.parse(val).data
  } else {
    siteTypes.value = siteTypeData.data
  }
  typeFilter.value = siteTypes.value[0]?.id || 0
}
getSiteTypes()
const siteData = useStorage<{ id: number; data: SiteItem[] }>(TODO_SITELIST, siteListData)

const sitelist = computed({
  get() {
    return siteData.value.data
  },
  set(val: SiteItem[]) {
    siteData.value.data = val
  }
})
const sitelistView = computed(() => {
  const filter = typeFilter.value
  if (showFilter.value && filter) {
    return sitelist.value.filter((ele) => ele.types.includes(filter))
  }
  return sitelist.value
})

watch(
  sitelist,
  () => {
    emits('site-change')
  },
  { deep: true }
)

const isEmpty = computed(() => sitelistView.value.length === 0)
const form = ref<SiteItem>({
  name: '',
  url: '',
  icon: '',
  types: [],
  id: -1
})
const formStatus = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const dialogTitle = ref('')
const showDialog = ref(false)
const selecting = ref(false)
const selectedLen = computed(() => sitelistView.value.filter((ele) => !!ele.checked).length)
const handleCheckAll = () => {
  const checkedAll = selectedLen.value === sitelistView.value.length ? 0 : 1
  sitelistView.value.forEach((ele) => {
    ele.checked = checkedAll
  })
}
const handleAdd = () => {
  dialogTitle.value = '新增'
  formStatus.value = 'add'
  showDialog.value = true
  form.value.types = []

  nextTick(() => {
    formRef.value?.resetFields()
  })
}
const handleEdit = (ele: SiteItem) => {
  dialogTitle.value = '编辑'
  formStatus.value = 'edit'
  showDialog.value = true
  nextTick(() => {
    form.value = {
      ...ele,
      types: siteEmpty.value
        ? ele.types.map((item) => item)
        : ele.types.filter((item) => siteTypes.value.some((el) => el.id === item))
    }
    setTimeout(() => {
      formRef.value?.clearValidate()
    }, 20)
  })
}
const handleCancelChecked = () => {
  selecting.value = false
  sitelistView.value.forEach((ele) => {
    ele.checked = 0
  })
}
const handelRemvoeChecked = () => {
  sitelist.value = sitelist.value.filter((ele) => !ele.checked)
  ElMessage({
    type: 'success',
    message: '删除成功'
  })
  selecting.value = false
}
const handleRemove = (ele: SiteItem) => {
  const index = sitelist.value.findIndex((item) => item.id === ele.id)
  if (index !== -1) {
    sitelist.value.splice(index, 1)
    sitelist.value = sitelist.value
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
  }
}
const handleUrlChange = (val: string) => {
  if (!val) {
    return
  }
  form.value.icon = `${form.value.url.replace(/\/$/, '')}/favicon.ico`
}
const handleConfirm = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) {
      return
    }
    if (formStatus.value === 'add') {
      if (sitelist.value.some((ele) => ele.name === form.value.name)) {
        ElMessage({
          type: 'error',
          message: '已存在同名网站'
        })
        return
      }
      sitelist.value.push({ ...form.value, id: ++siteData.value.id })
    } else {
      const index = sitelist.value.findIndex((ele) => ele.id === form.value.id)
      if (index !== -1) {
        sitelist.value[index] = { ...form.value }
      }
    }
    showDialog.value = false
  })
}
</script>

<template>
  <div :class="`site--${size}`">
    <div class="actions top-0 z-10">
      <div class="flex justify-between">
        <el-button text type="primary" @click="handleAdd">新增</el-button>
        <div v-if="!isEmpty">
          <el-button text v-show="!selecting" @click="selecting = true">选择</el-button>
          <el-button text v-show="selecting" style="margin-left: 0px" @click="handleCheckAll"
            >全选</el-button
          >
          <span v-show="selecting" class="text-mini">已选 {{ selectedLen }}</span>
          <el-button v-show="selecting" style="margin-left: 4px" text @click="handleCancelChecked"
            >取消</el-button
          >
          <el-button
            v-show="selecting && selectedLen > 0"
            style="margin-left: 2px"
            text
            type="danger"
            @click="handelRemvoeChecked"
            >删除</el-button
          >
        </div>
      </div>
      <div class="flex w-full flex-wrap">
        <el-button v-show="!showFilter" text type="primary" @click="dragdisable = !dragdisable">{{
          dragdisable ? '关闭拖拽排序' : '开启拖拽排序'
        }}</el-button>
        <div v-if="!siteEmpty" v-show="!dragdisable" class="flex flex-1 flex-wrap">
          <el-button text type="primary" @click="showFilter = !showFilter">{{
            showFilter ? '关闭筛选' : '开启筛选'
          }}</el-button>
          <el-radio-group
            class="flex-1"
            style="margin-left: 4px"
            v-show="showFilter"
            v-model="typeFilter"
          >
            <el-radio v-for="ele in siteTypes" :key="ele.id" :value="ele.id">{{
              ele.name
            }}</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <draggable
      class="site-list"
      tag="ul"
      item-key="id"
      ghost-class="ghost"
      :list="dragdisable ? sitelist : sitelistView"
      :disabled="!dragdisable"
    >
      <template #item="{ element }">
        <li class="text-center" @click="handleEdit(element)">
          <div class="relative">
            <el-icon class="close-icon text-danger right-0 z-9" @click.stop="handleRemove(element)"
              ><CircleCloseFilled
            /></el-icon>
            <el-image class="site-card" :src="element.icon"></el-image>
            <div
              v-show="selecting"
              class="absolute inline-flex checkbox-wrapper z-9"
              @click.stop="element.checked = element.checked === 1 ? 0 : 1"
            >
              <input :checked="element.checked === 1" class="checkbox" type="checkbox" />
            </div>
          </div>
          <span class="title">{{ element.name }}</span>
        </li>
      </template>
    </draggable>
    <el-empty
      v-if="isEmpty"
      description="暂无数据"
      :image-size="60"
      style="--el-empty-padding: 10px 0px"
    />
    <el-dialog
      v-model="showDialog"
      :width="width"
      :close-on-click-modal="false"
      :title="dialogTitle"
      align-center
    >
      <el-form ref="formRef" :model="form" label-position="top">
        <el-form-item v-if="!siteEmpty" label="站点类别" prop="types">
          <el-checkbox-group v-model="form.types">
            <el-checkbox v-for="item in siteTypes" :key="item.id" :value="item.id">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="站点名称"
          prop="name"
          :rules="[{ required: true, message: '请输入站点名称' }]"
        >
          <el-input v-model.trim="form.name" />
        </el-form-item>
        <el-form-item
          label="站点地址"
          prop="url"
          :rules="[{ required: true, message: '请输入站点地址' }]"
        >
          <el-input v-model.trim="form.url" @change="handleUrlChange" />
        </el-form-item>
        <el-form-item
          label="站点图标"
          prop="icon"
          :rules="[{ required: true, message: '请输入站点图标' }]"
        >
          <el-input v-model.trim="form.icon" />
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.actions {
  position: sticky;
  padding-bottom: 12px;
  background-color: var(--el-popover-bg-color);
}
.site-list {
  list-style: none;
  display: grid;
  padding-top: 6px;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
}
.site-card {
  width: 42px;
  height: 42px;
}
.site-card :deep(.el-image__error),
.text-mini {
  font-size: var(--el-font-size-extra-small);
}
.title {
  font-size: var(--el-font-size-small);
}
.text-danger {
  color: var(--el-color-danger);
}
.el-radio {
  margin-right: 8px;
}
.checkbox-wrapper {
  padding: 4px;
  top: -10px;
  left: -4px;
}
.checkbox {
  outline: none;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  width: 1em;
  height: 1em;
  cursor: pointer;
}
.z-10 {
  z-index: 10;
}
.z-9 {
  z-index: 9;
}
.close-icon {
  position: absolute;
  top: -6px;
  display: none;
  cursor: pointer;
}
.close-icon:hover + .site-card {
  animation: shake 0.82s ease-in-out infinite;
}
.site-list .relative:hover .close-icon {
  display: inline-flex;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
