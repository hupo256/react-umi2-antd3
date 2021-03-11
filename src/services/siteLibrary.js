import request from '../utils/request';
import { baseurl } from './config';

// 创建工地
export async function createSite(params) {
  return request(baseurl + '/api/v1/wechat/site/create', {
    method: 'POST',
    body: params,
  });
}

// 启用/停用
export async function siteDisable(params) {
  return request(baseurl + '/api/v1/wechat/site/disable', {
    method: 'POST',
    body: params,
  });
}

// 工地详情
export async function siteDetail(params) {
  return request(baseurl + '/api/v1/wechat/site/get', {
    method: 'POST',
    body: params,
  });
}

// 编辑工地
export async function modifySite(params) {
  return request(baseurl + '/api/v1/wechat/site/modify', {
    method: 'POST',
    body: params,
  });
}

// 工地列表
export async function siteList(params) {
  return request(baseurl + '/api/v1/wechat/site/pageList', {
    method: 'POST',
    body: params,
  });
}

// 从已有项目选择
export async function queryFromProject(params) {
  return request(baseurl + '/api/v1/wechat/site/queryFromProject', {
    method: 'POST',
    body: params,
  });
}

// 动态列表
export async function dynamicList(params) {
  return request(baseurl + '/api/v1/wechat/site/diary/pageTree', {
    method: 'POST',
    body: params,
  });
}

// 创建动态
export async function createDynamic(params) {
  return request(baseurl + '/api/v1/wechat/site/diary/push', {
    method: 'POST',
    body: params,
  });
}

// 显示/隐藏
export async function dynamicShow(params) {
  return request(baseurl + '/api/v1/wechat/site/diary/show', {
    method: 'POST',
    body: params,
  });
}

// 动态列表
export async function pageDynamic(params) {
  return request(baseurl + '/api/v1/wechat/site/diary/pageList', {
    method: 'POST',
    body: params,
  });
}
