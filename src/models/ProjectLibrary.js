import {
  specialCreate, //创建专题
  specialStatus, //启用/停用
  specialGet, //专题详情
  specialModify, //编辑专题
  pageList, //专题列表
  specialCollocate, //配置专题
  getCollocation, //获取专题配置
  specialRemove, //删除专题
  elementTree, //组件
  formList, //表单列表
} from '@/services/ProjectLibrary';

export default {
  namespace: 'ProjectLibrary',

  state: {
    siteList: {},
    siteListQuery: {},
    siteDetail: {},
    collocationDetail: {},
    elementTree: [],
    compentList: [],
    status: 1,
    fromData: {
      pageNum: 1,
      pageSize: 10,
      searchText: '',
      specialStatus: '',
    },
    uspecialUrlData: {
      uspecialUrl: '',
      specialTitle: '',
    },
  },

  effects: {
    // 专题列表
    *pageListModel({ payload }, { call, put }) {
      const response = yield call(pageList, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { siteList: (response && response.data) || {}, siteListQuery: { ...payload } },
      });
      return response;
    },
    // 专题详情
    *specialGetModel({ payload }, { call, put }) {
      const response = yield call(specialGet, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { collocationDetail: (response && response.data) || {} },
      });
      return response;
    },
    // 编辑专题
    *specialModifyModel({ payload }, { call, put }) {
      const response = yield call(specialModify, {
        ...payload,
      });
      return response;
    },
    // 启用/停用
    *specialStatusModel({ payload }, { call, put }) {
      const response = yield call(specialStatus, {
        ...payload,
      });
      return response;
    },
    // 创建专题
    *specialCreateModel({ payload }, { call, put }) {
      const response = yield call(specialCreate, {
        ...payload,
      });
      return response;
    },
    // 删除专题
    *specialRemoveModel({ payload }, { call, put }) {
      const response = yield call(specialRemove, {
        ...payload,
      });
      return response;
    },
    // 配置专题
    *specialCollocateModel({ payload }, { call, put }) {
      const response = yield call(specialCollocate, {
        ...payload,
      });
      return response;
    },
    // 获取专题配置
    *getCollocationModel({ payload }, { call, put }) {
      const response = yield call(getCollocation, {
        ...payload,
      });

      return response;
    },
    // 组件
    *elementTreeModel({ payload }, { call, put }) {
      const response = yield call(elementTree, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { elementTree: (response && response.data) || {} },
      });
      return response;
    },
    // 表单列表
    *formListModel({ payload }, { call, put }) {
      const response = yield call(formList, {
        ...payload,
      });
      return response;
    },
    *saveDataModel({ payload }, { call, put }) {
      yield put({
        type: 'saveDatax',
        payload: payload,
      });
    },
  },

  reducers: {
    upData(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveDatax(state, { payload }) {
      return {
        ...state,
        [payload.key]: payload.value,
      };
    },
  },
};
