import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Input, Row, Col, Radio, Button, message, Modal, Spin } from 'antd';
import RcViewer from 'rc-viewer';
import { getQueryUrlVal } from '@/utils/utils';
import { setAuthority } from '@/utils/authority';
import { regExpConfig } from '@/utils/regular.config';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ImgUploads from '@/components/Upload/FileUpload';
import styles from './BaseView.less';
@connect(({ login, base, loading }) => ({
  login,
  base, //
  Loading: loading.effects['base/getSystemuserModel'],
}))
class BaseView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sex: null,
      userHeadImg: '',
      visible: false,
      text: '获取验证码',
      phone: null,
      oldmobile: null,
      disabled: false,
      code: null,
      imgLoading: false,
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
          email: data && data.email,
          mobile: data && data.mobile,
          oldmobile: data && data.mobile,
          sex: data && data.sex,
          realName: data && data.realName,
          wechatId: data && data.wechatId,
          userHeadImg: data && data.userHeadImg,
        });
      }
    });
  }

  render() {
    const {
      Loading,
      base: { SystemUserData },
    } = this.props;
    const { userHeadImg, text, disabled } = this.state;
    return (
      <div>
        <PageHeaderWrapper title="">
          <Card bordered={false}>
            <div className={styles.userWrap}>
              <div className={styles.userWrapLeft}>
                <Row style={{ marginBottom: 16 }}>
                  <Col span={4}>
                    <span className="beforeStar">姓名：</span>
                  </Col>
                  <Col span={12}>
                    <Input
                      disabled={SystemUserData && !SystemUserData.canModifyRealName}
                      placeholder="请输入姓名"
                      value={this.state.realName}
                      style={{ width: 300 }}
                      onChange={e => {
                        if (e.target.value.length > 30) {
                          message.error('最多输入30位字符');
                        } else {
                          this.setState({ realName: e.target.value });
                        }
                      }}
                    />
                    {SystemUserData &&
                      SystemUserData.canModifyRealName && <p>姓名仅允许修改一次，请谨慎修改.</p>}
                  </Col>
                </Row>
                <Row style={{ marginBottom: 16 }}>
                  <Col span={4} className="beforeStar">
                    {' '}
                    性别：
                  </Col>
                  <Col span={12}>
                    <Radio.Group onChange={this.handleSexChange} value={this.state.sex}>
                      <Radio value={0}>男</Radio>
                      <Radio value={1}>女</Radio>
                    </Radio.Group>
                  </Col>
                </Row>
                <Row style={{ marginBottom: 16 }}>
                  <Col span={4}>
                    <span className="beforeStar">手机号：</span>
                  </Col>
                  <Col span={12} style={{ position: 'relative' }}>
                    <Input
                      disabled={SystemUserData && !SystemUserData.canModifyMobile}
                      value={this.state.mobile}
                      style={{ width: 300, display: 'inline-block' }}
                      onChange={e => this.setState({ mobile: e.target.value })}
                    />
                    <p>6个月内仅可修改1次，请谨慎修改</p>
                  </Col>
                </Row>
                <Row style={{ marginBottom: 16 }}>
                  <Col span={4}> 微信：</Col>
                  <Col span={12}>
                    <Input
                      value={this.state.wechatId}
                      placeholder="请输入微信号"
                      style={{ width: 300 }}
                      onChange={e => {
                        if (e.target.value.length > 30) {
                          message.error('最多输入30位字符');
                        } else {
                          this.setState({ wechatId: e.target.value });
                        }
                      }}
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: 16 }}>
                  <Col span={4}> 邮箱：</Col>
                  <Col span={12}>
                    <Input
                      value={this.state.email}
                      placeholder="请输入邮箱"
                      style={{ width: 300 }}
                      onChange={e => {
                        if (e.target.value.length > 30) {
                          message.error('最多输入30位字符');
                        } else {
                          this.setState({ email: e.target.value });
                        }
                      }}
                    />
                  </Col>
                </Row>

                <Button onClick={this.handleSave} type="primary" style={{ marginLeft: 80 }}>
                  保存
                </Button>
                <Button onClick={() => history.go(-1)} style={{ marginLeft: 12 }}>
                  返回
                </Button>
              </div>
              <div className={styles.userWrapRight}>
                <Spin spinning={this.state.imgLoading} style={{ width: 100 }}>
                  {userHeadImg ? (
                    <img
                      style={{
                        height: 100,
                        width: 100,
                        borderRadius: '100px',
                        marginBottom: 20,
                      }}
                      src={userHeadImg}
                    />
                  ) : (
                    <div
                      style={{
                        height: 100,
                        width: 100,
                        borderRadius: '100px',
                        marginBottom: 20,
                        border: '1px solid #ccc',
                      }}
                    />
                  )}
                </Spin>
                <div>
                  <ImgUploads
                    multiple={true}
                    name="userHeadImg"
                    uploadSuccess={(data, name) => this.uploadSuccess(data, name)}
                    previewTitle="头像"
                    isloading={imgLoading => this.setState({ imgLoading })}
                    type={'edit'}
                    long={2}
                    size={2}
                    accept=".jpg,.png"
                    defauleUrl={[]}
                    txt="修改头像"
                    showUploadList={'false'}
                    reset={true}
                  />
                </div>
                <p>注：仅支持JPG和PNG图片文件，且文件小于2M （使用高质量图片，可生成高清头像）</p>
              </div>
            </div>
          </Card>
          {this.state.visible && (
            <Modal
              visible={this.state.visible}
              title="更换手机验证"
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button type="primary" onClick={this.handleOk}>
                  确认更换
                </Button>,
                <Button loading={false} onClick={this.handleCancel}>
                  取消更换
                </Button>,
              ]}
            >
              <p>更换手机号后，下次登录请用新手机号登录</p>
              <Input
                value={this.state.mobile}
                onChange={e => this.setState({ mobile: e.target.value })}
                placeholder="请输入新手机号"
                style={{ marginBottom: 18 }}
              />
              <Input
                placeholder="请输入验证码"
                onChange={e => this.setState({ code: e.target.value })}
                addonAfter={
                  <button
                    disabled={disabled}
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
                    onClick={() => this.handleSendCode()}
                  >
                    {text}
                  </button>
                }
              />
            </Modal>
          )}
        </PageHeaderWrapper>
      </div>
    );
  }
  handleCancel = () => {
    this.setState({
      visible: false,
      // phone: null,
      disabled: false,
      code: null,
      text: '获取验证码',
    });
  };
  handleOk = () => {
    const { mobile, code } = this.state;
    if (!mobile) {
      message.error('请输入手机号');
      return false;
    } else if (!regExpConfig.phone.test(mobile)) {
      message.error('手机号格式不正确');
      return false;
    } else if (!code) {
      message.error('请输入验证码');
      return false;
    }
    this.handleSaves();
  };
  // 发送验证码
  handleSendCode = () => {
    const { mobile } = this.state;
    if (!mobile) {
      message.error('请输入手机号');
      return false;
    } else if (!regExpConfig.phone.test(mobile)) {
      message.error('请输入正确的手机号');
      return false;
    } else {
      this.setState({ disabled: true });
      // 调短信 接口
      const { dispatch } = this.props;
      dispatch({
        type: 'base/sendUserMobileMsgModel',
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
        } else {
          this.setState({ disabled: false });
        }
      });
    }
  };

  handleSexChange = e => {
    this.setState({ sex: e.target.value });
  };

  // 图片上传成功回调
  uploadSuccess = (list, name) => {
    console.log('====================================');
    console.log(list);
    console.log('====================================');
    const lists = list.map(item => {
      if (item.response && item.response.code === 200) {
        return item.response.data.addr;
      } else {
        return item.path;
      }
    });
    this.setState({ [name]: lists[0] });
  };

  handleSave = () => {
    const { email, mobile, sex, realName, wechatId, userHeadImg, oldmobile, code } = this.state;
    if (!realName || realName.trim().length < 1) {
      message.error('请输入姓名');
      return false;
    } else if (!sex && sex !== 0) {
      message.error('请选择性别');
      return false;
    } else if (wechatId && !regExpConfig.wechat.test(wechatId)) {
      message.error('微信格式不正确');
      return false;
    } else if (email && !regExpConfig.emails.test(email)) {
      message.error('邮箱格式不正确');
      return false;
    } else if (!regExpConfig.phone.test(mobile)) {
      message.error('请输入正确的手机号');
      return false;
    } else if (!userHeadImg) {
      message.error('请上传头像');
      return false;
    }
    if (mobile !== oldmobile) {
      this.setState({ visible: true });
    } else {
      this.handleSaves();
    }
  };
  handleSaves = () => {
    const { email, mobile, sex, realName, wechatId, userHeadImg, oldmobile, code } = this.state;

    const { dispatch } = this.props;
    dispatch({
      type: 'base/setSystemuserModel',
      payload: {
        email,
        mobile,
        sex,
        realName,
        wechatId,
        userHeadImg,
        smsVerifyCode: code,
      },
    }).then(res => {
      if (res && res.code === 200) {
        // 更改手机号设置新token
        if (res.data && res.data.status) {
          setAuthority(res.data.token);
        }
        message.success('保存成功');
        // 保存成功后刷新用户信息
        // 从新加载个人信息
        dispatch({
          type: 'login/setAuthModel',
          payload: {},
        }).then(res => {
          setTimeout(() => {
            // window.location.reload();
          }, 1000);
        });
        this.setState({ text: '获取验证码', disabled: false, visible: false, code: null });
        dispatch({
          type: 'base/getSystemuserModel',
          payload: {},
        }).then(res => {
          if (res && res.code === 200) {
            const data = res.data;
            this.setState({
              email: data && data.email,
              mobile: data && data.mobile,
              oldmobile: data && data.mobile,
              sex: data && data.sex,
              realName: data && data.realName,
              wechatId: data && data.wechatId,
              userHeadImg: data && data.userHeadImg,
            });
          }
        });
      }
    });
  };
}

export default BaseView;
