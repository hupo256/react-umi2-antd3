import request from '../utils/request';
import { baseurl } from './config';

// 添加线索
export async function trackAdd(params) {
  return request(baseurl + '/api/v1/sso/track/addNew', {
    method: 'POST',
    body: params,
    systemCode: 'S005',
  });
}
// 根据手机号查询线索
export async function checkMobile(params) {
  return request(baseurl + '/api/v1/sso/track/checkMobile', {
    method: 'POST',
    body: params,
    systemCode: 'S005',
  });
}

// 编辑线索
export async function trackEdit(params) {
  return request(baseurl + '/api/v1/sso/track/editNew', {
    method: 'POST',
    body: params,
    systemCode: 'S005',
  });
}

// 根据uid查询线索
export async function trackGet(params) {
  return request(baseurl + '/api/v1/sso/track/get', {
    method: 'POST',
    body: params,
    systemCode: 'S005',
  });
}

// 变更线索状态
export async function trackEditStatus(params) {
  return request(baseurl + '/api/v1/sso/track/editStatus', {
    method: 'POST',
    body: params,
    systemCode: 'S005',
  });
}

// 导出线索
export async function trackExportCriteria(params) {
  return request(
    `${baseurl}/api/v1/sso/track/exportCriteria`,
    {
      method: 'POST',
      body: params,
      systemCode: 'S005',
    },
    true,
    `线索列表.xls`
  );
}
// 分页查询线索
export async function trackQuery(params) {
  return request(baseurl + '/api/v1/sso/track/queryCriteria', {
    method: 'POST',
    body: params,
    systemCode: 'S005',
  });
}

// 分页查询推荐列表
export async function queryReferrer(params) {
  return request(baseurl + '/api/v1/sso/track/queryReferrer', {
    method: 'POST',
    body: params,
    systemCode: 'S005',
  });
}

// 查询推荐人建议
export async function queryUserByName(params) {
  return request(baseurl + '/api/v1/sso/user/queryUserByName', {
    method: 'POST',
    body: params,
    systemCode: 'S005',
  });
}
// 获取线索来源渠道树
export async function getTree(params) {
  return request(baseurl + '/api/v1/sso/track/source/getTree', {
    method: 'POST',
    body: params,
    systemCode: 'S005',
  });
}

// 分页查询线索状态变更记录
export async function trackstatuslog(params) {
  return request(baseurl + '/api/v1/sso/track/log/query', {
    method: 'POST',
    body: params,
    systemCode: 'S005',
  });
}
