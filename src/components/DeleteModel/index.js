/*
 * @Author: zqm 
 * @Date: 2020-12-08 20:00:19 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-01-14 10:58:57
 * 删除model
 */
import React, { Component } from 'react';

import { Divider, Button, Icon, Row, Col, Input, Radio, Modal } from 'antd';
class DeleteModel extends Component {
  render() {
    return (
      <div>
        <Modal
          className="closeModel"
          title={<span style={{ fontSize: 24, position: 'absolute', top: 25 }}>提示</span>}
          visible={this.props.visible}
          onCancel={this.props.handleCancel}
          width={400}
          maskClosable={false}
          footer={[
            <Button type="primary" onClick={this.props.handleOk}>
              确定
            </Button>,
            <Button onClick={this.props.handleCancel}>取消</Button>,
          ]}
        >
          <p className="closeModelTitle">
            <Icon type="exclamation-circle" style={{ color: '#fe6a30', fontSize: 22 }} />
            &nbsp; &nbsp;点击确定后即删除该角色，并清空该角色下的所有人员 ？
          </p>
        </Modal>
      </div>
    );
  }
}

export default DeleteModel;
