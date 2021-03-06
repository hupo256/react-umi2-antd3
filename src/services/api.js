import { stringify } from 'qs';
import request from '@/utils/request';
import { baseurl } from './config';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

// export async function fakeAccountLogin(params) {
//   return request('/api/login/account', {
//     method: 'POST',
//     body: params,
//   });
// }

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function loginCheck(params) {
  //???????????????
  return request(baseurl + '/api/v1/sso/login/queryCompany', {
    method: 'POST',
    body: params,
  });
}
// ???????????????
export async function checkMobile(params) {
  return request(`${baseurl}/api/v1/sso/login/checkMobile`, {
    method: "POST",
    body: params,
  });
}
export async function loginPassword(params) {
  //????????????
  return request(baseurl + '/api/v1/sso/login', {
    method: 'POST',
    body: params,
  });
}

export async function editPassword(params) {
  //????????????
  return request(baseurl + '/api/v1/sso/usercompany/editPassword', {
    method: 'POST',
    body: params,
  });
}

export async function logout(params) {
  //????????????
  return request(baseurl + '/api/v1/sso/login/out', {
    method: 'POST',
    body: params,
  });
}

// ?????????????????????
export async function switchSystem(params) {
  return request(baseurl + '/api/v1/sso/systemcompany/switchSystem', {
    method: 'POST',
    body: params,
  });
}
// ????????????????????????
export async function cityGroupByLetter(params) {
  return request(baseurl + '/api/v1/saas/amapaddress/cityGroupByLetter', {
    method: 'POST',
    body: params,
  });
}
// ????????????????????????
export async function cityMatch(params) {
  return request(baseurl + '/api/v1/saas/amapaddress/cityMatch', {
    method: 'POST',
    body: params,
  });
}
