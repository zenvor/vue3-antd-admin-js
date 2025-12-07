/**
 * API 配置
 * API 基础地址优先使用环境变量配置，否则使用当前域名
 */

const API_URL = import.meta.env.VITE_APP_API_URL
export const BASE_URL = API_URL || location.origin
