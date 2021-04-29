/*
 * @Author: zqm 
 * @Date: 2021-02-18 16:39:42 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-04-29 09:46:52
 * 创建设计师
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Upload from '@/components/Upload/Upload';
import RcViewer from 'rc-viewer';
import {
  Card,
  Form,
  Button,
  Icon,
  Input,
  message,
  Tooltip,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { paginations, getQueryUrlVal } from '@/utils/utils';
import TagGroup from '@/components/TagSelect/TagGroup';
import { regExpConfig } from '../../../../utils/regular.config';
import styles from './DesignerLibrary.less';
const { TextArea } = Input;
const { Search } = Input;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ DictConfig, DesignerLibrary, loading }) => ({
  DictConfig,
  DesignerLibrary,
}))
@Form.create()
class DesignerLibraryEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      coverImg: null,
      uploadVisible: false,
      disabled: [],
      tags: [],
      show: false,
    };
  }

  componentDidMount() {
    // 获取字典数据 queryDicModel
    const { dispatch } = this.props;
    dispatch({
      type: 'DictConfig/queryDicModel',
      payload: { dicModuleCodes: 'DM002' },
    }).then(res => {
      if (res && res.code === 200) {
        const disabled = res.data['DM002'].filter(item => item.status === '2');
        this.setState({ disabled });
      }
    });
    dispatch({
      type: 'DesignerLibrary/getDesignerModel',
      payload: { uid: getQueryUrlVal('uid') },
    }).then(res => {
      if (res && res.code === 200) {
        this.setState(
          {
            coverImg: res.data.headPicUrl,
            tags: res?.data?.keywords ? JSON.parse(res.data.keywords) : [],
          },
          () => {
            this.setState({ show: true });
          }
        );
      }
    });
  }

  render() {
    const { status, coverImg, uploadVisible, disabled, show, tags } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {
      DictConfig: { dicData },
      DesignerLibrary: { DesignerDetail },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div>
        <PageHeaderWrapper>
          <Card bordered={false}>
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <h4 className={styles.title}>基本信息</h4>
              <Form.Item label="设计师姓名">
                {getFieldDecorator('name', {
                  initialValue: DesignerDetail.name,
                  rules: [
                    {
                      required: true,
                      message: '请输入设计师姓名',
                    },
                    {
                      max: 10,
                      message: '限制1-10字符长度',
                    },
                  ],
                })(<Input style={{ width: 400 }} placeholder="请输入设计师姓名" />)}
              </Form.Item>
              <Form.Item label="联系电话">
                {getFieldDecorator('mobile', {
                  initialValue: DesignerDetail.mobile,
                  rules: [
                    {
                      required: true,
                      message: '请输入联系电话',
                    },
                    {
                      pattern: regExpConfig.phone,
                      message: '手机号码格式不正确!',
                    },
                  ],
                })(<Input style={{ width: 400 }} placeholder="请输入联系电话" />)}
              </Form.Item>
              <Form.Item label="职级">
                {getFieldDecorator('position', {
                  initialValue: DesignerDetail.position,
                  rules: [
                    {
                      required: true,
                      message: '请输入职级',
                    },
                    {
                      max: 10,
                      message: '限制1-10字符长度',
                    },
                  ],
                })(<Input style={{ width: 400 }} placeholder="请输入职级,例：首席设计师" />)}
              </Form.Item>
              <Form.Item label="从业时间">
                {getFieldDecorator('workingTime', {
                  initialValue: DesignerDetail.workingTime,
                  rules: [
                    {
                      required: true,
                      message: '请输入从业时间',
                    },
                    {
                      pattern: /^[0-9]*$/,
                      message: '请输入整数数字',
                    },
                    { max: 2, message: '限制输入1-99范围内的整数' },
                  ],
                })(<Input style={{ width: 400 }} placeholder="请输入从业时间，仅支持整数" />)}
              </Form.Item>
              <Form.Item label="选择擅长风格">
                {getFieldDecorator('styleDicCodes', {
                  initialValue: DesignerDetail.styleDicCodes,
                  rules: [
                    {
                      required: true,
                      message: '请选择擅长风格',
                    },
                  ],
                })(
                  <Select
                    mode="multiple"
                    showSearch
                    filterOption={(input, option) => {
                      return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }}
                    onChange={value => this.handleChange(value)}
                    style={{ width: 400 }}
                    placeholder="请选择擅长风格"
                  >
                    {dicData &&
                      dicData['DM002'] &&
                      dicData['DM002'].map(item => {
                        if (item.status === '1') {
                          return (
                            <Option value={item.code} key={item.uid}>
                              {item.name}
                            </Option>
                          );
                        } else {
                          return null;
                        }
                      })}
                    {disabled.map(item => {
                      if (
                        DesignerDetail.styleDicCodes &&
                        DesignerDetail.styleDicCodes.includes(item.code)
                      ) {
                        return (
                          <Option disabled={true} value={item.code} key={item.uid}>
                            {item.name}
                          </Option>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="设计师头像">
                {getFieldDecorator('headPicUrl', {
                  initialValue: DesignerDetail.headPicUrl,
                  rules: [
                    {
                      required: true,
                      message: '请上传设计师头像',
                    },
                  ],
                })(
                  <div className="coverImg">
                    {coverImg ? (
                      <div className="previewimg">
                        <img src={coverImg} />
                        <div className="picmodel">
                          <div className="picmodelcheld">
                            <span onClick={() => this.setState({ uploadVisible: true })}>
                              <Icon type="edit" />
                            </span>
                            <span
                              onClick={() => {
                                this.setState({ rcviewer: coverImg });
                                const { viewer } = this.refs.viewer;
                                viewer && viewer.show();
                              }}
                            >
                              <Icon type="eye" />
                            </span>
                            <span
                              onClick={() => {
                                this.props.form.setFieldsValue({
                                  headPicUrl: '',
                                });
                                this.setState({ coverImg: null });
                              }}
                            >
                              <Icon type="delete" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="previewimg"
                        onClick={() => this.setState({ uploadVisible: true })}
                      >
                        <p>
                          <Icon type="plus" />
                        </p>
                        <p>点击上传</p>
                      </div>
                    )}
                  </div>
                )}
              </Form.Item>
              <Form.Item label="设计师简介">
                {getFieldDecorator('profile', {
                  initialValue: DesignerDetail.profile,
                  rules: [
                    {
                      max: 200,
                      message: '限制0-200字符长度',
                    },
                  ],
                })(<TextArea rows={4} style={{ width: 400 }} placeholder="请输入设计师简介" />)}
              </Form.Item>
              <Form.Item label="设计理念">
                {getFieldDecorator('designConcept', {
                  initialValue: DesignerDetail.designConcept,
                  rules: [
                    {
                      max: 200,
                      message: '限制0-200字符长度',
                    },
                  ],
                })(<TextArea rows={4} style={{ width: 400 }} placeholder="请输入设计理念" />)}
              </Form.Item>

              <h4 className={styles.title}>TDK设置（用于搜索引擎收录）</h4>
              <Form.Item label={this.title('设计师标题')}>
                {getFieldDecorator('title', {
                  initialValue: DesignerDetail.title,
                  rules: [
                    {
                      max: 10,
                      message: '限制1-30字符长度',
                    },
                  ],
                })(<Input style={{ width: 400 }} placeholder="请输入设计师标题" />)}
              </Form.Item>
              <Form.Item label={this.title('关键词')}>
                {getFieldDecorator('keywords', {})(
                  <div>
                    {show && (
                      <TagGroup
                        tags={Array.isArray(tags) ? tags : []}
                        handleSave={tags => this.handleTagSave(tags)}
                      />
                    )}
                  </div>
                )}
              </Form.Item>
              <Form.Item label={this.title('设计师说明')}>
                {getFieldDecorator('description', {
                  initialValue: DesignerDetail.description,
                  rules: [
                    {
                      max: 200,
                      message: '限制0-200字符长度',
                    },
                  ],
                })(<TextArea rows={4} style={{ width: 400 }} placeholder="请输入设计师说明" />)}
              </Form.Item>
              <Row>
                <Col span={8} />
                <Col span={16}>
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </PageHeaderWrapper>
        {uploadVisible && (
          <Upload
            visible={uploadVisible}
            selectNum={1}
            handleOk={data => this.handleUploadOk(data)}
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

  handleChange = value => {
    if (value.length < 4) {
      this.props.form.setFieldsValue({
        styleDicCodes: value,
      });
    } else {
      message.info('最多支持选择3个');
      this.props.form.setFieldsValue({
        styleDicCodes: value,
      });
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) throw err;
      console.log(values);
      const { tags } = this.state;
      const { dispatch } = this.props;
      // createDesignerModel
      if (values.styleDicCodes.length > 3) {
        message.error('擅长风格最多支持选择3个');
        return false;
      }
      dispatch({
        type: 'DesignerLibrary/createDesignerModel',
        payload: {
          ...values,
          uid: getQueryUrlVal('uid'),
          keywords: JSON.stringify(tags || []),
        },
      }).then(res => {
        message.success('编辑成功');
        history.go(-1);
      });
    });
  };

  // 图片选择cancel
  handleUploadCancel = () => {
    this.setState({ uploadVisible: false, record: null });
  };
  // 图片选择
  handleUploadOk = data => {
    console.log(data);
    this.setState({ coverImg: data[0].path });
    this.props.form.setFieldsValue({
      headPicUrl: data[0].path,
    });
    this.handleUploadCancel();
  };

  // 关键词
  handleTagSave = tags => {
    this.setState({ tags });
  };
  title = title => {
    return (
      <span>
        {title}
        {'  '}
        <Tooltip placement="right" title="业主有可能通过您输入的关键词，搜索到您的网站哦！">
          <Icon type="question-circle" />
        </Tooltip>
        {'  '}
      </span>
    );
  };
}

export default DesignerLibraryEdit;
