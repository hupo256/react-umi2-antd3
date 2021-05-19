/*
 * @Author: zqm 
 * @Date: 2021-04-28 17:05:47 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-05-14 14:26:36
 * 小程序设置
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Switch, Icon, Menu, Table, Input, message, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { MyIcon } from '@/utils/utils';
import styles from './index.less';
import { getauth } from '@/utils/authority';
import LinkPage from './LinkPage';
const { SubMenu } = Menu;

@connect(({ MiniProgram }) => ({ MiniProgram }))
class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      record: null,
      selectedKeys: ['1'],
      switchChecked: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const code = localStorage.getItem('auth');
    const saasSellerCode = JSON.parse(code).companyCode;
    dispatch({ type: 'MiniProgram/getAuthInfoModel', payload: { saasSellerCode } }).then(res => {
      console.log('====================================');
      console.log(res);
      console.log('====================================');
      if (res && res.code === 200 && res.data.isAuthedWechatMini) {
        dispatch({ type: 'MiniProgram/formbindmapModel' });
        dispatch({ type: 'MiniProgram/queryWechatMiniGlobalModel' }).then(res => {
          if (res?.code === 200) {
            this.setState({ switchChecked: res.data?.homePageOpenAuth });
          }
        });
      }
    });
  }

  render() {
    const { FormDetail, AuthInfo } = this.props.MiniProgram;
    const title = (
      <div>
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
        render: t => {
          return <span>{t ? t : '一键授权'}</span>;
        },
      },
      {
        title: '按钮名称',
        dataIndex: 'buttonText',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
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
        ),
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
            link: 'page/Designer/Designer',
            ...FormDetail['3'],
          },
        ]
      : [];
    const { visible, record, selectedKeys, switchChecked } = this.state;
    return (
      <div className={styles.appleCard}>
        <PageHeaderWrapper title={title}>
          <Card bordered={false}>
            {AuthInfo.isAuthedWechatMini && (
              <div className={styles.appletWrap}>
                <div className={styles.appleLeft}>
                  <Menu
                    onClick={e => this.setState({ selectedKeys: [e.key] })}
                    style={{ width: 256 }}
                    selectedKeys={selectedKeys}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                  >
                    <Menu.Item key="1">
                      <p
                        style={{
                          paddingLeft: 24,
                        }}
                      >
                        通用设置
                      </p>
                    </Menu.Item>
                    <Menu.Item key="2">
                      <p
                        style={{
                          paddingLeft: 24,
                        }}
                      >
                        关联页面设置
                      </p>
                    </Menu.Item>
                  </Menu>
                </div>
                {selectedKeys[0] === '2' && (
                  <div className={styles.appleRight}>
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
                {selectedKeys[0] === '1' && (
                  <div className={styles.appleRight}>
                    <p style={{ fontWeight: 500, fontSize: 22, color: '#333' }}>通用设置</p>
                    <p>
                      打开小程序一键授权（首次）
                      <Switch
                        style={{ marginLeft: 30 }}
                        checked={switchChecked}
                        onChange={checked => {
                          this.handleSwitchChange(checked);
                        }}
                      />
                    </p>
                  </div>
                )}
              </div>
            )}
            {!AuthInfo.isAuthedWechatMini && (
              <div style={{ fontSize: 24, padding: 20 }}>请先进行小程序授权</div>
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
  handleOk = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'MiniProgram/formbindmapModel' });
    this.handleCancel();
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  // 开关
  handleSwitchChange = checked => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MiniProgram/setWechatMiniGlobalModel',
      payload: { homePageOpenAuth: checked },
    }).then(res => {
      if (res?.code === 200002) {
        message.warning(res.message);
      } else if (res?.code === 200) {
        this.setState({ switchChecked: checked }, () => {
          message.success(checked ? '授权成功' : '取消授权成功');
        });
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
