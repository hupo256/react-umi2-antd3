import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Input, Row, Col, Radio, Button, message, Modal } from 'antd';
import { regExpConfig } from '@/utils/regular.config';
import { MyIcon } from '@/utils/utils';
import { getauth } from '@/utils/authority';

const SMS_LIMIT_TIME = 60;
const VERIFY_CODE_LIMIT = 6;

async function captchaValidation(cb) {
  return new Promise((resolve, reject) => {
    const captcha1 = new TencentCaptcha('2071327168', res => {
      res && resolve(res);
    });
    captcha1.show();
  });
}

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
    const { uid } = getauth();
    dispatch({
      type: 'base/getSystemuserModel',
      payload: { uid },
    }).then(res => {
      if (res && res.code === 200) {
        const data = res.data;
        this.setState({
          mobile: data && data.mobile,
        });
      }
    });
  }

  backHandle = () => {
    router.go(-1);
  };

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
                onChange={e =>
                  this.setState({
                    mobile: e.target.value,
                  })
                }
                placeholder="请输入手机号"
                style={{ marginBottom: 18, width: 400, display: 'block' }}
              />
              <Input
                autoComplete="new-password"
                placeholder="请输入验证码"
                onChange={e => this.setState({ code: e.target.value })}
                style={{ marginBottom: 18, width: 400, display: 'block' }}
                maxLength={VERIFY_CODE_LIMIT}
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
                    onClick={() => this.sendVerifyCode()}
                  >
                    {text}
                  </button>
                }
              />
              <div style={{ marginBottom: 18, width: 400, position: 'relative' }}>
                <Input
                  autoComplete="new-password"
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
                    onClick={() =>
                      this.setState({
                        show: !this.state.show,
                      })
                    }
                    type={`${!show ? 'icon-password-invisible' : 'icon-password-visible'}`}
                  />
                </p>
              </div>
              <Button
                onClick={() => this.saveToServer()}
                type="primary"
                style={{ marginLeft: 140, transform: 'translateX(-50%)' }}
              >
                保存
              </Button>
              <Button
                onClick={() => this.backHandle()}
                style={{ marginLeft: 50, transform: 'translateX(-50%)' }}
              >
                返回
              </Button>
            </div>
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }

  // 发送验证码
  sendVerifyCode = async () => {
    const { mobile } = this.state;
    const that = this;

    if (!regExpConfig.phone.test(mobile)) {
      message.error('请输入正确的手机号');
      return false;
    }

    this.setState({ disabled: true });

    const { randstr, ticket } = await captchaValidation();

    // 调短信 接口
    // source: 2 找回密码
    const { dispatch } = this.props;
    const { code } = await dispatch({
      type: 'base/sendUserMobileMsgModel',
      payload: { mobile, randstr, source: 2, ticket },
    });

    if (code === 200) {
      message.success('发送成功');

      let num = SMS_LIMIT_TIME;
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
  };

  // 保存
  saveToServer = async () => {
    const { dispatch } = this.props;
    const { mobile, code, password } = this.state;
    if (!code) {
      message.error('请输入验证码');
      return;
    }
    if (!password) {
      message.error('请设置登录密码');
      return;
    }
    if (password.length < 6 || password.length > 20) {
      message.error('密码长度限制为6-20位');
      return;
    }

    try {
      const editPsdResponse = await dispatch({
        type: 'login/editPasswordModel',
        payload: {
          mobile,
          smsVerificationCode: code,
          password,
        },
      });

      if (editPsdResponse.code === 200) {
        message.success('修改成功');
        // 跳转到登录页
        dispatch({ type: 'login/logout' });
        return;
      }
      throw new Error(editPsdResponse);
    } catch (e) {
      console.log(e.message);
    }
  };
}

export default ResetPassword;
