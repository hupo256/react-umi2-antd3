/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:51:19 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-04-24 17:34:43
 * 专题库
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Steps } from 'antd';
import { getQueryUrlVal } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CreateStepOne from './CreateCase/CreateStepOne';
import CreateStepTwo from './CreateCase/CreateStepTwo';
import CreateStepThree from './CreateCase/CreateStepThree';
import styles from './index.less';
const { Step } = Steps;

@connect(({ ProjectLibrary, loading }) => ({
  ProjectLibrary,
  loading: loading.effects['ProjectLibrary/pageList'],
}))
class ProjectLibrary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'specialUid',
        value: '',
      },
    });
  }
  render() {
    const {
      ProjectLibrary: { status },
    } = this.props;
    let setp = Number(status);
    return (
      <div>
        <div
          className={styles.caseTab}
          style={{
            paddingLeft: sessionStorage.collapsed == 'false' ? '256px' : '110px',
          }}
        >
          <div className={styles.cht}>创建专题</div>
          <div className={styles.chp}>创建专题一共分两步，填写基本信息，配置专题界面</div>
        </div>
        <PageHeaderWrapper>
          <Card bordered={false} style={{ marginTop: 80 }}>
            <Steps current={setp}>
              <Step title="填写基本信息" />
              <Step title="配置专题界面" />
              <Step title="完成" />
            </Steps>
            {setp == 0 && <CreateStepOne handleOk={() => this.handleOk(1)} />}
            {setp == 1 && <CreateStepTwo handleOk={() => this.handleOk(0)} />}
            {setp == 2 && <CreateStepThree />}
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
  handleOk(status) {
    const {
      dispatch,
      ProjectLibrary: { specialUid },
    } = this.props;
    const activeKey = getQueryUrlVal('uid') || specialUid;
    if (activeKey) {
      dispatch({
        type: 'ProjectLibrary/specialGetModel',
        payload: {
          specialUid: activeKey,
        },
      });
    }
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'status',
        value: status,
      },
    });
  }
}

export default ProjectLibrary;
