/*
 * @Author: pengyc 
 * @Date: 2020-06-30 11:09:15 
 * @Last Modified by: pengyc
 * @Last Modified time: 2020-07-30 10:32:19
 * 供应链上方搜索框
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Input } from 'antd';
const { Search } = Input;

@connect(({ CommodityLibrary }) => ({ CommodityLibrary }))
class TotalSearch extends Component {
  render() {
    const { srarchObj } = this.props;
    return (
      <div className={styles.totalSearch}>
        <Search
          placeholder={srarchObj.placeholder}
          onSearch={this.handleOnSearch}
          style={{ width: srarchObj.width || 300 }}
          onChange={this.onChange}
          value={srarchObj.value}
        />
      </div>
    );
  }
  // 搜索
  handleOnSearch = value => {
    const { dispatch, srarchObj } = this.props;
    srarchObj.dispatch &&
      dispatch({
        type: srarchObj.dispatch,
        payload: {
          name: value,
        },
      });
    srarchObj.callback && srarchObj.callback(value);
  };
  // 存储搜索数据
  onChange = e => {
    const { srarchObj } = this.props;
    const tar = e.target;
    const value = tar.value;
    srarchObj.dataCallback && srarchObj.dataCallback(value);
  };
}

export default TotalSearch;
