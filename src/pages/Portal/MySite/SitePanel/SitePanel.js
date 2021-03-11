/*
 * @Author: zqm 
 * @Date: 2021-02-15 16:18:39 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-02-15 16:44:48
 * 网站面板
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, Row, Col, Input, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class SitePanel extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <PageHeaderWrapper>
          <Card bordered={false}>网站面板</Card>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default SitePanel;
