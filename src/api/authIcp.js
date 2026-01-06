import { request } from './request'

export const authIcpApi = {
  checkName(data) {
    return request.post('/customerInfoEndPoint/checkMiniProgramNickName', data)
  },
  // 获取地区
  getArea(data) {
    return request.post('/customerInfoEndPoint/queryIcpDistrictCode', data)
  },
  //获取前置审批项类型
  getIcpNrlxTypes(data) {
    return request.post('/customerInfoEndPoint/queryIcpNrlxTypes', data)
  },
  //获取主体单位性质
  getIcpSubjectTypes(data) {
    return request.post('/customerInfoEndPoint/queryIcpSubjectTypes', data)
  },
  //获取主体服务内容类型
  getIcpServiceContentTypes(data) {
    return request.post('/customerInfoEndPoint/queryIcpServiceContentTypes', data)
  },
  //获取证件类型
  getIcpCertificateTypes(data) {
    return request.post('/customerInfoEndPoint/queryIcpCertificateTypes', data)
  },
  //提交认证备案
  submitAuthAndIcp(data) {
    return request.post('/wechatOperateEndPoint/webMiniProgramSubmitAuthAndIcp', data)
  }
}
