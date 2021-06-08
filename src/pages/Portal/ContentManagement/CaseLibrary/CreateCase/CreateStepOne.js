/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-06-08 14:11:28
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Form,
  Button,
  Icon,
  Input,
  message,
  Steps,
  Divider,
  Select,
  Row,
  Col,
  Tooltip,
  InputNumber,
} from 'antd';
import { getQueryUrlVal } from '@/utils/utils';
import TagGroup from '@/components/TagSelect/TagGroup';
import styles from '../CaseLibrary.less';
const { TextArea } = Input;
const { Option } = Select;

@connect(({ DesignerLibrary, CaseLibrary, DictConfig, loading }) => ({
  CaseLibrary,
  DictConfig,
  DesignerLibrary,
}))
@Form.create()
class CreateStepOne extends PureComponent {
  lock = null;
  state = {
    status: null,
    bedroom: 0,
    liveroom: 0,
    kitchen: 0,
    bathroom: 0,
    name: null,
    disabled: [],
    designerUid: [],
    designerList: [],
    disabledDesigner: '',
    tags: [],
    show: false,
  };

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
    const { stepOne } = this.props.CaseLibrary;
    ['bedroom', 'liveroom', 'kitchen', 'bathroom'].forEach(item => {
      this.setState({ [item]: (stepOne && stepOne[item]) || 0 });
    });
    this.setState(
      {
        designerUid: stepOne.designerUid,
        tags: stepOne?.keywords || [],
      },
      () => {
        this.setState({ show: true });
      }
    );
    dispatch({
      type: 'DesignerLibrary/queryDesignerListModel',
      payload: { pageNum: -1 },
    }).then(res => {
      if (res && res.code === 200) {
        const designerList = res.data.list.filter(
          items => items.uid === stepOne.designerUid || items.status === '1'
        );
        const disabledDesigner = designerList.filter(item => item.uid === stepOne.designerUid);
        this.setState({
          designerList,
          disabledDesigner: (disabledDesigner.length > 0 && disabledDesigner[0].uid) || '',
        });
      }
    });
  }

  render() {
    const {
      status,
      name,
      disabled,
      designerUid,
      designerList,
      disabledDesigner,
      show,
      tags,
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
      CaseLibrary: { stepOne },
      DesignerLibrary: { DesignerList },
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
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <h4 className={styles.title}>基本信息</h4>
          <Form.Item
            label={
              <span>
                案例标题
                {'  '}
                <Tooltip placement="right" title="业主有可能通过您输入的关键词，搜索到您的网站哦！">
                  <Icon type="question-circle" />
                </Tooltip>
                {'  '}
              </span>
            }
          >
            {getFieldDecorator('title', {
              initialValue: stepOne.title || '',
              rules: [
                {
                  required: true,
                  message: '请输入案例标题',
                },
                {
                  max: 30,
                  message: '限制1-30字符长度',
                },
              ],
            })(<Input style={{ width: 400 }} placeholder="请输入案例标题" />)}
          </Form.Item>
          <Form.Item label="楼盘/楼宇名称">
            {getFieldDecorator('buildingName', {
              initialValue: stepOne.buildingName || '',
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
          <Form.Item label="设计师">
            {getFieldDecorator('designerUid', {
              initialValue: designerUid || [],
              rules: [{ required: true, message: '请选择设计师' }],
            })(
              <Select
                style={{ width: 400 }}
                placeholder="请选择设计师"
                showSearch
                onChange={this.handleChange}
                filterOption={(input, option) => {
                  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
              >
                {designerList.map(item => {
                  return (
                    <Option
                      value={item.uid}
                      key={item.uid}
                      disabled={item.uid === disabledDesigner}
                    >
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="面积">
            {getFieldDecorator('acreage', {
              initialValue: stepOne.acreage || null,
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
                  { name: ' 厅 ', value: 'liveroom' },
                  { name: ' 厨 ', value: 'kitchen' },
                  { name: ' 卫 ', value: 'bathroom' },
                ].map((item, i) => {
                  return (
                    <span key={i}>
                      <Select
                        defaultValue={0}
                        value={this.state[item.value] || 0}
                        style={{ width: 80 }}
                        onChange={value => this.handleHouseTypeSelect(value, item.value)}
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
          <Form.Item label="选择风格">
            {getFieldDecorator('styleDicCode', {
              initialValue: stepOne.styleDicCode || [],
              rules: [{ required: true, message: '请选择风格' }],
            })(
              <Select
                style={{ width: 400 }}
                placeholder="请选择风格"
                onDropdownVisibleChange={this.onDropdownVisibleChange}
                open={this.state.open}
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
                  if (stepOne.styleDicCode && [stepOne.styleDicCode].includes(item.code)) {
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
          <Form.Item label="装修造价">
            {getFieldDecorator('decorationCost', {
              initialValue: stepOne.decorationCost || null,
              rules: [
                {
                  required: true,
                  message: '请输入装修造价',
                },
              ],
            })(
              <InputNumber
                className="depFormInputAfter"
                formatter={limitDecimals}
                parser={limitDecimals}
                style={{ width: 400 }}
                placeholder="请输入装修造价（万元）"
              />
            )}
          </Form.Item>
          <h4 className={styles.title}>TDK设置（用于搜索引擎收录）</h4>
          <Form.Item
            label={
              <span>
                关键词
                {'  '}
                <Tooltip placement="right" title="业主有可能通过您输入的关键词，搜索到您的网站哦！">
                  <Icon type="question-circle" />
                </Tooltip>
                {'  '}
              </span>
            }
          >
            {getFieldDecorator('keywords', {})(
              <div>
                {show && <TagGroup tags={tags} handleSave={tags => this.handleTagSave(tags)} />}
              </div>
            )}
          </Form.Item>
          <Form.Item
            label={
              <span>
                案例说明
                {'  '}
                <Tooltip placement="right" title="业主有可能通过您输入的关键词，搜索到您的网站哦！">
                  <Icon type="question-circle" />
                </Tooltip>
                {'  '}
              </span>
            }
          >
            {getFieldDecorator('caseDesc', {
              initialValue: stepOne.caseDesc || '',
              rules: [
                {
                  max: 1000,
                  message: '最多可输入1000位字符!',
                },
              ],
            })(<TextArea rows={4} style={{ width: 400 }} placeholder="请输入案例说明" />)}
          </Form.Item>
          <Row>
            <Col span={8} />
            <Col span={16}>
              {this.props.type === 'edit' ? (
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              ) : (
                <Button type="primary" htmlType="submit">
                  下一步
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
  handleChange = value => {
    this.setState({ designerUid: value });
    this.props.form.setFieldsValue({
      designerUid: value,
    });
  };
  handleHouseTypeSelect = (value, name) => {
    this.setState({ [name]: value });
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
    const { name } = this.state;
    const { dispatch } = this.props;
    if (!name) {
      message.warning('请输入风格名称');
      return false;
    } else if (name && name.trim().length == 0) {
      message.warning('请输入风格名称');
      return false;
    } else if (name && name.length > 20) {
      message.warning('最多输入20位字符');
      return false;
    } else {
      dispatch({
        type: 'DictConfig/createDicModel',
        payload: { name, dicModuleCode: 'DM002' },
      }).then(res => {
        if (res && res.code === 200) {
          dispatch({
            type: 'DictConfig/queryDicModel',
            payload: { dicModuleCodes: 'DM002' },
          });
          this.props.form.setFieldsValue({
            styleDicCode: res.data.code,
          });
          this.setState({ open: false, name: null });
        }
      });
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) throw err;
      console.log(values);
      const { bedroom, liveroom, kitchen, bathroom, tags } = this.state;
      const { dispatch } = this.props;
      if (parseFloat(values.acreage) < 0.01 || parseFloat(values.acreage) > 99999.99) {
        message.error('面积限制输入0.01-99999.99范围内的数字');
        return false;
      } else if (
        parseFloat(values.decorationCost) < 0.01 ||
        parseFloat(values.decorationCost) > 99999.99
      ) {
        message.error('装修造价限制输入0.01-99999.99范围内的数字');
        return false;
      } else {
        if (this.props.type === 'edit') {
          //
          dispatch({
            type: 'CaseLibrary/editCaseModel',
            payload: {
              ...values,
              bedroom,
              liveroom,
              kitchen,
              bathroom,
              uid: getQueryUrlVal('uid'),
              keywords: JSON.stringify(tags || []),
            },
          }).then(res => {
            if (res && res.code === 200) {
              message.success('保存成功');
            }
          });
        } else {
          dispatch({
            type: 'CaseLibrary/setStepOneModel',
            payload: {
              stepOne: {
                ...values,
                bedroom,
                liveroom,
                kitchen,
                bathroom,
                keywords: JSON.stringify(tags || []),
              },
            },
          }).then(res => {
            this.props.handleOk();
          });
        }
      }
    });
  };

  // 关键词
  handleTagSave = tags => {
    this.setState({ tags });
  };
}

export default CreateStepOne;
