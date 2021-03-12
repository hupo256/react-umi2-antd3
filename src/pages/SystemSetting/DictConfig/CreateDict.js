/*
 * @Author: zqm 
 * @Date: 2021-02-18 10:48:14 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-02-18 15:06:39
 * 创建编辑字段
 */
import React, { Component } from 'react';
import { Modal, Row, Col, Input, message } from 'antd';

const { TextArea } = Input;

class CreateDict extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      extDescOne: null,
      extDescTwo: null,
    };
  }
  componentDidMount() {
    const { record } = this.props;
    if (record) {
      this.setState({
        name: record.name,
        extDescOne: record.extDescOne,
        extDescTwo: record.extDescTwo,
      });
    }
  }
  render() {
    const { name, extDescOne, extDescTwo } = this.state;
    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        onOk={() => this.handleOk()}
        onCancel={this.handleCancel}
        centered={true}
        maskClosable={false}
      >
        <Row>
          <Col span={5} className="beforeStar" style={{ textAlign: 'right' }}>
            字段名称：
          </Col>
          <Col span={18}>
            <Input
              placeholder="请输入字段名称"
              value={name}
              onChange={e => this.handleChange(e.target.value, 'name', 20)}
            />
          </Col>
        </Row>
        <Row style={{ margin: '20px 0' }}>
          <Col span={5} style={{ textAlign: 'right' }}>
            扩充描述1：
          </Col>
          <Col span={18}>
            <TextArea
              placeholder="请输入扩充描述"
              onChange={e => this.handleChange(e.target.value, 'extDescOne', 200)}
              rows={4}
              value={extDescOne}
            />
          </Col>
        </Row>
        <Row>
          <Col span={5} style={{ textAlign: 'right' }}>
            扩充描述2：
          </Col>
          <Col span={18}>
            <TextArea
              placeholder="请输入扩充描述"
              onChange={e => this.handleChange(e.target.value, 'extDescTwo', 200)}
              rows={4}
              value={extDescTwo}
            />
          </Col>
        </Row>
      </Modal>
    );
  }
  handleChange = (value, name, long) => {
    if (value.length > long) {
      message.info(`最多输入${long}位字符`);
    } else {
      this.setState({ [name]: value });
    }
  };
  handleOk = () => {
    const { name, extDescOne, extDescTwo } = this.state;
    if (!name) {
      message.error('请输入字段名称');
    } else if (name.trim().length == 0) {
      message.error('请输入字段名称');
    } else {
      this.props.handleOk({ name: name.trim(), extDescOne, extDescTwo });
    }
  };
  handleCancel = () => {
    this.setState(
      {
        name: null,
        extDescOne: null,
        extDescTwo: null,
      },
      () => {
        this.props.handleCancel();
      }
    );
  };
}

export default CreateDict;
