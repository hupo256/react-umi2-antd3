import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import HostBind from './HostBind';
import CustomCode from './CustomCode';
import BasicMessage from './BasicMessage';
import EnterpriseMessage from './EnterpriseMessage';
import { getauth } from '@/utils/authority';
import './WebSetting.less';

@connect(({ WebSettingStroe }) => ({
  WebSettingStroe,
}))
class WebSetting extends Component {
  render() {
    const { TabPane } = Tabs;
    const permissionsBtn = getauth();
    return (
      <div className="Websetting_Content" style={{ height: '100%' }}>
        <Tabs tabPosition="left" className="Websetting_ContentTabs">
          {permissionsBtn.permissions.includes('BTN210610000001') ? (
            <TabPane tab="域名绑定" key="1">
              <HostBind {...this.props} />
            </TabPane>
          ) : null}
          {permissionsBtn.permissions.includes('BTN210610000002') ? (
            <TabPane tab="基本信息" key="2">
              <BasicMessage {...this.props} />
            </TabPane>
          ) : null}
          {permissionsBtn.permissions.includes('BTN210610000003') ? (
            <TabPane tab="企业信息" key="3">
              <EnterpriseMessage {...this.props} />
            </TabPane>
          ) : null}
          {permissionsBtn.permissions.includes('BTN210610000004') ? (
            <TabPane tab="自定义代码" key="4">
              <CustomCode {...this.props} />
            </TabPane>
          ) : null}
        </Tabs>
      </div>
    );
  }
}

export default WebSetting;
