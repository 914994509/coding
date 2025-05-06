import { ref, watchEffect, type Ref, type UnwrapRef } from 'vue'

export const storage = {
  store: localStorage,
  getItem<T>(key: string): T | null {
    const value = this.store.getItem(key)
    try {
      return JSON.parse(value as string)
    } catch {
      return value as null
    }
  },
  setItem<T>(key: string, value: T) {
    if (typeof value === 'string') {
      this.store.setItem(key, value)
      return
    }
    this.store.setItem(key, JSON.stringify(value))
  },
  removeItem(key: string) {
    this.store.removeItem(key)
  },
  clear() {
    this.store.clear()
  }
}

export default function useStorage<T>(key: string, initialValue: T): Ref<UnwrapRef<T>> {
  const store = ref(storage.getItem<T>(key) ?? initialValue)

  watchEffect(() => {
    // 初始化时从本地存储中获取数据
    storage.setItem(key, store.value)
  })

  window.onstorage = (event: StorageEvent) => {
    // 监听本地存储的变化
    if (event.key === key) {
      store.value = (storage.getItem<T>(key) ?? initialValue) as UnwrapRef<T>
    }
  }

  return store
}
