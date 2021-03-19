import {
  getArticleList, //文章列表
  createArticle, //创建文章
  editArticle, //编辑文章
  getArticleDetail, //文章详情
  articleStatus, //切换文章状态
} from '@/services/articleLibrary';

export default {
  namespace: 'ArticleLibrary',

  state: {
    ArticleList:{},
    ArticleListQuery:{},
    ArticleDetail:{},
  },

  effects: {
    
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
