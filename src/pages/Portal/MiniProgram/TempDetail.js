/*
 * @Author: zqm 
 * @Date: 2021-03-22 14:00:29 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-22 15:30:53
 * 编辑模板
 */
import React, { PureComponent, Fragment } from 'react';
import { Card, Steps, Row, Col } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './MiniProgram.less';
import router from 'umi/router';
import { fixedTitle } from '@/utils/utils';
const { Step } = Steps;
class TempDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
    };
  }

  componentDidMount() {
    // router.push(`/portal/miniprogram/tempselect`)
  }

  render() {
    const { step } = this.state;
    return (
      <div>
        <PageHeaderWrapper  >
          <Card bordered={false} style={{marginTop:0}}>
            <div className={styles.tempdetail}>
            
            </div>
         </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default TempDetail;
