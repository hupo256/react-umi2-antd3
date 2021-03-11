import {
  getcurrentuser,
  normaleditpass,
  normaledit,
  getusersbyrole,
  getusersbyroles,
  helpQuery,
  contractpayplanqueryAudit,
  contractpayplanbookAttach,
  querySContractCode,
  queryMContractCode,
  audit,
  contractpayplanbookAttachs,
  getTargetMoneyData,
  updateTargetMoneyData,
  checkUserPassword,
  claimbackQueryLoans,
  claimbackQueryRepayment,
  fileLoansExport,
  fileRepaymentExport,
  depositauditQuery,
  fileDepositExport,
  getHelpInfo, //获取版本更新内容
  closeHelp, //标记已读
  taskQueryUsers, //任务台查询人员
} from '@/services/users';
import { message } from 'antd';
import router from 'umi/router';
export default {
  namespace: 'users',

  state: {
    userinfo: {},
    roleUsers: [],
    helpTable: {},
    auditQuery: {},
    ContractCode: {},
    userPassword: {},
    claimbackLoansQuery: {}, //个人-个人财务管理-我的借款列表
    claimbackRepaymentQuery: {}, //个人--个人财务管理-我的报销列表
    depositauditQuery: {}, //个人--个人财务管理-我的押金列表
    taskUsers: {}, //任务台所有人员
  },

  effects: {
    *taskQueryUsersModel({ payload }, { call, put }) {
      const response = yield call(taskQueryUsers, payload);
      yield put({
        type: 'upData',
        payload: { taskUsers: response.data },
      });
      return response;
    },
    //-------个人信息-------
    *getcurrentuser({ payload }, { call, put }) {
      const response = yield call(getcurrentuser, payload);
      if (response.code == '500') {
        //未登录的情况
        router.push('/User/Login');
      } else {
        yield put({
          type: 'uin',
          payload: response,
        });
      }
      return response;
    },
    *normaleditpass({ payload }, { call }) {
      const response = yield call(normaleditpass, payload.userinfo);
      return response;
    },

    *normaledit({ payload }, { call, put }) {
      const response = yield call(normaledit, payload.userinfo);
      if (response.code == '200') {
        message.success('提交成功');
        const response = yield call(getcurrentuser, payload);
        yield put({
          type: 'uin',
          payload: response,
        });
      } else {
        message.error('提交失败');
      }
    },

    *getusersbyrole({ payload }, { call, put }) {
      const response = yield call(getusersbyrole, payload);
      yield put({
        type: 'roleUser',
        payload: response,
      });
    },

    *getusersbyroles({ payload }, { call, put }) {
      const response = yield call(getusersbyroles, payload);
      yield put({
        type: 'roleUsers',
        payload: response,
      });
    },

    *helpquery({ payload }, { call, put }) {
      const response = yield call(helpQuery, payload);
      if (response.code == 200) {
        yield put({
          type: 'saveHelpData',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },

    *auditquery({ payload }, { call, put }) {
      const params = {
        ...payload,
        plan_start_time: payload.date
          ? typeof payload.date[0] == 'string'
            ? payload.date[0].slice(0, 10)
            : payload.date[0].format('YYYY-MM-DD')
          : '',
        plan_end_time: payload.date
          ? typeof payload.date[1] == 'string'
            ? payload.date[1].slice(0, 10)
            : payload.date[1].format('YYYY-MM-DD')
          : '',
        audit_start_time: payload.date_audited
          ? typeof payload.date_audited[0] == 'string'
            ? payload.date_audited[0].slice(0, 10)
            : payload.date_audited[0].format('YYYY-MM-DD') + ' 00:00:00'
          : '',
        audit_end_time: payload.date_audited
          ? typeof payload.date_audited[1] == 'string'
            ? payload.date_audited[1].slice(0, 10)
            : payload.date_audited[1].format('YYYY-MM-DD') + ' 23:59:59'
          : '',
        actual_start_time: payload.actual
          ? typeof payload.actual[0] == 'string'
            ? payload.actual[0].slice(0, 10)
            : payload.actual[0].format('YYYY-MM-DD')
          : '',
        actual_end_time: payload.actual
          ? typeof payload.actual[1] == 'string'
            ? payload.actual[1].slice(0, 10)
            : payload.actual[1].format('YYYY-MM-DD')
          : '',
      };
      delete params.date;
      delete params.actual;
      delete params.date_audited;
      const response = yield call(contractpayplanqueryAudit, params);
      if (response.code == 200) {
        yield put({
          type: 'saveAuditquery',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },

    *bookAttach({ payload }, { call }) {
      const response = yield call(contractpayplanbookAttach, payload);
      return response;
    },

    *contractpayplanbookAttachs({ payload }, { call }) {
      //查看发票和附件
      const response = yield call(contractpayplanbookAttachs, payload);
      return response;
    },

    *queryContractCode({ payload }, { call, put }) {
      if (payload.type == 'CTC_01') {
        delete payload.type;
        const response = yield call(querySContractCode, payload);
        if (response.code == 200) {
          yield put({
            type: 'saveContractCode',
            payload: response.data,
          });
        } else {
          message.error(response.message);
        }
      } else {
        delete payload.type;
        const response = yield call(queryMContractCode, payload);
        if (response.code == 200) {
          yield put({
            type: 'saveContractCode',
            payload: response.data,
          });
        } else {
          message.error(response.message);
        }
      }
    },

    *audit({ payload }, { call }) {
      const response = yield call(audit, payload);
      return response;
    },
    ///查询目标金额
    *getTargetMoneyDataModel({ payload }, { call }) {
      const response = yield call(getTargetMoneyData, payload);
      if (response.code === 200) {
        return response.data;
      }
    },
    ///修改目标金额
    *updateTargetMoneyDataModel({ payload }, { call }) {
      const response = yield call(updateTargetMoneyData, payload);
      return response;
    },

    // 判断用户密码是否是初始密码
    *checkUserPasswordModel({ payload }, { call, put }) {
      const response = yield call(checkUserPassword, payload);
      yield put({
        type: 'checkUserPasswordType',
        payload: response.data,
      });
      return response;
    },
    // 个人-个人财务管理-我的借款列表
    *claimbackQueryLoansModel({ payload }, { call, put }) {
      const response = yield call(claimbackQueryLoans, payload);
      yield put({
        type: 'saveclaimbackQueryLoans',
        payload: response.data,
      });
    },
    // 个人--个人财务管理-我的报销列表
    *claimbackQueryRepaymentModel({ payload }, { call, put }) {
      const response = yield call(claimbackQueryRepayment, payload);
      yield put({
        type: 'saveclaimbackQueryRepayment',
        payload: response.data,
      });
    },
    // 个人--个人财务管理-我的借款导出
    *fileLoansExportModel({ payload }, { call }) {
      yield call(fileLoansExport, payload);
    },
    // 个人--个人财务管理-我的报销导出
    *fileRepaymentExportModel({ payload }, { call }) {
      yield call(fileRepaymentExport, payload);
    },
    //个人-个人财务管理-押金列表
    *depositauditQueryModel({ payload }, { call, put }) {
      const response = yield call(depositauditQuery, payload);
      if (response.code == 200) {
        yield put({
          type: 'savedepositauditQuery',
          payload: response.data,
        });
      }
    },
    //个人-个人财务管理-我的押金导出
    *fileDepositExportModel({ payload }, { call }) {
      yield call(fileDepositExport, payload);
    },
    // 获取版本更新内容
    *getHelpInfoModel({ payload }, { call, put }) {
      const response = yield call(getHelpInfo, payload);
      return response;
    },

    *closeHelpModel({ payload }, { call, put }) {
      const response = yield call(closeHelp, payload);
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
    savedepositauditQuery(state, action) {
      return {
        ...state,
        depositauditQuery: action.payload,
      };
    },
    saveclaimbackQueryRepayment(state, action) {
      return {
        ...state,
        claimbackRepaymentQuery: action.payload,
      };
    },
    saveclaimbackQueryLoans(state, action) {
      return {
        ...state,
        claimbackLoansQuery: action.payload,
      };
    },
    checkUserPasswordType(state, action) {
      return {
        ...state,
        userPassword: action.payload,
      };
    },
    uin(state, action) {
      return {
        ...state,
        userinfo: action.payload.data,
      };
    },
    roleUser(state, action) {
      return {
        ...state,
        roleUser: action.payload.data,
      };
    },
    roleUsers(state, action) {
      return {
        ...state,
        roleUsers: action.payload.data,
      };
    },
    saveHelpData(state, { payload }) {
      return {
        ...state,
        helpTable: payload,
      };
    },
    saveAuditquery(state, { payload }) {
      return {
        ...state,
        auditQuery: payload,
      };
    },
    saveContractCode(state, { payload }) {
      return {
        ...state,
        ContractCode: payload,
      };
    },
  },
};
