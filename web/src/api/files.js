import { fileService } from './request'

// 保存图片
export const saveGoodsPic = (params) => {
  return fileService.post('/fileManageEndPoint/saveGoodsPic', params)
}

export const saveCustomerPic = (params) => {
  return fileService.post('/fileManageEndPoint/saveCustomerPic', params)
}

// 查看图片
export const downLoadFromOSS = (params) => {
  return fileService.post('/fileManageEndPoint/downLoadFromOSS', params)
}