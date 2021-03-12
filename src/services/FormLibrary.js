import request from '../utils/request';
import { baseurl } from './config';

// 创建表单
export async function formCreate(params) {
  return request(baseurl + '/api/v1/wechat/form/create', {
    method: 'POST',
    body: params,
  });
}

// 启用/停用
export async function formStatus(params) {
  return request(baseurl + '/api/v1/wechat/form/status', {
    method: 'POST',
    body: params,
  });
}

// 表单详情
export async function formGet(params) {
  return request(baseurl + '/api/v1/wechat/form/get', {
    method: 'POST',
    body: params,
  });
}

// 编辑表单
export async function formModify(params) {
  return request(baseurl + '/api/v1/wechat/form/modify', {
    method: 'POST',
    body: params,
  });
}

// 表单列表
export async function formList(params) {
  return request(baseurl + '/api/v1/wechat/form/pageList', {
    method: 'POST',
    body: params,
  });
}
// 配置表单
export async function formCollocate(params) {
  return request(baseurl + '/api/v1/wechat/form/collocate', {
    method: 'POST',
    body: params,
  });
}
// 获取表单配置
export async function formgetCollocation(params) {
  return request(baseurl + '/api/v1/wechat/form/getCollocation', {
    method: 'POST',
    body: params,
  });
}
// 删除表单
export async function formRemove(params) {
  return request(baseurl + '/api/v1/wechat/form/remove', {
    method: 'POST',
    body: params,
  });
}
