import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Modal } from 'antd';
import HostBind from './HostBind';
import CustomCode from './CustomCode';
import BasicMessage from './BasicMessage';
import EnterpriseMessage from './EnterpriseMessage';
import { getauth } from '@/utils/authority';
import './WebSetting.less';

const { confirm } = Modal;
@connect(({ WebSettingStroe }) => ({
  WebSettingStroe,
}))
class WebSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hintIf: false,
      tabsKey: '1',
      temporaryKey: '',
      oneHostChange: false,
      oneBaiscChange: false,
      oneEnterChange: false,
      oneCodeChange: false,
    };
    this.changeHintIf = this.changeHintIf.bind(this);
    this.openConfirm = this.openConfirm.bind(this);
    this.clickSubmit = this.clickSubmit.bind(this);
  }
  changeHintIf(value) {
    this.setState({
      hintIf: value,
    });
  }
  async changeTabs(key) {
    console.log('234', key, this.state.hintIf);

    if (this.state.hintIf) {
      this.setState({
        temporaryKey: key,
      });
      this.openConfirm();
      return;
    } else {
      if (key == '1') {
        if (this.state.oneHostChange) {
          await this.HostBindRef.dispatchValue();
          this.setState({
            tabsKey: key,
          });
        } else {
          this.setState({
            oneHostChange: true,
            tabsKey: key,
          });
        }
      } else if (key == '2') {
        if (this.state.oneBaiscChange) {
          await this.BasicMessageRef.dispatchValue();
          this.setState({
            tabsKey: key,
          });
        } else {
          this.setState({
            oneBaiscChange: true,
            tabsKey: key,
          });
        }
      } else if (key == '3') {
        if (this.state.oneEnterChange) {
          await this.EnterpriseMessageRef.dispatchValue();
          this.setState({
            tabsKey: key,
          });
        } else {
          this.setState({
            oneEnterChange: true,
            tabsKey: key,
          });
        }
      } else if (key == '4') {
        if (this.state.oneCodeChange) {
          await this.CustomCodeRef.dispatchValue();
          this.setState({
            tabsKey: key,
          });
        } else {
          this.setState({
            oneCodeChange: true,
            tabsKey: key,
          });
        }
      }
    }
  }
  openConfirm() {
    confirm({
      title: '修改未保存，是否保存？',
      okText: '保存',
      cancelText: '不保存',
      onOk: () => {
        console.log('OK', this);
        this.clickSubmit();
      },
      onCancel: () => {
        this.setState({
          hintIf: false,
          tabsKey: this.state.temporaryKey,
        });
      },
    });
  }
  async clickSubmit() {
    const { temporaryKey, tabsKey } = this.state;
    if (tabsKey == '1') {
      await this.HostBindRef.onHostBind();
      await this.setState({
        hintIf: false,
        tabsKey: temporaryKey,
      });
    } else if (tabsKey == '2') {
      await this.BasicMessageRef.clickButton();
      await this.setState({
        hintIf: false,
        tabsKey: temporaryKey,
      });
    } else if (tabsKey == '3') {
      await this.EnterpriseMessageRef.clickButton();
      await this.setState({
        hintIf: false,
        tabsKey: temporaryKey,
      });
    } else if (tabsKey == '4') {
      await this.CustomCodeRef.saveBef();
      await this.setState({
        hintIf: false,
        tabsKey: temporaryKey,
      });
    }
  }
  render() {
    const { TabPane } = Tabs;
    const permissionsBtn = getauth();
    const { tabsKey } = this.state;
    return (
      <div className="Websetting_Content" style={{ height: '100%' }}>
        <Tabs
          tabPosition="left"
          aciveKey={tabsKey}
          className="Websetting_ContentTabs"
          onTabClick={key => this.changeTabs(key)}
        >
          {permissionsBtn.permissions.includes('BTN210610000001') ? (
            <TabPane tab="域名绑定" key="1">
              {tabsKey == '1' ? (
                <HostBind
                  {...this.props}
                  changeHintIf={this.changeHintIf}
                  onRef={node => (this.HostBindRef = node)}
                />
              ) : null}
            </TabPane>
          ) : null}
          {permissionsBtn.permissions.includes('BTN210610000002') ? (
            <TabPane tab="基本信息" key="2">
              {tabsKey == '2' ? (
                <BasicMessage
                  {...this.props}
                  tabsKey={tabsKey}
                  changeHintIf={this.changeHintIf}
                  onRef={node => (this.BasicMessageRef = node)}
                />
              ) : null}
            </TabPane>
          ) : null}
          {permissionsBtn.permissions.includes('BTN210610000003') ? (
            <TabPane tab="企业信息" key="3">
              {tabsKey == '3' ? (
                <EnterpriseMessage
                  {...this.props}
                  changeHintIf={this.changeHintIf}
                  onRef={node => (this.EnterpriseMessageRef = node)}
                />
              ) : null}
            </TabPane>
          ) : null}
          {permissionsBtn.permissions.includes('BTN210610000004') ? (
            <TabPane tab="自定义代码" key="4">
              {tabsKey == '4' ? (
                <CustomCode
                  {...this.props}
                  changeHintIf={this.changeHintIf}
                  onRef={node => (this.CustomCodeRef = node)}
                />
              ) : null}
            </TabPane>
          ) : null}
        </Tabs>
      </div>
    );
  }
}

export default WebSetting;
