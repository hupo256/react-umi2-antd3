import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import HostBind from './HostBind';
import CustomCode from './CustomCode';
import BasicMessage from './BasicMessage';
import EnterpriseMessage from './EnterpriseMessage';
import './Websetting.less'

@connect(({ WebSettingStroe }) => ({
  WebSettingStroe
}))

class WebSetting extends Component {
  
  render() {
    const {TabPane} = Tabs;
    return (
      <div className='Websetting_Content' style={{height:'100%'}}>
        <Tabs tabPosition='left' className='Websetting_ContentTabs'>
          <TabPane tab="域名绑定" key="1">
            <HostBind {...this.props} />
          </TabPane>
          <TabPane tab="基本信息" key="2">
           <BasicMessage {...this.props} />
          </TabPane>
          <TabPane tab="企业信息" key="3">
           <EnterpriseMessage {...this.props}/>
          </TabPane>
          <TabPane tab="自定义代码" key="4">
            <CustomCode {...this.props}/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default WebSetting;
