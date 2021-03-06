/*
 * @Author: zqm 
 * @Date: 2021-01-28 17:56:05 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-05-25 11:38:06
 * 添加线索
 */
import React, { Component } from 'react';
import { Modal, message, Input, InputNumber, Select } from 'antd';
import styles from '../LeadManage.less';
import { regExpConfig } from '../../../../utils/regular.config';
const { TextArea } = Input;
const { Option } = Select;
class LeadManageAdd extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      record: {
        address: '',
        area: null,
        mobile: '',
        name: '',
        referrerCode: '',
        referrerName: '',
        referrerPhone: '',
        sourceChannelName: '手动录入',
        status: 'TS001',
        statusName: '未联系',
        trackDesc: '',
        trackInputType: 2,
        trackInputTypeName: '手动录入',
        trackReferEdit: false,
      },
      referrerNameList: [],
    };
    this.queryUserByName = this.queryUserByName.bind(this);
    this.queryUserByMobile = this.queryUserByMobile.bind(this);
  }
  //推荐人模糊搜索
  async queryUserByName(value) {
    const { dispatch } = this.props;
    console.log(value);
    const parm = {
      nickName: value,
      pageNum: 1,
      pageSize: 3,
    };
    await dispatch({
      type: 'LeadManage/queryUserByName',
      payload: parm,
    }).then(async res => {
      if (res && res.code === 200) {
        // message.success('查询成功');
        // console.log('查询成功', res.data.length);
        if (res.data && res.data.length > 0) {
          await this.setState({ referrerNameList: res.data });
          // console.log('查询成功2', res.data, this.state);
        } else {
          await this.setState({ referrerNameList: [] });
        }
      }
    });
  }
  //点击推荐模糊选项
  clickReferrerDiv(value) {
    this.setState({
      record: {
        ...this.state.record,
        referrerName: value.realName,
        referrerCode: value.userCode,
        referrerPhone: value.mobile,
      },
      referrerNameList: [],
    });
  }
  //点击推荐人输入框
  async clickTrackRefer() {
    await this.queryUserByName(this.state.record.referrerName);
  }
  //推荐人改变
  async changeTrackRefer(e) {
    await this.setState({
      record: {
        ...this.state.record,
        referrerName: e.target.value,
        referrerCode: "",
        referrerPhone: "",
      },
    });
    this.queryUserByName(this.state.record.referrerName);
  }

  render() {
    const { record, referrerNameList } = this.state;
    return (
      <Modal
        title={<span style={{ fontWeight: 600 }}>创建</span>}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.props.handleCancel}
        okText="确认"
        maskClosable={false}
        className="addTarckModal"
        width={600}
      >
        <div onClick={() => this.setState({ referrerNameList: [] })} style={{ padding: 24 }}>
          <div className={styles.CluesEdit}>
            <span className="beforeStar">客户姓名：</span>
            <span style={{ flex: 1 }}>
              <Input
                placeholder="请输入客户姓名"
                value={record.name}
                onChange={e =>
                  this.setState({ record: { ...this.state.record, name: e.target.value } })
                }
              />
            </span>
          </div>
          <div className={styles.CluesEdit}>
            <span className="beforeStar">联系电话：</span>
            <span style={{ flex: 1 }}>
              <Input
                placeholder="请输入联系电话"
                value={record.mobile}
                onChange={e =>
                  this.setState({ record: { ...this.state.record, mobile: e.target.value } })
                }
                onBlur={this.queryUserByMobile}
              />
            </span>
          </div>
          <div className={styles.CluesEdit} id='CluesEditdiv'>
            <span className="beforeStar">线索状态：</span>
            <span style={{ flex: 1 }}>
              <Select
                defaultValue={record.status}
                style={{ width: 402 }}
                getPopupContainer={()=>document.getElementById('CluesEditdiv')}
                onChange={value =>
                  this.setState({ record: { ...this.state.record, status: value } })
                }
              >
                <Option value="TS001">未联系</Option>
                <Option value="TS002">跟进中</Option>
                <Option value="TS003">已成交</Option>
                <Option value="TS004">战败</Option>
                <Option value="TS005">无效线索</Option>
              </Select>
            </span>
          </div>
          <div className={styles.CluesEdit}>
            <span>来源渠道：</span>
            <span style={{ flex: 1 }}>手动录入</span>
          </div>
          <div className={styles.CluesEdit}>
            <span>推荐人：</span>
            <span style={{ flex: 1, position: 'relative' }}>
              <Input
                placeholder="请输入/选择推荐人"
                value={record.referrerName != '' ? record.referrerName : ''}
                onClick={() => this.clickTrackRefer()}
                onChange={e => this.changeTrackRefer(e)}
              />
              <div
                className={styles.referrerNameSelect}
                style={{ display: referrerNameList.length > 0 ? 'block' : 'none', padding: 5 }}
              >
                {referrerNameList && referrerNameList.length != 0
                  ? referrerNameList.map(item => {
                      return (
                        <div
                          onClick={this.clickReferrerDiv.bind(this, item)}
                          style={{ cursor: 'pointer', padding: 2 }}
                        >
                          {item.realName && item.mobile
                            ? item.realName + '(' + item.mobile + ')'
                            : item.realName == ''
                              ? item.mobile
                              : item.realName}
                        </div>
                      );
                    })
                  : null}
              </div>
            </span>
          </div>
          <div className={styles.CluesEdit}>
            <span>楼盘/楼宇：</span>
            <span style={{ flex: 1 }}>
              <Input
                placeholder="请输入楼盘/楼宇"
                value={record.address}
                onChange={e =>
                  this.setState({ record: { ...this.state.record, address: e.target.value } })
                }
              />
            </span>
          </div>
          <div className={styles.CluesEdit}>
            <span>面积：</span>
            <span style={{ flex: 1 }}>
              <InputNumber
                placeholder="请输入面积"
                value={record.area}
                precision={2}
                style={{ width: '90%', marginRight: 8 }}
                onChange={e => this.setState({ record: { ...this.state.record, area: e } })}
              />
              m²
            </span>
          </div>
          <div className={styles.CluesEdit}>
            <span>线索描述：</span>
            <span style={{ flex: 1 }}>
              <TextArea
                placeholder="请输入线索描述"
                value={record.trackDesc}
                onChange={e =>
                  this.setState({ record: { ...this.state.record, trackDesc: e.target.value } })
                }
                rows={4}
              />
            </span>
          </div>
        </div>
      </Modal>
    );
  }
  async queryUserByMobile() {
    const { dispatch } = this.props;
    let { record } = this.state;
    record.mobile = record.mobile.trim();
    if (!regExpConfig.phoneAndLandline.test(record.mobile)) {
      message.error('手机号格式不正确');
      return false;
    }
    const parm = {
      mobile: record.mobile,
    };
    await dispatch({
      type: 'LeadManage/checkMobileModel',
      payload: parm,
    }).then(async res => {
      if (res && res.code === 200) {
        if (res.data == true) {
          message.warning('该线索已存在，无需重复录入。');
        }
      }
    });
  }
  handleOk = async () => {
    let { record } = this.state;
    record.name = record.name ? record.name.trim() : record.name;
    record.mobile = record.mobile ? record.mobile.trim() : record.mobile;
    record.trackDesc = record.trackDesc ? record.trackDesc.trim() : record.trackDesc;
    record.referrerName = record.referrerName ? record.referrerName.trim() : record.referrerName;
    if (!record.name) {
      message.error('请输入客户姓名');
      return false;
    } else if (record.name.length > 10) {
      message.error('客户姓名限制1-10字符长度');
      return false;
    } else if (record.referrerName.length > 10) {
      message.error('推荐人限制0-10字符长度');
      return false;
    } else if (!record.mobile) {
      message.error('请输入联系电话');
      return false;
    } else if (!regExpConfig.phoneAndLandline.test(record.mobile)) {
      message.error('手机号格式不正确');
      return false;
    } else if (record.address && record.address.length > 30) {
      message.error('楼盘/楼宇限制0-30字符长度');
      return false;
    } else if (record.area && parseFloat(record.area) + '' === 'NaN') {
      message.error('面积限制输入0.01-99999.99范围内的数字（含两位小数）');
      return false;
    } else if (record.area && (parseFloat(record.area) < 0.01 || parseInt(record.area) > 99999)) {
      message.error('面积限制输入0.01-99999.99范围内的数字（含两位小数）');
      return false;
    } else if (record.trackDesc && record.trackDesc.length > 200) {
      message.error('线索描述限制0-200字符长度');
      return false;
    }
    this.props.handleOk(record);
  };
}

export default LeadManageAdd;
