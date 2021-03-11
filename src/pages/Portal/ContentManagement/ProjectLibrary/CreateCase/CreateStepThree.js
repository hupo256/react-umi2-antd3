/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-02-25 14:18:21
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { paginations, getUrl } from '@/utils/utils';
import styles from '../index.less';

@connect(({ DictConfig, loading }) => ({
  DictConfig,
}))
class CreateStepThree extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <h3>创建成功</h3>
        <p>快去你的站点看看吧</p>
        <div />
        <Button type="primary">在创建一个</Button>
        <Button>返回案例库</Button>
      </div>
    );
  }
  handleSubmit = e => {};
}

export default CreateStepThree;
