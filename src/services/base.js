import request from '../utils/request';
import { baseurl } from './config';

//字典数据
export async function query(params) {
  return request(baseurl + '/api/v1/saas/systemdic/query', {
    method: 'POST',
    body: params,
  });
}

// 获取公司下的员工信息
export async function queryPersonnel(params) {
  return request(baseurl + '/api/v1/saas/systemuser/query', {
    method: 'POST',
    body: params,
  });
}
// 获取地址
export async function getAddr(params) {
  return request(baseurl + '/api/v1/saas/systemaddr/getStreet', {
    method: 'POST',
    body: params,
  });
}

export async function queryAddr(params) {
  return request(baseurl + '/api/v1/crm/addr/queryAddr', {
    method: 'POST',
    body: params,
  });
}

export async function getStreet(params) {
  return request(baseurl + '/api/v1/crm/addr/getStreet', {
    method: 'POST',
    body: params,
  });
}

export async function getpersonnel(params) {
  return request(baseurl + '/api/v1/sc/user/query', {
    method: 'POST',
    body: params,
  });
}

export async function source(params) {
  //查询线索来源
  return request(baseurl + '/api/v1/crm/base/sourceTree', {
    method: 'POST',
    body: params,
  });
}

//上传图片
export async function photoxImg(params) {
  // + params
  return request(baseurl + '/api/v1/saas/file/policy', {
    method: 'POST',
  });
}
// 上传图片
export async function photoImg(params) {
  return request(baseurl + '/oss/upload/policy/photox/img', {
    method: 'POST',
    body: params,
  });
}

// 根据岗位职能编号查询人员列表
export async function queryUsersByPostFunctionCode(params) {
  return request(baseurl + '/api/v1/sc/user/queryUsersByPostFunctionCode', {
    method: 'POST',
    body: params,
  });
}

// 查询自定义表头
export async function tableHeader(params) {
  return request(`${baseurl}/api/v1/crm/ShowField/query`, {
    method: 'POST',
    body: params,
  });
}

// 添加/修改自定义表头
export async function saveShowField(params) {
  return request(`${baseurl}/api/v1/crm/ShowField/add`, {
    method: 'POST',
    body: params,
  });
}

// 获取个人中心数据（pc端）
export async function getSystemuser(params) {
  return request(`${baseurl}/api/v1/saas/systemuser/pc/center`, {
    method: 'POST',
    body: params,
  });
}
// 修改用户信息（pc端）
export async function setSystemuser(params) {
  return request(`${baseurl}/api/v1/saas/systemuser/pc/modifyUserInfo`, {
    method: 'POST',
    body: params,
  });
}
// 个人中心修改手机号发送短信
export async function sendUserMobileMsg(params) {
  return request(`${baseurl}/api/v1/saas/systemuser/app/sendMobileMsgPassword`, {
    method: 'POST',
    body: params,
  });
}

//查询自定义表头
export async function columnQuery(params) {
  return request(`${baseurl}/api/v1/saas/showcolumnuser/query`, {
    method: 'POST',
    body: params,
  });
}
//编辑自定义表头
export async function columnEdit(params) {
  return request(`${baseurl}/api/v1/saas/showcolumnuser/edit`, {
    method: 'POST',
    body: params,
  });
}
//重置自定义表头
export async function columnReset(params) {
  return request(`${baseurl}/api/v1/saas/showcolumnuser/revoke`, {
    method: 'POST',
    body: params,
  });
}
//个人中心修改手机号
export async function sendMobileMsg(params) {
  return request(`${baseurl}/api/v1/saas/systemuser/app/sendMobileMsg`, {
    method: 'POST',
    body: params,
  });
}

export async function sendMobileMsgs(params) {
  return request(`${baseurl}/api/v1/saas/systemuser/app/sendMobileMsgPassword`, {
    method: 'POST',
    body: params,
  });
}