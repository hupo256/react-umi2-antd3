import moment from 'moment';
import React from 'react';
import { Tooltip, message, Icon } from 'antd';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';
import _ from 'lodash';
import Big from 'big.js';
import LinesEllipsis from 'react-lines-ellipsis';

export const downfile = (item, dispatch) => {
  console.log(item);
  const aLink = document.createElement('a');
  let url =
    item.downloadAddr ||
    (item.response && (item.response.data.downloadAddr || item.response.data.addr)) ||
    item.path ||
    item.addr;
  let index = url.lastIndexOf('/');
  let downass = url.substring(0, index).lastIndexOf('/'); //url
  let str = url.substring(0, downass + 1);
  let stg = url.substring(downass + 1, url.lastIndexOf('?')); //文件名称
  let indexs = stg.lastIndexOf('.');
  let sur = stg.substring(0, indexs);
  let suh = stg.substring(indexs, stg.length);
  let addr = `${encodeURI(str)}${encodeURIComponent(sur)}${suh}${url.substring(
    url.lastIndexOf('?')
  )}`;
  document.body.appendChild(aLink);
  aLink.style.display = 'none';
  // aLink.href = addr;
  aLink.href = url;
  aLink.target = '_blank';
  aLink.download = item.file_name;
  aLink.click();
  document.body.removeChild(aLink);
};
export const preview = item => {
  console.log(item);
  const aLink = document.createElement('a');
  let url =
    item.displayAddr ||
    (item.response && (item.response.data.downloadAddr || item.response.data.addr)) ||
    item.path ||
    item.addr;
  let downass = url.lastIndexOf('/'); //url
  let str = url.substring(0, downass + 1);
  let stg = url.substring(downass + 1); //文件名称
  let indexs = stg.lastIndexOf('.');
  let sur = stg.substring(0, indexs);
  let suh = stg.substring(indexs);
  let addr = `${encodeURI(str)}${encodeURIComponent(sur)}${suh}`;

  document.body.appendChild(aLink);
  aLink.style.display = 'none';
  aLink.href = addr;
  aLink.target = '_blank';
  aLink.download = item.file_name;
  aLink.click();
  document.body.removeChild(aLink);
};
export const pathLoad = url => {
  const aLink = document.createElement('a');
  let downass = url.lastIndexOf('/'); //url
  let str = url.substring(0, downass + 1);
  let stg = url.substring(downass + 1); //文件名称
  let indexs = stg.lastIndexOf('.');
  let sur = stg.substring(0, indexs);
  let suh = stg.substring(indexs);
  let addr = `${encodeURI(str)}${encodeURIComponent(sur)}${suh}`;

  console.log(addr);
  document.body.appendChild(aLink);
  aLink.style.display = 'none';
  aLink.href = addr;
  aLink.target = '_blank';
  aLink.download = url.slice(url.lastIndexOf('/'));
  aLink.click();
  document.body.removeChild(aLink);
};

// 预览所有excel格式文件， pdf格式的预览， 其他格式的下载
export const previewAll = item => {
  const nameLast = item.file_name ? item.file_name.split('.')[1] : item.name.split('.')[1];
  // xls xlsx doc docx ppt pptx pdf txt 预览
  switch (nameLast) {
    case 'xls':
    case 'xlsx':
    case 'doc':
    case 'docx':
    case 'ppt':
    case 'pptx':
      const aLink = document.createElement('a');
      document.body.appendChild(aLink);
      aLink.style.display = 'none';
      aLink.href = `https://view.officeapps.live.com/op/view.aspx?src=${item.displayAddr ||
        item.addr ||
        item.path}`;
      aLink.target = '_blank';
      aLink.click();
      document.body.removeChild(aLink);
      break;
    case 'pdf':
    case 'txt':
      preview(item);
      break;
    default:
      downfile(item);
      break;
  }
};

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';
  let result = val;
  result = Math.floor(val / 100) / 100;
  //result = (val / 10000).toFixed(2);
  return result;
}

export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

const addzero = zero => {
  return zero > 9 ? zero : '0' + zero;
};
export const parseTime = d => {
  const newDate =
    d.getFullYear() +
    '-' +
    addzero(d.getMonth() + 1) +
    '-' +
    addzero(d.getDate()) +
    ' ' +
    addzero(d.getHours()) +
    ':' +
    addzero(d.getMinutes()) +
    ':' +
    addzero(d.getSeconds());
  return newDate;
};

export function formatMoney(money) {
  //转为字符串 用字符串方法来实现
  let str = money.toString();
  let last = '';
  //三位数以上的数据才进行格式化
  while (str.length > 3) {
    //每次取末三位子字符串放到一个新的空字符串里并拼接上之前的末三位
    //(slice第一个参数传负数，代表从尾部开始截取该个数)
    last = ',' + str.slice(-3) + last;
    //原本数组不断截掉后三位直到长度小于三个
    str = str.slice(0, str.length - 3);
  }
  //最后把剥完的原数组拼接上新的不断被填充的数组
  return str + last;
}
export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
export function formatCurrency(num) {
  if (num == null || num == undefined) {
    return null;
  }
  num = num.toString().replace(/\$|\,/g, '');
  if (isNaN(num)) num = '0';
  let sign = num == (num = Math.abs(num));
  num = Math.floor(num * 100 + 0.50000000001);
  let cents = num % 100;
  num = Math.floor(num / 100).toString();
  if (cents < 10) cents = '0' + cents;
  for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
    num =
      num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
  return (sign ? '' : '-') + num + '.' + cents;
}
export function formatCurrencyZero(num) {
  if (num == null || num == undefined) {
    return null;
  }
  num = num.toString().replace(/\$|\,/g, '');
  if (isNaN(num)) num = '0';
  let sign = num == (num = Math.abs(num));
  num = Math.floor(num * 100 + 0.50000000001);
  let cents = num % 100;
  num = Math.floor(num / 100).toString();
  if (cents < 10) cents = '0' + cents;
  for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
    num =
      num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
  return (sign ? '' : '-') + num + (cents == '00' ? '' : '.' + cents);
}
// 金额千分位分割
export function formatToMoney(num) {
  if (num == null || num == undefined || !num) {
    return null;
  }
  num = num.toFixed(2);
  num = parseFloat(num);
  num = num.toLocaleString();
  return num; //返回的是字符串23,245.12保留2位小数
  // const reg = /\d{1,3}(?=(\d{3})+$)/g;
  // return `${num}`.replace(reg, '$&,');
}

/**
 * 去除千分位
 *@param{Object}num
 */
export function delcommafy(num) {
  if (num == null || num == undefined || _.isNumber(num)) {
    return num;
  }

  if ((num + '').trim() == '') {
    return '';
  }
  num = num.replace(/,/gi, '');
  return _.round(Number(num), 2);
}

// 数字验证
export function isNumber(value) {
  let b = delcommafy(value);
  let a = Number(b);
  if (!_.isFinite(a)) {
    return true;
  }
  return false;
}

export function Mul(a, b) {
  var str1 = a.toString(),
    str2 = b.toString(),
    m = 0;
  try {
    m += str1.split('.')[1].length;
  } catch (e) {}
  try {
    m += str2.split('.')[1].length;
  } catch (e) {}
  return (Number(str1.replace('.', '')) * Number(str2.replace('.', ''))) / Math.pow(10, m);
}

// 数组求和 需求big.js
export function UtilsSum(arr) {
  let s = new Big(0);
  for (let i = arr.length - 1; i >= 0; i--) {
    s = s.plus(new Big(arr[i]));
  }
  return _.toNumber(s);
}

// js判断含中文字符的字符串长度
export function getStringLength(stringContent) {
  var len = 0;
  for (var i = 0; i < stringContent.length; i++) {
    if (/[^\x00-\xff]/gi.test(stringContent[i]))
      //全角
      len += 2;
    //如果是全角，占用两个字节
    else len += 1; //半角占用一个字节
  }
  return len;
}
/**
 * 判断当前URL
 */
export function getUrl() {
  let hrefs = location.href.split('?')[0];
  hrefs = hrefs.split('/');
  const nowRul = _.last(hrefs);
  return nowRul;
}
/**
 * 判断当前U页面是否是增减项
 */
export function getAddSub() {
  let hrefs = location.href;
  if (hrefs.indexOf('AddSub') > -1) {
    return true;
  } else {
    return false;
  }
}
/**
 * 判断字符串长度   返回boole
 * @param str    字符串
 * @param long 需要判断的长度 非必传默认长度30
 * @param require是否必填
 */
export function strLengthVerify(str, long, require) {
  if (!str) {
    return require || false;
  } else {
    if (str.toString().length > (long || 32)) {
      return true;
    } else {
      return false;
    }
  }
}
/**
 * 表格文字气泡展示 返回jsx
 * @param {*} text  提示内容必传
 * @param {} width  宽度 默认160px
 * @param {} long  长度 默认展示10个字符
 *  @param  isMoney  是否格式化金额
 */
export function tableTooltip(text, width, long, isMoney) {
  return text ? (
    <div
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: (width || 160) - 22,
        display: 'inline-block',
      }}
    >
      {text ? (
        <Tooltip
          placement="top"
          title={isMoney ? formatCurrency(text.toString()) : text.toString()}
        >
          <span style={{ cursor: 'pointer' }}>
            {isMoney
              ? formatCurrency(text.toString().substring(0, long || 10))
              : text.toString().substring(0, long || 10)}
          </span>
        </Tooltip>
      ) : (
        <span style={{ color: '#ccc' }}>/</span>
      )}
    </div>
  ) : (
    <span style={{ color: '#ccc' }}>/</span>
  );
}

// 获取所有的localStorage;
export function getAlllocalStorage() {
  const len = localStorage.length; // 获取长度
  let arr = new Array(); // 定义数据集
  for (let i = 0; i < len; i++) {
    // 获取key 索引从0开始
    const getKey = localStorage.key(i);
    // 获取key对应的值
    const getVal = localStorage.getItem(getKey);
    // 放进数组
    arr[i] = {
      key: getKey,
      val: getVal,
    };
  }
  return arr;
}

//数字金额转换为大写人民币  number为字符串
export function numToText(n) {
  var fraction = ['角', '分'];
  var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  var head = n < 0 ? '欠' : '';
  n = Math.abs(n);
  var s = '';
  for (var i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (var i = 0; i < unit[0].length && n > 0; i++) {
    var p = '';
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  );
}
/**
 * [通过参数名获取url中的参数值]
 * @param   queryName [参数名]
 */
export function getQueryUrlVal(queryName) {
  const query = _.last(window.location.href.split('?'));
  if (!query) {
    return false;
  } else {
    const vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (pair[0] == queryName) {
        return pair[1];
      }
    }
    return false;
  }
}

// 上传文件前的钩子 只能上传图片； 做特殊处理验证
export const UpImgType = (file, fileSize) => {
  const isLt2M = file.size / 1024 / 1024 < fileSize;
  const isType = !/\.(png|jpg|gif|jpeg|webp|PNG|JPG|GIF|JPEG|WEBP)$/.test(file.name);
  if (isType) {
    message.error('请上传图片类型的文件');
    return false;
  }
  if (!isLt2M) {
    message.error(`图片大于${fileSize}M限制 不允许上传`);
    return false;
  }
  return true;
};

/* 
// 上传前操作 获取权限参数
 dispatch ,
 f:上传类型，文件图片传 s 视频传 v
 */

export function GetUploadedData(dispatch, file, subType, type, bsId, f) {
  return new Promise(function(resolve, reject) {
    let filenames = file.name;
    let index1 = filenames.lastIndexOf('.');
    let index2 = filenames.length;
    let fiename = filenames.substring(index1 + 1, index2);
    dispatch({
      type: 'base/photoxImg',
      payload: subType,
    }).then(data => {
      if (data) {
        if (data.code === 200) {
          if (data.data.success_action_status === '200') {
            if (data.data.fileName !== '') {
              filenames = `${data.data.fileName}.${fiename}`;
            }
            dispatch({
              type: 'base/picData',
              payload: {
                OSSAccessKeyId: data.data.accessid,
                callback: data.data.callback,
                policy: data.data.policy,
                signature: data.data.signature,
                host: data.data.host,
                key: `${data.data.dir}${filenames}`,
                success_action_status: data.data.success_action_status,
                'x:type': type,
                'x:subType': subType,
                'x:bsId': bsId,
                'x:f': f, //视频传v
                'x:token': localStorage.getItem('crmtoken'),
              },
            }).then(() => {
              resolve(true);
            });
          } else {
            message.error(data.message);
            return reject();
          }
        } else {
          message.error(data.message);
          return reject();
        }
      } else {
        return reject();
      }
    });
  });
}
/**
 * 对象数组去重
 * @param   arr 需要去重的数组
 * @param   id 去重依据
 */
export function arrReduce(arrs, id) {
  let obj = {};
  return arrs.reduce(function(item, next) {
    obj[next[id]] ? '' : (obj[next[id]] = true && item.push(next));
    return item;
  }, []);
}

// 根据页面宽度导出系数
export function coefficient() {
  const width = document.body.clientWidth;
  let coefficient = 1;
  if (width >= 1800) {
    coefficient = 1.405;
  } else if (width < 1800 && width >= 1700) {
    coefficient = 1.318;
  } else if (width < 1700 && width >= 1600) {
    coefficient = 1.244;
  } else if (width < 1600 && width >= 1500) {
    coefficient = 1.17;
  } else if (width < 1500 && width >= 1400) {
    coefficient = 1.1;
  } else if (width < 1400 && width >= 1300) {
    coefficient = 1;
  }
  return coefficient;
}

// 列表表头固定定位位置
export function tableFixed(tableWidth, fixed) {
  return tableWidth > getHeaderWidth() - 180 ? fixed : false;
}
//根据传参获取当前时间所处的 周、月、季度、年开始到结束时间 ---start---
export function getDefaultStartToEndTime(type) {
  //由工作台进入调整时间Fn
  const time = new Date(); //当前日期
  const DayOfWeek = time.getDay(); // 今天本周的第几天
  //const Year = time.getFullYear(); // 当前年
  let Year = time.getYear(); //当前年
  const Month = time.getMonth(); // 当前月
  const Day = time.getDate(); // 当前日
  Year += Year < 2000 ? 1900 : 0;

  let day = DayOfWeek || 7;
  let startTime = '';
  let endTime = '';

  switch (type) {
    case 'week':
      startTime = formatDate(new Date(Year, Month, Day + 1 - day));
      endTime = formatDate(new Date(Year, Month, Day + 7 - day));
      break;

    case 'month':
      startTime = formatDate(new Date(Year, Month, 1));
      endTime = formatDate(new Date(Year, Month, getMonthDays(Year, Month)));
      break;

    case 'quarter':
      startTime = formatDate(new Date(Year, getQuarterStartMonth(Month), 1));
      let quarterEndMonth = getQuarterStartMonth(Month) + 2;
      let quarterStartDate = new Date(Year, quarterEndMonth, getMonthDays(Year, quarterEndMonth));
      endTime = formatDate(quarterStartDate);
      break;

    default:
      startTime = `${Year}/01/01`;
      endTime = `${Year}/12/31`;
      break;
  }
  return [moment(`${startTime} 00:00:00`), moment(`${endTime} 23:59:59`)];
}
//时间格式
function formatDate(date) {
  let myyear = date.getFullYear();
  let mymonth = date.getMonth() + 1;
  let myweekday = date.getDate();

  if (mymonth < 10) {
    mymonth = '0' + mymonth;
  }
  if (myweekday < 10) {
    myweekday = '0' + myweekday;
  }
  return myyear + '/' + mymonth + '/' + myweekday;
}
//判断季度
function getQuarterStartMonth(Month) {
  let quarterStartMonth = 0;
  if (Month < 3) {
    quarterStartMonth = 0;
  }
  if (2 < Month && Month < 6) {
    quarterStartMonth = 3;
  }
  if (5 < Month && Month < 9) {
    quarterStartMonth = 6;
  }
  if (Month > 8) {
    quarterStartMonth = 9;
  }
  return quarterStartMonth;
}
//计算月份
function getMonthDays(Year, Month) {
  let monthStartDate = new Date(Year, Month, 1);
  let monthEndDate = new Date(Year, Month + 1, 1);
  return (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
}
//根据传参获取当前时间所处的 周、月、季度、年开始到结束时间 ---end---

//获取传递时间所处周开始到结束时间 ---start---
export function getWeekStartToEndTime(time) {
  //const time = new Date(); //当前日期
  const DayOfWeek = time.getDay(); // 今天本周的第几天
  let Year = time.getYear(); //当前年
  const Month = time.getMonth(); // 当前月
  const Day = time.getDate(); // 当前日
  Year += Year < 2000 ? 1900 : 0;

  let day = DayOfWeek || 7;
  let startTime = '';
  let endTime = '';

  startTime = formatWeekDate(new Date(Year, Month, Day + 1 - day));
  endTime = formatWeekDate(new Date(Year, Month, Day + 7 - day));
  return [startTime, endTime];
}
function formatWeekDate(date) {
  let myyear = date.getFullYear();
  let mymonth = date.getMonth() + 1;
  let myweekday = date.getDate();

  if (mymonth < 10) {
    mymonth = '0' + mymonth;
  }
  if (myweekday < 10) {
    myweekday = '0' + myweekday;
  }
  return myyear + '-' + mymonth + '-' + myweekday;
}
//获取传递时间所处周开始到结束时间 ---end---
//获取当前年-月-日
export function getDay() {
  let myDate = new Date();
  let tYear = myDate.getFullYear();
  let tMonth = myDate.getMonth();
  const Day = myDate.getDate(); // 当前日

  let m = tMonth + 1;
  let n = Day;
  if (m.toString().length == 1) {
    m = '0' + m;
  }
  if (n.toString().length == 1) {
    n = '0' + n;
  }
  return tYear + '-' + m + '-' + n;
}
// 分页配置
export const paginations = data => {
  return {
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    pageSize: (data && data.pageSize) || 10,
    hideOnSinglePage: false,
    current: data && data.curPage,
    total: data && data.recordTotal,
    showTotal: () => `共${data && data.recordTotal}条`,
  };
};

// x项目存储e
export function handleProjectSession(record) {
  const query = {
    code: record.zid,
    id: record.uid,
    project_code: record.project_code,
    project_name: record.project_name,
    project_code_ext: record.project_code_ext,
    verson: record.verson,
  };
  sessionStorage.setItem('statusCode', record.statusCode);
  sessionStorage.setItem('query', JSON.stringify(query));
}

// 获取头部宽度
export function getHeaderWidth() {
  let clientWidth = document.body.clientWidth; // 网页可见区域宽
  const noWidth = sessionStorage.collapsed == 'false' ? 220 : 80;
  clientWidth = clientWidth - noWidth;
  return clientWidth;
}

// 地址保留两级省市
export function provinceDataFilter(data) {
  return data.map(item => {
    if (item.children) {
      item.children.map(items => {
        items.children = null;
        items.title = items.areaName;
        items.value = items.areaCode;
        return items;
      });
    }
    item.title = item.areaName;
    item.value = item.areaCode;
    return item;
  });
}

//固定面包屑
export function fixedTitle() {
  const left = sessionStorage.collapsed == 'false' ? '220px' : '80px';
  return {
    padding: '16px 32px 0 32px',
    borderBottom: '0px solid #e8e8e8',
    position: 'fixed',
    top: 64,
    right: 0,
    left,
    zIndex: 2,
    background: '#fff',
  };
}

// 返回的指定位置
export function backToTop(name) {
  window.scrollTo({
    top: ToTop(document.getElementById(name)),
    behavior: 'smooth',
  });
  function ToTop(ele) {
    //ele为指定跳转到该位置的DOM节点
    let root = document.body;
    let height = -180;
    do {
      height += ele.offsetTop;
      ele = ele.offsetParent;
    } while (ele !== root);
    return height;
  }
}
// 获取滚动条高度
export function getScrollTop() {
  let scroll_top = 0;
  if (document.documentElement && document.documentElement.scrollTop) {
    scroll_top = document.documentElement.scrollTop;
  } else if (document.body) {
    scroll_top = document.body.scrollTop;
  }
  return scroll_top;
}

/**
 @description 页面垂直平滑滚动到指定滚动高度
 @author 
*/
export const scrollSmoothTo = function(position) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      return setTimeout(callback, 17);
    };
  }
  // 当前滚动高度
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  // 滚动step方法
  let step = function() {
    // 距离目标滚动距离
    let distance = position - scrollTop;
    // 目标滚动位置
    scrollTop = scrollTop + distance / 5;
    if (Math.abs(distance) < 1) {
      window.scrollTo(0, position);
    } else {
      window.scrollTo(0, scrollTop);
      requestAnimationFrame(step);
    }
  };
  step();
};

/**
 * 多行显示省略号插件
 * 默认展示3行
 */
export function LinesEllipsisTooltip(text, numstr) {
  return text ? (
    <Tooltip
      placement="top"
      title={
        <div
          style={{ wordBreak: 'break-all' }}
          dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br/>') }}
        />
      }
    >
      <LinesEllipsis
        text={text}
        maxLine={numstr || '3'}
        ellipsis="..."
        trimRight
        basedOn="letters"
      />
    </Tooltip>
  ) : (
    ''
  );
}

//获取当前年-月
export function doHandleDateMonth() {
  let myDate = new Date();
  let tYear = myDate.getFullYear();
  let tMonth = myDate.getMonth();

  let m = tMonth + 1;
  if (m.toString().length == 1) {
    m = '0' + m;
  }
  return tYear + '-' + m;
}

export const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2260966_ocun4xqluvi.js',
});
export const successIcon = <MyIcon type="icon-dui" style={{ color: '#52c41a' }} />;
export const waringIcon = <MyIcon type="icon-wenhao" style={{ color: '#faad15' }} />;
export const errorIcon = <MyIcon type="icon-close" style={{ color: '#f5212d' }} />;
