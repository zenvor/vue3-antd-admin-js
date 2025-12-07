import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import { routesToMenus, getValidMenuPaths } from '@/utils/routeUtils.js'

/**
 * 菜单状态管理 Hook
 */
export function useMenu() {
  const route = useRoute()
  const router = useRouter()
  const permissionStore = usePermissionStore()

  // 使用 permissionStore 中的路由表
  const validRoutes = computed(() => permissionStore.routes.filter((r) => !r.meta?.hideInMenu))

  // 自动从路由生成菜单配置
  const menuItems = computed(() => routesToMenus(validRoutes.value))

  // 获取所有有效的菜单路径
  const validPaths = computed(() => getValidMenuPaths(validRoutes.value))

  // 当前选中的菜单项 - 智能匹配
  const selectedKeys = computed(() => {
    const currentPath = route.path

    // 优先匹配完全相同的路径
    if (validPaths.value.includes(currentPath)) {
      return [currentPath]
    }

    // 如果没有完全匹配，则查找最接近的父路径
    const segments = currentPath.split('/').filter(Boolean)
    for (let i = segments.length; i > 0; i--) {
      const testPath = '/' + segments.slice(0, i).join('/')
      if (validPaths.value.includes(testPath)) {
        return [testPath]
      }
    }

    return []
  })

  // 当前展开的菜单项
  const openKeys = ref([])

  /**
   * 递归查找路由
   */
  const findRoute = (routes, targetPath) => {
    for (const route of routes) {
      if (route.path === targetPath) return route
      if (route.children) {
        const found = findRoute(route.children, targetPath)
        if (found) return found
      }
    }
    return null
  }

  /**
   * 计算应该展开的菜单项（基于 menuItems 树结构）
   */
  const calculateOpenKeys = (currentPath) => {
    const findPathToKey = (items, targetKey, parents = []) => {
      for (const item of items) {
        if (item.key === targetKey) return parents
        if (item.children) {
          const found = findPathToKey(item.children, targetKey, [...parents, item.key])
          if (found) return found
        }
      }
      return null
    }

    // 尝试直接查找当前路径
    let keys = findPathToKey(menuItems.value, currentPath)

    // 如果没找到，尝试查找父路径（应对详情页等不在菜单中的情况）
    if (!keys) {
      const segments = currentPath.split('/').filter(Boolean)
      for (let i = segments.length - 1; i > 0; i--) {
        const testPath = '/' + segments.slice(0, i).join('/')
        keys = findPathToKey(menuItems.value, testPath)
        if (keys) break
      }
    }

    return keys || []
  }

  // 监听路由变化，自动更新展开的菜单
  watch(
    () => route.path,
    (newPath) => {
      const newOpenKeys = calculateOpenKeys(newPath)
      // 合并新的 openKeys 到现有列表，并去重
      // 这样可以保留用户手动展开的其他菜单
      openKeys.value = [...new Set([...openKeys.value, ...newOpenKeys])]
    },
    { immediate: true }
  )

  // 当前页面标题 - 自动获取
  const currentPageTitle = computed(() => {
    const lastMatchedRoute = route.matched[route.matched.length - 1]
    return lastMatchedRoute?.meta?.title || '欢迎'
  })

  /**
   * 菜单点击处理 - 智能跳转
   */
  const handleMenuClick = ({ key }) => {
    if (key.startsWith('/')) {
      // 查找目标路由
      const targetRoute = findRoute(permissionStore.routes, key)

      // 如果有重定向，使用重定向路径
      if (targetRoute?.redirect) {
        router.push(targetRoute.redirect)
      } else {
        router.push(key)
      }
    }
  }

  return {
    menuItems,
    selectedKeys,
    openKeys,
    currentPageTitle,
    handleMenuClick
  }
}
