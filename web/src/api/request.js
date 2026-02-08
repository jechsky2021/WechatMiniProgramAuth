import axios from 'axios'
import { ElMessageBox } from 'element-plus'


// API基础路径前缀
const API_BASE_PREFIX ='/v1.0/wechatOpenServer' // import.meta.env.VITE_API_BASE_PREFIX   // '/wechatOpenServer' //'/v1.0/wechatOpenServer'

// 创建axios实例
// console.log('Environment API Base URL:', import.meta.env.VITE_API_BASE_URL)
const service = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || '/api'}${API_BASE_PREFIX}`, // 使用Vite代理的基础路径
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
    // console.log("requesttoken:",token)
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
    
   // console.log("response:",response)
    // 检查session-status头是否为timeout
    const sessionStatus = response.headers['session-status']
    if (sessionStatus === 'timeout') {
      // 登录超时处理
      console.error('登录已超时，请重新登录')
      // 显示确认框
      ElMessageBox.confirm('登录已超时，请重新登录', '登录超时', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showCancelButton: false // 只显示确定按钮
      }).then(() => {
        // 清除所有缓存和登录状态
        localStorage.clear() // 清空所有localStorage
        // 跳转到登录页，确保使用相对路径避免跨域
        window.location.href = '/login'
      }).catch(() => {
        // 即使用户取消，也强制跳转到登录页
        localStorage.clear()
        window.location.href = '/login'
      })
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
          // 显示确认框
          ElMessageBox.confirm('登录已过期，请重新登录', '登录过期', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showCancelButton: false // 只显示确定按钮
          }).then(() => {
            // 清除所有缓存和登录状态
            localStorage.clear() // 清空所有localStorage
            // 跳转到登录页，确保使用相对路径避免跨域
            window.location.href = '/login'
          }).catch(() => {
            // 即使用户取消，也强制跳转到登录页
            localStorage.clear()
            window.location.href = '/login'
          })
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

// 文件服务的API路径前缀
const FILES_BASE_PREFIX = '/v1.0/pictureServer'  // import.meta.env.VITE_FILES_BASE_PREFIX // '/pictureServer'  // 

// 文件服务的axios实例
const fileService = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || '/api'}${FILES_BASE_PREFIX}`,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 文件服务的请求拦截器
fileService.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
   // console.log("token:",token)
    if (token) {
      config.headers["x-auth-token"] = token
    }
    return config
  },
  error => {
    console.error('文件请求错误:', error)
    return Promise.reject(error)
  }
)

// 文件服务的响应拦截器
fileService.interceptors.response.use(
  response => {
    // 检查session-status头是否为timeout
    const sessionStatus = response.headers['session-status']
    if (sessionStatus === 'timeout') {
      // 登录超时处理
      console.error('登录已超时，请重新登录')
      // 显示确认框
      ElMessageBox.confirm('登录已超时，请重新登录', '登录超时', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showCancelButton: false // 只显示确定按钮
      }).then(() => {
        // 清除所有缓存和登录状态
        localStorage.clear() // 清空所有localStorage
        // 跳转到登录页，确保使用相对路径避免跨域
        window.location.href = '/login'
      }).catch(() => {
        // 即使用户取消，也强制跳转到登录页
        localStorage.clear()
        window.location.href = '/login'
      })
      return Promise.reject(new Error('登录已超时'))
    }
    return response.data
  },
  error => {
    console.error('文件响应错误:', error)
    
    // 处理不同的错误状态码
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，跳转到登录页
          console.error('未授权，请重新登录')
          // 显示确认框
          ElMessageBox.confirm('登录已过期，请重新登录', '登录过期', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showCancelButton: false // 只显示确定按钮
          }).then(() => {
            // 清除所有缓存和登录状态
            localStorage.clear() // 清空所有localStorage
            // 跳转到登录页，确保使用相对路径避免跨域
            window.location.href = '/login'
          }).catch(() => {
            // 即使用户取消，也强制跳转到登录页
            localStorage.clear()
            window.location.href = '/login'
          })
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

// 图片服务基础URL
const pictureServerBaseUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://tevv37568542.vicp.fun'}${FILES_BASE_PREFIX}`
const picPrePath = `/fileManageEndPoint/downLoadFromOSS?fileName=`
// console.log('pictureServerBaseUrl:', pictureServerBaseUrl)
// 导出封装后的axios实例
export default service

// 导出文件服务实例
export { fileService, pictureServerBaseUrl,picPrePath }

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