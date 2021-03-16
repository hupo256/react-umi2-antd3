/*
 * @Author: zqm 
 * @Date: 2021-02-25 14:14:21 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-16 16:56:14
 * 案例编辑
 */
import React, { Component } from 'react';
import { Card, Steps, Tabs, Col } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CreateStepOne from './CreateCase/CreateStepOne';
import CreateStepTwo from './CreateCase/CreateStepTwo';
import styles from './CaseLibrary.less';
import { connect } from 'dva';
import { getQueryUrlVal,fixedTitle } from '@/utils/utils';

const { TabPane } = Tabs;

@connect(({ CaseLibrary }) => ({ CaseLibrary }))
class CaseLibraryEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'tab1',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'CaseLibrary/getCaseByUidModel',
      payload: { uid: getQueryUrlVal('uid') },
    });
    dispatch({
      type: 'CaseLibrary/queryCasePicListModel',
      payload: { uid: getQueryUrlVal('uid') },
    });
  }

  render() {
    const { step } = this.state;
    return (
      <div>
        <div
          className={styles.caseTab}
          style={{ paddingLeft: sessionStorage.collapsed == 'false' ? '256px' : '110px' }}
        >
          <Tabs
            style={{ marginTop: 20, marginBottom: '-6px' }}
            activeKey={step}
            onChange={key => this.callback(key)}
          >
            <TabPane tab="基本信息" key="tab1" />
            <TabPane tab="案例图片" key="tab2" />
          </Tabs>
        </div>
        <PageHeaderWrapper   fixedTitle={fixedTitle()}>
          <Card bordered={false} style={{ marginTop: 108 }}>
            {step === 'tab1' && (
              <CreateStepOne type="edit" handleOk={() => this.setState({ step: 1 })} />
            )}
            {step === 'tab2' && (
              <CreateStepTwo
                type="edit"
                handleOk={() => this.setState({ step: 2 })}
                handleBackStep={() => this.setState({ step: 0 })}
              />
            )}
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
  callback = step => {
    this.setState({ step });
  };
}
export default CaseLibraryEdit;
