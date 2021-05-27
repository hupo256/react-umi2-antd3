import request from '../utils/request';
import { baseurl } from './config';

// 查询字典模块列表
export async function queryDicModuleList(params) {
  return request(baseurl + '/api/v1/wechat/dic/queryDicModuleList', {
    method: 'POST',
    body: params,
  });
}
// 创建/编辑字典
export async function createDic(params) {
  return request(baseurl + '/api/v1/wechat/dic/createDic', {
    method: 'POST',
    body: params,
  });
}
// 根据UID查询字典
export async function getDicByUid(params) {
  return request(baseurl + '/api/v1/wechat/dic/getDicByUid', {
    method: 'POST',
    body: params,
  });
}
// 其他模块查询字典
export async function queryDicForForm(params) {
  return request(baseurl + '/api/v1/wechat/dic/queryDicForForm', {
    method: 'POST',
    body: params,
  });
}
// 查询文章栏目字典
export async function queryArticleTopicDic(params) {
  return request(baseurl + '/api/v1/wechat/article/queryArticleTopicDic', {
    method: 'POST',
    body: params,
  });
}

// 查询字典列表
export async function queryDicListByModule(params) {
  return request(baseurl + '/api/v1/wechat/dic/queryDicListByModule', {
    method: 'POST',
    body: params,
  });
}
// 拖拽排序
export async function sortDic(params) {
  return request(baseurl + '/api/v1/wechat/dic/sortDic', {
    method: 'POST',
    body: params,
  });
}
// 修改字典状态
export async function updateDicStatus(params) {
  return request(baseurl + '/api/v1/wechat/dic/updateDicStatus', {
    method: 'POST',
    body: params,
  });
}
