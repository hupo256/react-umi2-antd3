import React, { Component } from 'react';
import { Input, Icon, Button, Form, message, Row, Col, Popover, Select } from 'antd';
import RcViewer from 'rc-viewer';
import Upload from '@/components/Upload/Upload';
import TagGroup from '@/components/TagSelect/TagGroup';
const { TextArea } = Input;
const FormItem = Form.Item;
@Form.create()
class BasicMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basicIcon: '',
      basicLogo: '',
      showtag: false,
      basicTitle: '',
      basicContent: '',
      basicKeyWords: [],
      iconUpload: false,
      logoUpload: false,
    };
  }
  async componentWillMount() {
    // console.log('basic', this.props);
    const { dispatch } = this.props;
    await dispatch({ type: 'WebSettingStroe/basicMessageModel' }).then(async res => {
      if (res && res.code == 200) {
        await this.setState(
          {
            basicIcon: res.data.icon,
            basicLogo: res.data.logo,
            basicTitle: res.data.title,
            basicContent: res.data.content,
            basicKeyWords: JSON.parse(res.data.keywords),
          },
          () => {
            this.setState({ showtag: true });
          }
        );
      }
    });
  }
  onBasicForm = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        throw err;
      }
      const { basicIcon, basicLogo, basicKeyWords } = this.state;
      const { dispatch } = this.props;
      let newBaiscIcon = '',
        newBasicLogo = '';
      console.log('请正确填写网站标题', values);
      if (values.basicTitle.length < 0 || values.basicTitle.length > 30) {
        message.error('请正确填写网站标题');
        return false;
      } else if (basicKeyWords > 10) {
        message.error('关键词不能超过10个');
        return false;
      } else {
        if (values.basicIcon && basicIcon) {
          newBaiscIcon = values.basicIcon;
        } else if (basicIcon && !values.basicIcon) {
          newBaiscIcon = basicIcon;
        } else {
          newBaiscIcon = '';
        }
        if (values.basicLogo && basicLogo) {
          newBasicLogo = values.basicLogo;
        } else if (basicLogo && !values.basicLogo) {
          newBasicLogo = basicLogo;
        } else {
          newBasicLogo = '';
        }
        dispatch({
          type: 'WebSettingStroe/basicMessageSave',
          payload: {
            icon: newBaiscIcon,
            logo: newBasicLogo,
            title: values.basicTitle,
            content: values.basicContent,
            keywords: JSON.stringify(basicKeyWords),
          },
        }).then(res => {
          if (res && res.code === 200) {
            message.success('保存成功');
            this.setState({
              basicIcon: newBaiscIcon,
              basicLogo: newBasicLogo,
              basicTitle: values.basicTitle,
              basicContent: values.basicContent,
              basicKeyWords: basicKeyWords,
            });
          }
        });
      }
    });
  };
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      showtag,
      basicIcon,
      basicLogo,
      iconUpload,
      logoUpload,
      basicTitle,
      basicContent,
      basicKeyWords,
    } = this.state;
    return (
      <div>
        <div style={{ color: '#101010', fontSize: '22px', marginBottom: '20px' }}>基本信息</div>
        <Form className="basicMessageFrom" onSubmit={this.onBasicForm}>
          <FormItem label="网站标题（业主有可能通过您输入的关键词，搜索到您的网站哦！）">
            {getFieldDecorator('basicTitle', {
              initialValue: basicTitle,
              rules: [
                {
                  required: true,
                  message: '请正确填写网站标题',
                },
                {
                  max: 30,
                  message: '限制1-30字符长度',
                },
              ],
            })(
              <Input
                type="text"
                style={{ width: 400 }}
                autoComplete="off"
                placeholder="请输入网站标题"
              />
            )}
          </FormItem>
          <FormItem label="网站描述（业主有可能通过您输入的关键词，搜索到您的网站哦！）">
            {getFieldDecorator('basicContent', {
              initialValue: basicContent,
              rules: [
                {
                  required: false,
                  message: '请正确填写网站描述',
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
                style={{ width: 400, height: 100, resize: 'none' }}
                autoComplete="off"
                placeholder="请输入网站描述"
              />
            )}
          </FormItem>
          <FormItem label="关键词（业主有可能通过您输入的关键词，搜索到您的网站哦！）">
            {getFieldDecorator('basicKeyWords', {})(
              <div style={{width: 400}}>
                {showtag && (
                  <TagGroup tags={basicKeyWords} handleSave={tags => this.handleTagSave(tags)} />
                )}
              </div>
            )}
          </FormItem>
          <FormItem label="网站图标">
            {getFieldDecorator('basicIcon', {
              rules: [{ required: false, message: '请上传网站图标' }],
            })(
              <div className="coverImg">
                {basicIcon ? (
                  <div className="previewimg basicIconImg">
                    <img src={basicIcon} />
                    <div className="picmodel">
                      <div className="picmodelcheld">
                        <span onClick={() => this.setState({ iconUpload: true })}>
                          <Icon type="edit" />
                        </span>
                        <span
                          onClick={() => {
                            this.setState({ rcviewer: basicIcon });
                            const { viewer } = this.refs.viewer;
                            viewer && viewer.show();
                          }}
                        >
                          <Icon type="eye" />
                        </span>
                        <span onClick={() => this.setState({ basicIcon: null })}>
                          <Icon type="delete" />
                        </span>
                        <Popover
                          placement="right"
                          className="uploadHint"
                          content="浏览器标签上的全站页面图标"
                        >
                          <Icon type="question-circle" />
                        </Popover>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="previewimg basicIconImg"
                    onClick={() => this.setState({ iconUpload: true })}
                  >
                    <p>
                      <Icon type="plus" />
                    </p>
                    <p>点击上传</p>
                    <Popover
                      placement="right"
                      className="uploadHint"
                      content="浏览器标签上的全站页面图标"
                    >
                      <Icon type="question-circle" />
                    </Popover>
                  </div>
                )}
              </div>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('basicLogo', {
              rules: [{ required: false, message: '请上传网站图标' }],
            })(
              <div className="coverImg">
                {basicLogo ? (
                  <div className="previewimg basicLogoImg">
                    <img src={basicLogo} />
                    <div className="picmodel">
                      <div className="picmodelcheld">
                        <span onClick={() => this.setState({ logoUpload: true })}>
                          <Icon type="edit" />
                        </span>
                        <span
                          onClick={() => {
                            this.setState({ rcviewer: basicLogo });
                            const { viewer } = this.refs.viewer;
                            viewer && viewer.show();
                          }}
                        >
                          <Icon type="eye" />
                        </span>
                        <span onClick={() => this.setState({ basicLogo: null })}>
                          <Icon type="delete" />
                        </span>
                        <Popover
                          placement="top"
                          className="uploadHint"
                          content="将会用于频道栏的企业LOGO显示"
                        >
                          <Icon type="question-circle" />
                        </Popover>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="previewimg basicLogoImg"
                    onClick={() => this.setState({ logoUpload: true })}
                  >
                    <p>
                      <Icon type="plus" />
                    </p>
                    <p>点击上传</p>
                    <Popover
                      placement="top"
                      className="uploadHint"
                      content="将会用于频道栏的企业LOGO显示"
                    >
                      <Icon type="question-circle" />
                    </Popover>
                  </div>
                )}
              </div>
            )}
          </FormItem>
          <Row>
            <Col span={16}>
              <Button
                type="primary"
                htmlType="submit"
                className="defaultHostButton"
                style={{ border: 0 }}
              >
                保存
              </Button>
            </Col>
          </Row>
        </Form>
        {iconUpload && (
          <Upload
            visible={iconUpload}
            selectNum={1}
            handleOk={data => this.iconUploadOk(data)}
            handleCancel={() => this.handleUploadCancel()}
          />
        )}
        {logoUpload && (
          <Upload
            visible={logoUpload}
            selectNum={1}
            handleOk={data => this.logoUploadOk(data)}
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
          <img src={this.state.rcviewer} />
        </RcViewer>
      </div>
    );
  }
  handleTagSave = tags => {
    // console.log('basicKeyWords', tags, this.state);
    this.setState({ basicKeyWords: tags });
  };
  // 图片选择cance
  handleUploadCancel = () => {
    this.setState({ iconUpload: false, logoUpload: false, record: null });
  };
  // icon图片选择
  iconUploadOk = data => {
    // console.log(data);
    const sizes = '?x-oss-process=image/crop,w_32,h_32,g_center'
    this.setState({ basicIcon: data[0].path + sizes });
    this.props.form.setFieldsValue({
      basicIcon: data[0].path + sizes,
    });
    this.handleUploadCancel();
  };
  // logo图片选择
  logoUploadOk = data => {
    // console.log(data);
    this.setState({ basicLogo: data[0].path });
    this.props.form.setFieldsValue({
      basicLogo: data[0].path,
    });
    this.handleUploadCancel();
  };
}

export default BasicMessage;
