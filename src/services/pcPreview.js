import request from '../utils/request';
import { baseurl } from './config';
import { stringify } from 'qs';

// PC HEADER （登陆）
export function getMenuList(params) {
  return request(`${baseurl}/api/v1/wechat/menu/preview/menuList`, {
    method: 'POST',
    body: params,
  });
}

// PC FOOTER
export function getFooter(params) {
  return request(baseurl + '/api/v1/wechat/website/companyinfo/view', {
    method: 'POST',
    body: params,
  });
}

// PC OTHER INFO
export function getPublishedData(params) {
  return request(baseurl + '/api/v1/wechat/homePage/pc/getHomePagePublishedData', {
    method: 'POST',
    body: params,
  });
}

// 获取域名
export function getDomain(params) {
  return request(baseurl + '/api/v1/wechat/website/domain/get', {
    method: 'POST',
    body: params,
  });
}
