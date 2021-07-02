/*
 * @Author: zqm 
 * @Date: 2021-01-28 17:56:05 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-05-25 11:38:06
 * 新添加
 */
import React, { Component } from 'react';
import { Modal, message, Input, InputNumber } from 'antd';
import styles from '../LeadManage.less';
import { regExpConfig } from '../../../../utils/regular.config';
const { TextArea } = Input;
class CluesEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: {},
    };
  }
  componentDidMount() {
    this.setState({ record: this.props.record });
  }

  render() {
    const { record } = this.state;
    return (
      <Modal
        title={<span style={{ fontWeight: 600 }}>编辑</span>}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.props.handleCancel}
        okText="确认"
        maskClosable={false}
        width={600}
      >
        <div className={styles.CluesEdit}>
          <span className="beforeStar">客户姓名：</span>
          <span style={{ flex: 1 }}>
            <Input
              placeholder="请输入客户姓名"
              value={record.name}
              onChange={e =>
                this.setState({ record: { ...this.state.record, name: e.target.value } })
              }
            />
          </span>
        </div>
        <div className={styles.CluesEdit}>
          <span className="beforeStar">联系电话：</span>
          <span style={{ flex: 1 }}>
            <Input
              placeholder="请输入联系电话"
              value={record.mobile}
              onChange={e =>
                this.setState({ record: { ...this.state.record, mobile: e.target.value } })
              }
            />
          </span>
        </div>
        <div className={styles.CluesEdit}>
          <span>来源渠道：</span>
          <span style={{ flex: 1 }}>{record.sourceChannelName}</span>
        </div>
        <div className={styles.CluesEdit}>
          <span>推荐人：</span>
          <span style={{ flex: 1 }}>{record.referrerName}</span>
        </div>
        <div className={styles.CluesEdit}>
          <span>楼盘/楼宇：</span>
          <span style={{ flex: 1 }}>
            <Input
              placeholder="请输入楼盘/楼宇"
              value={record.address}
              onChange={e =>
                this.setState({ record: { ...this.state.record, address: e.target.value } })
              }
            />
          </span>
        </div>
        <div className={styles.CluesEdit}>
          <span>面积：</span>
          <span style={{ flex: 1 }}>
            <InputNumber
              placeholder="请输入面积"
              value={record.area}
              precision={2}
              style={{ width: '90%', marginRight: 8 }}
              onChange={e => this.setState({ record: { ...this.state.record, area: e } })}
            />
            m²
          </span>
        </div>
        <div className={styles.CluesEdit}>
          <span>线索描述：</span>
          <span style={{ flex: 1 }}>
            <TextArea
              placeholder="请输入线索描述"
              value={record.trackDesc}
              onChange={e =>
                this.setState({ record: { ...this.state.record, trackDesc: e.target.value } })
              }
              rows={4}
            />
          </span>
        </div>
      </Modal>
    );
  }

  handleOk = () => {
    let { record } = this.state;
    record.name = record.name.trim();
    record.mobile = record.mobile.trim();
    record.trackDesc = record.trackDesc.trim();
    if (!record.name) {
      message.error('请输入客户姓名');
      return false;
    } else if (record.name.length > 10) {
      message.error('客户姓名限制1-10字符长度');
      return false;
    } else if (!record.mobile) {
      message.error('请输入联系电话');
      return false;
    } else if (!regExpConfig.phone.test(record.mobile)) {
      message.error('手机号格式不正确');
      return false;
    } else if (record.address && record.address.length > 30) {
      message.error('楼盘/楼宇限制1-30字符长度');
      return false;
    } else if (record.area && parseFloat(record.area) + '' === 'NaN') {
      message.error('面积限制输入0.01-99999范围内的数字（含两位小数）');
      return false;
    } else if (record.area && (parseFloat(record.area) < 0.01 || parseInt(record.area) > 99999)) {
      message.error('面积限制输入0.01-99999范围内的数字（含两位小数）');
      return false;
    } else if (record.trackDesc && record.trackDesc.length > 100) {
      message.error('线索描述限制0-100字符长度');
      return false;
    }
    this.props.handleOk(record);
  };
}

export default CluesEdit;
