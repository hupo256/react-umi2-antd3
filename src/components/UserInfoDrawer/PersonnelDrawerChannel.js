/*
 * @Author: pengyc 
 * @Date: 2020-06-12 11:30:57 
 * @Last Modified by: pengyc
 * @Last Modified time: 2020-07-07 11:37:17
 * 渠道管理 参与人 分配人
 */

import React, { Component } from 'react';
import { Drawer, Button, Table, Row, Col, Input, message } from 'antd';
import { connect } from 'dva';
import styles from './PersonnelDrawerCode.less';

@connect(({ channel, loading }) => ({
  channel,
  loadding: loading.effects['channel/queryStaffOfSameDeptByUserCodeModel'],
}))
class PersonnelDrawerChannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowList: [],
      selectedRowKeys: [],
      val: '',
    };
  }
  columns = [
    {
      title: '姓名',
      dataIndex: 'real_name',
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      propRowKeys,
      channel: { channelInfo },
    } = this.props;
    let { selectedRowKeys } = this.state;
    dispatch({
      type: 'channel/queryStaffOfSameDeptByUserCodeModel',
      payload: {
        pageNum: 1,
        userCode: channelInfo.principal_code,
      },
    }).then(res => {
      if (!_.isEmpty(propRowKeys)) {
        propRowKeys.map(item => {
          selectedRowKeys.push(item.user_code);
        });
        this.setState({
          selectedRowKeys,
          selectedRowList: propRowKeys,
        });
      }
    });
  }

  render() {
    const {
      Personnelvisible,
      channel: { queryPersonnelData },
      loadding,
    } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: 'true',
    };
    let tabledata = [];
    if (queryPersonnelData && queryPersonnelData.list) {
      queryPersonnelData.list.forEach(element => {
        tabledata.push(Object.assign(element, { key: element.user_code }));
      });
    }
    return (
      <Drawer
        width="550"
        title="信息"
        placement="right"
        onClose={this.onClose}
        visible={Personnelvisible}
      >
        <div>
          <Row className={styles.labelRow}>
            <Col span={12}>
              <Input
                placeholder="请输入"
                autoFocus
                className={styles.inputClass}
                value={this.state.val}
                onChange={this.inputChange}
              />
            </Col>
            <Col span={12}>
              <Button onClick={this.handleResetClick} style={{ marginLeft: 16 }}>
                重置
              </Button>
            </Col>
          </Row>
        </div>
        <div style={{ display: 'flex', background: '#f1f1f1', padding: '10px 0' }}>
          <span style={{ flexBasis: '30%', textAlign: 'center', fontWeight: 'bold' }}>姓名</span>
        </div>
        <Table
          showHeader={false}
          dataSource={tabledata}
          columns={this.columns}
          rowSelection={rowSelection}
          rowKey={record => record.user_code}
          loading={loadding}
          pagination={{
            pageSize: 10,
            hideOnSinglePage: true,
            current: queryPersonnelData && queryPersonnelData.curPage,
            total: queryPersonnelData && queryPersonnelData.recordTotal,
          }}
          onRow={record => {
            return {
              onClick: () => this.rowDouble(record),
            };
          }}
          onChange={this.handleTableChange}
        />
      </Drawer>
    );
  }

  // 重置
  handleResetClick = e => {
    this.setState({ val: '' });
    this.handleSearch('');
  };

  onClose = () => {
    this.props.closePersonnelDrawer(false);
  };

  // 输入搜索
  inputChange = e => {
    this.handleSearch(e.target.value);
    this.setState({ val: e.target.value });
  };

  // 输入搜索
  handleSearch = userName => {
    const {
      dispatch,
      channel: { channelInfo },
    } = this.props;
    dispatch({
      type: 'channel/queryStaffOfSameDeptByUserCodeModel',
      payload: {
        name: userName,
        pageNum: 1,
        userCode: channelInfo.principal_code,
      },
    });
  };

  // 翻页
  handleTableChange = (pagination, filters, sorter) => {
    const {
      dispatch,
      channel: { channelInfo },
    } = this.props;
    dispatch({
      type: 'channel/queryStaffOfSameDeptByUserCodeModel',
      payload: {
        name: this.state.val,
        pageNum: pagination.current,
        userCode: channelInfo.principal_code,
      },
    });
  };

  // 复选框选中
  onSelectChange = (selectedRowKeys, selectedRow) => {
    let selectedRowList = this.state.selectedRowList;
    selectedRowList = selectedRowList.concat(selectedRow);
    selectedRowList = _.uniqBy(selectedRowList, 'user_code');
    let newArr = [];
    selectedRowKeys.map(key => {
      selectedRowList.map(item => {
        if (item.user_code == key) {
          newArr.push(item);
        }
      });
    });
    this.props.propsTags(newArr);
    this.setState({ selectedRowKeys, selectedRowList: newArr });
  };

  // 行选择
  rowDouble = record => {
    let key = record.user_code;
    let { selectedRowKeys, selectedRowList } = this.state;
    if (_.indexOf(selectedRowKeys, key) === -1) {
      selectedRowKeys.push(key);
      selectedRowList.push({ ...record });
    } else {
      selectedRowKeys = _.pull(selectedRowKeys, key);
      selectedRowList = selectedRowList.filter(item => item.user_code !== key);
    }
    this.props.propsTags(selectedRowList);
    this.setState({ selectedRowKeys, selectedRowList });
  };
}

export default PersonnelDrawerChannel;
