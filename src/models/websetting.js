import {
    hostSetting,// 查询域名
    hostSettingBind,// 绑定域名
  } from '@/services/websetting';
  
  export default {
    namespace: 'WebSettingStroe',
  
    state: {
    },
  
    effects: {
      // 查询企业域名
      *hostSettingModel({ payload }, { call, put }) {
        const response = yield call(hostSetting, {
            ...payload,
          });
        return response;
      },
      // 域名绑定
      *hostSettingBind({ payload }, { call, put }) {
        const response = yield call(hostSettingBind, {
            ...payload,
          });
        return response;
      },
    },
  
    reducers: {
      upData(state, action) {
        console.log(state, action)
        return {
          ...state,
          ...action.payload,
        };
      },
    },
  };
  