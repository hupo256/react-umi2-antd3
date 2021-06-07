/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:51:19 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-06-01 15:15:35
 * 专题库
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Steps, Tabs } from 'antd';
import router from 'umi/router';
import { getQueryUrlVal } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CreateStepOne from './CreateCase/CreateStepOne';

import styles from './index.less';
const { TabPane } = Tabs;
@connect(({ ProjectLibrary, loading }) => ({
  ProjectLibrary,
  loading: loading.effects['ProjectLibrary/pageList'],
}))
class ProjectLibraryEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      step: 'tab1',
    };
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
    const { step } = this.state;
    return (
      <div>
        <div
          className={styles.caseTab}
          style={{ paddingLeft: sessionStorage.collapsed == 'false' ? '256px' : '110px' }}
        >
          <Tabs
            style={{ marginTop: 10, marginBottom: '-6px' }}
            activeKey={step}
            onChange={key => this.callback(key)}
          >
            <TabPane tab="基本信息" key="tab1" />
            <TabPane tab="配置专题界面" key="tab2" />
          </Tabs>
        </div>
        <PageHeaderWrapper>
          <Card bordered={false} style={{ marginTop: 48 }}>
            <CreateStepOne handleOk={() => this.handleOk(1)} />
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
  callback = step => {
    if (step === 'tab2') {
      const activeKey = getQueryUrlVal('uid');
      router.push(
        `/portal/contentmanagement/ProjectLibrary/ConfigurationTopic?&uid=${activeKey}&edit=1`
      );
    } else {
      this.setState({ step });
    }
  };
}

export default ProjectLibraryEdit;
