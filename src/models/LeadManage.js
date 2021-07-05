import {
  trackAdd, //添加线索
  trackEdit, //编辑线索
  trackGet, //根据uid查询线索
  trackEditStatus, //变更线索状态
  trackExportCriteria, //导出线索
  trackQuery, //分页查询线索
  queryReferrer, //分页查询推荐列表
  queryUserByName, //查询推荐人建议
  getTree, //获取线索来源渠道树
  trackstatuslog, //分页查询线索状态变更记录
  queryUserByMobile, //根据手机号查重
} from '@/services/leadManage';

export default {
  namespace: 'LeadManage',

  state: {
    trackData: {},
    trackDataSearch: {},
    treeData: [],
    ReferrerData: [], //推荐人列表
    trackLogData: {}, //变更记录
    trackDetail: {},
  },

  effects: {
    // 线索详情
    *trackGetModel({ payload }, { call, put }) {
      const response = yield call(trackGet, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { trackDetail: (response && response.data) || {} },
      });
      return response;
    },
    // 导出线索
    *trackExportCriteriaModel({ payload }, { call, put }) {
      const response = yield call(trackExportCriteria, {
        ...payload,
      });
      return response;
    },
    // 查询数据看板展示数据
    *trackstatuslogModel({ payload }, { call, put }) {
      const response = yield call(trackstatuslog, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { trackLogData: (response && response.data) || {} },
      });
      return response;
    },
    // 编辑线索
    *trackEditModel({ payload }, { call, put }) {
      const response = yield call(trackEdit, {
        ...payload,
      });
      return response;
    },
    // 创建线索
    *trackAddModel({ payload }, { call, put }) {
      const response = yield call(trackAdd, {
        ...payload,
      });
      return response;
    },
    // 根据手机号查重
    *queryUserByMobileModel({ payload }, { call, put }) {
      const response = yield call(queryUserByMobile, {
        ...payload,
      });
      return response;
    },
    // 变更线索状态
    *trackEditStatusModel({ payload }, { call, put }) {
      const response = yield call(trackEditStatus, {
        ...payload,
      });
      return response;
    },
    // 查询数据看板展示数据
    *trackQueryModel({ payload }, { call, put }) {
      const response = yield call(trackQuery, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { trackDataSearch: { ...payload }, trackData: (response && response.data) || {} },
      });
      return response;
    },
    // 获取线索来源渠道树
    *getTreeModel({ payload }, { call, put }) {
      const response = yield call(getTree, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { treeData: (response && response.data) || [] },
      });
      return response;
    },
    // 分页查询推荐列表
    *queryReferrerModel({ payload }, { call, put }) {
      const response = yield call(queryReferrer, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { ReferrerData: (response && response.data) || [] },
      });
      return response;
    },
    *resetSearchModel({ payload }, { call, put }) {
      yield put({
        type: 'upData',
        payload: { trackDataSearch: { ...payload } },
      });
    },
    *queryUserByName({ payload }, { call, put }) {
      const response = yield call(queryUserByName, {
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
