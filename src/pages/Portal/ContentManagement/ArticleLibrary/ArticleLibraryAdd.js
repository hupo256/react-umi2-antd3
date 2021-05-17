/*
 * @Author: zqm 
 * @Date: 2021-03-18 11:21:43 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-05-13 11:33:55
 * 创建文章
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import RcViewer from 'rc-viewer';
import Upload from '@/components/Upload/Upload';
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
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { paginations, getQueryUrlVal } from '@/utils/utils';
import TagGroup from '@/components/TagSelect/TagGroup';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import styles from './ArticleLibrary.less';
const { Search } = Input;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ DictConfig, ArticleLibrary, loading }) => ({
  DictConfig,
  ArticleLibrary,
}))
@Form.create()
class ArticleLibraryAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      coverImg: null,
      uploadVisible: false,
      dictionaries: [],
      editorContent: null,
      step: null,
      tags: [],
      show: false,
      isCopy: false,
    };
  }

  componentDidMount() {
    // 获取字典数据 queryDicModel
    const { dispatch } = this.props;
    this.setState({ step: getQueryUrlVal('step') });
    if (getQueryUrlVal('uid')) {
      this.setState({ isCopy: true });
      dispatch({
        type: 'ArticleLibrary/getPublicDetailModel',
        payload: { articleUid: getQueryUrlVal('uid') },
      }).then(res => {
        if (res && res.code === 200) {
          this.init(res.data);
          this.setState({ show: true });
        }
      });
    }
    dispatch({
      type: 'DictConfig/queryDicModel',
      payload: { dicModuleCodes: 'DM006' },
    }).then(res => {
      if (res && res.code === 200) {
        const dictionaries = res.data['DM006'].filter(item => item.status !== '2');
        this.setState({ dictionaries, step: dictionaries[0].code });
      }
    });
  }

  render() {
    const { isCopy, show, coverImg, uploadVisible, dictionaries, editorContent, tags } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {
      DictConfig: { dicData },
      ArticleLibrary: { publicListDetail },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
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
              <Form.Item label="文章标题">
                {getFieldDecorator('articleTitle', {
                  initialValue: (isCopy && publicListDetail.articleTitle) || '',
                  rules: [
                    {
                      required: true,
                      message: '请输入文章标题',
                    },
                    {
                      max: 30,
                      message: '限制1-30字符长度',
                    },
                  ],
                })(<Input style={{ width: 400 }} placeholder="请输入文章标题" />)}
              </Form.Item>
              <Form.Item label="所属栏目">
                {getFieldDecorator('articleDicCode', {
                  initialValue: getQueryUrlVal('step') || null,
                  rules: [
                    {
                      required: true,
                      message: '请选择所属栏目',
                    },
                  ],
                })(
                  <Select style={{ width: 400 }} placeholder="请选择所属栏目">
                    {dictionaries.map(item => {
                      return (
                        <Option value={item.code} key={item.uid}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="封面图">
                {getFieldDecorator('articleCoverImg', {
                  initialValue: (isCopy && publicListDetail.articleCoverImg) || '',
                  rules: [],
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
                            <span onClick={() => this.setState({ coverImg: null })}>
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
              {isCopy &&
                editorContent && (
                  <Form.Item label={<span className="beforeStar">文章正文</span>}>
                    {getFieldDecorator('articleContent', {
                      initialValue: (isCopy && editorContent) || null,
                      rules: [
                        {
                          required: false,
                          message: '请输入文章正文',
                        },
                      ],
                    })(
                      <BraftEditor
                        defval={editorContent}
                        editorCont={cont => {
                          this.handleEditorCont(cont);
                        }}
                      />
                    )}
                  </Form.Item>
                )}
              {!isCopy && (
                <Form.Item label={<span className="beforeStar">文章正文</span>}>
                  {getFieldDecorator('articleContent', {
                    initialValue: null,
                    rules: [
                      {
                        required: false,
                        message: '请输入文章正文',
                      },
                    ],
                  })(
                    <BraftEditor
                      defval={null}
                      editorCont={cont => {
                        this.handleEditorCont(cont);
                      }}
                    />
                  )}
                </Form.Item>
              )}
              <h4 className={styles.title}>TDK设置（用于搜索引擎收录）</h4>
              <Form.Item label={this.title('关键词')}>
                {getFieldDecorator('headKeywords', {
                  initialValue: null,
                  rules: [],
                })(
                  // <TagGroup tags={tags || []} handleSave={tags => this.handleTagSave(tags)} />
                  <div>
                    {isCopy &&
                      show && (
                        <TagGroup tags={tags || []} handleSave={tags => this.handleTagSave(tags)} />
                      )}
                    {!isCopy && (
                      <TagGroup tags={[]} handleSave={tags => this.handleTagSave(tags)} />
                    )}
                  </div>
                )}
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    文章说明
                    {'  '}
                    <Tooltip
                      placement="right"
                      title="业主有可能通过您输入的关键词，搜索到您的网站哦！"
                    >
                      <Icon type="question-circle" />
                    </Tooltip>
                    {'  '}
                  </span>
                }
              >
                {getFieldDecorator('articleDescription', {
                  initialValue: (isCopy && publicListDetail.articleDescription) || '',
                  rules: [
                    {
                      max: 200,
                      message: '限制0-200字符长度',
                    },
                  ],
                })(<TextArea rows={4} style={{ width: 400 }} placeholder="请输入文章说明" />)}
              </Form.Item>
              <Row>
                <Col span={8} />
                <Col span={16}>
                  <Button type="primary" htmlType="submit">
                    提交
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
  handleEditorCont = cont => {
    this.setState({ editorContent: cont });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) throw err;
      console.log(values);
      const { editorContent, tags, isCopy } = this.state;
      if (!editorContent) {
        message.error('请输入文章正文');
        return false;
      }
      if (editorContent === '<p></p>') {
        message.error('请输入文章正文');
        return false;
      }
      const { dispatch } = this.props;
      dispatch({
        type: 'ArticleLibrary/createArticleModel',
        payload: {
          ...values,
          articleContent: editorContent,
          headKeywords: tags,
          articleChannel: isCopy ? 1 : 2,
          articleShareId: getQueryUrlVal('uid'),
        },
      }).then(res => {
        if (res && res.code === 200) {
          message.success('创建成功');
          history.go(-1);
        }
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
      articleCoverImg: data[0].path,
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
  init = detail => {
    console.log('====================================');
    console.log(detail);
    console.log('====================================');
    this.props.form.setFieldsValue({
      articleCoverImg: detail.articleCoverImg,
    });
    this.setState({
      editorContent: detail.articleContent,
      coverImg: detail.articleCoverImg,
      tags: detail.headKeywords || [],
    });
  };
}

export default ArticleLibraryAdd;
