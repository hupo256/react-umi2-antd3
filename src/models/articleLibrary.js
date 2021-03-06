import {
  getArticleList, //文章列表
  createArticle, //创建文章
  editArticle, //编辑文章
  getArticleDetail, //文章详情
  getPublicArticleDetail, //公有库文章详情
  articleStatus, //切换文章状态
  publicList, //公有库文章
  publicDetail, //公有库文章详情
  queryDicModuleList, //公有库文章栏目
} from '@/services/articleLibrary';

export default {
  namespace: 'ArticleLibrary',

  state: {
    ArticleList: {},
    ArticleListQuery: { pageNum: 1 },
    ArticleDetail: {},
    publicList: {},
    publicListQuery: {},
    publicListDetail: {},
    DicModuleList: [],
  },

  effects: {
    *resetSearchModel({ payload }, { call, put }) {
      yield put({ type: 'upData', payload: { ArticleListQuery: { ...payload } } });
    },
    *resetPublicModel({ payload }, { call, put }) {
      yield put({ type: 'upData', payload: { publicListQuery: { ...payload } } });
    },
    // 公有库文章栏目
    *queryDicModuleList({ payload }, { call, put }) {
      const response = yield call(queryDicModuleList, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: {
          DicModuleList: response?.data?.DM006 || [],
        },
      });
      return response;
    },
    // 公有库文章列表
    *getPublicListModel({ payload }, { call, put }) {
      const response = yield call(publicList, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: {
          publicList: (response && response.data) || {},
          publicListQuery: { ...payload },
        },
      });
      return response;
    },
    // 公有库文章详情
    *getPublicDetailModel({ payload }, { call, put }) {
      const response = yield call(publicDetail, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: {
          publicListDetail: (response && response.data) || {},
        },
      });
      return response;
    },
    // 查询文章列表
    *getArticleListModel({ payload }, { call, put }) {
      const response = yield call(getArticleList, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: {
          ArticleList: (response && response.data) || {},
          ArticleListQuery: { ...payload },
        },
      });
      return response;
    },
    // 查询文章详情
    *getArticleDetailModel({ payload }, { call, put }) {
      const response = yield call(getArticleDetail, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: {
          ArticleDetail: (response && response.data) || {},
        },
      });
      return response;
    },
    // 查询公有库文章详情
    *getPublicArticleDetailModel({ payload }, { call, put }) {
      const response = yield call(getPublicArticleDetail, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: {
          publicListDetail: (response && response.data) || {},
        },
      });
      return response;
    },

    // 创建文章
    *createArticleModel({ payload }, { call, put }) {
      const response = yield call(createArticle, {
        ...payload,
      });
      return response;
    },
    // 编辑文章
    *editArticleModel({ payload }, { call, put }) {
      const response = yield call(editArticle, {
        ...payload,
      });
      return response;
    },
    // 修改文章状态
    *updateStatusModel({ payload }, { call, put }) {
      const response = yield call(articleStatus, {
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
