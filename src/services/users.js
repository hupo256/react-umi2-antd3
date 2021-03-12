import request from '../utils/request';
import { baseurl } from './config';

//查询权限
export async function queryMenuBtnLogin(params) {
  return request(baseurl + '/api/v1/sso/login/getUser', {
    method: 'POST',
    body: params,
  });
}

//修改个人信息
export async function normaledit(params) {
  return request(baseurl + '/api/v1/sc/user/normaledit', {
    method: 'POST',
    body: params,
  });
}

//根据角色查人
export async function getusersbyrole(params) {
  return request(baseurl + '/api/v1/sc/user/getusersbyrole', {
    method: 'POST',
    body: params,
  });
}

export async function getusersbyroles(params) {
  return request(baseurl + '/api/v1/sc/user/getusersbyroles', {
    method: 'POST',
    body: params,
  });
}

//获取uuid
export async function getStrCode() {
  return request(baseurl + '/api/v1/sso/login/getUuid', {
    method: 'POST',
  });
}
// 验证码
export async function getVerificationCode(params) {
  return request(baseurl + '/api/v1/sso/login/verificationCode?uuid=' + params, {
    method: 'GET',
    //body: params,
  });
}
