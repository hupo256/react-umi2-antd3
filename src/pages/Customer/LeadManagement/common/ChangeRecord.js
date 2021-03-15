/*
 * @Author: zqm 
 * @Date: 2021-01-28 17:56:05 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-03 17:33:24
 * 状态变更记录
 */
import React, { Component } from 'react';
import { Modal, Table, Tooltip } from 'antd';
import { connect } from 'dva';
import styles from '../LeadManage.less';
@connect(({ LeadManage, loading }) => ({
  LeadManage,
  loading: loading.effects['LeadManage/trackstatuslogModel'],
}))
class ChangeRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.queryData({ pageNum: 1, trackCode: this.props.record.trackCode });
  }

  render() {
    const columns = [
      {
        title: '变更时间',
        dataIndex: 'updateTime',
      },
      {
        title: '变更后状态',
        dataIndex: 'status',
      },
      {
        title: '变更前',
        dataIndex: 'statusOld',
      },
      {
        title: '变更原因',
        dataIndex: 'changeReason',
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
        title: '变更用户',
        dataIndex: 'creatorName',
      },
    ];
    const {
      LeadManage: { trackLogData },
    } = this.props;
    return (
      <Modal
        title={<span style={{ fontWeight: 600 }}>变更记录</span>}
        visible={this.props.visible}
        onCancel={this.props.handleCancel}
        maskClosable={false}
        width={850}
        footer={null}
      >
        <Table
          dataSource={trackLogData.list}
          columns={columns}
          scroll={{ y: 400 }}
          onChange={this.handleTableChange}
          pagination={{
            pageSize: 10,
            hideOnSinglePage: true,
            // size: 'small',
            current: trackLogData && trackLogData.curPage,
            total: trackLogData && trackLogData.recordTotal,
          }}
        />
      </Modal>
    );
  }
  handleTableChange = pagination => {
    this.queryData({ pageNum: pagination.current, trackCode: this.props.record.trackCode });
  };
  queryData = obj => {
    const { dispatch } = this.props;
    dispatch({
      type: 'LeadManage/trackstatuslogModel',
      payload: { ...obj },
    });
  };
}

export default ChangeRecord;
