import React, { Component } from 'react';
import { Drawer, Button, Table, Row, Col, Form, Input, message } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
@connect(({ customer, loading }) => ({
  customer,
  loadding: loading.effects['customer/query'],
}))
@Form.create()
class UserInfoDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        customerCode: '',
        customerName: '',
        sellUserId: '',
        status: [],
        source: [],
        dataRole: [],
        uid: '',
        date: null,
      },
      pageNum: 1,
      selectedRowKeys: [],
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.zid) {
      this.setState({ selectedRowKeys: [nextProps.zid] });
    }
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/query',
      payload: {
        ...this.state.formValues,
        flag: 'false',
      },
    });
  }
  columns = [
    {
      title: '线索名称',
      dataIndex: 'customer_name',
    },
    {
      title: '公司名称',
      dataIndex: 'company_name',
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
    },
  ];

  onClose = () => {
    this.props.close(false);
  };
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        pageNum: this.state.pageNum,
      };
      this.setState({
        formValues: values,
        pageNum: 1,
      });
      dispatch({
        type: 'customer/query',
        payload: values,
      });
    });
  };
  renderSearch() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={14} sm={24}>
            <FormItem label="线索名称" style={{ display: 'flex' }}>
              {getFieldDecorator('customerName')(<Input placeholder="请输入线索名称" />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            {/* <Button style={{ marginLeft: 8 }} onClick={this.toCustomerInfo}>
                  选取
                </Button> */}
          </div>
        </div>
      </Form>
    );
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
    this.props.infoData(selectedRows[0]);
  };
  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pageNum: pagination.current,
    });
    const values = {
      ...this.state.formValues,
      pageNum: pagination.current,
      flag: 'false',
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/query',
      payload: values,
    });
  };
  rowDouble = rec => {
    this.props.infoData(rec);
  };

  render() {
    const {
      visible,
      customer: { data },
      loadding,
    } = this.props;
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
      //hideDefaultSelections:true,
    };
    return (
      <Drawer
        width="550"
        title="信息"
        placement="right"
        closable={true}
        onClose={this.onClose}
        visible={visible}
      >
        <div>{this.renderSearch()}</div>
        <Table
          dataSource={data.list}
          columns={this.columns}
          rowSelection={rowSelection}
          rowKey={record => record.zid}
          loading={loadding}
          pagination={{
            pageSize: 10,
            hideOnSinglePage: true,
            current: data.curPage,
            total: data.recordTotal,
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
}

export default UserInfoDrawer;
