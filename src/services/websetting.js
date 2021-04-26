import request from '../utils/request';
import { baseurl } from './config';

// 查询域名
export async function hostSetting() {
  return request(baseurl + '/api/v1/wechat/website/domain/get', {
    method: 'POST',
    // body: params,
  });
}
// 绑定域名
export async function hostSettingBind(params) {
  return request(baseurl + '/api/v1/wechat/website/domain/bind', {
    method: 'POST',
    body: params,
  });
}
// 查询基本信息
export async function basicMessage() {
  return request(baseurl + '/api/v1/wechat/website/baseinfo/get', {
    method: 'POST',
    // body: params,
  });
}
// 保存基本信息
export async function basicMessageSave(params) {
  return request(baseurl + '/api/v1/wechat/website/baseinfo/modify', {
    method: 'POST',
    body: params,
  });
}
// 查询自定义代码
export async function customCodeModel() {
  return request(baseurl + '/api/v1/wechat/website/customcode/get', {
    method: 'POST',
    // body: params,
  });
}
// 保存自定义代码
export async function customCodeSave(params) {
  return request(baseurl + '/api/v1/wechat/website/customcode/modify', {
    method: 'POST',
    body: params,
  });
}
// 保存企业信息
export async function enterpriseMessageSave(params) {
  return request(baseurl + '/api/v1/wechat/website/companyinfo/modify', {
    method: 'POST',
    body: params,
  });
}
// 查询企业信息
export async function enterpriseMessageModel() {
  return request(baseurl + '/api/v1/wechat/website/companyinfo/get', {
    method: 'POST',
    // body: params,
  });
}
