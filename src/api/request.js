import axios from 'axios'

// 创建axios实例
console.log('Environment API Base URL:', import.meta.env.VITE_API_BASE_URL)
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 使用Vite代理的基础路径
  timeout: 50000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 例如：添加token
    const token = localStorage.getItem('token')
    console.log("requesttoken:",token)
    if (token) {
      config.headers["x-auth-token"] = token
      //config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    // 处理请求错误
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 2xx 范围内的状态码都会触发该函数
    
    console.log("response:",response)
    // 检查session-status头是否为timeout
    const sessionStatus = response.headers['session-status']
    if (sessionStatus === 'timeout') {
      // 登录超时处理
      console.error('登录已超时，请重新登录')
      // 清除登录状态和token
      localStorage.removeItem('token')
      localStorage.removeItem('isLogin')
      localStorage.removeItem('loginCode')
      // 跳转到登录页
      window.location.href = '/login'
      return Promise.reject(new Error('登录已超时'))
    }
    
    const res = response.data
    return res
  },
  error => {
    // 超出 2xx 范围的状态码都会触发该函数
    console.error('响应错误:', error)
    
    // 处理不同的错误状态码
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，跳转到登录页
          console.error('未授权，请重新登录')
          // 清除登录状态和token
          localStorage.removeItem('token')
          localStorage.removeItem('isLogin')
          localStorage.removeItem('loginCode')
          // 跳转到登录页
          window.location.href = '/login'
          break
        case 403:
          console.error('拒绝访问')
          break
        case 404:
          console.error('请求地址不存在')
          break
        case 500:
          console.error('服务器内部错误')
          break
        default:
          console.error(`错误码: ${error.response.status}`)
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('网络错误，请检查网络连接')
    }
    
    return Promise.reject(error)
  }
)

// 导出封装后的axios实例
export default service

// 导出常用的请求方法
export const request = {
  get(url, params = {}, config = {}) {
    return service.get(url, { params, ...config })
  },
  post(url, data = {}, config = {}) {
    return service.post(url, data, config)
  },
  put(url, data = {}, config = {}) {
    return service.put(url, data, config)
  },
  delete(url, params = {}, config = {}) {
    return service.delete(url, { params, ...config })
  },
  patch(url, data = {}, config = {}) {
    return service.patch(url, data, config)
  }
}