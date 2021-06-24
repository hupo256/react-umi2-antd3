/*
 * @Author: ql
 * @Date: 2021-06-15 14:46:47
 * @LastEditTime: 2021-06-24 18:35:36
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
        downloadUrl: '',
        loading: false

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
            yield put({
                type: 'upData',
                payload: {
                    loading: true,
                    visible: true,
                    showUrl: ''
                }
            })
            const res = yield call(getCode, payload);
            if(res?.data) {
                yield put({
                    type: 'upData',
                    payload: {
                        showUrl: res.data.showUrl,
                        downloadUrl: res.data.downloadUrl,
                        loading: false
                    }
                })
            }
        }
    }
}