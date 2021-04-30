/*
 * @Author: ql
 * @Date: 2021-04-22 10:55:31
 * @LastEditTime: 2021-04-27 18:07:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front-wechat-saas\src\services\channelManage.js
 */
import request from '@/utils/request'
import { stringify } from 'qs';
import { baseurl } from './config';

//获取频道管理列表信息
export const getList =  body => request(`${baseurl}/api/v1/wechat/menu/list`, {
    method: 'POST',
    body
})

// 新建频道
export const createChannel = body => request(`${baseurl}/api/v1/wechat/menu/add`, {
    method: 'POST',
    body
})

// 编辑频道
export const editChannelApi = body => request(`${baseurl}/api/v1/wechat/menu/update`, {
    method: 'POST',
    body
})

// 获取关联页面候选项
export const getRelatedPage = () => request(`${baseurl}/api/v1/wechat/menu/relatedPage`, {
    method: 'GET'
})

// 获取频道详情
export const getDetailApi = body => request(`${baseurl}/api/v1/wechat/menu/detail?${stringify(body)}`, {
    method: 'GET'
})

// 排序接口
export const sortApi = body => request(`${baseurl}/api/v1/wechat/menu/sort`, {
    method: 'POST',
    body
})

// 启停用接口
export const toggleStatusApi = body => request(`${baseurl}/api/v1/wechat/menu/toggleStatus`, {
    method: 'POST',
    body
})

// 工地列表接口
export const siteListApi = body => request(`${baseurl}/api/v1/wechat/site/pageList`, {
    method: 'POST',
    body
})

// 设计师列表接口
export const designerListApi = body => request(`${baseurl}/api/v1/wechat/designer/queryDesignerList`, {
    method: 'POST',
    body
})

// 案例列表接口
export const caseListApi = body => request(`${baseurl}/api/v1/wechat/case/queryCaseList`, {
    method: 'POST',
    body
})

// 文章列表接口
export const articleListApi = body => request(`${baseurl}/api/v1/wechat/article/pageList`, {
    method: 'POST',
    body
})

// 文章栏目列表信息接口
export const articleDicApi = body => request(`${baseurl}/api/v1/wechat/dic/queryDicForForm`, {
    method: 'POST',
    body
})