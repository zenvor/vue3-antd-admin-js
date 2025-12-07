import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layouts/index.vue'

// 基础路由（所有用户可访问）
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'Login',
    meta: { layout: false, hideInMenu: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: '仪表盘',
          icon: 'dashboard-outlined',
          affix: true
        }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/dashboard/index.vue'), // 暂时复用，需后续创建404页面
    name: '404',
    meta: { hideInMenu: true }
  }
]

// 动态路由（根据权限加载）
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/admin',
    name: 'Permission',
    meta: {
      title: '权限测试',
      icon: 'lock-outlined',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/dashboard/index.vue'), // 复用
        name: 'PermissionAdmin',
        meta: {
          title: '管理员页面',
          roles: ['admin']
        }
      },
      {
        path: 'editor',
        component: () => import('@/views/dashboard/index.vue'), // 复用
        name: 'PermissionEditor',
        meta: {
          title: '普通页',
          roles: ['editor']
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'NotFound',
    meta: { hideInMenu: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ top: 0 })
})

export default router
