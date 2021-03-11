/*
 * @Author: zqm 
 * @Date: 2020-06-04 11:06:14 
 * @Last Modified by: zqm
 * @Last Modified time: 2020-12-30 22:40:41
 * 自定义表头
 * defaultSelect arr 取消全选默认选中项
 * disabledData obj 不能编辑项
 */
import React, { Component } from 'react';
import { Modal, Checkbox, Row, Col } from 'antd';
const CheckboxGroup = Checkbox.Group;
import styles from './TableFieldConfig.less';
class TableFieldConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plainOptions: [],
      checkedList: [],
      indeterminate: false,
      checkAll: false,
    };
  }

  componentDidMount() {
    const { data, checked } = this.props;
    const plainOptions = data.map(item => {
      // 不能编辑项
      if (this.props.disabledData) {
        this.props.disabledData(item);
      }
      item.label = item.columnName;
      item.value = item.columnCode;
      return item;
    });
    const checkedList = checked.map(item => item.columnCode);
    this.setState({
      plainOptions,
      checkedList,
      indeterminate: checkedList.length > 4 && checkedList.length !== data.length,
      checkAll: checkedList.length === data.length,
    });
  }
  render() {
    const { plainOptions } = this.state;
    return (
      <div>
        <Modal
          title="自定义配置表头"
          visible={this.props.visible}
          onOk={() => this.handleOk()}
          onCancel={this.props.handleCancel}
          maskClosable={false}
          width={600}
        >
          <div className={styles.tableConfigCont}>
            <div className={styles.tableSelectAll}>
              <Checkbox
                indeterminate={this.state.indeterminate}
                onChange={this.onCheckAllChange}
                checked={this.state.checkAll}
              >
                全选
              </Checkbox>
            </div>
            <br />
            <Checkbox.Group
              style={{ width: '100%' }}
              value={this.state.checkedList}
              onChange={this.onChange}
            >
              <Row>
                {plainOptions.map(item => {
                  return (
                    <Col
                      span={8}
                      key={item.value}
                      style={{ display: item.disabled ? 'none' : 'block' }}
                    >
                      <Checkbox disabled={item.disabled} value={item.value}>
                        {item.label || item.name}
                      </Checkbox>
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
            <p
              onClick={() => this.props.reset()}
              style={{ cursor: 'pointer', paddingTop: 20, color: '#fe6a30', fontSize: 12 }}
            >
              恢复默认表头
            </p>
          </div>
        </Modal>
      </div>
    );
  }
  // 选择
  onChange = checkedList => {
    const { plainOptions } = this.state;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length,
    });
  };

  // 全选
  onCheckAllChange = e => {
    const { plainOptions } = this.state;
    const checkedList = plainOptions.map(item => {
      return item.value;
    });
    this.setState({
      checkedList: e.target.checked ? checkedList : this.props.defaultSelect || [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  // ok
  handleOk = () => {
    const { checkedList } = this.state;
    const data = this.props.data.filter(item => checkedList.includes(item.value));
    this.props.handleOk(data);
  };
}

export default TableFieldConfig;
