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
const FormItem = Form.Item;
@connect(({ users }) => ({
  users,
}))
@Form.create()
class EditPassword extends PureComponent {
  state = {
    confirmDirty: false,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    // 判断是否是初始密码
    // dispatch({
    //   type: 'users/checkUserPasswordModel',
    //   payload: {},
    // });
  }

  render() {
    const {
      users: { userPassword },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Modal
        title="修改密码"
        keyboard={false}
        maskClosable={false}
        closable={false}
        visible={!_.isEmpty(userPassword) ? userPassword.flag : false}
        footer={[
          <Button key="submit" type="primary" onClick={this.handleOk}>
            提交
          </Button>,
        ]}
        zIndex={1062}
      >
        <Alert message="您的密码当前为初始密码，请进行修改" type="error" />
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
          <FormItem label="确认密码" hasFeedback>
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
        </Form>
      </Modal>
    );
  }

  // 提交
  handleOk = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        const valuex = {
          ...fieldsValue,
        };
        dispatch({
          type: 'users/normaleditpass',
          payload: {
            userinfo: valuex,
          },
        }).then(res => {
          // dispatch({
          //   type: 'users/checkUserPasswordModel',
          //   payload: {},
          // });
          if (res && res.code === 200) {
            message.success('密码修改成功');
          } else {
            message.error(res.message);
          }
        });
      }
    });
  };

  // 2次输入是否相同验证
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('密码不一致');
    } else {
      callback();
    }
  };

  // 格式验证
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['newPassword1'], { force: true });
    }
    callback();
  };

  // 是否输入确认密码
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
}

export default EditPassword;
