export default {
  namespace: 'geographic',

  state: {
    province: [],
    city: [],
    isLoading: false,
  },

  effects: {
    *fetchProvince(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchCity({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    setProvince(state, action) {
      return {
        ...state,
        province: action.payload,
      };
    },
    setCity(state, action) {
      return {
        ...state,
        city: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
  },
};
