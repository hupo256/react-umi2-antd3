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