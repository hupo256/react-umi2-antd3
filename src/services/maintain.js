import request from '../utils/request';
import { baseurl } from './config';

// 查询工单列表
export async function workOrderQuery(params) {
  return request(baseurl + '/api/v1/saas/work-order/query', {
    method: 'POST',
    body: params,
  });
}

// 工单详情
export async function workOrderDetail(params) {
  return request(baseurl + '/api/v1/saas/work-order/detail', {
    method: 'POST',
    body: params,
  });
}

// 分配工单
export async function workOrderAllocate(params) {
  return request(baseurl + '/api/v1/saas/work-order/allocate', {
    method: 'POST',
    body: params,
  });
}
// 转移工单
export async function workOrderTransfer(params) {
  return request(baseurl + '/api/v1/saas/work-order/transfer', {
    method: 'POST',
    body: params,
  });
}
// 完结工单
export async function workOrderComplete(params) {
  return request(baseurl + '/api/v1/saas/work-order/complete', {
    method: 'POST',
    body: params,
  });
}
