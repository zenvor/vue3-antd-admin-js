import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 布局状态管理 Hook
 */
export function useLayout() {
  // 侧边栏折叠状态
  const collapsed = ref(false)

  // 响应式断点
  const MOBILE_BREAKPOINT = 991

  /**
   * 处理窗口大小变化
   */
  const handleResize = () => {
    collapsed.value = window.innerWidth <= MOBILE_BREAKPOINT
  }

  /**
   * 切换侧边栏折叠状态
   */
  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value
  }

  // 生命周期
  onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    collapsed,
    toggleCollapsed,
    MOBILE_BREAKPOINT
  }
}
