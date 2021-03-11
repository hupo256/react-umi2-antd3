import React, { Component } from "react";
import { connect } from "dva";
import router from "umi/router";
import { Form, Alert, Icon, Input, message, Modal, Button } from "antd";
import Login from "@/components/Login";
import { baseurl } from "@/services/config";
import styles from "./Login.less";
const { UserName, Password, Mobile, Captcha, Submit, Captchax } = Login;
const FormItem = Form.Item;
@Form.create()
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects["login/login"],
}))
class LoginPage extends Component {
  state = {
    autoLogin: true,
    count: "",
    visible: false,
    uuid: "",
    submitting: false,
    visibles: false,
  };
  onTabChange = (type) => {
    this.setState({ type });
  };

  //账号密码登录验证
  handleSubmitPasswordCheck = (err, values) => {
    if (!err) {
      const { dispatch, login } = this.props;
      const { CodeFlag } = login;
      dispatch({
        type: "login/loginCheckModel",
        payload: {
          mobile: values.userName,
        },
      }).then((res) => {
        if (res && res.code === 200) {
          console.log(res.data);
          if (res.data && res.data.length == 1) {
            let code = res.data[0].companyCode;
            dispatch({
              type: "login/loginPasswordModel",
              payload: {
                companyCode: code,
                mobile: values.userName,
                password: values.pwd,
                uuid: CodeFlag,
                source: 0,
                systemCode: "S005",
                verificationCode: values.verificationCode,
              },
            }).then((res) => {
              localStorage.setItem("companyName", code);
              if (res && res.code === 200) {
                dispatch({
                  type: "login/setAuthModel",
                  payload: {},
                }).then((res) => {
                  if (res && res.code === 200) {
                    window.location.href = "/";
                  }
                });
              } else {
                if (res && res.message) {
                  message.warning(res.message);
                  this.ReplacementVerificationCode();
                }
              }
            });
          } else {
            dispatch({
              type: "login/saveDataModel",
              payload: {
                key: "companyList",
                value: res.data,
              },
            });
            sessionStorage.setItem("companyList", JSON.stringify(res.data));
            router.push("/choiceCompany");
          }
          dispatch({
            type: "login/saveDataModel",
            payload: {
              key: "PasswordData",
              value: {
                mobile: values.userName,
                password: values.pwd,
                uuid: CodeFlag,
                systemCode: "S005",
                verificationCode: values.verificationCode,
              },
            },
          });
          let pass = {
            mobile: values.userName,
            password: values.pwd,
            uuid: CodeFlag,
            source: 0,
            verificationCode: values.verificationCode,
          };
          sessionStorage.setItem("PasswordData", JSON.stringify(pass));
        } else {
          if (res && res.message) {
            message.warning(res.message);
            this.ReplacementVerificationCode();
          }
        }
      });
    }
  };

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "login/getverificationCode",
    });
  }
  renderMessage = (content) => (
    <Alert
      style={{ marginBottom: 24 }}
      message={content}
      type="error"
      showIcon
    />
  );
  ReplacementVerificationCode() {
    const { dispatch } = this.props;
    dispatch({
      type: "login/getverificationCode",
    });
  }
  onRef = (ref) => {
    this.child = ref;
  };

  render() {
    const {
      login: { dispatchLoading },
      form: { getFieldDecorator },
      login,
      submitting,
    } = this.props;
    const { CodeFlag } = login;
    const { count, visible, visibles } = this.state;
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const pageStatus = Number(sessionStorage.getItem("pageStatus"));
    return (
      <div className={styles.main}>
        <Login
          onSubmit={this.handleSubmitPasswordCheck}
          ref={(form) => {
            this.loginForm = form;
          }}
          onRef={this.onRef}
        >
          <Mobile
            name="userName"
            rules={[{ required: true, message: "请输入手机号" }]}
            placeholder="请输入手机号"
          />
          <Password
            name="pwd"
            rules={[{ required: true, message: "请输入密码" }]}
            placeholder="请输入密码"
            onKeyDown={(e) => e.keyCode == 13 && this.child.handleSubmit(e)}
          />
          <Captchax
            name="verificationCode"
            rules={[{ required: true, message: "请输入验证码" }]}
            placeholder="请输入验证码"
            prefix={<Icon type="qrcode" style={{ color: "rgba(0,0,0,.25)" }} />}
            onKeyDown={(e) => e.keyCode == 13 && this.child.handleSubmit(e)}
          />

          {CodeFlag && (
            <div className={styles.verification}>
              <img
                src={
                  baseurl +
                  "/api/v1/saas/login/verificationCode?uuid=" +
                  CodeFlag
                }
              />
              <a onClick={this.ReplacementVerificationCode.bind(this)}>
                换一张
              </a>
            </div>
          )}
          <Submit loading={submitting || dispatchLoading}>登录</Submit>
        </Login>
      </div>
    );
  }
}
export default LoginPage;
