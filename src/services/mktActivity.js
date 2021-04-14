import request from '../utils/request';
// import { baseurl } from './config';

const baseurl = 'http://10.1.4.58:8291';

/**
 * 小游戏
 */
// 开始抽奖
export async function touchLottery(params) {
  return request(baseurl + '/api/v1/sso/activity/lottery', {
    method: 'POST',
    body: params,
  });
}

// 查询抽奖活动
export async function touchActivity() {
  return request(baseurl + '/api/v1/sso/activity/query');
}

// 中奖记录
export async function touchReward(params) {
  return request(baseurl + '/api/v1/sso/activity/reward', {
    query: params,
  });
}

/**
 * 营销活动管理
 */
// 删除活动
export async function delActivity(params) {
  return request(baseurl + '/api/v1/wechat/activity/delActivity', {
    method: 'POST',
    body: params,
  });
}
// 删除活动奖品
export async function delActivityPrize(params) {
  return request(baseurl + '/api/v1/wechat/activity/delActivityPrize', {
    method: 'POST',
    body: params,
  });
}
// 活动详情
export async function getActivity(params) {
  return request(baseurl + '/api/v1/wechat/activity/getActivity', {
    method: 'POST',
    body: params,
  });
}
// 活动奖品详情
export async function getActivityPrize(params) {
  return request(baseurl + '/api/v1/wechat/activity/getActivityPrize', {
    method: 'POST',
    body: params,
  });
}
// 查询活动列表
export async function activityList(params) {
  return request(baseurl + '/api/v1/wechat/activity/list', {
    method: 'POST',
    body: params,
  });
}
// 新增/修改活动
export async function newActivity(params) {
  return request(baseurl + '/api/v1/wechat/activity/newActivity', {
    method: 'POST',
    body: params,
  });
}
// 新增/修改活动奖品
export async function newPrize(params) {
  return request(baseurl + '/api/v1/wechat/activity/newPrize', {
    method: 'POST',
    body: params,
  });
}

// 活动奖品分页查询
export async function queryActivityPrizeList(params) {
  return request(baseurl + '/api/v1/wechat/activity/queryActivityPrizeList', {
    method: 'POST',
    body: params,
  });
}

// 活动列表分页查询
export async function queryActivityList(params) {
  return request(baseurl + '/api/v1/wechat/activity/queryActivityList', {
    method: 'POST',
    body: params,
  });
}

// 活动中奖记录分页查询
export async function queryActivityPrizeRewardList(params) {
  return request(baseurl + '/api/v1/wechat/activity/queryActivityPrizeRewardList', {
    method: 'POST',
    body: params,
  });
}

/**
 * 小程序首页设置
 */
// 查询案例
export async function queryCaseList(params) {
  return request('http://dev.gateway.ingongdi.com/api/v1/wechat/case/queryCaseList', {
    method: 'POST',
    body: params,
  });
}

// 查询设计师
export async function queryDesignerList(params) {
  return request('http://dev.gateway.ingongdi.com/api/v1/wechat/designer/queryDesignerList', {
    method: 'POST',
    body: params,
  });
}

// 查询工地
export async function sitePageList(params) {
  return request('http://dev.gateway.ingongdi.com/api/v1/wechat/site/pageList', {
    method: 'POST',
    body: params,
  });
}

// 查询专题
export async function specialPageList(params) {
  return request('http://dev.gateway.ingongdi.com/api/v1/wechat/special/pageList', {
    method: 'POST',
    body: params,
  });
}

export default {
  touchLottery,
  touchActivity,
  touchReward,
  delActivity,
  delActivityPrize,
  getActivity,
  getActivityPrize,
  activityList,
  newActivity,
  newPrize,
  queryActivityList,
  queryActivityPrizeRewardList,
  queryActivityPrizeList,
  queryCaseList,
  queryDesignerList,
  sitePageList,
  specialPageList,
};
