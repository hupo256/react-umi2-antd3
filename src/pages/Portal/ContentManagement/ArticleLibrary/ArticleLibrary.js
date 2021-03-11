/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:50:21 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-02-15 16:41:25
 * 文章库
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, Row, Col, Input, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class ArticleLibrary extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <PageHeaderWrapper>
          <Card bordered={false}>文章库</Card>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default ArticleLibrary;
