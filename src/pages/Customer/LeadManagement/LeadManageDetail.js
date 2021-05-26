import React, { Component } from 'react';
import { Descriptions, Card, Icon, message, Row, Col } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { getQueryUrlVal } from '@/utils/utils';
import CluesEdit from './common/CluesEdit';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './LeadManage.less';
import { getauth } from '@/utils/authority';
@connect(({ LeadManage }) => ({
  LeadManage,
}))
class LeadManageDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clueVisible: false,
    };
  }

  componentDidMount() {
    this.getDetail();
  }
  render() {
    const permissionsBtn = getauth().permissions || [];
    const { trackDetail } = this.props.LeadManage;
    const map = {
      TS001: '#bfbfbf',
      TS002: '#1890ff',
      TS003: '#52c41a',
      TS004: 'blue',
      TS005: '#f5222d',
    };
    return (
      <div>
        <PageHeaderWrapper>
          <Card border="false">
            <Descriptions
              title={
                <span>
                  基本信息
                  {permissionsBtn.includes('BTN210519000001') && (
                    <span
                      style={{
                        color: '#fe6a30',
                        fontSize: 14,
                        fontWeight: 400,
                        marginLeft: 12,
                        cursor: 'pointer',
                      }}
                      onClick={() => this.setState({ clueVisible: true, record: trackDetail })}
                    >
                      <Icon type="edit" />
                      编辑
                    </span>
                  )}
                </span>
              }
            >
              <Descriptions.Item label="客户姓名">{trackDetail.name}</Descriptions.Item>
              <Descriptions.Item label="联系电话" span={2}>
                {trackDetail.mobile}
              </Descriptions.Item>

              <Descriptions.Item label="线索状态">
                <span className={styles.tableStatus}>
                  <span style={{ borderColor: map[trackDetail.status] }} />
                  <span>{trackDetail.statusName}</span>
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="来源渠道">
                {trackDetail.sourceChannelName}{' '}
              </Descriptions.Item>
              <Descriptions.Item label="推荐人">{trackDetail.referrerName}</Descriptions.Item>
            </Descriptions>
            <Row style={{ marginBottom: 20 }}>
              <Col span={8} style={{ paddingRight: 12 }}>
                <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>楼盘/楼宇</span> : {'    '}
                {trackDetail.address}
              </Col>
              <Col span={16}>
                <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>面积</span> :{'    '}
                {trackDetail.area}
                {trackDetail.area && <span>m²</span>}
              </Col>
            </Row>
            <Row style={{ marginBottom: 20 }}>
              <Col span={24}>
                <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>线索描述</span> : {'    '}
                {trackDetail.trackDesc}
              </Col>
            </Row>
          </Card>
        </PageHeaderWrapper>
        {this.state.clueVisible && (
          <CluesEdit
            visible={this.state.clueVisible}
            record={this.state.record}
            handleOk={r => this.handleClueOk(r)}
            handleCancel={() => this.handleClueCancel()}
          />
        )}
      </div>
    );
  }
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
        this.getDetail();
      }
    });
  };
  handleClueCancel = () => {
    this.setState({ clueVisible: false, record: null });
  };

  getDetail = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'LeadManage/trackGetModel',
      payload: { uid: getQueryUrlVal('uid') },
    });
  };
}

export default LeadManageDetail;
