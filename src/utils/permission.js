/**
 * Token 管理工具函数
 *
 * 说明：此文件为模板项目预留的认证扩展点
 * 提供基础的 token 存储和获取功能
 */

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export function isAuthenticated() {
  return !!sessionStorage.getItem('token')
}

/**
 * 获取当前用户的认证 token
 * @returns {string | null} 认证 token
 */
export function getAuthToken() {
  return sessionStorage.getItem('token')
}

/**
 * 设置认证 token
 * @param {string} token - 认证 token
 */
export function setAuthToken(token) {
  if (token) {
    sessionStorage.setItem('token', token)
  } else {
    sessionStorage.removeItem('token')
  }
}

/**
 * 清除认证 token（用于登出）
 */
export function clearAuthToken() {
  sessionStorage.removeItem('token')
}
