import { request } from './request'

export const templateLibraryApi = {
  getTemplateList(data) {
    return request.post('/templatedOperateEndPoint/getTemplateList', data)
  },
  getTemplateDraftList(data) {
    return request.post('/templatedOperateEndPoint/getTemplateDraftList', data)
  },
  draftAddtotemplate(data) {
    return request.post('/templatedOperateEndPoint/draftAddtotemplate', data)
  },
  deleteTemplate(data) {
    return request.post('/templatedOperateEndPoint/deleteTemplate', data)
  }
}
