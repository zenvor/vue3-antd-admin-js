import router from './index'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'

const whiteList = ['/login', '/404']

router.beforeEach(async (to, from, next) => {
  // 注意：在这里获取 store 实例，确保 Pinia 已被挂载
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const token = userStore.token

  // 设置页面标题
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} - 全景图库管理系统`
  }

  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 检查是否已获取用户信息（通过 roles 判断）
      if (userStore.roles && userStore.roles.length > 0) {
        next()
      } else {
        try {
          // 1. 获取用户信息
          const { roles } = await userStore.getInfo()

          // 2. 根据角色生成可访问路由
          const accessRoutes = await permissionStore.generateRoutes(roles)

          // 3. 动态添加路由
          accessRoutes.forEach((route) => {
            router.addRoute(route)
          })

          // 4. 确保路由添加完成（replace: true）
          // hack 方法: 确保 addRoutes 已完成
          next({ ...to, replace: true })
        } catch (error) {
          console.error('Permission Guard Error:', error)
          // 出错时（如 token 失效），重置 token 并跳转登录页
          await userStore.resetToken()
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})
