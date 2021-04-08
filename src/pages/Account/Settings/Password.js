import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Upload, Select, Button, message } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import { regExpConfig } from '../../../utils/regular.config';
import { baseurl } from '../../../services/config';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;

message.config({ top: 100, maxCount: 2 });

@connect(({ users }) => ({
  users,
}))
@Form.create()
class Password extends Component {
  state = {
    confirmDirty: false,
  };

  handleSubmit = e => {
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
          if (res && res.code === 200) {
            message.success('密码修改成功', 1);
          } else {
            message.success(res.message, 1);
          }
        });
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('密码不一致');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['newPassword1'], { force: true });
    }
    callback();
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit}>
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
              })(
                <Input placeholder="请输入确认" onBlur={this.handleConfirmBlur} type="password" />
              )}
            </FormItem>

            <Button type="primary" htmlType="submit">
              修改密码
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Password;
