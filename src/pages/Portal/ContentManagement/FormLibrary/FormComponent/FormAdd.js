/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:51:19 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-01 16:27:39
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

  componentDidMount() {
    const activeKey = getQueryUrlVal('uid');
    if (activeKey) {
      const { dispatch } = this.props;
      dispatch({
        type: 'ProjectLibrary/specialGetModel',
        payload: {
          specialUid: activeKey,
        },
      });
    }
  }
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
              <Step title="上传案例图片" />
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
    const { dispatch } = this.props;
    const activeKey = getQueryUrlVal('uid');
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
