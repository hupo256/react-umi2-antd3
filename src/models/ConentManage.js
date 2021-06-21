/*
 * @Author: ql
 * @Date: 2021-06-15 14:46:47
 * @LastEditTime: 2021-06-15 15:21:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front-wechat-saas\src\models\ConentManage.js
 */
import { getCode } from '@/services/caseLibrary'
export default {
    namespace: 'ContentManage',
    state: {
        visible: false,
        uid: null,
        showUrl: '',
        downloadUrl: ''

    },
    reducers: {
        upData(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
    effects: {
        // 获取小程序码
        *getAppletsCode({ payload }, {put, call}) {
            const res = yield call(getCode, payload);
            if(res?.data) {
                yield put({
                    type: 'upData',
                    payload: {
                        showUrl: res.data.showUrl,
                        downloadUrl: res.data.downloadUrl,
                        visible: true,
                    }
                })
            }
        }
    }
}