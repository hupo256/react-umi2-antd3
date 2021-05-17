import React, { Component } from 'react';
import { Input, Button, message, Form, Icon, Row, Col, Popover } from 'antd';
import RcViewer from 'rc-viewer';
import Upload from '@/components/Upload/Upload';
const { TextArea } = Input;
const FormItem = Form.Item;
@Form.create()
class EnterpriseMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icp: '',
      rcviewer: '',
      copyright: '',
      wechatName: '',
      disclaimer: '',
      storeCover: '',
      storeAddress: '',
      wechatNumber: '',
      wechatQrCode: '',
      qrCodeUpload: false,
      storeCoverUpload: false,
    };
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'WebSettingStroe/enterpriseMessageModel' }).then(res => {
      if (res && res.code == 200) {
        this.setState({
          icp: res.data.icp,
          copyright: res.data.copyright,
          wechatName: res.data.wechatName,
          disclaimer: res.data.disclaimer,
          storeCover: res.data.storeCover,
          storeAddress: res.data.storeAddress,
          wechatNumber: res.data.wechatNumber,
          wechatQrCode: res.data.wechatQrCode,
        });
        console.log('enterprise', this);
      }
    });
  }
  onEnterpriseForm = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        throw err;
      }
      const { wechatQrCode, storeCover } = this.state;
      const { dispatch } = this.props;
      let newWechatQrCode = '',
        newStoreCover = '';
      console.log('newWechatQrCode', values);
      if (values.wechatQrCode && wechatQrCode) {
        newWechatQrCode = values.wechatQrCode;
      } else if (wechatQrCode && !values.wechatQrCode) {
        newWechatQrCode = wechatQrCode;
      } else {
        newWechatQrCode = '';
      }
      console.log('newWechatQrCode', newWechatQrCode);
      if (values.storeCover && storeCover) {
        newStoreCover = values.storeCover;
      } else if (storeCover && !values.storeCover) {
        newStoreCover = storeCover;
      } else {
        newStoreCover = '';
      }
      // debugger
      dispatch({
        type: 'WebSettingStroe/enterpriseMessageSave',
        payload: {
          icp: values.icp,
          copyright: values.copyright,
          wechatName: values.wechatName,
          disclaimer: values.disclaimer,
          storeCover: newStoreCover,
          storeAddress: values.storeAddress,
          wechatNumber: values.wechatNumber,
          wechatQrCode: newWechatQrCode,
        },
      }).then(res => {
        if (res && res.code === 200) {
          message.success('保存成功');
          this.setState({
            icp: values.icp,
            copyright: values.copyright,
            wechatName: values.wechatName,
            disclaimer: values.disclaimer,
            storeCover: newStoreCover,
            storeAddress: values.storeAddress,
            wechatNumber: values.wechatNumber,
            wechatQrCode: newWechatQrCode,
          });
        }
      });
    });
  };
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      icp,
      rcviewer,
      copyright,
      wechatName,
      disclaimer,
      storeCover,
      storeAddress,
      wechatNumber,
      wechatQrCode,
      qrCodeUpload,
      storeCoverUpload,
    } = this.state;
    return (
      <div>
        <div style={{ color: '#101010', fontSize: '26px', marginBottom: '20px' }}>
          企业信息
          <Popover placement="right" className="titleIcon" content="暂无数据">
            <Icon type="question-circle" />
          </Popover>
        </div>
        <Form className="enterpriseMessageFrom" onSubmit={this.onEnterpriseForm}>
          <FormItem label="公众号">
            {getFieldDecorator('wechatName', {
              initialValue: wechatName,
              rules: [
                {
                  required: false,
                  message: '请正确填写公众号',
                },
                {
                  max: 30,
                  message: '限制0-30字符长度',
                },
              ],
            })(
              <Input
                type="text"
                style={{ width: 400 }}
                autoComplete="off"
                placeholder="请输入公众号名称"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('wechatQrCode', {
              rules: [{ required: false, message: '请上传网站图标' }],
            })(
              <div className="coverImg">
                {wechatQrCode ? (
                  <div className="previewimg basicIconImg">
                    <img src={wechatQrCode} />
                    <div className="picmodel">
                      <div className="picmodelcheld">
                        <span onClick={() => this.setState({ qrCodeUpload: true })}>
                          <Icon type="edit" />
                        </span>
                        <span
                          onClick={() => {
                            this.setState({ rcviewer: wechatQrCode });
                            const { viewer } = this.refs.viewer;
                            viewer && viewer.show();
                          }}
                        >
                          <Icon type="eye" />
                        </span>
                        <span onClick={() => this.setState({ wechatQrCode: null })}>
                          <Icon type="delete" />
                        </span>
                        <Popover
                          placement="rightTop"
                          className="uploadHint"
                          content="公众号二维码，用于底部栏显示"
                        >
                          <Icon type="question-circle" />
                        </Popover>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="previewimg basicIconImg"
                    onClick={() => this.setState({ qrCodeUpload: true })}
                  >
                    <p>
                      <Icon type="plus" />
                    </p>
                    <p>点击上传</p>
                    <Popover
                      placement="rightTop"
                      className="uploadHint"
                      content="公众号二维码，用于底部栏显示"
                    >
                      <Icon type="question-circle" />
                    </Popover>
                  </div>
                )}
              </div>
            )}
          </FormItem>
          <FormItem label="微信号">
            {getFieldDecorator('wechatNumber', {
              initialValue: wechatNumber,
              rules: [
                {
                  required: false,
                  message: '请正确填写网站描述',
                },
                {
                  max: 30,
                  message: '限制0-30字符长度',
                },
              ],
            })(
              <Input
                type="text"
                style={{ width: 400 }}
                autoComplete="off"
                placeholder="请输入微信号"
              />
            )}
          </FormItem>
          <FormItem label="门店地址（暂仅支持单门店展示）">
            {getFieldDecorator('storeAddress', {
              initialValue: storeAddress,
              rules: [
                {
                  pattern: '',
                  message: '请正确填写二级域名',
                },
                {
                  max: 50,
                  message: '限制0-50字符长度',
                },
              ],
            })(
              <Input
                type="text"
                style={{ width: 400 }}
                autoComplete="off"
                placeholder="请输入门店地址"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('storeCover', {
              rules: [{ required: false, message: '请上门面封面图' }],
            })(
              <div className="coverImg">
                {storeCover ? (
                  <div className="previewimg storeCoverImg">
                    <img src={storeCover} />
                    <div className="picmodel">
                      <div className="picmodelcheld">
                        <span onClick={() => this.setState({ storeCoverUpload: true })}>
                          <Icon type="edit" />
                        </span>
                        <span
                          onClick={() => {
                            this.setState({ rcviewer: storeCover });
                            const { viewer } = this.refs.viewer;
                            viewer && viewer.show();
                          }}
                        >
                          <Icon type="eye" />
                        </span>
                        <span onClick={() => this.setState({ storeCover: null })}>
                          <Icon type="delete" />
                        </span>
                        <Popover placement="rightTop" className="uploadHint" content="门店封面图">
                          <Icon type="question-circle" />
                        </Popover>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="previewimg storeCoverImg"
                    onClick={() => this.setState({ storeCoverUpload: true })}
                  >
                    <p>
                      <Icon type="plus" />
                    </p>
                    <p>点击上传</p>
                    <Popover placement="rightTop" className="uploadHint" content="门店封面图">
                      <Icon type="question-circle" />
                    </Popover>
                  </div>
                )}
              </div>
            )}
          </FormItem>
          <FormItem label="免责声明">
            {getFieldDecorator('disclaimer', {
              initialValue: disclaimer,
              rules: [
                {
                  required: false,
                  message: '请正确填写免费声明',
                },
                {
                  max: 200,
                  message: '限制0-200字符长度',
                },
              ],
            })(
              <TextArea
                type="text"
                autoSize={true}
                style={{ width: 400, height: 54, resize: 'none' }}
                autoComplete="off"
                placeholder="本网站部分内容由用户自行上传，如权利人发现存在误传其作品情形，请及时与本站联系。"
              />
            )}
          </FormItem>
          <FormItem label="版权信息">
            {getFieldDecorator('copyright', {
              initialValue: copyright,
              rules: [
                {
                  required: false,
                  message: '请正确填写版权信息',
                },
                {
                  max: 200,
                  message: '限制0-200字符长度',
                },
              ],
            })(
              <TextArea
                type="text"
                autoSize={true}
                style={{ width: 400, height: 54, resize: 'none' }}
                autoComplete="off"
                placeholder="请输入版权信息，如：@2016 XXX设计装饰有限公司版权所有"
              />
            )}
          </FormItem>
          <FormItem label="ICP备案号">
            {getFieldDecorator('icp', {
              initialValue: icp,
              rules: [
                {
                  required: false,
                  message: '请正确填写ICP备案号',
                },
                {
                  max: 50,
                  message: '限制0-50字符长度',
                },
              ],
            })(
              <Input
                type="text"
                style={{ width: 400 }}
                autoComplete="off"
                placeholder="请输入ICP备案号，如：京ICP备102342219号"
              />
            )}
          </FormItem>
          <Row className="enterpriseButton">
            <Col span={16}>
              <Button type="primary" htmlType="submit" className="defaultHostButton">
                保存
              </Button>
            </Col>
          </Row>
        </Form>
        {qrCodeUpload && (
          <Upload
            visible={qrCodeUpload}
            selectNum={1}
            handleOk={data => this.qrCodeUploadOk(data)}
            handleCancel={() => this.handleUploadCancel()}
          />
        )}
        {storeCoverUpload && (
          <Upload
            visible={storeCoverUpload}
            selectNum={1}
            handleOk={data => this.storeCoverUploadOk(data)}
            handleCancel={() => this.handleUploadCancel()}
          />
        )}
        <RcViewer
          ref="viewer"
          options={{ title: false }}
          style={{
            display: 'none',
            verticalAlign: 'top',
            maxWidth: 300,
            wordWrap: 'break-word',
          }}
        >
          <img src={rcviewer} />
        </RcViewer>
      </div>
    );
  }
  // 图片选择cance
  handleUploadCancel = () => {
    this.setState({ qrCodeUpload: false, storeCoverUpload: false, record: null });
  };
  // icon图片选择
  qrCodeUploadOk = data => {
    // console.log(data);
    this.setState({ wechatQrCode: data[0].path });
    this.props.form.setFieldsValue({
      wechatQrCode: data[0].path,
    });
    this.handleUploadCancel();
  };
  // logo图片选择
  storeCoverUploadOk = data => {
    // console.log(data);
    this.setState({ storeCover: data[0].path });
    this.props.form.setFieldsValue({
      storeCover: data[0].path,
    });
    this.handleUploadCancel();
  };
}

export default EnterpriseMessage;
