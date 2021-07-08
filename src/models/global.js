import { queryNotices, feedbackAdd, isShow, cityGroupByLetter, cityMatch } from '@/services/api';
import { getQueryUrlVal } from '@/utils/utils';

import { setAuthority } from '@/utils/authority';
export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    *feedbackadd({ payload }, { call }) {
      const response = yield call(feedbackAdd, payload);
      return response;
    },
    *isShow({ payload }, { call }) {
      const response = yield call(isShow, payload);
      return response;
    },
    *cityGroupByLetterModel({ payload }, { call }) {
      const response = yield call(cityGroupByLetter, payload);
      return response;
    },
    *cityMatchModel({ payload }, { call }) {
      const response = yield call(cityMatch, payload);
      return response;
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({ dispatch,history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        let tok = getQueryUrlVal('token');
          if (tok) {
            setAuthority(tok);
            dispatch({
              type: 'login/loginTs',
              payload: {},
            });
          }
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },

};
