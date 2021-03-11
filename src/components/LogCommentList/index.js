/*
 * @Author: pengyc 
 * @Date: 2020-03-02 16:30:58 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-12-30 20:09:57
 * 评论组件
 *  dispatchData 
 *    editUrl: 修改地址
      deleteType: 删除接口,
      queryList: 查询接口,
      zid: 标识,
      type: 标识,
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import styles from './index.less';
import CommentWrap from './CommentWrap';
import { Spin } from 'antd';

@connect(({ customer, base, loading }) => ({
  customer,
  base,
  cluesLoading: loading.effects['customer/logQueryListModel'],
  projectLoading: loading.effects['customer/logQueryProjectListModel'],
}))
class LogCommentList extends Component {
  state = {
    loaded: false,
  };
  componentDidMount() {
    // 获取所有人员
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'base/requestquery',
    //   params: { pageNum: -1 },
    // });
  }
  render() {
    const { logdata, dispatchData, crmId, cluesLoading, projectLoading, updata } = this.props;
    return (
      <Spin spinning={!!cluesLoading || !!projectLoading}>
        <div className={styles.LogCommentList}>
          {logdata &&
            logdata.map((item, ind) => {
              return (
                <section key={ind} className={styles.center}>
                  <CommentWrap
                    crmId={crmId}
                    data={item}
                    dispatchData={dispatchData}
                    indexD={ind}
                    updata={updata}
                  />
                </section>
              );
            })}
          <div />
        </div>
      </Spin>
    );
  }
}

export default LogCommentList;
