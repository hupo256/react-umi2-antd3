/*
 * @Author: zqm 
 * @Date: 2021-04-28 17:05:47 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-04-30 17:18:22
 * 小程序设置
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, Menu, Table, Input, message, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { MyIcon } from '@/utils/utils';
import styles from './index.less';
import { getauth } from '@/utils/authority';
import LinkPage from './LinkPage';
const { SubMenu } = Menu;

@connect(({}) => ({}))
class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  componentDidMount() {}

  render() {
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
        dataIndex: 'age',
      },
      {
        title: '已关联页面',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '按钮名称',
        key: 'tags',
        dataIndex: 'tags',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={() => this.setState({ visible: true })}>编辑</a>
          </span>
        ),
      },
    ];
    const data = [
      {
        key: '1',
        name: '案例',
        age: 'page/site/site',
        address: '一键授权',
        tags: '立即咨询',
      },
      {
        key: '2',
        name: '工地',
        age: 'page/Case/Case',
        address: '一键授权',
        tags: '立即咨询',
      },
      {
        key: '3',
        name: '设计师',
        age: 'page/designer/designer',
        address: '一键授权',
        tags: '立即咨询',
      },
      {
        key: '4',
        name: '文章',
        age: 'page/article/article',
        address: '一键授权',
        tags: '立即咨询',
      },
    ];
    const { visible } = this.state;
    return (
      <div className={styles.appleCard}>
        <PageHeaderWrapper title={title}>
          <Card bordered={false}>
            <div className={styles.appletWrap}>
              <div className={styles.appleLeft}>
                <Menu
                  onClick={this.handleClick}
                  style={{ width: 256 }}
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  mode="inline"
                >
                  <Menu.Item key="1">
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
              <div className={styles.appleRight}>
                <p style={{ fontWeight: 400, fontSize: 13, color: '#666' }}>
                  <MyIcon
                    type="icon-tips"
                    style={{ color: '#ccebfa', fontSize: 18, marginRight: 6 }}
                  />
                  关联后，在小程序的对应模块内点击按钮，会跳转至关联的页面
                </p>
                <Table columns={columns} dataSource={data} pagination={false} />
              </div>
            </div>
          </Card>
        </PageHeaderWrapper>
        {visible && <LinkPage visible={visible} handleCancel={() => this.handleCancel()} />}
      </div>
    );
  }
  handleOk = () => {
    console.log('====================================');
    console.log(保存);
    console.log('====================================');
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
}

export default Index;
