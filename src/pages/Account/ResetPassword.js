import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Input, Row, Col, Radio, Button, message, Modal } from 'antd';
import { regExpConfig } from '@/utils/regular.config';
import { MyIcon } from '@/utils/utils';

@connect(({ login, base }) => ({ login, base }))
class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: null,
      code: null,
      text: '获取验证码',
      password: null,
      show: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/getSystemuserModel',
      payload: {},
    }).then(res => {
      if (res && res.code === 200) {
        const data = res.data;
        this.setState({
          mobile: data && data.mobile,
        });
      }
    });
  }

  render() {
    const { text, show } = this.state;
    return (
      <div>
        <PageHeaderWrapper>
          <Card bordered={false}>
            <div>
              <p style={{ fontSize: 24, marginBottom: 20 }}>修改密码</p>
              <Input
                disabled
                value={this.state.mobile}
                onChange={e => this.setState({ mobile: e.target.value })}
                placeholder="请输入手机号"
                style={{ marginBottom: 18, width: 400, display: 'block' }}
              />
              <Input
                autocomplete="new-password"
                placeholder="请输入验证码"
                onChange={e => this.setState({ code: e.target.value })}
                style={{ marginBottom: 18, width: 400, display: 'block' }}
                addonAfter={
                  <button
                    style={{
                      cursor: 'pointer',
                      color: '#fe6a30',
                      display: 'inline-block',
                      width: 100,
                      textAlign: 'center',
                      background: '#fafafa',
                      border: '0px',
                      outline: 'none',
                    }}
                    disabled={text !== '获取验证码'}
                    onClick={() => this.handleSendCode()}
                  >
                    {text}
                  </button>
                }
              />
              <div style={{ marginBottom: 18, width: 400, position: 'relative' }}>
                <Input
                  autocomplete="new-password"
                  type={`${show ? 'text' : 'password'}`}
                  value={this.state.password}
                  onChange={e => this.setState({ password: e.target.value.trim() })}
                  placeholder="请设置新密码，至少6位"
                  style={{ width: 400, display: 'block' }}
                />
                <p
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: 2,
                    fontSize: 18,
                    cursor: 'pointer',
                  }}
                >
                  <MyIcon
                    onClick={() => this.setState({ show: !this.state.show })}
                    type={`${!show ? 'icon-password-invisible' : 'icon-password-visible'}`}
                  />
                </p>
              </div>
              <Button
                onClick={() => this.handleClickSave()}
                type="primary"
                style={{ marginLeft: 200, transform: 'translateX(-50%)' }}
              >
                保存
              </Button>
            </div>
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }

  // 发送验证码
  handleSendCode = () => {
    const { mobile } = this.state;
    if (!regExpConfig.phone.test(mobile)) {
      message.error('请输入正确的手机号');
      return false;
    } else {
      this.setState({ disabled: true });
      // 调短信 接口
      const { dispatch } = this.props;
      dispatch({
        type: 'base/sendMobileMsgModel',
        payload: { mobile },
      }).then(res => {
        if (res && res.code === 200) {
          message.success('发送成功');
          const that = this;
          let num = 60;
          function timer() {
            num = num - 1;
            that.setState({ text: num + 's后从新获取' }, () => {
              if (num === 0) {
                that.setState({ text: '获取验证码', disabled: false });
              } else {
                setTimeout(() => timer(), 1000);
              }
            });
          }
          timer();
        }
      });
    }
  };

  // 保存
  handleClickSave = () => {
    const { dispatch } = this.props;
    const { mobile, code, password } = this.state;
    if (!code) {
      message.error('请输入验证码');
    } else if (!password) {
      message.error('请设置登录密码');
    } else if (password.length < 6 || password.length > 20) {
      message.error('密码长度限制为6-20位');
    } else {
      // 登录
      dispatch({
        type: 'login/retrieveUserPasswordModel',
        payload: {
          mobile,
          msgCode: code,
          password,
        },
      }).then(res => {
        if (res && res.code === 200) {
          message.success('修改成功');
          // 跳转到登录页
          dispatch({
            type: 'login/logout',
          });
        }
      });
    }
  };
}

export default ResetPassword;
