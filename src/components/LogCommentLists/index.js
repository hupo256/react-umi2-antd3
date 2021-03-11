/*
 * @Author: pengyc 
 * @Date: 2020-03-02 16:30:58 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-01-07 11:16:59
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
    const { logdata, crmId, cluesLoading, projectLoading } = this.props;
    return (
      <Spin spinning={!!cluesLoading || !!projectLoading}>
        <div className={styles.LogCommentList}>
          <section className={styles.center}>
            <CommentWrap crmId={crmId} data={logdata} />
          </section>
          <div />
        </div>
      </Spin>
    );
  }
}

export default LogCommentList;
