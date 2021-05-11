import {
  formList, //文章列表
} from '@/services/FormLibrary';

export default {
  namespace: 'AppletSetting',

  state: {
    formList: {},
    fromListQuery: {},
  },

  effects: {
    // 查询表单列表
    *formListModel({ payload }, { call, put }) {
      const response = yield call(formList, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { formList: (response && response.data) || {}, fromListQuery: { ...payload } },
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
