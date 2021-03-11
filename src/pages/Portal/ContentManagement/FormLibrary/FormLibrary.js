/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:51:19 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-01 19:42:23
 * 专题库
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, Row, Col, Input, message, Tag, Table, Popconfirm, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { paginations, successIcon, waringInfo, errorIcon } from '@/utils/utils';
import styles from './index.less';
const Search = Input.Search;
const { confirm } = Modal;
import TagSelect from '@/components/TagSelect';

@connect(({ ProjectLibrary, loading }) => ({
  ProjectLibrary,
  loading: loading.effects['ProjectLibrary/pageListModel'],
}))
class ProjectLibrary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  componentDidMount() {
    this.getList();
  }
  render() {
    return (
      <div>
        <PageHeaderWrapper>
          <Card bordered={false}>{this.renderSearch()}</Card>
          <Card bordered={false} style={{ marginTop: 16 }}>
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                const { dispatch } = this.props;
                dispatch({
                  type: 'ProjectLibrary/saveDataModel',
                  payload: {
                    key: 'status',
                    value: 0,
                  },
                });
                router.push('/portal/contentmanagement/ProjectLibrary/add');
              }}
            >
              创建专题
            </Button>
            {this.renderTable()}
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
  renderSearch() {
    const {
      ProjectLibrary: { fromData },
    } = this.props;
    let value = [];
    value.push(fromData.specialStatus);
    return (
      <div className={styles.wrap}>
        <Search
          onSearch={value => this.thSearch(value)}
          placeholder={'可通过专题标题/专题链接进行搜索'}
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
              <TagSelect.Option value="0">未发布</TagSelect.Option>
            </TagSelect>
          </div>
        </div>
      </div>
    );
  }
  renderTable() {
    const {
      ProjectLibrary: { siteList },
      loading,
    } = this.props;
    const columns = [
      {
        title: '专题',
        dataIndex: 'specialTitle',
      },
      {
        title: '专题链接',
        dataIndex: 'specialUrl',
        render: (t, r) => {
          return t;
        },
      },
      {
        title: '状态',
        dataIndex: 'specialStatus',
        render: (t, r) => {
          let status;
          switch (t) {
            case 0:
              status = (
                <span>
                  <span className={styles.ico1} />
                  未发布
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
                  const { dispatch } = this.props;
                  dispatch({
                    type: 'ProjectLibrary/saveDataModel',
                    payload: {
                      key: 'status',
                      value: 0,
                    },
                  });
                  router.push(`/portal/contentmanagement/ProjectLibrary/add?uid=${r.specialUid}`);
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
                  router.push(
                    `/portal/contentmanagement/ProjectLibrary/ConfigurationTopic?&uid=${
                      r.specialUid
                    }`
                  );
                }}
              >
                配置专题
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
        rowKey={record => record.specialUid}
        dataSource={siteList && siteList.list}
        columns={columns}
        onChange={this.handleTableChange}
        pagination={siteList && siteList.recordTotal > 10 ? paginations(siteList) : false}
      />
    );
  }
  handleFormSubmit = value => {
    if (value.length > 1) {
      value.splice(0, 1);
    }
    const {
      dispatch,
      ProjectLibrary: { fromData },
    } = this.props;
    fromData.specialStatus = value[0];
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
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
      ProjectLibrary: { fromData },
    } = this.props;
    dispatch({
      type: 'ProjectLibrary/pageListModel',
      payload: { ...fromData },
    });
  };
  // 停用启用
  handleToggleStatus = r => {
    const status = r.specialStatus;
    const { dispatch } = this.props;
    const that = this;
    confirm({
      title: status + '' === '0' ? '确认要停用当前工地吗？' : '确认要启用当前工地吗？',
      content:
        status + '' === '0' ? '停用后，将无法看到当前专题界面' : '启用后，将可以查看到当前专题界面',
      icon: status === '1' ? successIcon : waringInfo,
      onOk() {
        dispatch({
          type: 'ProjectLibrary/specialStatusModel',
          payload: { specialUid: r.specialUid, specialStatus: r.specialStatus === 1 ? 2 : 1 },
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
      title: '确认要删除当前专题吗?',
      content: '删除后，已填写的内容将无法恢复，请确认是否要删除',
      icon: errorIcon,
      onOk() {
        dispatch({
          type: 'ProjectLibrary/specialRemoveModel',
          payload: { specialUid: r.specialUid },
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
      type: 'ProjectLibrary/saveDataModel',
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
      ProjectLibrary: { fromData },
    } = this.props;
    fromData.pageNum = pagination.current;
    fromData.pageSize = pagination.pageSize;
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'fromData',
        value: fromData,
      },
    }).then(() => {
      this.getList();
    });
  };
}

export default ProjectLibrary;
