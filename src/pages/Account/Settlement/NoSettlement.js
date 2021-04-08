import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { paginations } from '@/utils/utils';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Table,
  DatePicker,
  Divider,
  Alert,
  message,
  Popconfirm,
  Tooltip,
} from 'antd';
import styles from './Index.less';
const FormItem = Form.Item;

@connect(({ settlement, loading }) => ({
  settlement,
  loading: loading.effects['settlement/loadQueryProjectSettlementDataModel'],
}))
@Form.create()
class NoSettlement extends Component {
  constructor(props) {
    const { location } = props;
    const patharr = location.pathname.split('/');
    const role = patharr[patharr.length - 2];
    const menuMap = {
      bj: 'DR_001',
      sh: 'DR_002',
      dkh: 'DR_003',
      sz: 'DR_004',
    };
    super(props);
    this.state = {
      data_role: menuMap[role],
      pageNum: 1,
      pageSize: '10',
      sendpack_model: '',
      project_name: '',
    };
  }

  columns = [
    {
      title: '项目ID',
      width: 100,
      dataIndex: 'project_code_ext',
      key: 'project_code_ext',
      fixed: 'left',
    },
    {
      title: '项目名称',
      width: 250,
      dataIndex: 'project_name',
      key: 'project_name',
      fixed: 'left',
    },
    {
      title: '发包模式',
      dataIndex: 'sendpack_model',
      key: 'sendpack_model',
      fixed: 'left',
      width: 150,
    },
    {
      title: '对甲结算单是否全部签回',
      dataIndex: 'a_flag',
      key: 'a_flag',
      width: 200,
      render: text => {
        if (text == '否') {
          return <span style={{ color: 'red' }}>{text}</span>;
        } else if (text == '/') {
          return <span style={{ color: '#ccc' }}>{text}</span>;
        } else {
          return text;
        }
      },
    },
    {
      title: '对乙劳务结算单是否全部签回',
      dataIndex: 'service_flag',
      key: 'service_flag',
      width: 220,
      render: text => {
        if (text == '否') {
          return <span style={{ color: 'red' }}>{text}</span>;
        } else if (text == '/') {
          return <span style={{ color: '#ccc' }}>{text}</span>;
        } else {
          return text;
        }
      },
    },
    {
      title: '对乙软装采购是否结算',
      dataIndex: 'soft_flag',
      key: 'soft_flag',
      width: 200,
      render: text => {
        if (text == '否') {
          return <span style={{ color: 'red' }}>{text}</span>;
        } else if (text == '/') {
          return <span style={{ color: '#ccc' }}>{text}</span>;
        } else {
          return text;
        }
      },
    },
    {
      title: '对乙材料采购是否结算',
      dataIndex: 'material_flag',
      key: 'material_flag',
      width: 200,
      render: text => {
        if (text == '否') {
          return <span style={{ color: 'red' }}>{text}</span>;
        } else if (text == '/') {
          return <span style={{ color: '#ccc' }}>{text}</span>;
        } else {
          return text;
        }
      },
    },
    {
      title: '对乙暖通是否结算',
      dataIndex: 'hvac_flag',
      key: 'hvac_flag',
      width: 200,
      render: text => {
        if (text == '否') {
          return <span style={{ color: 'red' }}>{text}</span>;
        } else if (text == '/') {
          return <span style={{ color: '#ccc' }}>{text}</span>;
        } else {
          return text;
        }
      },
    },
    {
      title: '对乙消防是否结算',
      dataIndex: 'fire_flag',
      key: 'fire_flag',
      width: 200,
      render: text => {
        if (text == '否') {
          return <span style={{ color: 'red' }}>{text}</span>;
        } else if (text == '/') {
          return <span style={{ color: '#ccc' }}>{text}</span>;
        } else {
          return text;
        }
      },
    },
    {
      title: '对乙清包工是否结算',
      dataIndex: 'contractor_flag',
      key: 'contractor_flag',
      width: 200,
      render: text => {
        if (text == '否') {
          return <span style={{ color: 'red' }}>{text}</span>;
        } else if (text == '/') {
          return <span style={{ color: '#ccc' }}>{text}</span>;
        } else {
          return text;
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'project_code',
      key: 'project_code',
      fixed: 'right',
      width: 150,
      render: text => <a onClick={() => this.handleFlag(text)}>最终结算</a>,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { data_role, sendpack_model } = this.state;
    dispatch({
      type: 'settlement/loadQueryProjectSettlementDataModel',
      payload: {
        data_role,
        pageNum: 1,
        pageSize: '10',
        sendpack_model,
        settlement_status: 0,
      },
    });
  }

  // 筛选
  renderSearch() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('project_name', {})(<Input placeholder="请输入项目名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="发包模式">
              {getFieldDecorator('sendpack_model', {
                initialValue: this.state.sendpack_model || undefined,
              })(
                <Select placeholder="全部" style={{ width: '100%' }}>
                  <Select.Option value="" key="">
                    全部
                  </Select.Option>
                  <Select.Option value="CCP_001" key="CCP_001">
                    常规模式
                  </Select.Option>
                  <Select.Option value="CCP_002" key="CCP_002">
                    清包工模式
                  </Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  //查询
  handleSearch = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        sendpack_model: fieldsValue.sendpack_model || '',
        project_name: fieldsValue.project_name || '',
      });
      dispatch({
        type: 'settlement/loadQueryProjectSettlementDataModel',
        payload: {
          data_role: this.state.data_role,
          pageNum: 1,
          pageSize: '10',
          sendpack_model: fieldsValue.sendpack_model || '',
          project_name: fieldsValue.project_name || '',
          settlement_status: 0,
        },
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { location, form, dispatch } = this.props;
    const patharr = location.pathname.split('/');
    const role = patharr[patharr.length - 2];
    form.resetFields();
    const menuMap = {
      bj: 'DR_001',
      sh: 'DR_002',
      dkh: 'DR_003',
      sz: 'DR_004',
    };
    this.setState({
      data_role: menuMap[role],
      pageNum: 1,
      pageSize: '10',
      sendpack_model: '',
      project_name: '',
    });
    const { data_role, sendpack_model } = this.state;
    dispatch({
      type: 'settlement/loadQueryProjectSettlementDataModel',
      payload: {
        data_role,
        pageNum: 1,
        pageSize: '10',
        sendpack_model,
        settlement_status: 0,
      },
    });
  };

  render() {
    const {
      settlement: { queryProjectSettlementData },
      loading,
    } = this.props;
    let newArr = [];
    this.columns.map(item => {
      newArr.push(item.width);
    });
    const newMaxWidth = _.sum(newArr);
    const twidth = document.getElementById('tabMain').clientWidth - 120;
    return (
      <Card loading={false} bordered={false} className={styles.tableList}>
        <div className={styles.tableListForm}>{this.renderSearch()}</div>
        <div style={{ width: twidth }}>
          <Table
            dataSource={queryProjectSettlementData ? queryProjectSettlementData.list || [] : []}
            columns={this.columns}
            loading={loading}
            rowKey="project_code"
            pagination={paginations(queryProjectSettlementData)}
            onChange={this.handleTableChange}
            scroll={{ x: newMaxWidth }}
          />
        </div>
      </Card>
    );
  }
  handleTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    this.setState(
      {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      },
      () => {
        dispatch({
          type: 'settlement/loadQueryProjectSettlementDataModel',
          payload: {
            data_role: this.state.data_role,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            sendpack_model: this.state.sendpack_model || '',
            project_name: this.state.project_name || '',
            settlement_status: 0,
          },
        });
      }
    );
  };

  // 结算
  handleFlag = project_code => {
    const { dispatch } = this.props;
    dispatch({
      type: 'settlement/loadFinalConfirmSettlementModel',
      payload: {
        project_code,
      },
    }).then(res => {
      if (res && res.code == 200) {
        message.success('最终结算成功！');
        dispatch({
          type: 'settlement/loadQueryProjectSettlementDataModel',
          payload: {
            data_role: this.state.data_role,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            sendpack_model: this.state.sendpack_model,
            project_name: this.state.project_name,
            settlement_status: 0,
          },
        });
      } else {
        message.error(res.message);
      }
    });
  };
}

export default NoSettlement;
