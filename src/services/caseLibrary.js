import request from '../utils/request';
import { baseurl } from './config';

// 创建编辑案例
export async function createCasr(params) {
  return request(baseurl + '/api/v1/wechat/case/createOrUpdateCase', {
    method: 'POST',
    body: params,
  });
}

// 根据UID获取案例
export async function getCaseByUid(params) {
  return request(baseurl + '/api/v1/wechat/case/getCaseByUid', {
    method: 'POST',
    body: params,
  });
}

// 查询案例
export async function queryCaseList(params) {
  return request(baseurl + '/api/v1/wechat/case/queryCaseList', {
    method: 'POST',
    body: params,
  });
}

// 查询案例图片
export async function queryCasePicList(params) {
  return request(baseurl + '/api/v1/wechat/case/queryCasePicList', {
    method: 'POST',
    body: params,
  });
}

// 更新案例图片
export async function updateCasePic(params) {
  return request(baseurl + '/api/v1/wechat/case/updateCasePic', {
    method: 'POST',
    body: params,
  });
}

// 更新案例状态
export async function updateCaseStatus(params) {
  return request(baseurl + '/api/v1/wechat/case/updateCaseStatus', {
    method: 'POST',
    body: params,
  });
}
