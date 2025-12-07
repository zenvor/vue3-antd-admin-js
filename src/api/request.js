import axios from 'axios'
import { message } from 'ant-design-vue'
import errorCode from '@/utils/error/errorCode'
import { BASE_URL } from './config'
import { getAuthToken } from '@/utils/permission'

// 创建全局 axios 实例
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器：添加 token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器：统一处理响应和错误
axiosInstance.interceptors.response.use(
  (response) => {
    const { responseType } = response.request

    // 处理文件下载类响应
    if (['blob', 'arraybuffer'].includes(responseType)) {
      return response.data
    }

    const { code, message: errorMessage } = response.data

    // 业务错误处理
    if (code !== 200) {
      const msg = errorMessage || errorCode[code] || errorCode.default
      message.error(msg)
      return Promise.reject(new Error(msg))
    }

    return response.data
  },
  (error) => {
    console.error('请求错误:', error)

    // HTTP 错误处理
    if (error.response) {
      const { status, data } = error.response
      const msg = data?.message || data?.error || errorCode[status] || errorCode.default
      message.error(msg)
    } else {
      // 网络错误处理
      let msg = errorCode.default
      if (error.message === 'Network Error') {
        msg = '网络连接异常'
      } else if (error.message.includes('timeout')) {
        msg = '请求超时'
      }
      message.error(msg)
    }

    return Promise.reject(error)
  }
)

// 封装请求方法
const request = {
  /**
   * 发送 GET 请求
   * @param {string} url - 请求路径
   * @param {object} [params] - 查询参数
   * @param {import('axios').AxiosRequestConfig} [config] - Axios 可选配置
   * @returns {Promise<any>} 响应数据
   */
  get: (url, params, config = {}) => {
    return axiosInstance.get(url, { params, ...config })
  },

  /**
   * 发送 POST 请求
   * @param {string} url - 请求路径
   * @param {any} data - 请求体数据
   * @param {import('axios').AxiosRequestConfig} [config] - Axios 可选配置
   * @returns {Promise<any>} 响应数据
   */
  post: (url, data, config = {}) => {
    return axiosInstance.post(url, data, config)
  },

  /**
   * 发送 PUT 请求
   * @param {string} url - 请求路径
   * @param {any} data - 请求体数据
   * @param {import('axios').AxiosRequestConfig} [config] - Axios 可选配置
   * @returns {Promise<any>} 响应数据
   */
  put: (url, data, config = {}) => {
    return axiosInstance.put(url, data, config)
  },

  /**
   * 发送 DELETE 请求
   * @param {string} url - 请求路径
   * @param {any} data - 请求体数据（部分服务端实现需要）
   * @param {import('axios').AxiosRequestConfig} [config] - Axios 可选配置
   * @returns {Promise<any>} 响应数据
   */
  delete: (url, data, config = {}) => {
    return axiosInstance.delete(url, { data, ...config })
  }
}

export default request
