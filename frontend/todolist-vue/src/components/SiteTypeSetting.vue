<!--
 * @Author: pimzh
 * @Date: 2024-06-17 09:39:11
 * @LastEditTime: 2024-11-11 09:37:58
 * @LastEditors: pimzh
 * @Description: 
-->
<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { TODO_SITETYPE, siteTypeData } from '@/hooks/config'
import useGlobal from '@/hooks/useGlobal'

interface SiteTypeItem {
  id: number
  checked?: 0 | 1
  name: string
}

const { size, width } = useGlobal()
const emits = defineEmits<{
  (e: 'site-type-change'): void
}>()
defineExpose({
  getData() {}
})

const typeData = useStorage<{ id: number; data: SiteTypeItem[] }>(TODO_SITETYPE, siteTypeData)
const typeList = computed({
  get() {
    return typeData.value.data
  },
  set(val: SiteTypeItem[]) {
    typeData.value.data = val
  }
})
watch(
  typeList,
  () => {
    emits('site-type-change')
  },
  { deep: true }
)
const isEmpty = computed(() => typeList.value.length === 0)

const form = ref({
  name: '',
  id: -1
})

const formStatus = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const dialogTitle = ref('')
const showDialog = ref(false)
const selecting = ref(false)
const selectedLen = computed(() => typeList.value.filter((ele) => !!ele.checked).length)
const handleCheckAll = () => {
  const checkedAll = selectedLen.value === typeList.value.length ? 0 : 1
  typeList.value.forEach((ele) => {
    ele.checked = checkedAll
  })
}
const handleAdd = () => {
  dialogTitle.value = '新增'
  formStatus.value = 'add'
  showDialog.value = true

  nextTick(() => {
    formRef.value?.resetFields()
  })
}
const handleEdit = (ele: SiteTypeItem) => {
  dialogTitle.value = '编辑'
  formStatus.value = 'edit'
  showDialog.value = true
  nextTick(() => {
    form.value = { ...ele }
  })
}
const handleCancelChecked = () => {
  selecting.value = false
  typeList.value.forEach((ele) => {
    ele.checked = 0
  })
}
const handelRemvoeChecked = () => {
  typeList.value = typeList.value.filter((ele) => !ele.checked)
  ElMessage({
    type: 'success',
    message: '删除成功'
  })
  selecting.value = false
}
const handleRemove = (ele: SiteTypeItem) => {
  const index = typeList.value.findIndex((item) => item.id === ele.id)
  if (index !== -1) {
    typeList.value.splice(index, 1)
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
  }
}
const handleConfirm = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) {
      return
    }
    if (formStatus.value === 'add') {
      if (typeList.value.some((ele) => ele.name === form.value.name)) {
        ElMessage({
          type: 'error',
          message: '已存在同名类别'
        })
        return
      }
      typeList.value.push({ ...form.value, id: ++typeData.value.id })
    } else {
      const index = typeList.value.findIndex((ele) => ele.id === form.value.id)
      if (index !== -1) {
        typeList.value[index] = { ...form.value }
      }
    }
    showDialog.value = false
  })
}
</script>
<template>
  <div :class="`site-type--${size}`">
    <div class="flex justify-between actions top-0 z-10">
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
    <ul class="type-list">
      <li
        v-for="ele in typeList"
        :key="ele.id"
        class="text-center type-item"
        @click="handleEdit(ele)"
      >
        <div class="relative">
          <el-icon class="close-icon text-danger z-9" @click.stop="handleRemove(ele)"
            ><CircleCloseFilled
          /></el-icon>
          <div class="type-tag">
            <span class="title">{{ ele.name }}</span>
          </div>
          <div
            v-show="selecting"
            class="absolute inline-flex checkbox-wrapper z-9"
            @click.stop="ele.checked = ele.checked === 1 ? 0 : 1"
          >
            <input :checked="ele.checked === 1" class="checkbox" type="checkbox" />
          </div>
        </div>
      </li>
    </ul>
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
        <el-form-item
          label="类别名称"
          prop="name"
          :rules="[{ required: true, message: '请输入站点名称' }]"
        >
          <el-input v-model.trim="form.name" />
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
  padding-bottom: 10px;
  background-color: var(--el-popover-bg-color);
}
.type-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding-top: 6px;
}
.type-item {
  margin: 4px;
}
.type-tag {
  white-space: nowrap;
  min-width: 72px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  padding: 4px 6px;
  cursor: pointer;
}
.text-mini {
  font-size: var(--el-font-size-extra-small);
}
.title {
  font-size: var(--el-font-size-small);
}
.text-danger {
  color: var(--el-color-danger);
}
.checkbox-wrapper {
  padding: 4px;
  top: -10px;
  left: -8px;
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
  right: -4px;
  display: none;
  cursor: pointer;
}
.close-icon:hover + .type-tag {
  animation: shake 0.82s ease-in-out infinite;
}
.type-list .relative:hover .close-icon {
  display: inline-flex;
}
</style>
