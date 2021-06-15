/*
 * @Author: zqm 
 * @Date: 2021-04-28 17:05:47 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-06-16 03:26:49
 * 小程序设置
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Switch, Icon, Menu, Table, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { MyIcon } from '@/utils/utils';
import styles from './index.less';
import { getauth } from '@/utils/authority';
import LinkPage from './LinkPage';
import AdSeter from './AdSeter';
import NotBound from '../MiniProgram/NotBound';

const { permissions } = getauth();
const menuData = [
  {
    name: '通用设置',
    code: 'BTN210610000006',
  },
  {
    name: '关联页面设置',
    code: 'BTN210610000007',
  },
  {
    name: '广告设置',
    code: 'BTN210621000001',
  },
];

@connect(({ MiniProgram }) => ({ MiniProgram }))
class Index extends PureComponent {
  state = {
    visible: false,
    record: null,
    selectedKeys: ['1'],
    switchCommonDate: null,
    switchLoading: false,
    showSec: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const code = localStorage.getItem('auth');
    const saasSellerCode = JSON.parse(code).companyCode;
    dispatch({ type: 'MiniProgram/getAuthInfoModel', payload: { saasSellerCode } }).then(res => {
      // if (res && res.code === 200 && res.data.isAuthedWechatMini) {
      if (res && res.code === 200) {
        dispatch({ type: 'MiniProgram/formbindmapModel' });
        dispatch({ type: 'MiniProgram/queryWechatMiniGlobalModel' }).then(res => {
          if (res?.code === 200) {
            this.setState({ switchCommonDate: res.data });
          }
        });
      }
    });
  }

  render() {
    const { FormDetail, AuthInfo } = this.props.MiniProgram;
    const title = (
      <div style={{ display: 'none' }}>
        <h3 style={{ marginTop: 10 }}>关联页面设置</h3>
      </div>
    );
    const columns = [
      {
        title: '模块名称',
        dataIndex: 'name',
      },
      {
        title: '模块链接',
        dataIndex: 'link',
        render: (t, r) => {
          return (
            <div className={styles.copy}>
              <p id="text" style={{ display: 'block' }}>
                {t}
              </p>
              <textarea id="input" className={styles.ipt} />
              {t ? (
                <span
                  style={{ marginLeft: 0 }}
                  onClick={() => {
                    this.handleCopy(t);
                  }}
                >
                  <Icon type="copy" />
                  <span style={{ marginLeft: 5 }}>复制链接</span>
                </span>
              ) : (
                ''
              )}
            </div>
          );
        },
      },
      {
        title: '已关联页面',
        dataIndex: 'formTitle',
        render: (t, r) => {
          if (r.name == '文章') {
            return '/';
          } else {
            return <span>{t ? t : '一键授权'}</span>;
          }
        },
      },
      {
        title: '按钮名称',
        dataIndex: 'buttonText',
        render: (t, r) => {
          if (r.name == '文章') {
            return '/';
          } else {
            return <span>{t}</span>;
          }
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          if (record.name == '文章') {
            return '/';
          } else {
            return (
              <span>
                <a
                  onClick={() =>
                    this.setState({ record }, () => {
                      this.setState({ visible: true });
                    })
                  }
                >
                  编辑
                </a>
              </span>
            );
          }
        },
      },
    ];
    const data = FormDetail
      ? [
          {
            key: '1',
            name: '案例',
            link: 'page/Case/Case',
            ...FormDetail['1'],
          },
          {
            key: '2',
            name: '工地',
            link: 'page/Site/Site',
            ...FormDetail['2'],
          },
          {
            key: '3',
            name: '设计师',
            link: 'page/designer/designer',
            ...FormDetail['3'],
          },
          {
            key: '4',
            name: '文章',
            link: 'page/Article/Article',
          },
        ]
      : [];
    const { visible, record, selectedKeys, switchCommonDate, switchLoading, showSec } = this.state;
    return (
      <div className={styles.appleCard} onClick={this.touchInpBlurTag}>
        <PageHeaderWrapper title={title}>
          <Card bordered={false}>
            {!AuthInfo.isAuthedWechatMini && (
              <div className={styles.appletWrap}>
                <div className={styles.appleLeft}>
                  <Menu
                    onClick={e => this.setState({ selectedKeys: [e.key] })}
                    style={{ width: 256 }}
                    selectedKeys={selectedKeys}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                  >
                    {menuData.map((menu, ind) => {
                      const { name, code } = menu;
                      return (
                        permissions.includes(code) && (
                          <Menu.Item key={`${ind + 1}`}>
                            <p style={{ paddingLeft: 24 }}>{name}</p>
                          </Menu.Item>
                        )
                      );
                    })}
                  </Menu>
                </div>
                {selectedKeys[0] === '3' &&
                  permissions.includes('BTN210621000001') && (
                    <AdSeter
                      showSecTag={showSec}
                      taggleSecTag={() => this.setState({ showSec: true })}
                    />
                  )}
                {selectedKeys[0] === '2' &&
                  permissions.includes('BTN210610000007') && (
                    <div className={styles.appleRight}>
                      <p style={{ fontWeight: 500, fontSize: 22, color: '#333' }}>关联页面设置</p>
                      <p style={{ fontWeight: 400, fontSize: 13, color: '#666' }}>
                        <MyIcon
                          type="icon-tips"
                          style={{ color: '#ccebfa', fontSize: 18, marginRight: 6 }}
                        />
                        关联后，在小程序的对应模块内点击按钮，会跳转展示所关联的页面
                      </p>
                      <Table columns={columns} dataSource={data} pagination={false} />
                    </div>
                  )}
                {selectedKeys[0] === '1' &&
                  permissions.includes('BTN210610000006') && (
                    <div className={styles.appleRight}>
                      <p style={{ fontWeight: 500, fontSize: 22, color: '#333' }}>通用设置</p>
                      <p>
                        <span>打开小程序一键授权（首次）</span>
                        <Switch
                          loading={switchLoading}
                          checked={switchCommonDate?.homePageOpenAuth}
                          onChange={val => {
                            this.handleSwitchChange('homePageOpenAuth', val);
                          }}
                        />
                      </p>

                      <p>
                        <span>在线客服</span>
                        <Switch
                          loading={switchLoading}
                          checked={switchCommonDate?.wechatCustomerService}
                          onChange={val => {
                            this.handleSwitchChange('wechatCustomerService', val);
                          }}
                        />
                      </p>
                    </div>
                  )}
              </div>
            )}
            {!AuthInfo.isAuthedWechatMini && (
              <NotBound jumpUrl={`${window.location.origin}/#/portal/insite/appletsetting`} />
            )}
          </Card>
        </PageHeaderWrapper>
        {visible && (
          <LinkPage
            visible={visible}
            defvalue={record}
            directType={record.key}
            handleCancel={() => this.handleCancel()}
            handleOk={() => this.handleOk()}
            show={AuthInfo.isCompanyAuthWechatMini}
          />
        )}
      </div>
    );
  }

  // click 事件能到冒泡这里说明那个input已经失焦了
  touchInpBlurTag = e => {
    // e.stopPropagation();
    // console.log(123);
    this.setState({ showSec: false });
  };

  handleOk = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'MiniProgram/formbindmapModel' });
    this.handleCancel();
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  // 开关
  handleSwitchChange = (key, bool) => {
    const { dispatch } = this.props;
    const { switchCommonDate } = this.state;
    const payload = { ...switchCommonDate, [key]: bool };
    this.setState({ switchLoading: true });
    dispatch({
      type: 'MiniProgram/setWechatMiniGlobalModel',
      payload,
    }).then(res => {
      if (res?.code === 200002) {
        message.warning(res.message);
      } else if (res?.code === 200) {
        this.setState({ switchCommonDate: payload, switchLoading: false });
        const AuthTex = ['授权成功', '取消授权成功'];
        const wechatTex = ['在线客服开启成功', '在线客服关闭成功'];
        const tex = key === 'homePageOpenAuth' ? AuthTex : wechatTex;
        message.success(bool ? tex[0] : tex[1]);
      }
    });
  };
  handleCopy(t) {
    let input = document.getElementById('input');
    input.value = t; // 修改文本框的内容
    input.select(); // 选中文本
    document.execCommand('copy'); // 执行浏览器复制命令
    message.success('复制成功');
  }
}

export default Index;
