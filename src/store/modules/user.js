import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAuthToken, setAuthToken, clearAuthToken } from '@/utils/permission'
import { RoleEnum } from '@/enums/RoleEnum'
import defaultAvatar from '@/assets/images/default-avatar.png'

export const useUserStore = defineStore('user', () => {
  const token = ref(getAuthToken())
  const roles = ref([])
  const name = ref('')
  const avatar = ref('')

  /**
   * 登录
   * @param {Object} userInfo
   */
  async function login(userInfo) {
    const { username } = userInfo
    // 模拟 API 调用
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username) {
          const mockToken = 'mock-token-' + username
          token.value = mockToken
          setAuthToken(mockToken)
          resolve()
        } else {
          reject(new Error('用户名不能为空'))
        }
      }, 500)
    })
  }

  /**
   * 获取用户信息
   */
  async function getInfo() {
    return new Promise((resolve) => {
      // 模拟 API 调用，根据 token 决定角色
      setTimeout(() => {
        if (token.value?.includes('admin')) {
          roles.value = [RoleEnum.ADMIN]
          name.value = '超级管理员'
          avatar.value = defaultAvatar
        } else {
          roles.value = [RoleEnum.USER]
          name.value = '普通用户'
          avatar.value = defaultAvatar
        }
        resolve({ roles: roles.value, name: name.value, avatar: avatar.value })
      }, 200)
    })
  }

  /**
   * 登出
   */
  function logout() {
    return new Promise((resolve) => {
      token.value = ''
      roles.value = []
      clearAuthToken()
      resolve()
    })
  }

  /**
   * 重置 Token
   */
  function resetToken() {
    return new Promise((resolve) => {
      token.value = ''
      roles.value = []
      clearAuthToken()
      resolve()
    })
  }

  return {
    token,
    roles,
    name,
    avatar,
    login,
    getInfo,
    logout,
    resetToken
  }
})
