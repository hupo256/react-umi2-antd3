import request from '../utils/request';
import { baseurl } from './config';

// 添加线索
export async function trackAdd(params) {
  return request(baseurl + '/api/v1/saas/track/add', {
    method: 'POST',
    body: params,
  });
}

// 编辑线索
export async function trackEdit(params) {
  return request(baseurl + '/api/v1/saas/track/edit', {
    method: 'POST',
    body: params,
  });
}

// 根据uid查询线索
export async function trackGet(params) {
  return request(baseurl + '/api/v1/saas/track/get', {
    method: 'POST',
    body: params,
  });
}

// 变更线索状态
export async function trackEditStatus(params) {
  return request(baseurl + '/api/v1/saas/track/editStatus', {
    method: 'POST',
    body: params,
  });
}

// 导出线索
export async function trackExportCriteria(params) {
  return request(
    `${baseurl}/api/v1/saas/track/exportCriteria`,
    {
      method: 'POST',
      body: params,
    },
    true,
    `线索列表.xls`
  );
}
// 分页查询线索
export async function trackQuery(params) {
  return request(baseurl + '/api/v1/saas/track/queryCriteria', {
    method: 'POST',
    body: params,
  });
}

// 分页查询推荐列表
export async function queryReferrer(params) {
  return request(baseurl + '/api/v1/saas/track/queryReferrer', {
    method: 'POST',
    body: params,
  });
}

// 查询推荐人建议
export async function queryReferrerSuggest(params) {
  return request(baseurl + '/api/v1/saas/track/queryReferrerSuggest', {
    method: 'POST',
    body: params,
  });
}
// 获取线索来源渠道树
export async function getTree(params) {
  return request(baseurl + '/api/v1/saas/tracksourcechannel/getTree', {
    method: 'POST',
    body: params,
  });
}

// 分页查询线索状态变更记录
export async function trackstatuslog(params) {
  return request(baseurl + '/api/v1/saas/trackstatuslog/query', {
    method: 'POST',
    body: params,
  });
}
