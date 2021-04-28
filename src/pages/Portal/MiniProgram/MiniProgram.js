/*
 * @Author: zqm 
 * @Date: 2021-03-22 11:14:52 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-22 14:48:48
 * 我的小程序
 */
import React, { PureComponent, Fragment } from 'react';
import { Card, Steps, Row, Col } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import { fixedTitle } from '@/utils/utils';
const { Step } = Steps;
class MiniProgram extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
    };
  }

  componentDidMount() {
    router.push(`/portal/miniprogram/tempselect`)
  }

  render() {
    const { step } = this.state;
    return (
      <div>
        <PageHeaderWrapper  >
          <Card bordered={false} style={{marginTop:0}}>
            去玩儿2222推与
         </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default MiniProgram;
