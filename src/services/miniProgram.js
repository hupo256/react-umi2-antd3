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
  return request(baseurl + '/api/v1/wechat/wechat-mini/getAuthInfoBySaasSellCode', {
    method: 'POST',
    body: params,
  });
}

// Saas 获取授权链接
export async function getAuthUrl(params) {
  return request(baseurl + '/api/v1/wechat/wechat-mini/getAuthUrlBySaasSellCode', {
    method: 'POST',
    body: params,
  });
}

// 查询模版
export async function queryTemplate(params) {
  return request(baseurl + '/api/v1/wechat/homePage/queryTemplate', {
    method: 'POST',
    body: params,
  });
}

// 查询小程序首页编辑数据
export async function getHomePageEditData(params) {
  return request(baseurl + '/api/v1/wechat/homePage/getHomePageEditData', {
    method: 'POST',
    body: params,
  });
}

// 查询小程序首页已发布数据「小程序调用」
export async function getHomePagePublishedData(params) {
  return request(baseurl + '/api/v1/wechat/homePage/getHomePagePublishedData', {
    method: 'POST',
    body: params,
  });
}

// 查询小程序首页是否已发布过
export async function getHomePagePublishState(params) {
  return request(baseurl + '/api/v1/wechat/homePage/getHomePagePublishState', {
    method: 'POST',
    body: params,
  });
}

// 更新小程序首页编辑数据
export async function updateHomePageEditData(params) {
  return request(baseurl + '/api/v1/wechat/homePage/updateHomePageEditData', {
    method: 'POST',
    body: params,
  });
}

// 发布小程序首页
export async function publishEditData(params) {
  return request(baseurl + '/api/v1/wechat/homePage/publishEditData', {
    method: 'POST',
    body: params,
  });
}

// 分级查询
export async function queryHomePageData(params) {
  return request(baseurl + '/api/v1/wechat/homePage/queryHomePageData', {
    method: 'POST',
    body: params,
  });
}
