/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import fetch from 'dva/fetch';
import { notification, Button, message } from 'antd';
import router from 'umi/router';
import hash from 'hash.js';
import { isAntdPro } from './utils';
import { cleanAuthority } from './authority';
notification.config({
  placement: 'topRight',
  top: 90,
  duration: 4,
});
message.config({
  top: 120,
  duration: 3,
  maxCount: 1,
});
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '您的权限已被管理员更改，请重新登录！',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
const close = key => {
  notification.close(key);
};
const BtnClose = key => {
  notification.close(key);
  location.reload();
};
const openNotification = () => {
  const key = `open${Date.now()}`;
  const btn = (
    <Button type="primary" onClick={() => BtnClose(key)}>
      刷新
    </Button>
  );
  notification.open({
    message: '网络超时',
    description: '网络请求超时，请点击刷新页面重试',
    btn,
    key,
    onClose: close,
    duration: null,
  });
};
const checkStatus = response => {
  // debugger;
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  // notification.error({
  //   message: `请求错误 ${response.status}: ${response.url}`,
  //   description: errortext,
  // });
  notification.error({
    message: `请求错误 请联系服务端技术人员`,
    description: errortext,
    key: '错误弹窗唯一',
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  // debugger;
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(
  url,
  options = {
    expirys: isAntdPro(),
  },
  exp = false,
  expfile = '导出文件.xls'
) {
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    // credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    newOptions.headers = {
      token: localStorage.getItem('crmtoken'),
      systemCode  :'S005',
      ...newOptions.headers,
    };
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }
  const expirys = options.expirys || 60;
  // options.expirys !== false, return the cache,
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }
  if (exp) {
    //导出特殊操作
    return fetch(url, newOptions)
      .then(checkStatus)
      .then(response => response.blob())
      .then(blob => {
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = expfile;
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(e => {});
  }
  return Promise.race([
    fetch(url, newOptions),
    new Promise((resolve, reject) => {
      let error = new Error('请求超时');
      error.name = 100;
      setTimeout(() => reject(error), 60000);
    }),
  ])
    .then(checkStatus)
    .then(response => {
      // debugger;
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      let res = response.json();
      return res.then(item => {
        if (item.code === 200 || item.code === 666) {
          return res;
        } else {
          // 返回的数据状态码不对进行提示
          // 501 错误信息不弹出通用提示

          // 10013 租约过期
          // 10018 账号被停用
          // 10014 无权限
          if (item.code === 400 || item.code === 401) {
            cleanAuthority();
            router.push('/user/login');
            return;
          } else if (item.code === 10018) {
            router.push('/disabled');
            return;
          } else if (item.code === 10013) {
            console.log(res);
            router.push('/overdue');
            return;
          } else if (item.code === 10014) {
            router.push('/noaccess');
            return;
          } else if (item.code !== 501 && item.code !== 10025 && item.code !== 10024) {
            if (item.message) {
              message.error(item.message);
            }
          }
          return res;
        }
      });
    })
    .catch(e => {
      const status = e.name;
      if (status === 100) {
        openNotification();
        return;
      }
      if (status === 400 || status === 401) {
        cleanAuthority();
        router.push('/user/login');
        return;
      }
      // environment should not be used
      if (status === 403) {
        router.push('/exception/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        router.push('/exception/500');
        return;
      }
      if (status >= 404 && status < 422) {
        router.push('/exception/404');
      }
    });
}
