/*
 * @Author: zqm 
 * @Date: 2021-01-22 13:30:02 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-03 16:49:25
 * 线索搜索 
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Divider, Button, Icon, Select, DatePicker, Input, message, Tag } from 'antd';
import styles from './LeadManage.less';
import Cascaderselect from '@/components/Cascaderselect/Cascaderselecthover';
const { Search } = Input;
const { CheckableTag } = Tag;
const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
@connect(({ LeadManage }) => ({
  LeadManage,
}))
class LeadManageSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      checked: null,
      referrerName: null, //推荐人
      codes: ['TSC000'],
    };
  }
  componentDidMount() {
    // 获取所有渠道
    const { dispatch } = this.props;
    dispatch({ type: 'LeadManage/getTreeModel' });
  }
  render() {
    const statusMap = [
      { name: '全部', value: null },
      { name: '未联系', value: 'TS001' },
      { name: '跟进中', value: 'TS002' },
      { name: '已签约', value: 'TS003' },
      { name: '无效线索', value: 'TS005' },
      { name: '战败', value: 'TS004' },
    ];
    const { treeData, ReferrerData } = this.props.LeadManage;
    const { referrerName, codes } = this.state;
    return (
      <div>
        <Card bordered={false}>
          <Search
            placeholder="可通过姓名 / 电话 / 描述进行搜索"
            onSearch={value => this.handleSearch(value)}
            style={{ width: 400 }}
          />
          <Divider dashed={true} />
          <div>
            状态：
            {statusMap.map(item => {
              return (
                <span
                  key={item.value}
                  className={`${styles.statusItem} ${this.state.checked === item.value &&
                    styles.statusCurrent}`}
                  onClick={() => this.handleClickStatus(item.value)}
                >
                  {item.name}
                </span>
              );
            })}
          </div>
          <Divider dashed={true} />
          <div className={styles.otherSelect}>
            <span className={styles.otherLabel}>其它选项:</span>
            <div className={styles.otherCont}>
              <div>
                <span>来源：</span>
                <Cascaderselect
                  options={treeData}
                  fieldNames={{
                    label: 'sourceChannelName',
                    value: 'sourceChannelType',
                    children: 'children',
                  }}
                  placeholder="选择来源"
                  onChange={this.handleCascaderchange}
                  multiple={true}
                  initvalue={{
                    codes: codes,
                  }}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <span>创建时间：</span>
                <RangePicker
                  onChange={(v, d) => this.handleStartChange(v, d, 'createTime')}
                  format={dateFormat}
                  placeholder={['开始时间', '截止时间']}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <span>推荐人：</span>
                <div className={styles.searchDiv}>
                  <Input
                    value={referrerName}
                    onChange={e => this.handleSelectSearch(e.target.value)}
                    style={{ width: '100%' }}
                    placeholder="请输入推荐人姓名进行搜索"
                    onBlur={() => this.handleBlur()}
                    onPressEnter={() => this.handleBlur()}
                  />
                  {Array.isArray(ReferrerData) &&
                    ReferrerData.length > 0 && (
                      <ul className={styles.searchUl}>
                        {ReferrerData.map(item => {
                          return (
                            <li
                              onClick={() =>
                                this.handleLiClick('projectCodeExt', item.projectCodeExt)
                              }
                              key={item.uid}
                              className={styles.searchLi}
                            >
                              {item.projectCodeExt}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                </div>
              </div>
            </div>
            <span
              style={{ display: 'none' }}
              className={styles.otherExpand}
              onClick={() => this.setState({ isExpanded: !this.state.isExpanded })}
            >
              {`${this.state.isExpanded ? '收起  ' : '展开  '}`}
              <Icon type={`${this.state.isExpanded ? 'up' : 'down'}`} />
            </span>
          </div>
        </Card>
      </div>
    );
  }
  // 来源
  handleCascaderchange = (codes, arr) => {
    console.log('====================================');
    console.log(codes);
    console.log(arr);
    console.log('====================================');
    this.setState({
      // sourcetag: arr,
      codes,
    });
    const val = codes[codes.length - 1];
    this.queryTrackData({ sourceChannel: codes.length > 0 ? (val === 'TSC000' ? '' : val) : '' });
  };
  //
  handleSearch = searchKeys => {
    this.queryTrackData({ searchKeys });
  };
  handleClickStatus = checked => {
    this.setState({ checked });
    this.queryTrackData({ status: checked, pageNum: 1 });
  };
  // 起始时间
  handleStartChange = (value, dateString, name) => {
    this.setState({ [`${name}Start`]: dateString[0], [`${name}End`]: dateString[1] });
    this.queryTrackData({ createTimeStart: dateString[0], createTimeEnd: dateString[1] });
  };
  handleSelectSearch = value => {
    this.setState({ referrerName: value });
  };
  handleBlur = () => {
    this.queryTrackData({ referrerName: this.state.referrerName });
    // const { dispatch } = this.props;
    // setTimeout(() => {
    //   dispatch({
    //     type: 'LeadManage/setDataModel',
    //     payload: {
    //       ReferrerData: [], //项目模糊查询
    //     },
    //   });
    // }, 500);
  };

  queryTrackData = obj => {
    const {
      dispatch,
      LeadManage: { trackDataSearch },
    } = this.props;
    dispatch({
      type: 'LeadManage/trackQueryModel',
      payload: { ...trackDataSearch, ...obj },
    });
  };
}

export default LeadManageSearch;
