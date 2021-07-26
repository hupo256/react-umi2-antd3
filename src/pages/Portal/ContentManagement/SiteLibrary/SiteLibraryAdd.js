/*
 * @Author: zqm
 * @Date: 2021-02-17 17:03:48
 * @Last Modified by: zqm
 * @Last Modified time: 2021-06-08 14:12:15
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
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
  Tooltip,
  Divider,
  Steps,
  Result,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TagGroup from '@/components/TagSelect/TagGroup';
import MapModal from '@/components/MapModal';
import Upload from '@/components/Upload/Upload';
import { getQueryUrlVal } from '@/utils/utils';
import styles from './SiteLibrary.less';
import RcViewer from 'rc-viewer';
import RelateNode from './RelateNode';
import { router } from 'umi';
const { TextArea } = Input;
const { Option } = Select;

@connect(({ DictConfig, loading, SiteLibrary }) => ({
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
      tags: [],
      addr: '',
      isaAddr: true,
      isaAddrs: false,
      mapVisible: false,
      cityName: '',
      lat: '',
      lng: '',
      open: false,
      name: '',
      isMap: false,
      step: 0,
      relateNodeModalVisible: false,
      gongdiTitle: '',
      buildingName: '',
      defaultData: {},
    };
  }

  componentDidMount() {
    const isMap = getQueryUrlVal('isMap');
    const isFromProject = getQueryUrlVal('projectUid');

    this.setState({ isMap }, () => {
      console.log(this.state.isMap);
    });
    // 获取字典数据 queryDicModel
    const { dispatch } = this.props;
    if (isFromProject) {
      dispatch({
        type: 'SiteLibrary/getProjectDetailModel',
        payload: { uid: isFromProject },
      }).then(r => {
        if (r && r.code === 200) {
          this.setState({
            defaultData: r.data,
            addr: r.data.addr,
            // isaAddr: false,
            lat: r.data.lat,
            lng: r.data.lng,
            coverImg: r.data.defaultImage || null,
          });
        }
      });
    }
    dispatch({
      type: 'DictConfig/queryDicModel',
      payload: { dicModuleCodes: isMap === '1' ? 'DM001,DM002,DM007' : 'DM002,DM007' },
    });
  }

  render() {
    const {
      status,
      uploadVisible,
      coverImg,
      tags,
      mapVisible,
      cityName,
      isMap,
      step,
      relateNodeModalVisible,
      gongdiTitle,
      buildingName,
      defaultData,
    } = this.state;
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

    const selectBefore = getFieldDecorator('prefix', {
      initialValue: '',
    })(
      <Select style={{ width: 180 }}>
        <Option value="" disabled>
          请选择
        </Option>
        <Option value="https://vr.realsee.cn/vr/">https://vr.realsee.cn/vr/</Option>
      </Select>
    );
    const isFromProject = getQueryUrlVal('projectUid');
    return (
      <div>
        <PageHeaderWrapper>
          <Card bordered={false}>
            {isMap === '1' && (
              <Steps current={step} style={{ width: 800, margin: '30px auto 50px' }}>
                <Steps.Step title="完善基本信息" />
                <Steps.Step title="关联工程节点" />
                <Steps.Step title="完成" />
              </Steps>
            )}
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <div hidden={isMap === '1' && step !== 0}>
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
                    initialValue: isFromProject ? defaultData.projectName : '',
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
                  {getFieldDecorator('buildingCode', {
                    initialValue: '',
                    rules: [{ required: true, message: '请输入楼盘/楼宇名称' }],
                  })(
                    <Select
                      style={{ width: 400 }}
                      placeholder="请输入楼盘/楼宇名称"
                      onDropdownVisibleChange={this.onDropdownVisibleChange}
                      open={this.state.open}
                      showSearch
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      dropdownRender={menu => {
                        return (
                          <div>
                            {menu}
                            <Divider style={{ margin: '4px 0' }} />
                            <div
                              style={{ padding: '4px 8px', cursor: 'pointer' }}
                              onMouseDown={this.lockClose}
                              onMouseUp={this.lockClose}
                            >
                              <Input
                                value={this.state.name}
                                onChange={e => {
                                  this.setState({ name: e.target.value });
                                }}
                                placeholder="请输入选项"
                                style={{ width: '70%', marginBottom: 6 }}
                              />
                              <span
                                style={{ color: '#fe6a30', marginLeft: 10 }}
                                onClick={() => this.handleAddDic()}
                              >
                                <Icon type="plus-circle" />
                                添加选项
                              </span>
                            </div>
                          </div>
                        );
                      }}
                    >
                      {dicData &&
                        dicData['DM007'] &&
                        dicData['DM007'].map(item => {
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
                <Form.Item label={this.star('工地地址')}>
                  {this.state.isaAddr ? (
                    <div className={styles.pointwrap}>
                      <TextArea
                        placeholder="请选择具体位置"
                        name="addr"
                        style={{ paddingRight: 24 }}
                        rows={2}
                        maxLength={100}
                        onClick={this.addPoint}
                      />
                      <span className={styles.poit} onClick={this.addPoint}>
                        <Icon type="environment" theme="filled" />
                      </span>
                    </div>
                  ) : (
                    <div className={styles.pointwrap}>
                      <TextArea
                        placeholder="请选择具体位置"
                        name="addr"
                        value={this.state.addr}
                        disabled={this.state.isaAddrs}
                        onChange={this.handleAddrChange}
                        onBlur={this.handleAddrBlur}
                        style={{ paddingRight: 24 }}
                        rows={2}
                        maxLength={100}
                      />
                      <span className={styles.poit} onClick={this.addPoint}>
                        <Icon type="environment" theme="filled" />
                      </span>
                    </div>
                  )}
                </Form.Item>
                <Form.Item label="面积">
                  {getFieldDecorator('buildingArea', {
                    initialValue: isFromProject ? defaultData.buildArea : '',
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
                      {console.log(dicData)}
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
                <Form.Item label="VR链接">
                  {getFieldDecorator('vrLink', {
                    rules: [
                      {
                        max: 200,
                        message: '最多可输入200位字符!',
                      },
                      {
                        whitespace: true,
                        message: '不可含有空格！',
                      },
                    ],
                  })(
                    <Input
                      addonBefore={selectBefore}
                      style={{ width: 400 }}
                      placeholder="请输入链接后缀"
                    />
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
                  {getFieldDecorator('headKeywords', {
                    initialValue: null,
                    rules: [],
                  })(<TagGroup tags={tags} handleSave={tags => this.handleTagSave(tags)} />)}
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
                    rules: [
                      {
                        max: 200,
                        message: '限制0-200字符长度',
                      },
                    ],
                  })(<TextArea rows={4} style={{ width: 400 }} placeholder="请输入工地说明" />)}
                </Form.Item>
              </div>
              {relateNodeModalVisible && (
                <div hidden={step !== 1}>
                  <RelateNode type="add" projectUid={getQueryUrlVal('projectUid')} />
                </div>
              )}
              {step === 2 && (
                <Result
                  status="success"
                  title="创建成功"
                  subTitle={
                    <div>
                      快去你的站点看看吧
                      <Card
                        bordered={false}
                        style={{ background: '#f9f9f9', width: 600, margin: '10px auto 0' }}
                      >
                        <div style={{ width: 300, margin: '0 auto', textAlign: 'left' }}>
                          <span style={{ display: 'inline-block', width: 100, textAlign: 'right' }}>
                            工地标题：
                          </span>
                          {gongdiTitle}
                          <br />
                          <span style={{ display: 'inline-block', width: 100, textAlign: 'right' }}>
                            楼盘/楼宇：
                          </span>
                          {buildingName}
                        </div>
                      </Card>
                    </div>
                  }
                  extra={[
                    <Button
                      key={'gongdi'}
                      onClick={() => {
                        router.push(`/portal/contentmanagement/sitelibrary`);
                      }}
                    >
                      返回工地库
                    </Button>,
                  ]}
                />
              )}
              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  {isMap === '1' ? (
                    <>
                      {step === 0 && (
                        <Button
                          onClick={() => {
                            this.handleNext();
                          }}
                        >
                          下一步
                        </Button>
                      )}
                      {step === 1 && (
                        <>
                          <Button type="primary" htmlType="submit">
                            提交
                          </Button>
                          &nbsp;&nbsp;
                          <Button
                            onClick={() => {
                              this.setState({ step: 0 });
                            }}
                          >
                            上一步
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <Button type="primary" htmlType="submit">
                      提交
                    </Button>
                  )}
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
        {mapVisible && (
          <MapModal
            visible={mapVisible}
            cityName={cityName}
            handleCity={name => {
              this.handleCity(name);
            }}
            handleAddPoint={data => {
              this.handleAddPoint(data);
            }}
            handleCancel={this.handleCancelMap}
          />
        )}
      </div>
    );
  }
  //取消工地地址选择
  handleCancelMap = () => {
    this.setState({
      mapVisible: false,
      cityName: '',
    });
  };
  lockClose = e => {
    clearTimeout(this.lock);
    this.lock = setTimeout(() => {
      this.lock = null;
    }, 100);
  };
  onDropdownVisibleChange = open => {
    if (this.lock) return;
    this.setState({ open });
  };
  // 添加字典
  handleAddDic = () => {
    const that = this;
    const { name } = this.state;
    const { dispatch } = this.props;
    if (!name) {
      message.warning('请输入楼盘/楼宇名称');
      return false;
    } else if (name && name.trim().length === 0) {
      message.warning('请输入楼盘/楼宇名称');
      return false;
    } else if (name && name.length > 20) {
      message.warning('最多输入20位字符');
      return false;
    } else {
      dispatch({
        type: 'DictConfig/createDicModel',
        payload: { name, dicModuleCode: 'DM007' },
      }).then(res => {
        if (res && res.code === 200) {
          dispatch({
            type: 'DictConfig/queryDicModel',
            payload: { dicModuleCodes: 'DM002,DM007' },
          }).then(r => {
            if (r && r.code === 200) {
              that.props.form.setFieldsValue({
                buildingCode: res.data.code,
              });
            }
          });
          this.setState({ open: false, name: null });
        }
      });
    }
  };

  handleAddrChange = e => {
    if (e.target.value.length > 100) {
      message.error('最多可输入100位字符');
    } else {
      this.setState({ addr: e.target.value });
    }
  };

  handleAddrBlur = e => {
    const { addr } = this.state;
    if (addr === '') {
      this.setState({
        lat: '',
        lng: '',
        cityName: '',
        isaAddr: true,
      });
    } else {
      this.setState({
        isaAddrs: true,
      });
    }
  };
  addPoint = () => {
    //实例化城市查询类
    const { cityName } = this.state;
    if (cityName === '') {
      const _that = this;
      let citysearch = new AMap.CitySearch();
      //自动获取用户IP，返回当前城市
      citysearch.getLocalCity(function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.city && result.bounds) {
            var cityinfo = result.city;
            _that.setState({
              mapVisible: true,
              cityName: cityinfo,
            });
          }
        }
      });
    } else {
      this.setState({
        mapVisible: true,
      });
    }
  };
  // 城市选择
  handleCity = name => {
    this.setState({
      cityName: name,
    });
  };

  // 工地地址选择
  handleAddPoint = data => {
    this.setState({
      mapVisible: false,
      addr: data.addressCont,
      lat: data.lat,
      lng: data.lng,
      cityName: '',
      isaAddr: false,
      isaAddrs: false,
    });
  };

  star(txt) {
    return (
      <span>
        <b
          style={{
            display: 'inline-block',
            marginRight: ' 4px',
            content: '*',
            fontFamily: ' SimSun',
            lineHeight: 1,
            fontSize: '14px',
            color: '#f5222d',
            fontWeight: 'normal',
          }}
        >
          *
        </b>
        {txt}
      </span>
    );
  }

  handleNext = () => {
    const {
      DictConfig: { dicData },
      form,
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) throw err;
      // 取消前后空格
      values.vrLink = values.vrLink?.trim();

      if (!!!values.vrLink) {
        this.props.form.setFieldsValue({
          prefix: '',
        });
      }
      const { coverImg, bedroom, parlor, kitchen, toilet, tags, addr, lat, lng } = this.state;
      if (!addr) {
        message.error('请输入详细地址');
        return false;
      }
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
        let { prefix, ...copyValues } = values;
        const payload = {
          ...copyValues,

          buildingName: dicData['DM007'].find(e => e.code === copyValues.buildingCode).name,
          // coverImg: (coverImg && coverImg[0].response.data.addr) || '',
          houseType: { bedroom, parlor, kitchen, toilet },
          headKeywords: tags,
          vrLink: !!!copyValues.vrLink || !!!prefix ? '' : prefix + copyValues.vrLink,
          addr,
          lat,
          lng,
          gongdiFromType: 0,
        };
        this.setState({ step: 1, relateNodeModalVisible: true });
      }
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    const {
      DictConfig: { dicData },
      form,
      dispatch,
      SiteLibrary: { engineeringMapData },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) throw err;

      // 取消前后空格
      values.vrLink = values.vrLink?.trim();

      if (!!!values.vrLink) {
        this.props.form.setFieldsValue({
          prefix: '',
        });
      }
      const {
        coverImg,
        bedroom,
        parlor,
        kitchen,
        toilet,
        tags,
        addr,
        lat,
        lng,
        isMap,
      } = this.state;
      if (!addr) {
        message.error('请输入详细地址');
        return false;
      }
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
        let { prefix, ...copyValues } = values;
        const engineeringMaps = [];
        engineeringMapData.map(e => {
          const item = {
            dicCode: e.dicCode,
            dicName: e.dicName,
            taskNames: [],
          };
          e.taskNodes.map(i => {
            item.taskNames.push(i.taskName);
          });
          engineeringMaps.push(item);
        });
        const buildingName = dicData['DM007'].find(e => e.code === copyValues.buildingCode).name;
        const projectUid = getQueryUrlVal('projectUid');

        const payload = {
          ...copyValues,
          buildingName,
          // coverImg: (coverImg && coverImg[0].response.data.addr) || '',
          houseType: { bedroom, parlor, kitchen, toilet },
          headKeywords: tags,
          vrLink: !copyValues.vrLink || !prefix ? '' : prefix + copyValues.vrLink,
          addr,
          lat,
          lng,
          gongdiFromType: projectUid ? 1 : 0,
        };
        if (isMap === '1') {
          payload.engineeringMaps = engineeringMaps;
        }
        if (projectUid) {
          payload.projectUid = projectUid;
        }

        dispatch({
          type: 'SiteLibrary/createSiteModel',
          payload,
        }).then(res => {
          if (res && res.code === 200) {
            message.success('创建成功');
            if (isMap !== '1') {
              history.go(-1);
            }
            this.setState({
              step: 2,
              relateNodeModalVisible: false,
              gongdiTitle: copyValues.gongdiTitle,
              buildingName,
              addr: '',
              isaAddr: true,
            });
            form.resetFields();
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

  // 关键词
  handleTagSave = tags => {
    this.setState({ tags });
  };
}

export default SiteLibraryAdd;
