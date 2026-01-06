import { request } from './request'

export const customerApi = {
  getCustomerList(data) {
    return request.post('/customerInfoEndPoint/findCustomerInfoByPage', data)
  },
  saveCustomer(data) {
    return request.post('/customerInfoEndPoint/saveOrUpdateCustomerInfo', data)
  },
  createMiniProgram(data) {
    return request.post('/customerInfoEndPoint/customerInfoCreateWechat', data)
  }
}


