/*
 * @Author: zqm 
 * @Date: 2020-12-07 16:19:49 
 * @Last Modified by: zqm
 * @Last Modified time: 2020-12-17 20:48:58
 * 人员选择
 */

import React, { Component } from 'react';
import { Button, Drawer, Input, Row, Col, Divider, Table, message, Checkbox } from 'antd';
import { connect } from 'dva';
@connect(({ base, loading }) => ({
  base,
  Loading: loading.effects['base/queryPersonnelModel'],
}))
class PersonnelDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.loadQuery({ pageNum: 1 });
  }
  render() {
    const {
      title,
      visible,
      onClose,
      selectedRowKeys,
      Loading,
      onRowChange,
      rowKey,
      base: { personnelList, personnelSearch },
    } = this.props;
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys: selectedRowKeys && selectedRowKeys.map(item => item.key),
      onChange: (selectedRowKeys, selectedRows) => {
        onRowChange(selectedRows[0]);
      },
      getCheckboxProps: record => ({
        realName: record.realName,
      }),
    };
    const columns = [
      {
        title: '',
        dataIndex: 'checkbox',
        key: 'checkbox',
        render: (t, r) => {
          const checked = selectedRowKeys.map(item => item.uid).includes(r.uid);
          return (
            <Checkbox checked={checked} onChange={() => onRowChange(type, 'select', checked, r)} />
          );
        },
      },
      {
        title: '姓名',
        dataIndex: 'realName',
        key: 'realName',
      },
      {
        title: '职务',
        dataIndex: 'position',
        key: 'position',
      },
      {
        title: '手机号码',
        dataIndex: 'mobile',
        key: 'mobile',
      },
    ];

    return (
      <div>
        <Drawer
          title={title || '选择工程内部主负责人'}
          placement="right"
          closable={true}
          onClose={() => {
            this.setState({ userName: '' }, () => onClose());
          }}
          visible={visible}
          width="500"
          maskClosable={false}
        >
          <Row>
            <Col span={12}>
              <Input
                placeholder={'请输入姓名'}
                value={personnelSearch.userName}
                onChange={this.inputChange}
                style={{ width: 200 }}
              />
            </Col>
            <Col span={12}>
              <Button onClick={() => this.onDrawerReset()} type="primary">
                重置
              </Button>
            </Col>
          </Row>
          <Divider />
          <Table
            rowKey={record => record[rowKey] || record.uid}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={personnelList && personnelList.list}
            loading={Loading}
            onRow={(record, index) => {
              return {
                onClick: () => {
                  onRowChange(record);
                },
              };
            }}
            pagination={{
              pageSize: 10,
              hideOnSinglePage: true,
              current: personnelList && personnelList.curPage,
              total: personnelList && personnelList.recordTotal,
            }}
            onChange={this.handleTableChange}
          />
        </Drawer>
      </div>
    );
  }

  inputChange = e => {
    this.loadQuery({ userName: e.target.value });
  };

  // 分页
  handleTableChange = pagination => {
    this.loadQuery({ pageNum: pagination.current, pageSize: pagination.pageSize });
  };
  onDrawerReset = () => {
    this.loadQuery({ userName: '', pageNum: 1 });
  };
  loadQuery = obj => {
    const {
      dispatch,
      base: { personnelSearch },
    } = this.props;
    dispatch({
      type: 'base/queryPersonnelModel',
      payload: { ...personnelSearch, ...obj },
    });
  };
}

export default PersonnelDrawer;
