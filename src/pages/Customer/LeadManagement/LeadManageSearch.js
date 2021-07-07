/*
 * @Author: zqm 
 * @Date: 2021-01-22 13:30:02 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-05-26 18:50:56
 * 线索搜索 
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
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
      codes: ['TSC002'],
      sourcetag: [],
      createTimeStart: null,
      createTimeEnd: null,
    };
  }
  componentDidMount() {
    // 获取所有渠道
    const {
      dispatch,
      LeadManage: { trackDataSearch },
    } = this.props;
    dispatch({ type: 'LeadManage/getTreeModel' });
    this.setState({
      searchVal: trackDataSearch.searchKeys || '',
      checked: trackDataSearch.status || null,
      referrerName: trackDataSearch.referrerName || null,
      codes: trackDataSearch.codes || [],
      sourcetag: trackDataSearch.sourcetag || [],
      createTimeStart: trackDataSearch.createTimeStart || null,
      createTimeEnd: trackDataSearch.createTimeEnd || null,
    });
  }
  render() {
    const statusMap = [
      { name: '全部', value: null },
      { name: '未联系', value: 'TS001' },
      { name: '跟进中', value: 'TS002' },
      { name: '已成交', value: 'TS003' },
      { name: '无效线索', value: 'TS005' },
      { name: '战败', value: 'TS004' },
    ];
    const { treeData, ReferrerData } = this.props.LeadManage;
    const {
      referrerName,
      sourcetag,
      codes,
      searchVal,
      createTimeEnd,
      createTimeStart,
    } = this.state;
    const treedatas = (treeData.length > 0 && this.treeFilter(treeData)) || [];
    return (
      <div>
        <Card bordered={false}>
          <Search
            placeholder="可通过姓名 / 电话 / 描述进行搜索"
            value={searchVal}
            onSearch={value => this.handleSearch(value)}
            onPressEnter={e => this.handleSearch(e.target.value)}
            onChange={e => {
              this.setState({ searchVal: e.target.value });
              if (!e.target.value) {
                this.handleSearch('');
              }
            }}
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
                  options={treedatas}
                  fieldNames={{
                    label: 'sourceChannelName',
                    value: 'sourceChannelType',
                    children: 'children',
                  }}
                  placeholder="选择来源"
                  onChange={this.handleCascaderchange}
                  multiple={true}
                  initvalue={{ sourcetag, codes }}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <span>创建时间：</span>
                <RangePicker
                  value={[
                    createTimeStart && moment(createTimeStart, 'YYYY-MM-DD'),
                    createTimeEnd && moment(createTimeEnd, 'YYYY-MM-DD'),
                  ]}
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
                    onChange={e => {
                      this.setState({ referrerName: e.target.value }, () => {
                        const { referrerName } = this.state;
                        if (!referrerName) {
                          this.handleBlur();
                        }
                      });
                    }}
                    style={{ width: '100%' }}
                    placeholder="请输入推荐人姓名/手机号进行搜索"
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
    this.setState({
      sourcetag: arr,
      codes,
    });
    const val = codes[codes.length - 1];
    this.queryTrackData({
      pageNum: 1,
      sourceChannel: val,
      codes,
      sourcetag: arr,
    });
  };
  //
  handleSearch = searchKeys => {
    this.queryTrackData({
      pageNum: 1,
      searchKeys: (searchKeys && searchKeys.substring(0, 30)) || '',
    });
  };
  handleClickStatus = checked => {
    this.setState({ checked });
    this.queryTrackData({ status: checked, pageNum: 1 });
  };
  // 起始时间
  handleStartChange = (value, dateString, name) => {
    this.setState({ [`${name}Start`]: dateString[0], [`${name}End`]: dateString[1] });
    this.queryTrackData({
      pageNum: 1,
      createTimeStart: dateString[0],
      createTimeEnd: dateString[1],
    });
  };
  handleBlur = () => {
    this.queryTrackData({
      pageNum: 1,
      referrerName: (this.state.referrerName && this.state.referrerName.substring(0, 30)) || '',
    });
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

  treeFilter = datas => {
    const data = datas.map(item => {
      if (item.children && item.children.length == 0) {
        item.children = null;
      } else {
        item.children && this.treeFilter(item.children);
      }
      return item;
    });
    return data;
  };
}

export default LeadManageSearch;
