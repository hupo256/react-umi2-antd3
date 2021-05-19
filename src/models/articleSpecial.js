import {
  getArticleList, //文章列表
  createArticle, //创建文章
  editArticle, //编辑文章
  getArticleDetail, //文章详情
  articleStatus, //切换文章状态
  publicList, //公有库文章
  publicDetail, //公有库文章详情
} from '@/services/articleLibrary';
import { pageList } from '../services/ProjectLibrary';

export default {
  namespace: 'ArticleSpecial',

  state: {
    formList: {},
    formListQuery: { pageNum: 1 },
    ArticleDetail: {},
    publicList: {},
    publicListQuery: {},
    publicListDetail: {},
  },

  effects: {
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
          formList: (response && response.data) || {},
          formListQuery: { ...payload },
        },
      });
      return response;
    },
    // 查询专题列表
    *getSpecialListModel({ payload }, { call, put }) {
      const response = yield call(pageList, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: {
          formList: (response && response.data) || {},
          formListQuery: { ...payload },
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
