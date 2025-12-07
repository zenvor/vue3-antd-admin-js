// utils/routeUtils.js
import { h } from 'vue'
import * as Icons from '@ant-design/icons-vue'

/**
 * 路径拼接工具
 * @param {string} parent 父路径
 * @param {string} path 当前路径
 * @returns {string} 完整路径
 */
function resolvePath(parent, path) {
  if (path.startsWith('/')) return path
  if (parent.endsWith('/')) return parent + path
  return parent + '/' + path
}

/**
 * 路由转菜单配置
 * @param {Array} routes 路由配置
 * @param {string} parentPath 父级路径
 * @returns {Array} 菜单配置
 */
export function routesToMenus(routes, parentPath = '') {
  const menus = []

  routes.forEach((route) => {
    // 跳过不需要显示在菜单中的路由
    if (route.meta?.hideInMenu || route.meta?.layout === false) {
      return
    }

    // 计算当前路由的完整路径
    let fullPath = route.path
    if (parentPath && !route.path.startsWith('/')) {
      fullPath = resolvePath(parentPath, route.path)
    }

    // 处理有子路由的情况
    if (route.children && route.children.length > 0) {
      // 过滤出需要显示在菜单中的子路由
      const validChildren = route.children.filter((child) => child.meta?.title && !child.meta?.hideInMenu)

      if (validChildren.length > 0) {
        // 特殊处理：如果父路由没有标题（如根路由 '/'），直接展开子路由作为顶级菜单
        if (!route.meta?.title) {
          // 递归处理子菜单，传递当前路径作为父路径
          const childMenus = routesToMenus(route.children, fullPath)
          menus.push(...childMenus)
        } else {
          // 父路由有标题，作为包含子菜单的菜单项
          const menuItem = {
            key: fullPath,
            label: route.meta.title,
            title: route.meta.title
          }

          // 处理父级图标
          if (route.meta.icon) {
            const iconName = route.meta.icon
            const iconComponent = iconName
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join('')

            if (Icons[iconComponent]) {
              menuItem.icon = () => h(Icons[iconComponent])
            }
          }

          // 递归处理子菜单
          menuItem.children = routesToMenus(route.children, fullPath)
          menus.push(menuItem)
        }
      }
    } else if (route.meta?.title) {
      // 处理没有子路由的单独路由
      const menuItem = {
        key: fullPath,
        label: route.meta.title,
        title: route.meta.title
      }

      // 处理图标
      if (route.meta.icon) {
        const iconName = route.meta.icon
        const iconComponent = iconName
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join('')

        if (Icons[iconComponent]) {
          menuItem.icon = () => h(Icons[iconComponent])
        }
      }

      menus.push(menuItem)
    }
  })

  return menus
}

/**
 * 获取所有有效的菜单路径（用于路由跳转和高亮匹配）
 * @param {Array} routes 路由配置
 * @param {string} parentPath 父级路径
 * @returns {Array} 路径数组
 */
export function getValidMenuPaths(routes, parentPath = '') {
  const paths = []

  routes.forEach((route) => {
    // 计算当前路由的完整路径
    let fullPath = route.path
    if (parentPath && !route.path.startsWith('/')) {
      fullPath = resolvePath(parentPath, route.path)
    }

    // 如果有子路由，递归提取子路由路径
    if (route.children && route.children.length > 0) {
      const childPaths = getValidMenuPaths(route.children, fullPath)
      paths.push(...childPaths)

      // 如果父路由有标题且不隐藏，也加入路径（用于父级菜单点击）
      if (route.meta?.title && !route.meta?.hideInMenu) {
        paths.push(fullPath)
        // 如果有重定向路径，也加入
        if (route.redirect) {
          paths.push(route.redirect)
        }
      }
    } else if (route.meta?.title && !route.meta?.hideInMenu) {
      // 叶子节点路由
      paths.push(fullPath)
    }
  })

  return paths
}
