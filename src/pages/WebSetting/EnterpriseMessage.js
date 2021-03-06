import React, { Component } from 'react';
import { Input, Button, message, Form, Icon, Row, Col, Popover } from 'antd';
import RcViewer from 'rc-viewer';
import Upload from '@/components/Upload/Upload';
import { getauth } from '@/utils/authority';
const permissionsBtn = getauth().permissions || [];
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
        // console.log('enterprise', this);
      }
    });
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
  }
  async dispatchValue() {
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
        // console.log('enterprise', this);
      }
    });
  }
  clickButton() {
    document.getElementById('EnterpriseMessageButton').click();
    this.props.changeHintIf(false);
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
      // console.log('newWechatQrCode', values);
      if (values.wechatQrCode && wechatQrCode) {
        newWechatQrCode = values.wechatQrCode;
      } else if (wechatQrCode && !values.wechatQrCode) {
        newWechatQrCode = wechatQrCode;
      } else {
        newWechatQrCode = '';
      }
      // console.log('newWechatQrCode', newWechatQrCode);
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
          message.success('????????????');
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
          this.props.changeHintIf(false);
        }
      });
    });
  };
  changeTextArea() {
    this.props.changeHintIf(true);
  }
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
    const prpoverImg = (
      <img src="https://img.inbase.in-deco.com/crm_saas/release/20210519/b0bd7f64b276409dbb22deb8bf88ea05/????????????.png" />
    );
    return (
      <div>
        <div style={{ color: '#101010', fontSize: '22px', marginBottom: '20px' }}>
          ????????????
          <Popover placement="right" className="titleIcon" content={prpoverImg}>
            <Icon type="question-circle" />
          </Popover>
        </div>
        <Form className="enterpriseMessageFrom" onSubmit={this.onEnterpriseForm}>
          <FormItem label="?????????">
            {getFieldDecorator('wechatName', {
              initialValue: wechatName,
              rules: [
                {
                  required: false,
                  message: '????????????????????????',
                },
                {
                  max: 30,
                  message: '??????0-30????????????',
                },
              ],
            })(
              <Input
                type="text"
                style={{ width: 400 }}
                autoComplete="off"
                placeholder="????????????????????????"
                onChange={() => this.changeTextArea()}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('wechatQrCode', {
              rules: [{ required: false, message: '?????????????????????' }],
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
                          content="????????????????????????????????????????????????????????????78px*78px"
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
                    <p>????????????</p>
                    <Popover
                      placement="rightTop"
                      className="uploadHint"
                      content="????????????????????????????????????????????????????????????78px*78px"
                    >
                      <Icon type="question-circle" />
                    </Popover>
                  </div>
                )}
              </div>
            )}
          </FormItem>
          <FormItem label="?????????">
            {getFieldDecorator('wechatNumber', {
              initialValue: wechatNumber,
              rules: [
                {
                  required: false,
                  message: '???????????????????????????',
                },
                {
                  max: 30,
                  message: '??????0-30????????????',
                },
              ],
            })(
              <Input
                type="text"
                style={{ width: 400 }}
                autoComplete="off"
                placeholder="??????????????????"
                onChange={() => this.changeTextArea()}
              />
            )}
          </FormItem>
          <FormItem label="?????????????????????????????????????????????">
            {getFieldDecorator('storeAddress', {
              initialValue: storeAddress,
              rules: [
                {
                  pattern: '',
                  message: '???????????????????????????',
                },
                {
                  max: 50,
                  message: '??????0-50????????????',
                },
              ],
            })(
              <Input
                type="text"
                style={{ width: 400 }}
                autoComplete="off"
                placeholder="?????????????????????"
                onChange={() => this.changeTextArea()}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('storeCover', {
              rules: [{ required: false, message: '?????????????????????' }],
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
                        <Popover placement="rightTop" className="uploadHint" content="??????????????????????????????????????????????????????156px*78px">
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
                    <p>????????????</p>
                    <Popover placement="rightTop" className="uploadHint" content="??????????????????????????????????????????????????????156px*78px">
                      <Icon type="question-circle" />
                    </Popover>
                  </div>
                )}
              </div>
            )}
          </FormItem>
          <FormItem label="????????????">
            {getFieldDecorator('disclaimer', {
              initialValue: disclaimer,
              rules: [
                {
                  required: false,
                  message: '???????????????????????????',
                },
                {
                  max: 200,
                  message: '??????0-200????????????',
                },
              ],
            })(
              <TextArea
                type="text"
                autoSize={true}
                style={{ width: 400, height: 54, resize: 'none' }}
                autoComplete="off"
                placeholder="????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????"
                onChange={() => this.changeTextArea()}
              />
            )}
          </FormItem>
          <FormItem label="????????????">
            {getFieldDecorator('copyright', {
              initialValue: copyright,
              rules: [
                {
                  required: false,
                  message: '???????????????????????????',
                },
                {
                  max: 200,
                  message: '??????0-200????????????',
                },
              ],
            })(
              <TextArea
                type="text"
                autoSize={true}
                style={{ width: 400, height: 54, resize: 'none' }}
                autoComplete="off"
                placeholder="??????????????????????????????@2016 XXX????????????????????????????????????"
                onChange={() => this.changeTextArea()}
              />
            )}
          </FormItem>
          <FormItem label="ICP?????????">
            {getFieldDecorator('icp', {
              initialValue: icp,
              rules: [
                {
                  required: false,
                  message: '???????????????ICP?????????',
                },
                {
                  max: 50,
                  message: '??????0-50????????????',
                },
              ],
            })(
              <Input
                type="text"
                style={{ width: 400 }}
                autoComplete="off"
                placeholder="?????????ICP?????????????????????ICP???102342219???"
                onChange={() => this.changeTextArea()}
              />
            )}
          </FormItem>
          <Row className="enterpriseButton">
            <Col span={16}>
              {permissionsBtn.includes('BTN210610000003') && (
                <Button
                  type="primary"
                  id="EnterpriseMessageButton"
                  htmlType="submit"
                  className="defaultHostButton"
                >
                  ??????
                </Button>
              )}
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
  // ????????????cance
  handleUploadCancel = () => {
    this.setState({ qrCodeUpload: false, storeCoverUpload: false, record: null });
  };
  // icon????????????
  qrCodeUploadOk = data => {
    // console.log(data);
    this.setState({ wechatQrCode: data[0].path });
    this.props.form.setFieldsValue({
      wechatQrCode: data[0].path,
    });
    this.handleUploadCancel();
    this.props.changeHintIf(true);
  };
  // logo????????????
  storeCoverUploadOk = data => {
    // console.log(data);
    this.setState({ storeCover: data[0].path });
    this.props.form.setFieldsValue({
      storeCover: data[0].path,
    });
    this.handleUploadCancel();
    this.props.changeHintIf(true);
  };
}

export default EnterpriseMessage;
