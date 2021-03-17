/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-16 15:29:22
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, Input, message, Select, Row, Col, InputNumber, Icon } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Upload from '@/components/Upload/Upload';
import styles from './SiteLibrary.less';
import RcViewer from 'rc-viewer';
const { TextArea } = Input;
const { Option } = Select;

@connect(({ DictConfig, loading }) => ({
  DictConfig,
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
    };
  }

  componentDidMount() {
    // 获取字典数据 queryDicModel
    const { dispatch } = this.props;
    dispatch({
      type: 'DictConfig/queryDicModel',
      payload: { dicModuleCodes: 'DM002' },
    });
  }

  render() {
    const { status, uploadVisible, coverImg } = this.state;
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
    } = this.props;
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
              <Form.Item label="工地标题">
                {getFieldDecorator('gongdiTitle', {
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
                  rules: [
                    {
                      required: true,
                      message: '请输入装修造价',
                    },
                  ],
                })(
                  <div className="depFormInput">
                    <InputNumber
                      formatter={limitDecimals}
                      parser={limitDecimals}
                      style={{ width: 400 }}
                      placeholder="请输入装修造价"
                    />
                    <span> 万元</span>
                  </div>
                )}
              </Form.Item>
              <Form.Item label="选择风格">
                {getFieldDecorator('houseStyle', {
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
                  </Select>
                )}
              </Form.Item>

              <Form.Item label="封面图">
                {getFieldDecorator('coverImg', {
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
              <Form.Item label="工地说明">
                {getFieldDecorator('gongdiDescription', {
                  rules: [ {
                    max: 200,
                    message: '限制0-200字符长度',
                  }],
                })(<TextArea rows={4} style={{ width: 400 }} placeholder="请输入案例说明" />)}
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
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) throw err;
      console.log(values);
      const { coverImg, bedroom, parlor, kitchen, toilet } = this.state;
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
        dispatch({
          type: 'SiteLibrary/createSiteModel',
          payload: {
            ...values,
            // coverImg: (coverImg && coverImg[0].response.data.addr) || '',
            houseType: { bedroom, parlor, kitchen, toilet },
          },
        }).then(res => {
          if (res && res.code === 200) {
            message.success('创建成功');
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
}

export default SiteLibraryAdd;
