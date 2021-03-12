/*
 * @Author: zqm 
 * @Date: 2021-02-17 10:32:27 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-12 10:40:19
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
      url: null,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const code = localStorage.getItem('auth');
    const saasSellerCode = JSON.parse(code).companyCode;
    dispatch({ type: 'MiniProgram/getAuthInfoModel', payload: { saasSellerCode } }).then(res => {
      if (res && res.code === 200) {
        if (!res.data.isAuthedWechatMini) {
          dispatch({ type: 'MiniProgram/getAuthUrlModel', payload: { saasSellerCode } }).then(
            res => {
              if (res && res.code === 200) {
                this.setState({ url: res.code.url });
              }
            }
          );
        }
      }
    });
  }

  render() {
    const { activeKey, leftactiveKey } = this.state;
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
                    <TabPane tab="基本信息" key="baseinfo" />
                    <TabPane tab="表单绑定" key="form" />
                  </Tabs>
                </div>
                <div className={styles.dictRight}>
                  {leftactiveKey === 'baseinfo' && (
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
                  {leftactiveKey === 'form' && <FormBinding />}
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
    // 重置搜索数据
    const { dispatch } = this.props;
    // resetModel
    // dispatch({
    //   type: 'DictConfig/resetModel',
    //   payload: {
    //     DicList: {},
    //     DicQuery: {},
    //   },
    // }).then(res => {
    //   this.queryList({ dicModuleCode: activeKey, pageNum: 1, pageSize: 100 });
    // });
  };
}

export default MiniProgram;
