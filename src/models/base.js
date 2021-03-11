import {
  query,
  querys,
  getAddr,
  getStreet,
  getpersonnel,
  source,
  queryAddr,
  photoImg,
  photoxImg,
  queryUsersByPostFunctionCode,
  getDepartmentList, // 所属部门
  tableHeader, //自定义表头
  saveShowField, //添加/修改自定义表头
  queryCategoryInfo, //查询所有类目
  queryCategoryInfoAllCount, //查询所有类目 商品库
  queryPersonnel, //选择人员
  getSystemuser, //获取个人中心数据
  setSystemuser, //修改用户信
  sendUserMobileMsg, //个人中心修改手机号发送短信
  sendMobileMsg,
  sendMobileMsgs,
  columnQuery, //查询自定义表头
  columnEdit, //编辑自定义表头
  columnReset, //重置自定义表头
} from '@/services/base';
import { message } from 'antd';
message.config({
  top: 120,
  duration: 3,
  maxCount: 1,
});
import { setaddr, getaddr, setqueryaddr, getqueryaddr } from '../utils/authority';
export default {
  namespace: 'base',

  state: {
    crmState: [],
    basedata: {},
    level: {},
    addrs: [],
    street: [],
    personnels: {},
    sources: [],
    queryaddr: [],
    picData: {},
    collapsed: false,
    queryUsersList: {},
    departmentList: [], // 所属部门
    tableHeader: [], //自定义表头
    categoryInfoData: [], //所有类目
    categoryInfoAllData: [], //所有类目 商品库

    personnelList: {},
    personnelSearch: {},

    SystemUserData: {}, //个人中心数据

    columnDatas: {},
  },

  effects: {
    // 查询自定义表头
    *columnQueryModel({ payload }, { call, put }) {
      const response = yield call(columnQuery, { ...payload });
      yield put({
        type: 'upData',
        payload: { columnDatas: (response && response.data) || {} },
      });
      return response;
    },
    // 编辑自定义表头
    *columnEditModel({ payload }, { call, put }) {
      const response = yield call(columnEdit, { ...payload });
      return response;
    },
    //重置自定义表头
    *columnResetModel({ payload }, { call, put }) {
      const response = yield call(columnReset, { ...payload });
      return response;
    },

    // 保存个人中心数据
    *sendUserMobileMsgModel({ payload }, { call, put }) {
      const response = yield call(sendMobileMsg, { ...payload });
      return response;
    },
    // 保存个人中心数据
    *sendMobileMsgModel({ payload }, { call, put }) {
      const response = yield call(sendMobileMsgs, { ...payload });
      return response;
    },
    // 获取个人中心数据
    *getSystemuserModel({ payload }, { call, put }) {
      const response = yield call(getSystemuser, { ...payload });
      yield put({
        type: 'upData',
        payload: { SystemUserData: response.data },
      });
      return response;
    },
    *resetModel({ payload }, { call, put }) {
      yield put({
        type: 'upData',
        payload: { ...payload },
      });
    },
    // 保存个人中心数据
    *setSystemuserModel({ payload }, { call, put }) {
      const response = yield call(setSystemuser, { ...payload });
      return response;
    },

    *queryPersonnelModel({ payload }, { call, put }) {
      const response = yield call(queryPersonnel, { ...payload });
      yield put({
        type: 'upTableHeader',
        payload: { personnelList: response.data, personnelSearch: { ...payload } },
      });
    },

    *crmState({ payload }, { call, put }) {
      const response = yield call(query, { type: 'crmState' });
      response.data.tbase.crmState.unshift({
        code: 'all',
        name: '全部',
      });
      yield put({
        type: 'crmStateQuery',
        payload: response,
      });
    },

    *level({ payload }, { call, put }) {
      const response = yield call(query, { type: 'level' });
      response.data.tbase.level.unshift({
        code: '',
        name: '全部',
      });
      yield put({
        type: 'levelQuery',
        payload: response,
      });
    },
    *query({ payload }, { call, put }) {
      const response = yield call(query, {
        type: payload.type,
      });
      yield put({
        type: 'queryx',
        payload: response,
      });
      return response;
    },

    *queryAddr({ payload }, { call, put }) {
      const response = yield call(queryAddr, payload);
      yield put({
        type: 'queryaddrx',
        payload: response,
      });
      setqueryaddr(response);
    },

    *getAddr({ payload }, { call, put }) {
      const response = yield call(getAddr, payload);
      yield put({
        type: 'addrx',
        payload: response,
      });
      response && response.code === 200 && setaddr(response);
    },

    *getStreet({ payload }, { call, put }) {
      const response = yield call(getStreet, payload);
      yield put({
        type: 'streetx',
        payload: response,
      });
    },

    *requestquery({ params }, { call, put }) {
      const response = yield call(getpersonnel, {
        ...params,
        status: params.status ? params.status : 1,
      });
      if (response.code === 200) {
        yield put({
          type: 'savepersonnels',
          payload: response,
        });
      }
      return response;
    },

    *source({ payload }, { call, put }) {
      const response = yield call(source, payload);
      if (response.code === 200) {
        yield put({
          type: 'savesource',
          payload: response.data,
        });
      }
    },
    *photoxImg({ payload }, { call }) {
      const response = yield call(photoxImg, payload);
      return response;
    },
    *picData({ payload }, { call, put }) {
      yield put({
        type: 'savepicData',
        payload,
      });
    },
    *setCollapsedModel({ payload }, { call, put }) {
      yield put({ type: 'upCollapsed', payload });
    },
    // 根据岗位职能编号查询人员列表
    *queryUsersByPostFunctionCodeModel({ payload }, { call, put }) {
      const response = yield call(queryUsersByPostFunctionCode, payload);
      yield put({
        type: 'queryUsersByPostFunctionCodeType',
        payload: response.data,
      });
    },
    // 所属部门
    *getDepartmentListModel({ payload }, { call, put }) {
      const response = yield call(getDepartmentList, payload);
      yield put({
        type: 'getDepartmentListType',
        payload: response.data,
      });
    },
    // 自定义表头
    *tableHeaderModel({ payload }, { call, put }) {
      const response = yield call(tableHeader, payload);
      yield put({
        type: 'upTableHeader',
        payload: { tableHeader: response.data },
      });
      return response;
    },
    *saveTableHeaderModel({ payload }, { call, put }) {
      const response = yield call(saveShowField, { ...payload });
      return response;
    },
    // 查询所有类目
    *queryCategoryInfoModel({ payload }, { call, put }) {
      const res = yield call(queryCategoryInfo, {});
      if (res && res.code === 200) {
        const data = category(res.data);
        function category(data) {
          return data.map(item => {
            item.title = item.categoryName;
            item.key = item.categoryCode;
            item.value = item.categoryCode;
            if (item.children && item.children.length > 0) {
              category(item.children);
            }
            return item;
          });
        }
        yield put({
          type: 'upCategoryInfo',
          payload: { categoryInfoData: data },
        });
        return res;
      }
    },
    // 查询所有类目 商品库
    *queryLibraryCategoryInfoModel({ payload }, { call, put }) {
      const res = yield call(queryCategoryInfoAllCount, {});
      if (res && res.code === 200) {
        const data = [
          {
            ...res.data,
            title: res.data.categoryName,
            key: res.data.categoryCode,
            value: res.data.categoryCode,
            children: category(res.data.children),
          },
        ];
        function category(data) {
          return data.map(item => {
            item.title = item.categoryName;
            item.key = item.categoryCode;
            item.value = item.categoryCode;
            if (item.children && item.children.length > 0) {
              category(item.children);
            }
            return item;
          });
        }
        const categoryInfoData = category(res.data.children);
        yield put({
          type: 'upCategoryInfo',
          payload: { categoryInfoAllData: data, categoryInfoData },
        });
        return res;
      }
    },
    *photoImg({ payload }, { call }) {
      const response = yield call(photoImg, payload);
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
    upCollapsed(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    savepersonnels(state, { payload }) {
      return {
        ...state,
        personnels: payload.data,
      };
    },
    savepicData(state, { payload }) {
      return {
        ...state,
        picData: payload,
      };
    },
    savesource(state, { payload }) {
      return {
        ...state,
        sources: payload,
      };
    },
    crmStateQuery(state, action) {
      return {
        ...state,
        crmState: action.payload.data.tbase.crmState,
      };
    },
    levelQuery(state, action) {
      return {
        ...state,
        level: action.payload.data.tbase.level,
      };
    },
    queryx(state, action) {
      return {
        ...state,
        basedata: action.payload.data,
      };
    },
    addrx(state, action) {
      return {
        ...state,
        addrs: action.payload.data,
      };
    },
    queryaddrx(state, action) {
      return {
        ...state,
        queryaddr: action.payload.data,
      };
    },
    streetx(state, action) {
      return {
        ...state,
        street: action.payload.data,
      };
    },
    queryUsersByPostFunctionCodeType(state, action) {
      return {
        ...state,
        queryUsersList: action.payload,
      };
    },
    getDepartmentListType(state, action) {
      return {
        ...state,
        departmentList: action.payload.children,
      };
    },
    upTableHeader(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    upCategoryInfo(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
