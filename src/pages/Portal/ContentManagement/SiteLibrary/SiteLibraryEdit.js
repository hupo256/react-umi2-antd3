/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-06-08 14:12:26
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Tooltip,
  Tag,
  Card,
  Form,
  Button,
  Input,
  message,
  Select,
  Row,
  Col,
  InputNumber,
  Icon,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TagGroup from '@/components/TagSelect/TagGroup';
import { getQueryUrlVal, getUrl } from '@/utils/utils';
import Upload from '@/components/Upload/Upload';
import styles from './SiteLibrary.less';
import RcViewer from 'rc-viewer';
const { TextArea } = Input;
const { Option } = Select;

@connect(({ SiteLibrary, DictConfig, loading }) => ({
  DictConfig,
  SiteLibrary,
  maintainListLoading: loading.effects['Maintain/maintainQueryModel'],
}))
@Form.create()
class SiteLibraryAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      bedroom: 0,
      parlor: 0,
      kitchen: 0,
      toilet: 0,
      uploadVisible: false,
      coverImg: null,
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
    console.log(getQueryUrlVal('uid'));
    if (getQueryUrlVal('uid') === 'null') {
      // 从项目选择
      const { siteDetail } = this.props.SiteLibrary;
      this.init(siteDetail);
    } else {
      dispatch({
        type: 'SiteLibrary/siteDetailModel',
        payload: { gongdiUid: getQueryUrlVal('uid') },
      }).then(res => {
        if (res && res.code === 200) {
          this.init(res.data);
        }
      });
    }
  }

  render() {
    const { uploadVisible, coverImg, disabled, show, tags } = this.state;
    const { getFieldDecorator } = this.props.form;
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
    const {
      DictConfig: { dicData },
      SiteLibrary: { siteDetail },
    } = this.props;
    console.log(siteDetail);
    const limitDecimals = value => {
      const reg = /^(\-)*(\d+)\.(\d\d).*$/;
      if (typeof value === 'string') {
        return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
      } else if (typeof value === 'number') {
        return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
      } else {
        return '';
      }
    };
    return (
      <div>
        <PageHeaderWrapper>
          <Card bordered={false}>
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <h4 className={styles.title}>基本信息</h4>
              <Form.Item
                label={
                  <span>
                    工地标题
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
                {getFieldDecorator('gongdiTitle', {
                  initialValue: siteDetail.gongdiTitle,
                  rules: [
                    {
                      required: true,
                      message: '请输入工地标题',
                    },
                    {
                      max: 30,
                      message: '限制1-30字符长度',
                    },
                  ],
                })(<Input style={{ width: 400 }} placeholder="请输入工地标题" />)}
              </Form.Item>
              <Form.Item label="楼盘/楼宇名称">
                {getFieldDecorator('buildingName', {
                  initialValue: siteDetail.buildingName,
                  rules: [
                    {
                      required: true,
                      message: '请输入楼盘/楼宇名称',
                    },
                    {
                      max: 30,
                      message: '限制1-30字符长度',
                    },
                  ],
                })(<Input style={{ width: 400 }} placeholder="请输入楼盘/楼宇名称" />)}
              </Form.Item>
              <Form.Item label="面积">
                {getFieldDecorator('buildingArea', {
                  initialValue: siteDetail.buildingArea,
                  rules: [
                    {
                      required: true,
                      message: '请输入面积，单位m²',
                    },
                  ],
                })(
                  <InputNumber
                    formatter={limitDecimals}
                    parser={limitDecimals}
                    style={{ width: 400 }}
                    placeholder="请输入面积，单位m²"
                  />
                )}
              </Form.Item>
              <Form.Item label="选择户型">
                {getFieldDecorator('houseType', {
                  initialValue: siteDetail.houseType,
                  rules: [],
                })(
                  <div>
                    {[
                      { name: ' 室 ', value: 'bedroom' },
                      { name: ' 厅 ', value: 'parlor' },
                      { name: ' 厨 ', value: 'kitchen' },
                      { name: ' 卫 ', value: 'toilet' },
                    ].map((item, i) => {
                      return (
                        <span key={i}>
                          <Select
                            defaultValue={0}
                            value={this.state[item.value]}
                            style={{ width: 80 }}
                            onChange={value => this.setState({ [item.value]: value })}
                          >
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => {
                              return (
                                <Option value={v} key={v}>
                                  {v}
                                </Option>
                              );
                            })}
                          </Select>
                          {item.name}
                        </span>
                      );
                    })}
                  </div>
                )}
              </Form.Item>
              <Form.Item label="装修造价">
                {getFieldDecorator('renovationCosts', {
                  initialValue: siteDetail.renovationCosts,
                  rules: [
                    {
                      required: true,
                      message: '请输入装修造价',
                    },
                  ],
                })(
                  <InputNumber
                    formatter={limitDecimals}
                    parser={limitDecimals}
                    style={{ width: 400 }}
                    placeholder="请输入装修造价"
                    className="depFormInputAfter"
                  />
                )}
              </Form.Item>
              <Form.Item label="选择风格">
                {getFieldDecorator('houseStyle', {
                  initialValue: siteDetail.houseStyle || [],
                  rules: [{ required: true, message: '请选择风格' }],
                })(
                  <Select style={{ width: 400 }} placeholder="请选择风格">
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
                      if (siteDetail.houseStyle && [siteDetail.houseStyle].includes(item.code)) {
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
              <Form.Item label="封面图">
                {getFieldDecorator('coverImg', {
                  initialValue: siteDetail.coverImg,
                  rules: [{ required: false, message: '请上传封面图' }],
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
              <h4 className={styles.title}>TDK设置（用于搜索引擎收录）</h4>
              <Form.Item
                label={
                  <span>
                    关键词
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
                {getFieldDecorator('headKeywords', {})(
                  <div>
                    {show && <TagGroup tags={tags} handleSave={tags => this.handleTagSave(tags)} />}
                  </div>
                )}
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    工地说明
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
                {getFieldDecorator('gongdiDescription', {
                  initialValue: siteDetail.gongdiDescription,
                  rules: [
                    {
                      max: 200,
                      message: '限制0-200字符长度',
                    },
                  ],
                })(<TextArea rows={4} style={{ width: 400 }} placeholder="请输入工地说明" />)}
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
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) throw err;
      console.log(values);
      const { coverImg, bedroom, parlor, kitchen, toilet, tags } = this.state;
      const { dispatch } = this.props;
      if (parseFloat(values.buildingArea) < 0.01 || parseFloat(values.buildingArea) > 99999.99) {
        message.error('面积限制输入0.01-99999.99范围内的数字');
        return false;
      } else if (
        parseFloat(values.renovationCosts) < 0.01 ||
        parseFloat(values.renovationCosts) > 99999.99
      ) {
        message.error('装修造价限制输入0.01-99999.99范围内的数字');
        return false;
      } else {
        let obj = {};
        const { siteDetail } = this.props.SiteLibrary;
        obj.projectUid = siteDetail.projectUid;
        dispatch({
          type: 'SiteLibrary/modifySiteModel',
          payload: {
            ...values,
            // coverImg: (coverImg && coverImg[0].response.data.addr) || '',
            houseType: { bedroom, parlor, kitchen, toilet },
            gongdiUid: getQueryUrlVal('uid') === 'null' ? null : getQueryUrlVal('uid'),
            ...obj,
            headKeywords: tags,
          },
        }).then(res => {
          if (res && res.code === 200) {
            message.success('编辑成功');
            history.go(-1);
          }
          // this.setState({ submitLoading: false });
          // if (res && res.code === 200) {
          //   // 清空缓存内容
          //   this.clearCache();
          //   // 跳转到详情页
          //   router.push(`/project/info/projectinformation?uid=${res.data.uid}`);
          // }
        });
      }
    });
  };

  // 图片选择cance
  handleUploadCancel = () => {
    this.setState({ uploadVisible: false, record: null });
  };
  // 图片选择
  handleUploadOk = data => {
    console.log(data);
    this.setState({ coverImg: data[0].path });
    this.props.form.setFieldsValue({
      coverImg: data[0].path,
    });
    this.handleUploadCancel();
  };

  init = data => {
    this.setState(
      {
        bedroom: data.houseType?.bedroom || 0,
        parlor: data.houseType?.parlor || 0,
        kitchen: data.houseType?.kitchen || 0,
        toilet: data.houseType?.toilet || 0,
        coverImg: data.coverImg,
        tags: data.headKeywords || [],
      },
      () => {
        this.setState({ show: true });
      }
    );
  };

  // 关键词
  handleTagSave = tags => {
    this.setState({ tags });
  };
}

export default SiteLibraryAdd;
