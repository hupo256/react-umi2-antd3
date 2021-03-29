/*
 * @Author: zqm 
 * @Date: 2021-02-17 10:32:27 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-29 11:27:06
 * 小程序授权
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, Tabs, Col, Input, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import img from '../../../assets/v2_q1insu.png';
import styles from './MiniProgram.less';
import NotBound from './NotBound';
import FormBinding from './FormBinding';
import { getauth } from "@/utils/authority";
const { TabPane } = Tabs;

@connect(({ MiniProgram, loading }) => ({
  MiniProgram,
  Loading: loading.effects['MiniProgram/getAuthInfoModel'],
}))
class MiniProgram extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1',
      leftactiveKey: 'baseinfo',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const code = localStorage.getItem('auth');
    const saasSellerCode = JSON.parse(code).companyCode;
    dispatch({ type: 'MiniProgram/getAuthInfoModel', payload: { saasSellerCode } }).then(res => {});
  }

  render() {
    const { activeKey, leftactiveKey } = this.state;
    const permissionsBtn = getauth().permissions||[];
    const {
      Loading,
      MiniProgram: { AuthInfo },
    } = this.props;
    return (
      <div>
        <PageHeaderWrapper>
          <Card bordered={false} loading={Loading}>
            <Tabs activeKey={activeKey} onChange={activeKey => this.setState({ activeKey })}>
              <TabPane tab="营销门户" key="1" />
            </Tabs>
            {!AuthInfo.isAuthedWechatMini && <NotBound />}
            {AuthInfo.isAuthedWechatMini && (
              <div className={styles.dictWrap}>
                <div className={styles.dictLeft}>
                  <Tabs
                    tabPosition="left"
                    className={styles.dictTabs}
                    activeKey={leftactiveKey}
                    onChange={activeKey => this.handleChangeTab(activeKey)}
                  >
                  {permissionsBtn.includes('MU9000000300020001')&&<TabPane tab="基本信息" key="baseinfo" />}
                  {permissionsBtn.includes('MU9000000300020002')&& <TabPane tab="表单绑定" key="form" />}
                  </Tabs>
                </div>
                <div className={styles.dictRight}>
                  {permissionsBtn.includes('MU9000000300020001')&&leftactiveKey === 'baseinfo' && (
                    <div>
                      <p className={styles.dictRightTitle}>基本信息</p>
                      <p className={styles.dictRightName}>{AuthInfo.wechatNickName}</p>
                      <p>小程序名称</p>
                      <div className={styles.dictImg}>
                        <div className={styles.dictImgLeft}>
                          <img src={AuthInfo.wechatHeadImgUrl} style={{ width: 120 }} />
                          <p>小程序图标</p>
                        </div>
                        <div className={styles.dictImgRight}>
                          <img src={AuthInfo.wechatQrcodeUrl} style={{ width: 120 }} />
                          <p>小程序二维码</p>
                        </div>
                      </div>
                      <p className={styles.dictCompanyname}>{AuthInfo.wechatPrincipalName}</p>
                    </div>
                  )}
                  {permissionsBtn.includes('MU9000000300020002')&&leftactiveKey === 'form' && <FormBinding />}
                </div>
              </div>
            )}
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
  // 字段模块切换
  handleChangeTab = leftactiveKey => {
    this.setState({ leftactiveKey });
  };
}

export default MiniProgram;
