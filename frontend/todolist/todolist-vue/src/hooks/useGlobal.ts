import { useGlobalSize } from 'element-plus'
import { computed } from 'vue'

export default () => {
  const size = useGlobalSize()
  return {
    size,
    width: computed(() => (size.value === 'small' ? 320 : 400))
  }
}
