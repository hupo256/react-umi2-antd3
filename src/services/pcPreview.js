import request from '../utils/request';
import { baseurl } from './config';
import { stringify } from 'qs';

// PC HEADER (不登陆)
export function getMenuListPublic(params) {
  return request(baseurl + `/api/v1/wechat/menu/preview/list`, {
    method: 'GET',
  });
}

// PC HEADER （登陆）
export function getMenuList(params) {
  return request(`${baseurl}/api/v1/wechat/menu/list`, {
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
