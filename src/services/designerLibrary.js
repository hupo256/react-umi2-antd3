import request from '../utils/request';
import { baseurl } from './config';

// 创建/编辑设计师
export async function createDesigner(params) {
  return request(baseurl + '/api/v1/wechat/designer/createOrUpdateDesigner', {
    method: 'POST',
    body: params,
  });
}

// 根据UID查询设计师
export async function getDesignerByUid(params) {
  return request(baseurl + '/api/v1/wechat/designer/getDesignerByUid', {
    method: 'POST',
    body: params,
  });
}

// 查询设计师列表
export async function queryDesignerList(params) {
  return request(baseurl + '/api/v1/wechat/designer/queryDesignerList', {
    method: 'POST',
    body: params,
  });
}

// 修改设计师状态
export async function updateStatus(params) {
  return request(baseurl + '/api/v1/wechat/designer/updateDesignerStatus', {
    method: 'POST',
    body: params,
  });
}
