/*
 * @Author: pengyc 
 * @Date: 2020-01-09 14:35:33 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-04-08 15:09:47
 * 修改密码
 */
import React, { PureComponent } from 'react';
import { message, Modal, Button, Form, Input, Alert } from 'antd';
import { connect } from 'dva';
import { regExpConfig } from '@/utils/regular.config';
import styles from './index.less';
const FormItem = Form.Item;
@connect(({ users }) => ({
  users,
}))
@Form.create()
export default class AdSeter extends PureComponent {
  state = {
    confirmDirty: false,
  };
  componentDidMount() {
    const { dispatch } = this.props;
  }

  handleConfirmBlur = e => {
    console.log(e);
  };

  updateGame = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      console.log(values);
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.appleRight}>
        <p style={{ fontWeight: 500, fontSize: 22, color: '#333' }}>广告设置</p>
        <Form layout="vertical">
          <FormItem label="原密码" hasFeedback>
            {getFieldDecorator('oldPassword', {
              initialValue: '',
              rules: [{ required: true, message: '请输入原密码' }],
            })(<Input placeholder="请输入原密码" type="password" />)}
          </FormItem>
          <FormItem label="新密码" hasFeedback>
            {getFieldDecorator('newPassword', {
              initialValue: '',
              rules: [
                { required: true, message: '请输入新密码' },
                { validator: this.validateToNextPassword },
                {
                  pattern: regExpConfig.adminpws,
                  message: '密码格式错误,应包含大小写、特殊字符、数字,且8-30位',
                },
              ],
            })(<Input placeholder="请输入新密码" type="password" />)}
          </FormItem>
          <FormItem label="确认密码">
            {getFieldDecorator('newPassword1', {
              initialValue: '',
              rules: [
                { required: true, message: '请输入确认' },
                { validator: this.compareToFirstPassword },
                {
                  pattern: regExpConfig.adminpws,
                  message: '密码格式错误,应包含大小写、特殊字符、数字,且8-30位',
                },
              ],
            })(<Input placeholder="请输入确认" onBlur={this.handleConfirmBlur} type="password" />)}
          </FormItem>

          <FormItem label="提交">
            <Button
              type="primary"
              // loading={btnLoading}
              onClick={this.updateGame}
            >
              保存
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
