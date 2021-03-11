import React, { Component } from 'react';
import { Drawer, Button, Table, Row, Col, Form, Input } from 'antd';
import { connect } from 'dva';

let Tags = [];
const FormItem = Form.Item;
@connect(({ base, loading }) => ({
  base,
  loadding: loading.effects['base/requestquery'],
}))
@Form.create()
class PersonnelDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      tags: {},
      params: {
        deptCode: '',
        endTime: '',
        pageNum: 1,
        startTime: '',
        status: 1,
        userName: '',
      },
      ipt: '',
      val: '',
    };
  }
  columns = [
    {
      title: '姓名',
      dataIndex: 'real_name',
    },
    // {
    //   title: '联系方式',
    //   dataIndex: 'mobile',
    // },
  ];
  onClose = () => {
    this.props.closePersonnelDrawer(false);
  };
  componentWillReceiveProps(nextProps, p) {
    if (nextProps.selectids) {
      this.setState({ selectedRowKeys: nextProps.selectids });
    }
  }

  // componentWillMount() {
  //   const { selectids } = this.props;
  //   console.log(selectids);
  //   this.setState({
  //     selectedRowKeys: selectids,
  //   });
  // }

  componentDidMount() {
    const { params } = this.state;
    const { dispatch, roleid, initperson } = this.props;
    dispatch({
      type: 'base/requestquery',
      params: {
        ...params,
        data_role: '',
      },
    }).then(() => {
      if (initperson) {
        let initss = [];
        for (var index = 0; index < initperson.length; index++) {
          Tags.push(initperson[index].key * 1);
          initss.push({
            zid: initperson[index].key * 1,
            real_name: initperson[index].props.children,
          });
        }
        this.setState({
          tags: {
            ...this.state.tags,
            0: initss,
          },
        });
      }
    });
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    const {
      base: { personnels },
    } = this.props;
    const key = this.state.ipt ? this.state.ipt : personnels.curPage;
    this.setState(
      {
        tags: {
          ...this.state.tags,
          [key]: selectedRows,
        },
      },
      () => {
        const arr = Array.prototype.concat.apply([], Object.values(this.state.tags));
        let array = [];
        let zids = [];
        for (var n = 0; n < arr.length; n++) {
          if (zids.indexOf(arr[n].zid) == -1) {
            zids.push(arr[n].zid);
            array.push(arr[n]);
          }
        }
        this.props.propsTags(array);
      }
    );
    this.setState({ selectedRowKeys });
  };
  handleTableChange = (pagination, filters, sorter) => {
    const { dispatch, roleid } = this.props;
    this.setState({
      pageNum: pagination.current,
    });
    const values = {
      ...this.state.params,
      pageNum: pagination.current,
      data_role: '',
    };
    dispatch({
      type: 'base/requestquery',
      params: values,
    });
  };
  handleSearch = e => {
    e && e.preventDefault();
    const { dispatch, form, roleid } = this.props;
    form.validateFields((err, params) => {
      if (err) return;
      this.setState({
        ipt: params.userName,
      });
      const values = {
        ...this.state.params,
        userName: params.userName,
        data_role: '',
      };
      dispatch({ type: 'base/requestquery', params: values });
    });
  };
  renderSearch() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 18 },
      },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={14} sm={24} xs={12}>
            <FormItem {...formItemLayout} label="人员名称" style={{ display: 'flex' }}>
              {getFieldDecorator('userName')(
                <Input placeholder="请输入人员名称" onChange={this.inputChange} />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" onClick={this.handleResetClick}>
              重置
            </Button>
          </div>
        </div>
      </Form>
    );
  }
  rowDouble = record => {
    const {
      base: { personnels },
    } = this.props;
    let selectedRowKeys = [...this.state.selectedRowKeys];
    const key = this.state.ipt ? this.state.ipt : personnels.curPage;
    if (selectedRowKeys.indexOf(record.zid) !== -1) {
      for (var i = 0; i < selectedRowKeys.length; i++) {
        if (selectedRowKeys[i] == record.zid) {
          selectedRowKeys.splice(i, 1);
        }
      }
      let arr1 = this.state.tags[0];
      for (var i = 0; i < arr1.length; i++) {
        if (arr1[i].zid == record.zid) {
          arr1.splice(i, 1);
        }
      }
      this.setState(
        {
          selectedRowKeys,
          tags: {
            ...this.state.tags,
            [key]: arr1,
          },
        },
        () => {
          let arr = Array.prototype.concat.apply([], Object.values(this.state.tags));
          let array = [];
          let zids = [];
          for (var n = 0; n < arr.length; n++) {
            if (zids.indexOf(arr[n].zid) == -1) {
              zids.push(arr[n].zid);
              array.push(arr[n]);
            }
          }
          this.props.propsTags(array);
        }
      );
    } else {
      let arr = this.state.tags[0];
      arr.push(record);
      this.setState(
        {
          selectedRowKeys: [...this.state.selectedRowKeys, record.zid],
          tags: {
            ...this.state.tags,
            [key]: arr,
          },
        },
        () => {
          let arr = Array.prototype.concat.apply([], Object.values(this.state.tags));
          let array = [];
          let zids = [];
          for (var n = 0; n < arr.length; n++) {
            if (zids.indexOf(arr[n].zid) == -1) {
              zids.push(arr[n].zid);
              array.push(arr[n]);
            }
          }
          this.props.propsTags(array);
        }
      );
    }
  };
  onSelect(record, selected) {
    const { initperson } = this.props;
    if (initperson && Tags.indexOf(record.zid) != -1) {
      let initss = [];
      this.state.tags[0].forEach((v, n) => {
        if (record.zid != v.zid) {
          initss.push(v);
        }
      });
      Tags.splice(Tags.indexOf(record.zid), 1);
      this.setState({
        tags: {
          ...this.state.tags,
          0: initss,
        },
      });
    } else {
      if (selected) return;
      const { tags } = this.state;
      const obj = {};
      for (let i in tags) {
        let arr = [];
        tags[i].map((v, n) => {
          if (v.zid != record.zid) {
            arr.push(v);
          }
        });
        obj[i] = arr;
      }
      this.setState({
        tags: obj,
      });
    }
  }

  render() {
    const {
      Personnelvisible,
      base: { personnels },
      loadding,
    } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelect.bind(this),
      hideDefaultSelections: 'true',
    };
    let tabledata = [];
    if (personnels && personnels.list) {
      personnels.list.forEach(element => {
        tabledata.push(Object.assign(element, { key: element.zid }));
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
        <div>{this.renderSearch()}</div>
        <div style={{ display: 'flex', background: '#f1f1f1', padding: '10px 0' }}>
          <span style={{ flexBasis: '30%', textAlign: 'center', fontWeight: 'bold' }}>姓名</span>
          {/*<span style={{ flexBasis: '70%', textAlign: 'center', fontWeight: 'bold' }}>
            联系方式
    </span>*/}
        </div>
        <Table
          showHeader={false}
          dataSource={tabledata}
          columns={this.columns}
          rowSelection={rowSelection}
          rowKey={record => record.zid}
          loading={loadding}
          pagination={{
            pageSize: 10,
            hideOnSinglePage: true,
            current: personnels.curPage,
            total: personnels.recordTotal,
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
  componentWillUnmount() {
    Tags = [];
  }

  handleResetClick = e => {
    this.setState({ val: '' });
    this.props.form.resetFields();
    this.handleSearch();
  };

  inputChange = e => {
    this.setState({ val: e.target.value }, () => {
      this.handleSearch();
    });
  };
}

export default PersonnelDrawer;
