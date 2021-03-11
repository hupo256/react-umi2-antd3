import {
  queryDicModuleList, //查询字典模块列表
  createDic, //创建/编辑字典
  getDicByUid, //根据UID查询字典
  queryDicForForm, //其他模块查询字典
  queryDicListByModule, //查询字典列表
  sortDic, //拖拽排序
  updateDicStatus, //修改字典状态
} from '@/services/dictConfig';

export default {
  namespace: 'DictConfig',

  state: {
    DicModuleList: [],
    DicList: {},
    DicQuery: {},
    dicData: {},
  },

  effects: {
    // 获取字典数据
    *queryDicModel({ payload }, { call, put }) {
      const response = yield call(queryDicForForm, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { dicData: (response && response.data) || [] },
      });
      return response;
    },
    // 修改字典状态
    *updateDicStatusModel({ payload }, { call, put }) {
      const response = yield call(updateDicStatus, {
        ...payload,
      });
      return response;
    },
    // 查询字典模块列表
    *queryDicModuleListModel({ payload }, { call, put }) {
      const response = yield call(queryDicModuleList, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { DicModuleList: (response && response.data) || [] },
      });
      return response;
    },
    // 查询字典列表
    *queryDicListModel({ payload }, { call, put }) {
      const response = yield call(queryDicListByModule, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { DicList: (response && response.data) || {}, DicQuery: { ...payload } },
      });
      return response;
    },
    // 创建/编辑字典
    *createDicModel({ payload }, { call, put }) {
      const response = yield call(createDic, {
        ...payload,
      });
      return response;
    },
    // 拖拽排序
    *sortDicModel({ payload }, { call, put }) {
      const response = yield call(sortDic, {
        ...payload,
      });
      return response;
    },

    *resetModel({ payload }, { call, put }) {
      yield put({
        type: 'upData',
        payload: { ...payload },
      });
      return true;
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
