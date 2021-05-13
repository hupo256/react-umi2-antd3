/*
 * @Author: zqm 
 * @Date: 2021-01-22 13:30:46 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-05-13 16:09:34
 * 线索列表
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Table, Button, Icon, message, Tooltip } from 'antd';
import styles from './LeadManage.less';
import ChangeStatus from './common/ChangeStatus';
import ChangeRecord from './common/ChangeRecord';
import CluesEdit from './common/CluesEdit';
import { paginations } from '@/utils/utils';
import { getauth } from '@/utils/authority';

@connect(({ LeadManage, loading }) => ({
  LeadManage,
  loading: loading.effects['LeadManage/projectquoteQueryModel'],
}))
class LeadManageTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeVisible: false,
      clueVisible: false,
      recordVisible: false,
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
        width: 200,
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
      },
      {
        title: '建筑面积',
        dataIndex: 'area',
        width: 150,
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
        width: 150,
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
        title: '推荐人',
        dataIndex: 'referrerName',
        width: 120,
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
              {permissionsBtn.includes('BTN210326000022') && (
                <span onClick={() => this.setState({ changeVisible: true, record: r })}>
                  变更状态
                </span>
              )}
              {permissionsBtn.includes('BTN210326000022') &&
                (permissionsBtn.includes('BTN210326000023') ||
                  permissionsBtn.includes('BTN210326000024')) && <span> | </span>}
              {permissionsBtn.includes('BTN210326000023') && (
                <span onClick={() => this.setState({ clueVisible: true, record: r })}>编辑</span>
              )}
              {permissionsBtn.includes('BTN210326000023') &&
                permissionsBtn.includes('BTN210326000024') && <span> | </span>}
              {permissionsBtn.includes('BTN210326000024') && (
                <span onClick={() => this.setState({ recordVisible: true, record: r })}>
                  变更记录
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
        {this.state.clueVisible && (
          <CluesEdit
            visible={this.state.clueVisible}
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
        message.success('状态变更成功');
        this.handleChangeCancel();
        // 刷新列表
        this.queryTrackData({});
      }
    });
  };
  handleChangeCancel = () => {
    this.setState({ changeVisible: false, record: null });
  };
  // 编辑
  handleClueOk = r => {
    const { dispatch } = this.props;
    dispatch({
      type: 'LeadManage/trackEditModel',
      payload: { ...r },
    }).then(res => {
      if (res && res.code === 200) {
        message.success('线索编辑成功');
        this.handleClueCancel();
        // 刷新列表
        this.queryTrackData({});
      }
    });
  };
  handleClueCancel = () => {
    this.setState({ clueVisible: false, record: null });
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
