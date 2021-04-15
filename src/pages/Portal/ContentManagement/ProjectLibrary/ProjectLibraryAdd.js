/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:51:19 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-04-15 20:27:09
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
  render() {
    const {
      ProjectLibrary: { status },
    } = this.props;
    let setp = Number(status);
    return (
      <div>
        <PageHeaderWrapper>
          <Card bordered={false}>
            <Steps current={setp}>
              <Step title="填写基本信息" />
              <Step title="配置专题界面" />
              <Step title="完成" />
            </Steps>
            {setp == 0 && <CreateStepOne handleOk={() => this.handleOk(1)} />}
            {setp == 1 && <CreateStepTwo />}
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
