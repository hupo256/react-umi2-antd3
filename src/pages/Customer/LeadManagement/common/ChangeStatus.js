/*
 * @Author: zqm 
 * @Date: 2021-01-28 17:56:05 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-05-19 22:07:57
 * 状态变更
 */
import React, { Component } from 'react';
import { Modal, Button, Input, message } from 'antd';
import styles from '../LeadManage.less';
const { TextArea } = Input;
class ChangeStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: null,
      changeReason: null,
    };
  }
  componentDidMount() {
    const { record } = this.props;
    this.setState({ checked: record.status });
  }

  render() {
    const statusMap = [
      { name: '未联系', value: 'TS001' },
      { name: '跟进中', value: 'TS002' },
      { name: '已成交', value: 'TS003' },
      { name: '无效线索', value: 'TS005' },
      { name: '战败', value: 'TS004' },
    ];
    const { record } = this.props;
    return (
      <Modal
        title={<span style={{ fontWeight: 600 }}>写跟进</span>}
        visible={this.props.visible}
        onOk={() => this.handleOk()}
        onCancel={this.props.handleCancel}
        okText="确认"
        maskClosable={false}
        width={600}
      >
        <div style={{ marginBottom: 22 }}>
          <span className="beforeStar">线索状态：</span>
          <span>
            {statusMap.map(item => {
              return (
                <span
                  key={item.value}
                  className={`${styles.statusItem} ${(this.state.checked || record.status) ===
                    item.value && styles.statusCurrent}`}
                  onClick={() => this.handleClickStatus(item.value)}
                >
                  {item.name}
                </span>
              );
            })}
          </span>
        </div>
        <div style={{ display: 'flex' }}>
          <span className="beforeStar">跟进内容：</span>
          <span style={{ flex: 1 }}>
            <TextArea
              value={this.state.changeReason}
              rows={4}
              onChange={e => this.setState({ changeReason: e.target.value })}
            />
          </span>
        </div>
      </Modal>
    );
  }
  handleOk = () => {
    const { record } = this.props;
    const { checked, changeReason } = this.state;
    // if (!checked) {
    //   message.error('当前状态未发生变化，无需变更');
    //   return false;
    // } else if (checked && checked == record.status) {
    //   message.error('当前状态未发生变化，无需变更');
    //   return false;
    // } else
    if (!changeReason) {
      message.error('请输入跟进内容');
      return false;
    } else if (changeReason && changeReason.trim().length == 0) {
      message.error('请输入跟进内容');
      return false;
    } else if (changeReason && changeReason.trim().length > 200) {
      message.error('跟进内容限制0-200字符长度');
      return false;
    } else {
      this.props.handleOk({ uid: record.uid, status: checked, changeReason });
    }
  };
  handleClickStatus = checked => {
    this.setState({ checked });
  };
}

export default ChangeStatus;
