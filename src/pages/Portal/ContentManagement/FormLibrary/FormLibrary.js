/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:51:19 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-17 14:57:10
 * 专题库
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, Row, Col, Input, message, Tag, Table, Popconfirm, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { paginations, successIcon, waringInfo, errorIcon } from '@/utils/utils';
import FormAdd from './FormComponent/FormAdd';
import FormConfiguration from './FormComponent/FormConfiguration';
import styles from './index.less';
const Search = Input.Search;
const { confirm } = Modal;
import TagSelect from '@/components/TagSelect';

@connect(({ FormLibrary, loading }) => ({
  FormLibrary,
  loading: loading.effects['FormLibrary/pageListModel'],
}))
class ProjectLibrary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      visible: false,
      title: '',
      formUid: '',
      data: '',
      visibleForm: false,
    };
  }

  componentDidMount() {
    this.getList();
  }
  render() {
    const { visible, title, data, formUid, visibleForm } = this.state;
    return (
      <div>
        <PageHeaderWrapper>
          <Card bordered={false}>{this.renderSearch()}</Card>
          <Card bordered={false} style={{ marginTop: 16 }}>
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                this.setState({
                  visible: true,
                  title: '创建表单',
                  formUid: '',
                  data: '',
                });
              }}
            >
              创建表单
            </Button>
            {this.renderTable()}
            <FormAdd
              visible={visible}
              title={title}
              data={data}
              formUid={formUid}
              handleCancel={this.handleCancel}
              handleList={() => {
                this.handleList();
              }}
            />
          </Card>
        </PageHeaderWrapper>
        {visibleForm ? (
          <FormConfiguration
            formUid={formUid}
            handleCancel={this.handleCancelForm}
            handleAdd={this.handleAddConfig}
          />
        ) : null}
      </div>
    );
  }
  renderSearch() {
    const {
      FormLibrary: { fromData },
    } = this.props;
    let value = [];
    value.push(fromData.formStatus);
    return (
      <div className={styles.wrap}>
        <Search
          onSearch={value => this.thSearch(value)}
          placeholder={'可通过表单标题进行搜索'}
          className={styles.ser}
          defaultValue={fromData.searchText}
        />
        <div className={styles.status}>
          <div className={styles.fl}>状态：</div>
          <div className={styles.flr}>
            <TagSelect onChange={this.handleFormSubmit} value={value} hideCheckAll={true}>
              <TagSelect.Option value="">全部</TagSelect.Option>
              <TagSelect.Option value="1">正常</TagSelect.Option>
              <TagSelect.Option value="2">停用</TagSelect.Option>
              <TagSelect.Option value="0">待配置</TagSelect.Option>
            </TagSelect>
          </div>
        </div>
      </div>
    );
  }
  renderTable() {
    const {
      FormLibrary: { formList },
      loading,
    } = this.props;
    const columns = [
      {
        title: '表单标题',
        dataIndex: 'formTitle',
      },
      {
        title: '适用终端',
        dataIndex: 'terminalType',
        render: (t, r) => {
          let type;
          switch (t) {
            case 0:
              type = '小程序';
              break;
            case 1:
              type = 'PC';
              break;
            default:
              type = '/';
              break;
          }
          return type;
        },
      },
      {
        title: '表单类型',
        dataIndex: 'formType',
        render: (t, r) => {
          return t === 0 ? '浮窗' : null;
        },
      },
      {
        title: '状态',
        dataIndex: 'formStatus',
        render: (t, r) => {
          let status;
          switch (t) {
            case 0:
              status = (
                <span>
                  <span className={styles.ico1} />
                  待配置
                </span>
              );
              break;
            case 1:
              status = (
                <span>
                  <span className={styles.ico2} />
                  正常
                </span>
              );
              break;
            case 2:
              status = (
                <span>
                  <span className={styles.ico3} />
                  停用
                </span>
              );
              break;
          }
          return (t = status);
        },
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        render: (t, r) => {
          return (
            <div>
              <p>{t}</p>
              <p>{r.operatorName}</p>
            </div>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        render: (t, r) => {
          return (
            <div className="operateWrap">
              <span
                className="operateBtn"
                onClick={() => {
                  this.handleEdit(r);
                }}
              >
                编辑
              </span>
              {r.specialStatus !== 0 ? (
                <span>
                  <span className="operateLine" />
                  <span className="operateBtn" onClick={() => this.handleToggleStatus(r)}>
                    {r.specialStatus === 0 || r.specialStatus === 2 ? '启用' : '停用'}
                  </span>
                </span>
              ) : null}
              <span className="operateLine" />
              <span className="operateBtn" onClick={() => this.handleDelete(r)}>
                删除
              </span>
              <span className="operateLine" />
              <span
                className="operateBtn"
                onClick={() => {
                  this.addFormConfiguration(r);
                }}
              >
                配置表单
              </span>
            </div>
          );
        },
      },
    ];
    return (
      <Table
        loading={loading}
        style={{ marginTop: 20 }}
        rowKey={record => record.formUid}
        dataSource={formList && formList.list}
        columns={columns}
        onChange={this.handleTableChange}
        pagination={formList && formList.recordTotal > 10 ? paginations(formList) : false}
      />
    );
  }
  handleFormSubmit = value => {
    if (value.length > 1) {
      value.splice(0, 1);
    }
    const {
      dispatch,
      FormLibrary: { fromData },
    } = this.props;
    fromData.formStatus = value[0];
    dispatch({
      type: 'FormLibrary/saveDataModel',
      payload: {
        key: 'fromData',
        value: fromData,
      },
    }).then(() => {
      this.getList();
    });
  };
  getList = () => {
    const {
      dispatch,
      FormLibrary: { fromData },
    } = this.props;
    dispatch({
      type: 'FormLibrary/pageListModel',
      payload: { ...fromData },
    });
  };
  // 停用启用
  handleToggleStatus = r => {
    const status = r.specialStatus;
    const { dispatch } = this.props;
    const that = this;
    confirm({
      title: status + '' === '0' ? '确认要停用当前表单吗？' : '确认要启用当前表单吗？',
      content:
        status + '' === '0'
          ? '停用后，将无法关联当前表单(已关联的不受影响)'
          : '启用后，将可以关联使用表单',
      icon: status === '1' ? successIcon : waringInfo,
      onOk() {
        dispatch({
          type: 'FormLibrary/formStatusModel',
          payload: { formUid: r.formUid, formStatus: r.formStatus === 1 ? 2 : 1 },
        }).then(res => {
          if (res && res.code === 200) {
            message.success('操作成功');
            that.getList({});
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  handleDelete = r => {
    const { dispatch } = this.props;
    const that = this;
    confirm({
      title: '确认要删除当前表单吗?',
      content: '删除后，已填写的内容将无法恢复，请确认是否要删除',
      icon: errorIcon,
      onOk() {
        dispatch({
          type: 'FormLibrary/formRemoveModel',
          payload: { formUid: r.formUid },
        }).then(res => {
          if (res && res.code === 200) {
            message.success('操作成功');
            that.getList({});
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  thSearch(value) {
    const {
      dispatch,
      ProjectLibrary: { fromData },
    } = this.props;
    fromData.searchText = value;
    dispatch({
      type: 'FormLibrary/saveDataModel',
      payload: {
        key: 'fromData',
        value: fromData,
      },
    }).then(() => {
      this.getList();
    });
  }
  handleTableChange = pagination => {
    const {
      dispatch,
      FormLibrary: { fromData },
    } = this.props;
    fromData.pageNum = pagination.current;
    fromData.pageSize = pagination.pageSize;
    dispatch({
      type: 'FormLibrary/saveDataModel',
      payload: {
        key: 'fromData',
        value: fromData,
      },
    }).then(() => {
      this.getList();
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  handleCancelForm = () => {
    this.setState({
      visibleForm: false,
    });
  };
  handleList() {
    this.setState(
      {
        visible: false,
      },
      () => {
        this.getList();
      }
    );
  }
  handleEdit(t) {
    const { dispatch } = this.props;
    dispatch({
      type: 'FormLibrary/formGetModel',
      payload: { formUid: t.formUid },
    }).then(res => {
      if (res && res.code === 200) {
        this.setState({
          title: '编辑表单',
          data: res.data,
          visible: true,
          formUid: t.formUid,
        });
      }
    });
  }
  addFormConfiguration(t) {
    this.setState({
      formUid: t.formUid,
      visibleForm: true,
    });
  }
  handleAddConfig = () => {
    this.setState(
      {
        visibleForm: false,
      },
      () => {
        this.getList({});
      }
    );
  };
}

export default ProjectLibrary;
