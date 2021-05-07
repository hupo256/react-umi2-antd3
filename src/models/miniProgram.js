import {
  formbindmap, //获取表单已绑定关系
  formlist, //表单列表
  formcollocate, //配置表单
  getAuthInfo, //获取授权信息
  getAuthUrl, //获取授权链接
} from '@/services/miniProgram';

export default {
  namespace: 'MiniProgram',

  state: {
    FormDetail: {},
    FormList: [],
    AuthInfo: {},
    authorizationUrl: null,
  },

  effects: {
    // 获取授权链接
    *getAuthUrlModel({ payload }, { call, put }) {
      const response = yield call(getAuthUrl, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { authorizationUrl: (response && response.data.url) || null },
      });
      return response;
    },
    // 获取授权信息
    *getAuthInfoModel({ payload }, { call, put }) {
      const response = yield call(getAuthInfo, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { AuthInfo: (response && response.data) || {} },
      });
      return response;
    },
    // 获取表单已绑定关系
    *formbindmapModel({ payload }, { call, put }) {
      const response = yield call(formbindmap, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { FormDetail: (response && response.data) || null },
      });
      return response;
    },
    // 表单列表
    *formlistModel({ payload }, { call, put }) {
      const response = yield call(formlist, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: {
          FormList: (response && response.data) || [],
        },
      });
      return response;
    },
    // 配置表单
    *formcollocateModel({ payload }, { call, put }) {
      const response = yield call(formcollocate, {
        ...payload,
      });
      return response;
    },
  },

  reducers: {
    upData(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
