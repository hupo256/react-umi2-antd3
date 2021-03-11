import {
  createCasr, //创建编辑案例
  getCaseByUid, //根据UID获取案例
  queryCaseList, //查询案例
  queryCasePicList, //查询案例图片
  updateCasePic, //更新案例图片
  updateCaseStatus, //更新案例状态
} from '@/services/caseLibrary';

export default {
  namespace: 'CaseLibrary',

  state: {
    CaseDetail: {},
    CaseList: {},
    CaseListQuery: {},
    stepOne: {},
    stepTwo: [],
    caseRes: {},
  },

  effects: {
    // 设置VR链接
    *setVRUrlModel({ payload }, { call, put }) {
      yield put({ type: 'setVR', payload: { ...payload } });
      return true;
    },
    // 第一步保存
    *setStepOneModel({ payload }, { call, put }) {
      yield put({ type: 'upData', payload: { ...payload } });
      return true;
    },
    // 根据UID获取案例
    *getCaseByUidModel({ payload }, { call, put }) {
      const response = yield call(getCaseByUid, {
        ...payload,
      });
      const data = response.data;
      yield put({
        type: 'upData',
        payload: {
          stepOne:
            (response && {
              ...data,
              houseType: {
                bedroom: data.bedroom,
                liveroom: data.liveroom,
                kitchen: data.kitchen,
                bathroom: data.bathroom,
              },
            }) ||
            {},
          stepTwo: (response && data) || {},
        },
      });
      return response;
    },
    // 查询案例图片
    *queryCasePicListModel({ payload }, { call, put }) {
      const response = yield call(queryCasePicList, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: { stepTwo: (response && response.data) || [] },
      });
      return response;
    },
    // 查询案例
    *queryCaseListModel({ payload }, { call, put }) {
      const response = yield call(queryCaseList, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: {
          CaseList: (response && response.data) || [],
          CaseListQuery: { ...payload },
        },
      });
      return response;
    },
    // 创建案例
    *createCaseModel({ payload }, { call, put }) {
      const response = yield call(createCasr, {
        ...payload,
      });
      yield put({
        type: 'upData',
        payload: {
          caseRes: {
            title: payload.title,
            buildingName: payload.buildingName,
            designerName: (response.data && response.data.designerName) || '',
          },
        },
      });
      return response;
    },
    // 编辑案例
    *editCaseModel({ payload }, { call, put }) {
      const response = yield call(createCasr, {
        ...payload,
      });
      return response;
    },
    // 更新案例图片
    *updateCasePicModel({ payload }, { call, put }) {
      const response = yield call(updateCasePic, {
        ...payload,
      });
      return response;
    },
    // 更新案例状态
    *updateCaseStatusModel({ payload }, { call, put }) {
      const response = yield call(updateCaseStatus, {
        ...payload,
      });
      return response;
    },
    // reset
    *resetDataModel({ payload }, { call, put }) {
      yield put({ type: 'upData', payload: { ...payload } });
      return true;
    },
  },

  reducers: {
    upData(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setVR(state, action) {
      let { stepOne } = state;
      stepOne.vrCoverUrl = action.payload.coverImg;
      stepOne.vrUrl = action.payload.VRUrl;
      return {
        ...state,
        stepOne,
      };
    },
  },
};
