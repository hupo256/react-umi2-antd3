import {
  hostSetting, // 查询域名
  basicMessage, //查询基本信息
  customCodeSave, //保存自定义代码
  hostSettingBind, // 绑定域名
  customCodeModel, //查询自定义代码
  basicMessageSave, //基本信息保存
  enterpriseMessageSave, //保存企业信息
  enterpriseMessageModel, //企业信息查询
} from '@/services/websetting';

export default {
  namespace: 'WebSettingStroe',

  state: {
    ceshi: '112',
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
    //查询基本信息
    *basicMessageModel({ payload }, { call, put }) {
      const response = yield call(basicMessage, {
        ...payload,
      });
      return response;
    },
    //保存基本信息
    *basicMessageSave({ payload }, { call, put }) {
      const response = yield call(basicMessageSave, {
        ...payload,
      });
      return response;
    },
    //查询自定义代码
    *customCodeModel({ payload }, { call, put }) {
      const response = yield call(customCodeModel, {
        ...payload,
      });
      return response;
    },
    //保存自定义代码
    *customCodeSave({ payload }, { call, put }) {
      const response = yield call(customCodeSave, {
        ...payload,
      });
      return response;
    },
    //查询企业信息
    *enterpriseMessageModel({ payload }, { call, put }) {
      const response = yield call(enterpriseMessageModel, {
        ...payload,
      });
      return response;
    },
    //保存企业信息
    *enterpriseMessageSave({ payload }, { call, put }) {
      const response = yield call(enterpriseMessageSave, {
        ...payload,
      });
      return response;
    }
  },

  reducers: {
    upData(state, action) {
      console.log(state, action);
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
