export const imgBaseUrl = 'https://img.inbase.in-deco.com/crm-saas/img/dflfwc/';

export function createUuid() {
  let s = [];
  let hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';
  let uuid = s.join('');
  return uuid;
}

export function urlParamHash(url) {
  let params = {};
  let h;
  let hash = url.slice(url.indexOf('?') + 1).split('&');
  for (let i = 0; i < hash.length; i++) {
    h = hash[i].split('='); //
    params[h[0]] = h[1];
  }
  return params;
}

const CHN_NUM_CHAR = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
export function roomType(bedroom) {
  return `${!!bedroom ? CHN_NUM_CHAR[bedroom] + '居室 | ' : ''}`;
}
