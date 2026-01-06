import { request } from './request'

export const weChatAuthApi = {
  weChatAuthList(data) {
    return request.post('/wechatAuthCustomerEndPoint/findWechatAuthCustomerByPage', data)
  },
  updateMiniProgramAvatar(data) {
    return request.post('/customerInfoEndPoint/setMiniProgramHeadImage', data)
  },
  updateMiniProgramName(data) {
    return request.post('/customerInfoEndPoint/setMiniProgramNickName', data)
  },
  updateMiniProgramSignature(data) {
    return request.post('/customerInfoEndPoint/setMiniProgramSignature', data)
  },
  getAllCategoriesByType(data) {
    return request.post('/customerInfoEndPoint/getAllCategoriesByType', data)
  },
  addMiniProgramCategory(data) {
    return request.post('/customerInfoEndPoint/addMiniProgramCategory', data)
  },
  authICPRecord(data) {
    return request.post('/wechatAuthCustomerEndPoint/findWechatApplyRecordByPage', data)
  }
}