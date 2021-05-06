/*
 * @Author: ql
 * @Date: 2021-04-21 14:51:56
 * @LastEditTime: 2021-04-26 18:20:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front-wechat-saas\src\models\ChannelManange.js
 */
export default {
    namespace: 'channelManage',
    state: {
        showCreateEdit: false,   //创建或编辑弹框
        isCreate: true,             
        currentEditUid: '',       //当前编辑数据uid
        currentDetailType: 0,     //关联页面详情选择页面类型    1-工地   2-设计师   3-案例  4-文章
        selectDetailData: [],   //选择的当前详情数据对象   
    },
    reducers:{
        save(state, action) {
            return {
                ...state, ...action.payload
            }
        }
    },
    effects: {
        
    }
}