import React, { Component } from 'react';
import { Input, Icon, Button, Form, message, Row, Col, Popover, Select } from 'antd';
import RcViewer from 'rc-viewer';
import Upload from '@/components/Upload/Upload';
import { regExpConfig } from '@/utils/regular.config';
import TagGroup from '@/components/TagSelect/TagGroup';
import { getauth } from '@/utils/authority';
const permissionsBtn = getauth().permissions || [];
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
      emojiIf: '',
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

  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
  }
  async dispatchValue() {
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
  clickButton() {
    document.getElementById('BasicMessageButton').click();
    this.props.changeHintIf(false);
  }
  onBasicForm = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        throw err;
      }
      const ifEmojis = this.isEmojiCharacter(values.basicTitle);
      if (ifEmojis) {
        message.error('不能输入表情');
        return;
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
        let newkeywords = []
        if(basicKeyWords && basicKeyWords.length > 0){
          newkeywords = basicKeyWords
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
            this.props.changeHintIf(false);
          }
        });
      }
    });
  };
  isEmojiCharacter(substring) {
    for (var i = 0; i < substring.length; i++) {
      var hs = substring.charCodeAt(i);
      if (0xd800 <= hs && hs <= 0xdbff) {
        if (substring.length > 1) {
          var ls = substring.charCodeAt(i + 1);
          var uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
          if (0x1d000 <= uc && uc <= 0x1f77f) {
            return true;
          }
        }
      } else if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        if (ls == 0x20e3) {
          return true;
        }
      } else {
        if (0x2100 <= hs && hs <= 0x27ff) {
          return true;
        } else if (0x2b05 <= hs && hs <= 0x2b07) {
          return true;
        } else if (0x2934 <= hs && hs <= 0x2935) {
          return true;
        } else if (0x3297 <= hs && hs <= 0x3299) {
          return true;
        } else if (
          hs == 0xa9 ||
          hs == 0xae ||
          hs == 0x303d ||
          hs == 0x3030 ||
          hs == 0x2b55 ||
          hs == 0x2b1c ||
          hs == 0x2b1b ||
          hs == 0x2b50
        ) {
          return true;
        }
      }
    }
    return false;
  }
  changeTextArea() {
    this.props.changeHintIf(true);
  }
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      emojiIf,
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
        <Form
          className="basicMessageFrom"
          onSubmit={this.onBasicForm}
          style={{ position: 'relative' }}
        >
          <Popover
            placement="right"
            className="ContentHint uploadHints"
            content="业主有可能通过您输入的网站描述，搜索到您的网站哦！"
          >
            <Icon type="question-circle" />
          </Popover>
          <Popover
            placement="right"
            className="TitleHint uploadHints"
            content="业主有可能通过您输入的网站标题，搜索到您的网站哦！"
          >
            <Icon type="question-circle" />
          </Popover>
          <FormItem label="网站标题">
            {getFieldDecorator('basicTitle', {
              initialValue: basicTitle,
              rules: [
                {
                  required: true,
                  message: '请正确填写网站标题',
                },
                {
                  pattern: emojiIf,
                  message: '不能输入表情',
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
                onChange={e => {
                  this.onBasicTitle(e);
                }}
              />
            )}
          </FormItem>
          <FormItem label="网站描述">
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
                onChange={() => this.changeTextArea()}
              />
            )}
          </FormItem>
          <FormItem label="关键词">
            {getFieldDecorator('basicKeyWords', {})(
              <div style={{ width: 400 }}>
                {showtag && (
                  <TagGroup tags={basicKeyWords} handleSave={tags => this.handleTagSave(tags)} />
                )}
              </div>
            )}
            <Popover
              placement="right"
              className="keyWordHint uploadHints"
              content="业主有可能通过您输入的关键词，搜索到您的网站哦！"
            >
              <Icon type="question-circle" />
            </Popover>
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
                      content="将会用于频道栏的企业LOGO显示"
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
              {permissionsBtn.includes('BTN210610000002') && (
                <Button
                  id="BasicMessageButton"
                  type="primary"
                  htmlType="submit"
                  className="defaultHostButton"
                  style={{ border: 0 }}
                >
                  保存
                </Button>
              )}
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
    this.props.changeHintIf(true);
  };
  // 图片选择cance
  handleUploadCancel = () => {
    this.setState({ iconUpload: false, logoUpload: false, record: null });
  };
  // icon图片选择
  iconUploadOk = data => {
    // console.log(data);
    const imgs = new Image();
    let sizes = '';
    imgs.src = data[0].path;
    imgs.onload = () => {
      console.log('this', this);
      if (imgs.width > imgs.height) {
        sizes = `?x-oss-process=image/crop,w_${imgs.height},h_${imgs.height},g_center`;
      } else if (imgs.width < imgs.height) {
        sizes = `?x-oss-process=image/crop,w_${imgs.width},h_${imgs.width},g_center`;
      } else {
        sizes = '';
      }
      this.setState({ basicIcon: data[0].path + sizes });
      this.props.form.setFieldsValue({
        basicIcon: data[0].path + sizes,
      });
      this.handleUploadCancel();
      this.props.changeHintIf(true);
    };
  };
  // logo图片选择
  logoUploadOk = data => {
    // console.log(data);
    this.setState({ basicLogo: data[0].path });
    this.props.form.setFieldsValue({
      basicLogo: data[0].path,
    });
    this.handleUploadCancel();
    this.props.changeHintIf(true);
  };
  async onBasicTitle(e) {
    console.log('onBasicTitle', e.target.value, this);
    for (var i = 0; i < e.target.value.length; i++) {
      var hs = e.target.value.charCodeAt(i);
      if (0xd800 <= hs && hs <= 0xdbff) {
        if (e.target.value.length > 1) {
          var ls = e.target.value.charCodeAt(i + 1);
          var uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
          if (0x1d000 <= uc && uc <= 0x1f77f) {
            message.error('不能输入表情');
            await this.setState({
              emojiIf: regExpConfig.emojiInput,
            });
            return;
          }
        }
      } else if (e.target.value.length > 1) {
        var ls = e.target.value.charCodeAt(i + 1);
        if (ls == 0x20e3) {
          await this.setState({
            emojiIf: regExpConfig.emojiInput,
          });
          return;
        }
      } else {
        if (0x2100 <= hs && hs <= 0x27ff) {
          await this.setState({
            emojiIf: regExpConfig.emojiInput,
          });
          message.error('不能输入表情');
          return;
        } else if (0x2b05 <= hs && hs <= 0x2b07) {
          await this.setState({
            emojiIf: regExpConfig.emojiInput,
          });
          return;
        } else if (0x2934 <= hs && hs <= 0x2935) {
          await this.setState({
            emojiIf: regExpConfig.emojiInput,
          });
          return;
        } else if (0x3297 <= hs && hs <= 0x3299) {
          await this.setState({
            emojiIf: regExpConfig.emojiInput,
          });
          return;
        } else if (
          hs == 0xa9 ||
          hs == 0xae ||
          hs == 0x303d ||
          hs == 0x3030 ||
          hs == 0x2b55 ||
          hs == 0x2b1c ||
          hs == 0x2b1b ||
          hs == 0x2b50
        ) {
          await this.setState({
            emojiIf: regExpConfig.emojiInput,
          });
          return;
        }
      }
    }
    await this.setState({
      emojiIf: '',
    });
    this.props.changeHintIf(true);
  }
}

export default BasicMessage;
