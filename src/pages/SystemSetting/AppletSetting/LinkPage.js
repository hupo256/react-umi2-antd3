/*
 * @Author: zqm 
 * @Date: 2021-04-30 11:36:34 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-04-30 15:37:24
 * 关联设置
 */
import React, { Component } from 'react';
import { Modal, Input, Icon } from 'antd';
import Select from './Select';
import styles from './index.less';

class LinkPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <Modal
        title="关联页面设置"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={() => this.props.handleCancel()}
        maskClosable={false}
      >
        <div style={{ minHeight: 350 }}>
          <div className={styles.linkpage}>
            <span className="beforeStar">关联页面：</span>
            <Select />
          </div>
          <div>
            <span className="beforeStar">按钮名称：</span>
            <Input placeholder="请输入按钮名称" style={{ width: 360 }} />
          </div>
        </div>
      </Modal>
    );
  }
}

export default LinkPage;
