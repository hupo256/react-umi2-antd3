import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Alert, Icon, Input, message, Modal, Button } from 'antd';
import Login from '@/components/Login';
import { baseurl } from '@/services/config';
import styles from './Login.less';
const { UserName, Password, Mobile, Captcha, Submit, Captchax } = Login;
const FormItem = Form.Item;
@Form.create()
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    autoLogin: true,
    count: '',
    visible: false,
    uuid: '',
    submitting: false,
    visibles: false,
  };
  onTabChange = type => {
    this.setState({ type });
  };

  //账号密码登录验证
  handleSubmitPasswordCheck = (err, values) => {
    if (!err) {
      const { dispatch, login } = this.props;
      const { CodeFlag } = login;
      const captcha1 = new TencentCaptcha(
        '2071327168',
        function(ress) {
          // res（用户主动关闭验证码）= {ret: 2, ticket: null}
          // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
          if (ress.ret === 0) {
            localStorage.setItem('ticket', ress.ticket);
            localStorage.setItem('randstr', ress.randstr);
            dispatch({
              type: "login/checkMobileModel",
              payload: {
                mobile: values.userName,
                password: values.pwd,
                source: 1,
              },
            }).then((re) => {
                if (re && re.code === 200) {
                  dispatch({
                    type: 'login/loginCheckModel',
                    payload: {
                      mobile: values.userName,
                    },
                  }).then(res => {
                    if (res && res.code === 200) {
                      if (res.data && res.data.length === 1) {
                        let code = res.data[0].companyCode;
                        dispatch({
                          type: 'login/loginPasswordModel',
                          payload: {
                            companyCode: code,
                            mobile: values.userName,
                            password: values.pwd,
                            ticket: ress.ticket,
                            randstr: ress.randstr,
                            //uuid: CodeFlag,
                            source: 0,
                            systemCode: 'S005',
                            //verificationCode: values.verificationCode,
                          },
                        }).then(res => {
                          localStorage.setItem('companyName', code);
                          if (res && res.code === 200) {
                            dispatch({
                              type: 'login/setAuthModel',
                              payload: {},
                            }).then(res => {
                              if (res && res.code === 200) {
                                window.location.href = '/';
                              }
                            });
                          } else {
                            if (res && res.message) {
                              message.warning(res.message);
                              //this.ReplacementVerificationCode();
                            }
                          }
                        });
                      } else {
                        if (res.data && res.data.length > 0) {
                          dispatch({
                            type: 'login/saveDataModel',
                            payload: {
                              key: 'companyList',
                              value: res.data,
                            },
                          });
                          sessionStorage.setItem('companyList', JSON.stringify(res.data));
                          router.push('/choiceCompany');
                        } else {
                          message.warning('抱歉，您当前未开通营销站权限，请联系公司管理员开通。');
                        }
                      }
                      dispatch({
                        type: 'login/saveDataModel',
                        payload: {
                          key: 'PasswordData',
                          value: {
                            mobile: values.userName,
                            password: values.pwd,
                            //uuid: CodeFlag,
                            systemCode: 'S005',
                            source: 0,
                            ticket: ress.ticket,
                            randstr: ress.randstr,
                            //verificationCode: values.verificationCode,
                          },
                        },
                      });
                      let pass = {
                        mobile: values.userName,
                        password: values.pwd,
                        //uuid: CodeFlag,
                        source: 0,
                        //verificationCode: values.verificationCode,
                        ticket: ress.ticket,
                        randstr: ress.randstr,
                      };
                      console.log(pass);
                      sessionStorage.setItem('PasswordData', JSON.stringify(pass));
                    } else {
                      if (res && res.message) {
                        message.warning(res.message);
                        //this.ReplacementVerificationCode();
                      }
                    }
                  });
                }
            })

          }
        },
        { sdkView: { right: 0 } }
      );
      captcha1.show();
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };
  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'login/getverificationCode',
    // });
  }

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );
  // ReplacementVerificationCode() {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'login/getverificationCode',
  //   });
  // }
  onRef = ref => {
    this.child = ref;
  };
  showView = () => {
    captcha1.show(); // 显示验证码
  };
  render() {
    const {
      login: { dispatchLoading },
      submitting,
    } = this.props;
    return (
      <div className={styles.main}>
        <Login
          onSubmit={this.handleSubmitPasswordCheck}
          ref={form => {
            this.loginForm = form;
          }}
          onRef={this.onRef}
        >
          <Mobile
            name="userName"
            rules={[{ required: true, message: '请输入手机号' }]}
            placeholder="请输入手机号"
          />
          <Password
            name="pwd"
            rules={[{ required: true, message: '请输入密码' }]}
            placeholder="请输入密码"
            onKeyDown={e => e.keyCode == 13 && this.child.handleSubmit(e)}
          />
          {/*<Captchax
            name="verificationCode"
            rules={[{ required: true, message: '请输入验证码' }]}
            placeholder="请输入验证码"
            prefix={<Icon type="qrcode" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onKeyDown={e => e.keyCode == 13 && this.child.handleSubmit(e)}
          />*/}

          {/*CodeFlag && (
            <div className={styles.verification}>
              <img src={baseurl + '/api/v1/sso/login/verificationCode?uuid=' + CodeFlag} />
              <a onClick={this.ReplacementVerificationCode.bind(this)}>换一张</a>
            </div>
          )*/}
          <Submit loading={submitting || dispatchLoading} style={{ marginTop: 24 }}>
            登录
          </Submit>
        </Login>
      </div>
    );
  }
}
export default LoginPage;
