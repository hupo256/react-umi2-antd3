/*
 * @Author: pengyc 
 * @Date: 2020-02-28 14:28:21 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-04-08 15:09:28
 * 线索， 项目。 客户。 共用 添加/编辑日志
 * 公用组件，难公用，接口差异化
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import {
  Form,
  Input,
  Button,
  Spin,
  Upload,
  Icon,
  message,
  DatePicker,
  Radio,
  Mentions,
  Select,
} from 'antd';
import styles from './index.less';
import { GetUploadedData } from '@/utils/utils';
import moment from 'moment';
import CarouselPic from '@/components/CarouselPic';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect(({ base, customerNew, customer, loading }) => ({
  base,
  customer,
  customerNew,
  loading1: loading.effects['customer/getLogInfoModel'], // 项目 线索
  loading2: loading.effects['customerNew/clientVisitGetLogModel'], //客户
}))
@Form.create()
class AddLog extends Component {
  state = {
    status: '',
    uploadFileList: [],
    uploadImgList: [],
    visit_time: undefined,
    visit_type: '1',
    loaded: false,
    CarouselPicVisible: false,
    imgList: [],
    initialSlide: '',
    selectUser: [],
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'base/query',
      payload: {
        type: 'clue_active_rejection,clue_passive_rejection,crmState',
        url: 'crms',
      },
    });
    this.handleCDMData(this.props);
    // 获取所有人员
    const { loginfo } = this.props;
    const contentCode = (loginfo && loginfo.remind_user) || [];
    this.setState({ selectUser: contentCode });
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.loginfo, prevProps.loginfo)) {
      this.handleCDMData(this.props);
    }
  }

  render() {
    const { uploadFileList, uploadImgList, visit_time, visit_type, loaded, status } = this.state;
    const {
      form: { getFieldDecorator },
      base: { basedata, picData, personnels },
      loginfo,
      uploadType,
      loading1,
      loading2,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const contentText = loginfo ? loginfo.log_content || loginfo.content : undefined;
    let logType = uploadType.log_type; //是否为线索
    let logStatus = this.props.form.getFieldValue('status') || status;
    let logRefuse = this.props.form.getFieldValue('refuse_reason');
    let loading = false;
    if (uploadType.type !== 'add') {
      if (loading1 || loading2) {
        loading = true;
      }
    }

    return (
      <div className={styles.AddLog}>
        <Spin spinning={loaded || loading}>
          <Form onSubmit={this.handleSubmit}>
            {//线索日志有状态
            logType == 'L001' && (
              <FormItem {...formItemLayout} label="状态">
                {getFieldDecorator('status', {
                  initialValue: status || 'S000', //默认为当前线索状态 没有就是未沟通
                  rules: [{ required: true, message: '请选择状态' }],
                })(
                  <Select
                    placeholder="选择状态"
                    onChange={this.statusFn}
                    disabled={status == 'S002' || loginfo ? true : false}
                  >
                    {basedata.crmState &&
                      basedata.crmState.map(v => {
                        return (
                          <Option value={v.code} key={v.code}>
                            {' '}
                            {v.name}{' '}
                          </Option>
                        );
                      })}
                  </Select>
                )}
              </FormItem>
            )}
            {(logType == 'L001' && logStatus == 'S004') ||
            (logType == 'L001' && logStatus == 'S005') ? ( //线索 且为主动拒绝或被拒绝
              <FormItem {...formItemLayout} label="拒绝原因">
                {getFieldDecorator('refuse_reason', {
                  initialValue: (loginfo && loginfo.refuse_reason) || undefined,
                  rules: [{ required: true, message: '请选择拒绝原因' }],
                })(
                  <Select
                    placeholder="选择拒绝原因"
                    onChange={value => this.refuseReasonFn(value, logStatus)}
                    disabled={loginfo ? true : false}
                  >
                    {logStatus == 'S004'
                      ? basedata.clue_active_rejection &&
                        basedata.clue_active_rejection.map(v => {
                          return (
                            <Option value={v.code} key={v.code}>
                              {' '}
                              {v.name}{' '}
                            </Option>
                          );
                        })
                      : basedata.clue_passive_rejection &&
                        basedata.clue_passive_rejection.map(v => {
                          return (
                            <Option value={v.code} key={v.code}>
                              {' '}
                              {v.name}{' '}
                            </Option>
                          );
                        })}
                  </Select>
                )}
              </FormItem>
            ) : null}
            {(logType == 'L001' && logRefuse == 'CAR_009') ||
            (logType == 'L001' && logRefuse == 'CPR_011') ? ( //线索 且拒绝原因为其他
              <FormItem {...submitFormLayout} label="">
                {getFieldDecorator('other_rejection_desc', {
                  initialValue: (loginfo && loginfo.other_rejection_desc) || '',
                  rules: [
                    { required: true, message: '拒绝原因为其他请填写原因' },
                    { max: 500, message: '字符长度不可超过500!' },
                  ],
                })(
                  //<Input placeholder='请填写拒绝原因' onBlur={this.otherRejectionDescFn} />
                  <Mentions
                    rows="3"
                    placeholder="请填写拒绝原因"
                    onSelect={this.handleSelect}
                    onBlur={this.otherRejectionDescFn}
                  >
                    {personnels &&
                      personnels.list &&
                      personnels.list.map(item => {
                        return (
                          <Option value={item.real_name} code={item.user_code} key={item.uid}>
                            {item.real_name}
                          </Option>
                        );
                      })}
                  </Mentions>
                )}
              </FormItem>
            ) : null}
            <FormItem {...formItemLayout} label="日志内容">
              {getFieldDecorator('log_content', {
                rules: [
                  {
                    required: true,
                    message: '请输入日志内容',
                  },
                  {
                    max: 500,
                    message: '字符长度不可超过500!',
                  },
                ],
                initialValue: contentText,
              })(
                <Mentions rows="3" placeholder="请输入日志内容" onSelect={this.handleSelect}>
                  {personnels &&
                    personnels.list &&
                    personnels.list.map(item => {
                      return (
                        <Option value={item.real_name} code={item.user_code} key={item.uid}>
                          {item.real_name}
                        </Option>
                      );
                    })}
                </Mentions>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="图片">
              <Upload
                action={picData && picData.host}
                listType="picture-card"
                accept="image/gif, image/jpeg, image/png"
                data={picData}
                fileList={uploadImgList}
                beforeUpload={(file, filelist) =>
                  this.beforeUpload(file, filelist, uploadType.imgNum)
                }
                onPreview={(...arg) => this.handlePreview(...arg)}
                onRemove={arg => this.fileRemove(arg, 'uploadImgList')}
                onChange={arg => this.handleUpload(arg, 'uploadImgList')}
                multiple={true}
              >
                <div>
                  <Icon type="plus" />
                </div>
              </Upload>
            </FormItem>
            <FormItem {...formItemLayout} label="附件">
              <Upload
                action={picData && picData.host}
                showUploadList={true}
                data={picData}
                fileList={uploadFileList}
                beforeUpload={(file, filelist) =>
                  this.beforeUpload(file, filelist, uploadType.fileNum)
                }
                onRemove={arg => this.fileRemove(arg, 'uploadFileList')}
                onChange={arg => this.handleUpload(arg, 'uploadFileList')}
              >
                <Button>
                  <Icon type="upload" /> 上传
                </Button>
              </Upload>
            </FormItem>
            <FormItem {...formItemLayout} label="拜访时间">
              {getFieldDecorator('visit_time', {
                initialValue: visit_time || undefined,
                rules: [{ type: 'object', required: true, message: '请选择拜访时间！' }],
              })(
                <DatePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  onChange={this.onTimeChange}
                  disabled={loginfo ? true : false}
                />
              )}
            </FormItem>
            <Form.Item {...formItemLayout} label="拜访方式">
              {getFieldDecorator('visit_type', {
                initialValue: visit_type || undefined,
                rules: [{ required: true, message: '请选择拜访方式！' }],
              })(
                <Radio.Group onChange={this.handleRadioChange}>
                  <Radio value="1">线上拜访</Radio>
                  <Radio value="2">线下拜访</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <div
                className={styles.addAndEditFotter}
                style={{ paddingLeft: sessionStorage.collapsed == 'false' ? '256px' : '80px' }}
              >
                <Button type="primary" htmlType="submit" loading={loaded}>
                  提交
                </Button>
                <Button
                  loading={loaded}
                  style={{ marginLeft: '8px' }}
                  onClick={() => {
                    history.go(-1);
                  }}
                >
                  返回
                </Button>
              </div>
            </FormItem>
          </Form>
          <CarouselPic
            ref="CarouselPic"
            inputData={this.state.imgList}
            visible={this.state.CarouselPicVisible}
            handleCancel={this.handleCancel}
            initialSlide={this.state.initialSlide}
          />
        </Spin>
      </div>
    );
  }
  //拒绝原因为其他原因
  otherRejectionDescFn = () => {
    let cont = this.props.form.getFieldValue('other_rejection_desc');
    this.props.form.setFieldsValue({ log_content: cont });
  };
  //拒绝原因
  refuseReasonFn = (value, logStatus) => {
    if (value != 'CAR_009' && value != 'CPR_011') {
      const {
        base: { basedata },
      } = this.props;
      let arr =
        logStatus == 'S004' ? basedata.clue_active_rejection : basedata.clue_passive_rejection;
      let str = '';
      arr.forEach(element => {
        if (element.code == value) {
          str = element.name;
        }
      });
      this.props.form.setFieldsValue({ log_content: str });
    } else {
      this.props.form.setFieldsValue({ log_content: '' });
    }
  };
  //状态
  statusFn = value => {
    this.props.form.setFieldsValue({ refuse_reason: undefined });
    this.props.form.setFieldsValue({ other_rejection_desc: '' });
    this.props.form.setFieldsValue({ log_content: '' });
  };

  // 提交
  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const { uploadType, dispatch } = this.props;
      const uploadFileList = this.handleUpSubmitFile(this.state.uploadFileList);
      const uploadImgList = this.handleUpSubmitFile(this.state.uploadImgList);
      let payload = {};
      if (uploadFileList == 'notUpload' || uploadImgList == 'notUpload') {
        return;
      }
      let fieldsValues = { ...fieldsValue };
      // 检查被@人员是否被删除
      if (this.state.selectUser) {
        let user_code = [];
        let log_content = fieldsValues.log_content || '';
        this.state.selectUser.forEach(item => {
          if (log_content.indexOf(item.name) != -1) {
            user_code.push(item.code);
          }
        });
        fieldsValues.remindUser = user_code;
      }

      if (uploadType.type === 'add') {
        if (uploadType.PageType === '客户') {
          payload = {
            ...fieldsValues,
            content: fieldsValues.log_content,
            client_code: uploadType.client_code,
            company_code: uploadType.company_code,
            visit_time: moment(fieldsValues.visit_time).format('YYYY-MM-DD HH:mm'),
            fileIds: uploadFileList.concat(uploadImgList),
          };
        } else {
          // 线索 项目
          payload = {
            ...fieldsValues,
            visit_time: moment(fieldsValues.visit_time).format('YYYY-MM-DD HH:mm'),
            fileIds: uploadFileList.concat(uploadImgList),
            code: uploadType.code,
            crm_id: uploadType.crm_id,
            log_type: uploadType.log_type,
          };
        }

        this.setState({ loaded: true });
        dispatch({
          type: uploadType.diapstchType,
          payload,
        }).then(res => {
          if (res && res.code === 200) {
            message.success('日志信息提交成功', 1, () => {
              history.back(-1);
            });
          } else {
            this.setState({ loaded: false });
            message.error('日志信息提交失败');
          }
        });
      } else {
        // 修改
        const { loginfo, crmId } = this.props;
        if (uploadType.PageType === '客户') {
          payload = {
            ...fieldsValues,
            content: fieldsValues.log_content,
            visit_time: moment(fieldsValues.visit_time).format('YYYY-MM-DD HH:mm'),
            fileIds: uploadFileList.concat(uploadImgList),
            is_app: false,
            code: loginfo.visit_code,
            uid: loginfo.uid,
          };
        } else {
          payload = {
            ...fieldsValues,
            visit_time: moment(fieldsValues.visit_time).format('YYYY-MM-DD HH:mm'),
            fileIds: uploadFileList.concat(uploadImgList),
            is_app: false,
            log_type: uploadType.log_type,
            uid: loginfo.uid,
            crm_id: crmId,
          };
        }
        this.setState({ loaded: true });
        dispatch({
          type: uploadType.diapstchType,
          payload,
        }).then(res => {
          if (res && res.code === 200) {
            message.success('日志信息修改成功', 1, () => {
              history.back(-1);
            });
          } else {
            this.setState({ loaded: false });
            message.error('日志信息修改失败');
          }
        });
      }

      // 提交后需要处理， 如果是修改的话，需要把存储的当前日志内容情况，避免下次进来时内容重复
    });
  };

  // 处理上传前文件参数
  handleUpSubmitFile = filelist => {
    let imgArr = [];
    for (let i = 0; i < filelist.length; i++) {
      let item = filelist[i];
      if (!item.zid) {
        if (item && item.response && item.response.code == 200) {
          imgArr.push(item.response.data.zid);
        } else {
          message.error('正在上传附件信息，请稍后');
          imgArr = 'notUpload';
          return imgArr;
        }
      } else {
        imgArr.push(item.zid);
      }
    }
    return imgArr;
  };

  // 上传前操作
  beforeUpload = (file, fileList, subNum) => {
    const { uploadType } = this.props;
    const isLt2M = file.size / 1024 / 1024 < 200;
    if (!isLt2M) {
      message.error('文件大于200M!', 2);
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].uid == file.uid) {
          fileList.splice(i, 1); //删除下标为i的元素
          break;
        }
      }
      return false;
    }
    return isLt2M && GetUploadedData(this.props.dispatch, file, subNum, uploadType.num, '', 's');
  };

  // 删除
  fileRemove(file, name) {
    let _arr = this.state[name];
    if (_arr.length > 0) {
      for (let i = 0; i < _arr.length; i++) {
        if (_arr[i].uid == file.uid) {
          _arr.splice(i, 1); //删除下标为i的元素
          break;
        }
      }
    }
    this.setState({
      [name]: _arr || [],
    });
  }

  // 开始上传
  handleUpload = (info, name) => {
    if (info.file.status === 'error' && !info.file.response) {
      message.error('上传错误！');
      info.fileList.forEach((item, index) => {
        if (item.uid == info.file.uid) {
          info.fileList.splice(index, 1);
        }
      });
    }
    this.setState({
      [name]: info.fileList,
    });
  };

  // 拜访时间
  onTimeChange = (date, dateString) => {
    this.setState({ visit_time: dateString });
  };

  // 拜访方式
  handleRadioChange = e => {
    this.setState({
      visit_type: e.target.value,
    });
  };

  handlePreview = ({ uid }) => {
    //显示
    let _arr = [];
    let arr = [];
    let index = '';
    _arr = this.state.uploadImgList;
    for (var i = 0; i < _arr.length; i++) {
      if (_arr[i].uid == uid) index = i;
      if (_arr[i].url) {
        arr.push({
          originalFullUrl: _arr[i].url,
        });
      } else {
        arr.push({
          originalFullUrl: _arr[i].response.data.displayAddr,
        });
      }
    }

    this.setState(
      {
        CarouselPicVisible: true,
        imgList: arr,
        initialSlide: index,
      },
      () => {
        if (this.refs.CarouselPic.refs.prics) {
          this.refs.CarouselPic.refs.prics.innerSlider.slickGoTo(index);
        }
      }
    );
  };
  //隐藏
  handleCancel = () => {
    this.setState({
      CarouselPicVisible: false,
      imgList: [],
      initialSlide: '',
    });
  };

  // 初始化
  handleCDMData = props => {
    const { loginfo, uploadType, status } = props;
    let uploadFileList = [];
    let uploadImgList = [];
    if (uploadType.type !== 'add' && loginfo) {
      if (!_.isEmpty(loginfo.attachment)) {
        loginfo.attachment.map(element => {
          uploadFileList.push({
            uid: element.uid,
            name: element.file_name,
            status: 'done',
            url: element.displayAddr,
            zid: element.zid,
          });
        });
      }
      if (!_.isEmpty(loginfo.pic)) {
        loginfo.pic.map(element => {
          uploadImgList.push({
            uid: element.uid,
            name: element.file_name,
            url: element.displayAddr,
            zid: element.zid,
            status: 'done',
          });
        });
      }
    }
    this.setState({
      status: status || (loginfo && loginfo.status) || '',
      visit_time:
        loginfo && loginfo.visit_time
          ? moment(loginfo.visit_time, 'YYYY-MM-DD HH:mm')
          : moment(new Date(), 'YYYY-MM-DD HH:mm'),
      visit_type: loginfo && loginfo.visit_type ? loginfo.visit_type : '1',
      uploadFileList,
      uploadImgList,
    });
  };

  // 日志添加@
  handleSelect = (text, prefix) => {
    const { selectUser } = this.state;
    let selectdata = { name: text.value, code: text.code };
    this.setState({ selectUser: [...selectUser, selectdata] }, () => {});
  };
}

export default AddLog;
