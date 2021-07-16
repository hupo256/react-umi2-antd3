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

// 上条记录的阶段
export async function dynamicStatus(params) {
  return request(baseurl + '/api/v1/wechat/site/diary/getLastStatus', {
    method: 'POST',
    body: params,
  });
}

// 动态详情
export const getSiteDetaiyApi = body => {
  return request(`${baseurl}/api/v1/wechat/site/diary/get`, {
    method: 'POST',
    body,
  });
};

// 修改工地动态
export const editSiteDetailApi = body => {
  return request(`${baseurl}/api/v1/wechat/site/diary/update`, {
    method: 'POST',
    body,
  });
};
// 查询已选工地（我的工地）uid列表
export const queryProjectUids = body =>
  request(`${baseurl}/api/v1/wechat/site/queryProjectUids`, {
    method: 'POST',
    body,
  });

// 查询已有工地列表
export const queryProjectOtherSys = body =>
  request(`${baseurl}/api/v1/saas/project/queryProjectOtherSys`, {
    method: 'POST',
    body,
  });
// 获取工地工程节点关联关系
export const engineeringMap = body =>
  request(`${baseurl}/api/v1/wechat/site/engineeringMap`, {
    method: 'POST',
    body,
  });
//  获取工地可关联工程节点
export const engineeringTask = body =>
  request(`${baseurl}/api/v1/saas/project/engineeringTask`, {
    method: 'POST',
    body,
  });
// 更新工地工程节点关联关系
export const updateEngineeringMap = body =>
  request(`${baseurl}/api/v1/wechat/site/updateEngineeringMap`, {
    method: 'POST',
    body,
  });
// 从已有工地列表单条详情
export const getProjectDetail = body =>
  request(`${baseurl}/api/v1/saas/project/get`, {
    method: 'POST',
    body,
  });
