import { defineStore } from 'pinia'
import { ref } from 'vue'
import { constantRoutes } from '@/router'

/**
 * 判断是否有权限访问该路由
 * @param {Array} roles - 用户角色列表
 * @param {Object} route - 路由对象
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表
 * @param {Array} routes - 待过滤的路由表
 * @param {Array} roles - 用户角色
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref([])
  const addRoutes = ref([])

  function setRoutes(newRoutes) {
    addRoutes.value = newRoutes
    routes.value = constantRoutes.concat(newRoutes)
  }

  function generateRoutes(roles) {
    return new Promise((resolve) => {
      // 动态导入 asyncRoutes，避免循环依赖
      import('@/router').then(({ asyncRoutes }) => {
        let accessedRoutes
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes || [], roles)
        }
        setRoutes(accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }

  return {
    routes,
    addRoutes,
    generateRoutes
  }
})
