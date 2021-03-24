import request from '../utils/request';
import { baseurl } from './config';

// 创建专题
export async function specialCreate(params) {
  return request(baseurl + '/api/v1/wechat/special/create', {
    method: 'POST',
    body: params,
  });
}

// 启用/停用
export async function specialStatus(params) {
  return request(baseurl + '/api/v1/wechat/special/status', {
    method: 'POST',
    body: params,
  });
}

// 专题详情
export async function specialGet(params) {
  return request(baseurl + '/api/v1/wechat/special/get', {
    method: 'POST',
    body: params,
  });
}

// 编辑专题
export async function specialModify(params) {
  return request(baseurl + '/api/v1/wechat/special/modify', {
    method: 'POST',
    body: params,
  });
}

// 专题列表
export async function pageList(params) {
  return request(baseurl + '/api/v1/wechat/special/pageList', {
    method: 'POST',
    body: params,
  });
}
// 配置专题
export async function specialCollocate(params) {
  return request(baseurl + '/api/v1/wechat/special/collocate', {
    method: 'POST',
    body: params,
  });
}
// 获取专题配置
export async function getCollocation(params) {
  return request(baseurl + '/api/v1/wechat/special/getCollocation', {
    method: 'POST',
    body: params,
  });
}
// 删除专题
export async function specialRemove(params) {
  return request(baseurl + '/api/v1/wechat/special/remove', {
    method: 'POST',
    body: params,
  });
}
// 组件
export async function elementTree(params) {
  return request(baseurl + '/api/v1/wechat/magic/element/tree', {
    method: 'POST',
    body: params,
  });
}
// 表单列表
export async function formList(params) {
  return request(baseurl + '/api/v1/wechat/form/list', {
    method: 'POST',
    body: params,
  });
}
// 绑定表单
export async function formBind(params) {
  return request(baseurl + '/api/v1/wechat/form/bind', {
    method: 'POST',
    body: params,
  });
}
