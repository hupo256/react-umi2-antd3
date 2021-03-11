/*
 * @Author: pengyc 
 * @Date: 2020-05-08 16:18:49 
 * @Last Modified by: pengyc
 * @Last Modified time: 2020-06-08 15:43:36
 * 项目下新建 不编辑人员
 */
import React, { Component } from 'react';
import { Drawer, Button, Table, Row, Col, Input, message } from 'antd';
import { connect } from 'dva';
import styles from './PersonnelDrawerCode.less';

@connect(({ base, loading }) => ({
  base,
  loadding: loading.effects['base/queryUsersByPostFunctionCodeModel'],
}))
class PersonnelDrawerCode extends Component {
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
    const { dispatch, propRowKeys, PersonnelName } = this.props;
    let { selectedRowKeys } = this.state;
    dispatch({
      type: 'base/queryUsersByPostFunctionCodeModel',
      payload: {
        function_code: this.handleDispatchData(PersonnelName),
        pageNum: 1,
      },
    }).then(res => {
      if (!_.isEmpty(propRowKeys)) {
        propRowKeys.map(item => {
          selectedRowKeys.push(item.user_code);
        });
        console.log('selectedRowKeys ==', selectedRowKeys);

        this.setState({
          selectedRowKeys,
          selectedRowList: propRowKeys,
        });
      }
    });
  }

  componentWillUnmount() {}

  render() {
    const {
      Personnelvisible,
      base: { queryUsersList },
      loadding,
    } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: 'true',
    };
    let tabledata = [];
    if (queryUsersList && queryUsersList.list) {
      queryUsersList.list.forEach(element => {
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
            current: queryUsersList && queryUsersList.curPage,
            total: queryUsersList && queryUsersList.recordTotal,
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
    const { dispatch, PersonnelName } = this.props;
    dispatch({
      type: 'base/queryUsersByPostFunctionCodeModel',
      payload: {
        name: userName,
        function_code: this.handleDispatchData(PersonnelName),
        pageNum: 1,
      },
    });
  };
  // 翻页
  handleTableChange = (pagination, filters, sorter) => {
    const { dispatch, PersonnelName } = this.props;
    dispatch({
      type: 'base/queryUsersByPostFunctionCodeModel',
      payload: {
        name: this.state.val,
        pageNum: pagination.current,
        function_code: this.handleDispatchData(PersonnelName),
      },
    });
  };

  onSelectChange = (selectedRowKeys, selectedRow) => {
    const { PersonnelName } = this.props;
    let selectedRowList = this.state.selectedRowList;
    selectedRowList = selectedRowList.concat(selectedRow);
    selectedRowList = _.uniqBy(selectedRowList, 'user_code');
    selectedRowList.map(item => {
      if (_.isEmpty(item.type)) {
        item.type = PersonnelName;
      }
      return item;
    });
    let newArr = [];
    if (selectedRowKeys.length > 10) {
      return message.warning('每项职能最多可选择10个人员');
    }

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
  rowDouble = record => {
    const { PersonnelName } = this.props;
    let key = record.user_code;
    let { selectedRowKeys, selectedRowList } = this.state;
    if (selectedRowList.length >= 10) {
      return message.warning('每项职能最多可选择10个人员');
    }

    if (_.indexOf(selectedRowKeys, key) === -1) {
      selectedRowKeys.push(key);
      selectedRowList.push({ ...record, type: PersonnelName });
    } else {
      selectedRowKeys = _.pull(selectedRowKeys, key);
      selectedRowList = selectedRowList.filter(item => item.user_code !== key);
    }
    this.props.propsTags(selectedRowList);
    this.setState({ selectedRowKeys, selectedRowList });
  };

  // 岗位编码转换
  handleDispatchData = PersonnelName => {
    let str = '';
    switch (PersonnelName) {
      case 'main_leader':
      case 'aux_leader':
        str = 'PF_01'; //   PF_01  项目总监
        break;
      case 'main_sale':
        str = 'PF_02'; //   PF_02  商务
        break;
      case 'main_design':
      case 'aux_design':
        str = 'PF_03'; //   PF_03  方案
        break;
      case 'main_engin':
      case 'aux_engin':
        str = 'PF_04'; //   PF_04  项目管理
        break;
      case 'main_construction':
      case 'aux_construction':
        str = 'PF_05'; //   PF_05  深化
        break;
      case 'main_electromechanical':
      case 'aux_electromechanical':
        str = 'PF_06'; //   PF_06  机电
        break;
      case 'main_budget':
      case 'aux_budget':
        str = 'PF_07'; //   PF_07  成本
        break;
      case 'main_order':
      case 'aux_order':
        str = 'PF_08'; //   PF_08  采购
        break;
      case 'aux_quality':
        str = 'PF_09'; //   PF_09  技术管理
        break;
      default:
        break;
    }
    return str;
  };
}

export default PersonnelDrawerCode;
