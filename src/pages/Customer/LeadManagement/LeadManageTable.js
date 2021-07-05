/*
 * @Author: zqm 
 * @Date: 2021-01-22 13:30:46 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-05-26 18:52:39
 * 线索列表
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Table, Button, Icon, message, Tooltip } from 'antd';
import styles from './LeadManage.less';
import ChangeStatus from './common/ChangeStatus';
import ChangeRecord from './common/ChangeRecord';
import LeadManageAdd from './common/LeadManageAdd';
import { paginations } from '@/utils/utils';
import { getauth } from '@/utils/authority';

@connect(({ LeadManage, loading }) => ({
  LeadManage,
  loading: loading.effects['LeadManage/trackQueryModel'],
}))
class LeadManageTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeVisible: false,
      recordVisible: false,
      addVisble: false,
      record: null,
    };
  }

  componentDidMount() {
    this.queryTrackData({ pageNum: 1 });
  }

  render() {
    const permissionsBtn = getauth().permissions || [];
    const columns = [
      {
        title: '线索',
        dataIndex: 'name',
        width: 150,
        render: (t, r) => {
          return (
            <div className={styles.tableName}>
              <p>{r.name}</p>
              <p>{r.mobile}</p>
            </div>
          );
        },
      },
      {
        title: '线索描述',
        dataIndex: 'trackDesc',
        width: 300,
        render: text => {
          return (
            <div className={styles.remark}>
              <p style={{ width: 300, marginBottom: 0, maxHeight: 42, overflow: 'hidden' }}>
                <Tooltip title={text}>
                  <span className={styles.remarkspan} style={{ WebkitBoxOrient: 'vertical' }}>
                    {text}
                  </span>
                </Tooltip>
              </p>
            </div>
          );
        },
      },
      {
        title: '楼盘/楼宇',
        dataIndex: 'address',
        width: 200,
        render: text => {
          return (
            <div className={styles.remark}>
              <p style={{ width: 200, marginBottom: 0, maxHeight: 42, overflow: 'hidden' }}>
                <Tooltip title={text}>
                  <span className={styles.remarkspan} style={{ WebkitBoxOrient: 'vertical' }}>
                    {text}
                  </span>
                </Tooltip>
              </p>
            </div>
          );
        },
      },
      {
        title: '建筑面积',
        dataIndex: 'area',
        width: 120,
        render: text => {
          return text ? (
            <span>
              {text}
              m²
            </span>
          ) : (
            ''
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'statusName',
        width: 120,
        render: (t, r) => {
          const map = {
            TS001: '#bfbfbf',
            TS002: '#1890ff',
            TS003: '#52c41a',
            TS004: 'blue',
            TS005: '#f5222d',
          };
          return (
            <span className={styles.tableStatus}>
              <span style={{ borderColor: map[r.status] }} />
              <span>{t}</span>
            </span>
          );
        },
      },
      {
        title: '来源渠道',
        dataIndex: 'sourceChannelName',
        width: 200,
        render: text => {
          return (
            <div className={styles.remark}>
              <p style={{ width: 200, marginBottom: 0, maxHeight: 42, overflow: 'hidden' }}>
                <span className={styles.remarkspan} style={{ WebkitBoxOrient: 'vertical' }}>
                  {text}
                </span>
              </p>
            </div>
          );
        },
      },
      {
        title: '留资方式',
        dataIndex: 'trackInputTypeName',
        width: 120,
      },
      {
        title: '推荐人',
        dataIndex: 'referrerName',
        width: 120,
        render: (t, r) => {
          return (
            <div className={styles.tableName}>
              <p>{r.referrerName}</p>
              <p>{r.referrerPhone}</p>
            </div>
          );
        },
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        width: 180,
        // sorter: true,
      },
      {
        title: '操作',
        dataIndex: 'operate',
        width: 220,
        render: (t, r) => {
          return (
            <span className={styles.operate}>
              {/* {permissionsBtn.includes('MU900000020001') && (
                <span
                  onClick={() => {
                    router.push(`/customer/detail?uid=${r.uid}`);
                  }}
                >
                  详情
                </span>
              )} */}
              <span
                onClick={() => {
                  router.push(`/customer/detail?uid=${r.uid}`);
                }}
              >
                详情
              </span>
              {permissionsBtn.includes('MU900000020001') &&
                (permissionsBtn.includes('BTN210526000002') ||
                  permissionsBtn.includes('BTN210526000003')) && <span> | </span>}
              {permissionsBtn.includes('BTN210526000002') && (
                <span onClick={() => this.setState({ changeVisible: true, record: r })}>
                  写跟进
                </span>
              )}
              {permissionsBtn.includes('BTN210526000002') &&
                permissionsBtn.includes('BTN210526000003') && <span> | </span>}
              {permissionsBtn.includes('BTN210526000003') && (
                <span onClick={() => this.setState({ recordVisible: true, record: r })}>
                  跟进记录
                </span>
              )}
            </span>
          );
        },
      },
    ];
    const {
      loading,
      LeadManage: { trackData },
    } = this.props;
    return (
      <div style={{ marginTop: 20 }}>
        <Card bordered={false}>
          <Button style={{ marginBottom: 16 }} onClick={() => this.setState({ addVisble: true })}>
            <Icon type="plus" />
            创建线索
          </Button>
          {permissionsBtn.includes('BTN210326000021') && (
            <Button style={{ marginBottom: 16 }} onClick={() => this.handleDownload()}>
              导出Excel
              <Icon type="download" />
            </Button>
          )}

          <Table
            loading={loading}
            dataSource={trackData.list}
            columns={columns}
            rowKey={(t, r) => r}
            onChange={this.handleTableChange}
            scroll={{ x: 1600 }}
            pagination={trackData && paginations(trackData)}
          />
        </Card>

        {this.state.changeVisible && (
          <ChangeStatus
            visible={this.state.changeVisible}
            record={this.state.record}
            handleOk={r => this.handleChangeOk(r)}
            handleCancel={() => this.handleChangeCancel()}
          />
        )}
        {this.state.addVisble && (
          <LeadManageAdd
            {...this.props}
            visible={this.state.addVisble}
            record={this.state.record}
            handleOk={r => this.handleClueOk(r)}
            handleCancel={() => this.handleClueCancel()}
          />
        )}
        {this.state.recordVisible && (
          <ChangeRecord
            visible={this.state.recordVisible}
            record={this.state.record}
            handleCancel={() => this.handleRecordCancel()}
          />
        )}
      </div>
    );
  }
  //
  //导出
  handleDownload = () => {
    const {
      dispatch,
      LeadManage: { trackDataSearch },
    } = this.props;
    const exportLoading = message.loading('正在导出，请稍等~', 0);
    // 导出线索列表数据
    dispatch({
      type: 'LeadManage/trackExportCriteriaModel',
      payload: { ...trackDataSearch },
    }).then(res => {
      setTimeout(exportLoading, 100);
    });
  };
  // 分页
  handleTableChange = pagination => {
    this.queryTrackData({ pageNum: pagination.current, pageSize: pagination.pageSize });
  };
  // 变更状态
  handleChangeOk = r => {
    // 变更状态
    const { dispatch } = this.props;
    dispatch({
      type: 'LeadManage/trackEditStatusModel',
      payload: { ...r },
    }).then(res => {
      if (res && res.code === 200) {
        message.success('跟进成功');
        this.handleChangeCancel();
        // 刷新列表
        this.queryTrackData({});
      }
    });
  };
  handleChangeCancel = () => {
    this.setState({ changeVisible: false, record: null });
  };
  // 新建

  handleClueOk = r => {
    const { dispatch } = this.props;
    const parm = {
      mobile: r.mobile,
      name: r.name,
      status: r.status,
      trackAddress: r.address,
      trackArea: r.area,
      trackDesc: r.trackDesc,
      trackReferCode: r.referrerCode,
      trackReferName: r.referrerName,
      trackReferPhone: r.referrerPhone,
      trackSource: r.trackInputType,
    };
    dispatch({
      type: 'LeadManage/trackAddModel',
      payload: parm,
    }).then(res => {
      if (res && res.code === 200) {
        message.success('创建成功');
        this.handleClueCancel();
        // 刷新列表
        this.queryTrackData({});
      }
    });
  };
  handleClueCancel = () => {
    this.setState({ addVisble: false });
  };
  // 变更记录
  handleRecordCancel = () => {
    this.setState({ recordVisible: false, record: null });
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

export default LeadManageTable;
