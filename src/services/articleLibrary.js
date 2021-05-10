import request from '../utils/request';
import { baseurl } from './config';

// 文章列表
export async function getArticleList(params) {
  return request(baseurl + '/api/v1/wechat/article/pageList', {
    method: 'POST',
    body: params,
  });
}

// 创建文章
export async function createArticle(params) {
  return request(baseurl + '/api/v1/wechat/article/create', {
    method: 'POST',
    body: params,
  });
}

// 编辑文章
export async function editArticle(params) {
  return request(baseurl + '/api/v1/wechat/article/modify', {
    method: 'POST',
    body: params,
  });
}

// 文章详情
export async function getArticleDetail(params) {
  return request(baseurl + '/api/v1/wechat/article/get', {
    method: 'POST',
    body: params,
  });
}

// 切换文章状态
export async function articleStatus(params) {
  return request(baseurl + '/api/v1/wechat/article/status', {
    method: 'POST',
    body: params,
  });
}

// 公有库文章
export async function publicList(params) {
  return request(baseurl + '/api/v1/wechat/article/public/pageList', {
    method: 'POST',
    body: params,
  });
}

// 公有库文章
export async function publicDetail(params) {
  return request(baseurl + '/api/v1/wechat/article/public/detail', {
    method: 'POST',
    body: params,
  });
}

// 公有库文章详情
export async function getPublicArticleDetail(params) {
  return request(baseurl + '/api/v1/wechat/article/public/detail', {
    method: 'POST',
    body: params,
  });
}
