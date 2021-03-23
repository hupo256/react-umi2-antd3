import {
  createDesigner, //创建/编辑设计师
  getDesignerByUid, //根据UID查询设计师
  queryDesignerList, //查询设计师列表
  updateStatus, //修改设计师状态
} from '@/services/designerLibrary';

export default {
  namespace: 'DesignerLibrary',

  state: {
    DesignerDetail: {},
    DesignerList: {},
    DesignerListQuery: {},
  },

  effects: {
    // 根据UID查询设计师
    *getDesignerModel({ payload }, { call, put }) {
      const response = yield call(getDesignerByUid, {
        ...payload,
      });
      let obj={}
      if(response && response.code===200){
        const code = response.data.styles.map(item=>item.code)
        obj = {...response.data,styleDicCodes:code}
      }

      yield put({
        type: 'upData',
        payload: { DesignerDetail: {...obj}},
      });
      return response;
    },
    // 查询设计师列表
    *queryDesignerListModel({ payload }, { call, put }) {
      const response = yield call(queryDesignerList, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: {
          DesignerList: (response && response.data) || [],
          DesignerListQuery: { ...payload },
        },
      });
      return response;
    },
    // 创建/编辑设计师
    *createDesignerModel({ payload }, { call, put }) {
      const response = yield call(createDesigner, {
        ...payload,
      });
      return response;
    },
    // 修改设计师状态
    *updateStatusModel({ payload }, { call, put }) {
      const response = yield call(updateStatus, {
        ...payload,
      });
      return response;
    },
    
    *resetSearchModel({ payload }, { call, put }) {
      yield put({ type: 'upData',payload: {DesignerListQuery: { ...payload }}});
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
