import {
  createSite, //创建工地
  siteDisable, //启用/停用
  siteDetail, //工地详情
  modifySite, //编辑工地
  siteList, //工地列表
  queryFromProject, //从已有工地选择
  dynamicList, //动态列表
  pageDynamic, //动态列表
  createDynamic, //创建动态
  dynamicShow, //显示/隐藏
  dynamicStatus,//查询动态状态
} from '@/services/siteLibrary';

export default {
  namespace: 'SiteLibrary',

  state: {
    siteList: {},
    siteListQuery: {},
    siteDetail: {},
    dynamicList: [],
    FromProjectList: {},
    FromProjectQuery: {},
  },

  effects: {
    *resetSearchModel({ payload }, { call, put }) {
      yield put({
        type: 'upData',payload: {siteListQuery: { ...payload }},
      });
    },
    // 上条记录的阶段
    *dynamicStatusModel({ payload }, { call, put }) {
      const response = yield call(dynamicStatus, { ...payload });
      return response;
    },
    // 从已有工地选择
    *queryFromProjectModel({ payload }, { call, put }) {
      const response = yield call(queryFromProject, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: {
          FromProjectList: (response && response.data) || {},
          FromProjectQuery: { ...payload },
        },
      });
      return response;
    },
    // 工地列表
    *siteListModel({ payload }, { call, put }) {
      const response = yield call(siteList, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { siteList: (response && response.data) || {}, siteListQuery: { ...payload } },
      });
      return response;
    },
    // 工地详情
    *siteDetailModel({ payload }, { call, put }) {
      const response = yield call(siteDetail, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { siteDetail: (response && response.data) || {} },
      });
      return response;
    },
     *setSiteDetailModel({ payload }, { call, put }) {
      yield put({
        type: 'upData',
        payload: { siteDetail:  {...payload} },
      });
      return true;
    },
    // 创建工地
    *createSiteModel({ payload }, { call, put }) {
      const response = yield call(createSite, {
        ...payload,
      });
      return response;
    },
    // 编辑工地
    *modifySiteModel({ payload }, { call, put }) {
      const response = yield call(modifySite, {
        ...payload,
      });
      return response;
    },
    // 启用/停用
    *siteDisableModel({ payload }, { call, put }) {
      const response = yield call(siteDisable, {
        ...payload,
      });
      return response;
    },
    // 创建动态
    *createDynamicModel({ payload }, { call, put }) {
      const response = yield call(createDynamic, {
        ...payload,
      });
      return response;
    },
    // 显示/隐藏
    *dynamicShowModel({ payload }, { call, put }) {
      const response = yield call(dynamicShow, {
        ...payload,
      });
      return response;
    },
    // 动态列表
    *dynamicListModel({ payload }, { call, put }) {
      const response = yield call(dynamicList, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: {
          dynamicList: (response && response.data) || {},
          dynamicListQuery: { ...payload },
        },
      });
      return response;
    },
    // 动态列表
    *pageDynamicModel({ payload }, { call, put }) {
      const response = yield call(pageDynamic, {
        ...payload,
      });
      yield put({
        type: 'upDataList',
        payload: {
          list: (response && response.data) || {},
          dicCode: payload.gongdiStage,
        },
      });
      return response;
    },
    // 切换动态状态
    *toggleStatusModel({ payload }, { call, put }) {
      yield put({
        type: 'upDataListStatus',
        payload: { ...payload },
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
    upDataList(state, action) {
      let dynamic = [...state.dynamicList];
      const dynamicList = dynamic.map((item, i) => {
        if (item.dicCode === action.payload.dicCode) {
          item.pageList = action.payload.list;
          return item;
        } else {
          return item;
        }
      });
      return {
        ...state,
        dynamicList,
      };
    },
    toggleStatusModel(state, action) {
      let dynamic = [...state.dynamicList];
      const dynamicList = dynamic.map((item, i) => {
        if (item.dicCode === action.payload.dicCode) {
          item.pageList.list = item.pageList.list.map(items => {
            if (items.diaryUid === action.payload.diaryUid) {
              items.appletsShow = action.payload.status ? 0 : 1;
              return items;
            } else {
              return items;
            }
          });
          return item;
        } else {
          return item;
        }
      });
      return {
        ...state,
        dynamicList,
      };
    },
  },
};
