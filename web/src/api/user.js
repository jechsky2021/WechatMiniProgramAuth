import { request } from './request'

// 用户相关API
export const userApi = {
  // 登录
  login(data) {
    return request.post('/moniLogin', data)
  },
  
  // 注册
  register(data) {
    return request.post('/user/register', data)
  },
  
  // 获取用户信息
  getUserInfo() {
    return request.get('/user/info')
  }
}

// 微信认证相关API
export const authApi = {
  // 提交认证申请
  submitAuth(data) {
    return request.post('/auth/submit', data)
  },
  
  // 查询认证状态
  getAuthStatus(id) {
    return request.get(`/auth/status/${id}`)
  },
  
  // 更新认证状态
  updateAuthStatus(id, status) {
    return request.put(`/auth/status/${id}`, { status })
  }
}

// 账户相关API
export const accountApi = {
  // 注册账户
  registerAccount(data) {
    return request.post('/account/register', data)
  },
  
  // 获取账户列表
  getAccountList(params) {
    return request.get('/account/list', params)
  }
}