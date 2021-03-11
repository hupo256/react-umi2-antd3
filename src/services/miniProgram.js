import request from '../utils/request';
import { baseurl } from './config';

// 获取表单已绑定关系
export async function formbindmap(params) {
  return request(baseurl + '/api/v1/wechat/form/bindMap', {
    method: 'POST',
    body: params,
  });
}

// 表单列表
export async function formlist(params) {
  return request(baseurl + '/api/v1/wechat/form/list', {
    method: 'POST',
    body: params,
  });
}

// 配置表单
export async function formcollocate(params) {
  return request(baseurl + '/api/v1/wechat/form/bind', {
    method: 'POST',
    body: params,
  });
}

// Saas 获取授权信息
export async function getAuthInfo(params) {
  return request(baseurl + '/api/v1/sso/wechat-mini/getAuthInfoBySaasSellCode', {
    method: 'POST',
    body: params,
  });
}

// Saas 获取授权链接
export async function getAuthUrl(params) {
  return request(baseurl + '/api/v1/sso/wechat-mini/getAuthUrlBySaasSellCode', {
    method: 'POST',
    body: params,
  });
}
