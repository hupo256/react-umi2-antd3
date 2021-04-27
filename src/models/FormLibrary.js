import {
  formCreate, //创建表单
  formStatus, //启用/停用
  formGet, //表单详情
  formModify, //编辑表单
  formList, //表单列表
  formCollocate, //配置表单
  formgetCollocation, //获取表单配置
  formRemove, //删除表单
} from '@/services/FormLibrary';

export default {
  namespace: 'FormLibrary',

  state: {
    formList: {},
    fromListQuery: {},
    formDetail: {},
    collocationDetail: {},
    compentList: [],
    status: 1,
    fromData: {
      pageNum: 1,
      pageSize: 10,
      searchText: '',
      formStatus: '',
    },
  },

  effects: {
    *resetSearchModel({ payload }, { call, put }) {
      yield put({
        type: 'upData',
        payload: { fromData: { ...payload } },
      });
    },
    // 表单列表
    *pageListModel({ payload }, { call, put }) {
      const response = yield call(formList, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { formList: (response && response.data) || {}, fromListQuery: { ...payload } },
      });
      return response;
    },
    // 表单详情
    *formGetModel({ payload }, { call, put }) {
      const response = yield call(formGet, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { formDetail: (response && response.data) || {} },
      });
      return response;
    },
    // 编辑表单
    *formModifyModel({ payload }, { call, put }) {
      const response = yield call(formModify, {
        ...payload,
      });
      return response;
    },
    // 启用/停用
    *formStatusModel({ payload }, { call, put }) {
      const response = yield call(formStatus, {
        ...payload,
      });
      return response;
    },
    // 创建表单
    *formCreateModel({ payload }, { call, put }) {
      const response = yield call(formCreate, {
        ...payload,
      });
      return response;
    },
    // 删除表单
    *formRemoveModel({ payload }, { call, put }) {
      const response = yield call(formRemove, {
        ...payload,
      });
      return response;
    },

    // 配置表单
    *formCollocateModel({ payload }, { call, put }) {
      const response = yield call(formCollocate, {
        ...payload,
      });
      return response;
    },
    // 获取表单配置
    *formgetCollocationModel({ payload }, { call, put }) {
      const response = yield call(formgetCollocation, {
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
