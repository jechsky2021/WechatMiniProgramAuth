import { request } from './request'

export const developmentManageApi = {
  operation(data) {
    return request.post('/modifyDomainEndPoint/operateModifyDomain', data)
  },
  getAuthMiniList(data) {
    return request.post('/wechatAuthCustomerEndPoint/findWechatAuthByPage', data)
  },
  codeCommit(data) {
    return request.post('/wechatCodeEndPoint/operateWechatCodeCommit', data)
  },
  getQRCode(data) {
    return request.post('/wechatCodeEndPoint/getWechatCodeTrialQRCode', data)
  },
  getVersionInfo(data) {
    return request.post('/wechatCodeEndPoint/getWechatVersionInfo', data)
  },
  getPrivacyInfo(data) {
    return request.post('/wechatCodeEndPoint/getWechatCodePrivacyInfo', data)
  },
  wechatAudit(data) {
    return request.post('/wechatCodeEndPoint/submitWechatAudit', data)
  },
  //发布已通过审核的小程序 参数authAppid
  weChatRelease(data) {
    return request.post('/wechatCodeEndPoint/operateWechatRelease', data)
  },
  //查询最新一次审核单状态 参数authAppid
  wechatLastestAuditStatus(data) {
    return request.post('/wechatCodeEndPoint/getWechatLatestAuditStatus', data)
  },
  //发布已通过审核的小程序 参数authAppid
  weChatRelease(data) {
    return request.post('/wechatCodeEndPoint/operateWechatRelease', data)
  },
  //撤回代码审核 参数authAppid
  weChatUndoAudit(data) {
    return request.post('/wechatCodeEndPoint/operateWechatUndoAudit', data)
  },
  //体验人员列表 参数authAppid
  wechatTesterList(data) {
    return request.post('/wechatTesterEndPoint/getWechatTesterList', data)
  },
  //新增人员 参数authAppid  wechatId(微信号)
  bindWechatTester(data) {
    return request.post('/wechatTesterEndPoint/bindWechatTester', data)
  },
  //解除体验人员  参数authAppid   testerId(列表查出来的id)
  unBindWechatTester(data) {
    return request.post('/wechatTesterEndPoint/unBindWechatTester', data)
  }
}
