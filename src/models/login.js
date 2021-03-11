import { routerRedux } from "dva/router";
import { stringify } from "qs";
import {
  fakeAccountLogin,
  getFakeCaptcha,
  loginCount,
  loginCheck,
  loginPassword,
  logout,
} from "@/services/api";
import { setAuthority, cleanAuthority, setauth } from "@/utils/authority";
import { getPageQuery } from "@/utils/utils";
import router from "umi/router";
import { reloadAuthorized } from "@/utils/Authorized";
import {
  queryMenuBtnLogin,
  getStrCode,
  getVerificationCode,
  projectQueryNum,
} from "../services/users";
export default {
  namespace: "login",
  state: {
    status: undefined,
    CodeFlag: "",
    msg: "",
    dispatchLoading: false,
    pageStatus: 2,
    mobileData: {},
    companyList: [],
    PasswordData: {},
    againSend: 0,
  },
  effects: {
    //退出登录
    *logoutModel({ payload }, { call }) {
      const response = yield call(logout, { source: 1 });
      if (response.code === 200) {
        router.push("/User/Login");
      }
      return response;
    },
    *login({ payload }, { call, put, select }) {
      const response = yield call(fakeAccountLogin, payload);
      return response;
    },
    // 存储权限
    *setAuthModel({ payload }, { call, put }) {
      try {
        const response = yield call(queryMenuBtnLogin, payload);
        if (response && response.code === 200) {
          setauth(response.data);
          reloadAuthorized();
        }
        return response;
      } catch (error) {
        alert("error ==", error);
      }
    },
    *getCaptcha({ payload }, { call }) {
      const response = yield call(getFakeCaptcha, payload);
      return response;
    },

    *loginCountModel({ payload }, { call }) {
      const response = yield call(loginCount, payload);
      return response;
    },
    *logout(_, { put }) {
      // yield put({
      //   type: 'changeLoginStatus',
      //   payload: {
      //     status: false,
      //     currentAuthority: 'guest',
      //   },
      // });
      yield put({
        type: "changeLoginStatus",
        payload: {
          // status: false,
          status: "401",
          data: "guest",
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: "/user/login",
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
    *getverificationCode({ payload }, { call, put }) {
      const strCode = yield call(getStrCode);
      if (strCode.code == 200) {
        yield call(getVerificationCode, strCode.data);
        yield put({
          type: "saveCodeFlag",
          payload: strCode.data,
        });
      }
    },
    *saveDataModel({ payload }, { call, put }) {
      yield put({
        type: "saveDatax",
        payload: payload,
      });
    },
    //登录验证
    *loginCheckModel({ payload }, { call }) {
      const response = yield call(loginCheck, payload);
      return response;
    },
    //如果公司租约过期 查询项目数和工单数
    *projectQueryNumModel({ payload }, { call }) {
      const response = yield call(projectQueryNum, payload);
      return response;
    },

    //密码登陆
    *loginPasswordModel({ payload }, { call, put, select }) {
      yield put({
        type: "dispatchLoadingType",
        payload: { dispatchLoading: true },
      });
      payload.codeFlag = yield select((state) => state.login.CodeFlag);
      const response = yield call(loginPassword, payload);
      yield put({
        type: "changeLoginStatus",
        payload: response,
      });
      yield put({
        type: "dispatchLoadingType",
        payload: { dispatchLoading: false },
      });
      return response;
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload && payload.code == "200") {
        setAuthority(payload.data.token);
      } else {
        cleanAuthority();
      }

      return {
        ...state,
        status: payload && payload.code,
        msg: payload && payload.message,
        type: "account",
      };
    },
    saveCodeFlag(state, { payload }) {
      return {
        ...state,
        CodeFlag: payload,
      };
    },
    dispatchLoadingType(state, action) {
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
