/*
 * @Author: zqm 
 * @Date: 2021-04-30 11:36:34 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-04-30 18:39:42
 * 关联设置
 */
import React, { Component } from 'react';
import { Modal, Input, Icon, message } from 'antd';
import Select from './Select';
import styles from './index.less';

class LinkPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnName: null,
      isEdit: false,
      saveValue: null,
    };
  }

  componentDidMount() {}

  render() {
    const { btnName } = this.state;
    return (
      <Modal
        title="关联页面设置"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={() => this.props.handleCancel()}
        maskClosable={false}
      >
        <div style={{ minHeight: 86 }}>
          <div className={styles.linkpage}>
            <span className="beforeStar">关联页面：</span>
            <Select handleSelect={value => this.handleSelect(value)} />
          </div>
          <div>
            <span className="beforeStar">按钮名称：</span>
            <Input
              value={btnName}
              onChange={e => this.setState({ btnName: e.target.value, isEdit: true })}
              disabled={btnName == '立即咨询'}
              placeholder="请输入按钮名称"
              style={{ width: 360 }}
            />
          </div>
        </div>
      </Modal>
    );
  }
  handleSelect = value => {
    const { btnName, isEdit } = this.state;
    this.setState({ saveValue: value });
    if (value.type == 1) {
      this.setState({ btnName: '立即咨询' });
    } else if (value.type == 3 && !isEdit) {
      this.setState({ btnName: null });
    } else {
      if (!btnName) {
        this.setState({ btnName: value.record.formTitle });
      }
    }
  };
  handleOk = () => {
    const { saveValue } = this.state;
    console.log('====================================');
    console.log(saveValue);
    console.log('====================================');
    if (!saveValue) {
      message.error('请选择关联页面');
      return false;
    } else if (saveValue.type == 3) {
      message.error('请选择关联页面');
      return false;
    }
  };
}

export default LinkPage;
