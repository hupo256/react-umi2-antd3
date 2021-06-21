/*
 * @Author: your name
 * @Date: 2021-06-10 18:35:51
 * @LastEditTime: 2021-06-11 18:45:02
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \front-wechat-saas\src\services\caseLibrary.js
 */
import request from '../utils/request';
import { baseurl } from './config';

// 创建编辑案例
export async function createCasr(params) {
  return request(baseurl + '/api/v1/wechat/case/createOrUpdateCase', {
    method: 'POST',
    body: params,
  });
}

// 根据UID获取案例
export async function getCaseByUid(params) {
  return request(baseurl + '/api/v1/wechat/case/getCaseByUid', {
    method: 'POST',
    body: params,
  });
}

// 查询案例
export async function queryCaseList(params) {
  return request(baseurl + '/api/v1/wechat/case/queryCaseList', {
    method: 'POST',
    body: params,
  });
}

// 查询案例图片
export async function queryCasePicList(params) {
  return request(baseurl + '/api/v1/wechat/case/queryCasePicList', {
    method: 'POST',
    body: params,
  });
}

// 更新案例图片
export async function updateCasePic(params) {
  return request(baseurl + '/api/v1/wechat/case/updateCasePic', {
    method: 'POST',
    body: params,
  });
}

// 更新案例状态
export async function updateCaseStatus(params) {
  return request(baseurl + '/api/v1/wechat/case/updateCaseStatus', {
    method: 'POST',
    body: params,
  });
}

// 获取案例小程序码
export const getCode = async body => request(`${baseurl}/api/v1/wechat/wechat-mini/qrcode/getQrCode`, {
  method: 'POST',
  body
})