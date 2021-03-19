/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:47:07 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-19 12:12:53
 * 工地库
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Divider, Table, Button, Icon, Input, Dropdown, Menu, Modal, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { paginations, getUrl, successIcon, waringInfo } from '@/utils/utils';
import styles from './SiteLibrary.less';
import DynamicAdd from './DynamicAdd';
import FromProjectModel from './FromProjectModel';
const { confirm } = Modal;
const { Search } = Input;

@connect(({ SiteLibrary, loading }) => ({
  SiteLibrary,
  maintainListLoading: loading.effects['Maintain/maintainQueryModel'],
}))
class SiteLibrary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      visible: false,
      record: null,
      porjectVisible: false,
      searchWord: null,
    };
  }

  componentDidMount() {
    this.getList({ pageNum: 1 });
  }

  render() {
    const { status, visible, record, porjectVisible } = this.state;
    const {
      SiteLibrary: { siteList },
    } = this.props;

    const columns = [
      {
        title: '工地',
        dataIndex: 'gongdiTitle',
        render: (t, r) => {
          return (
            <div>
              <p>
                {(r.gongdiFromType && <Icon type="link" style={{ color: '#fe6a30' }} />) || null}{' '}
                {t}
              </p>
              <p>
                {(r.houseType.bedroom && (
                  <span className={`${styles.siteTag} ${styles.siteTag1}`}>
                    {r.houseType.bedroom && `${r.houseType.bedroom}居室 `}
                  </span>
                )) ||
                  null}
                <span className={`${styles.siteTag} ${styles.siteTag2}`}>
                  {r.buildingArea}
                  m²
                </span>
                <span className={`${styles.siteTag} ${styles.siteTag3}`}>
                  {r.renovationCosts}万
                </span>
                <span className={`${styles.siteTag} ${styles.siteTag4}`}>{r.houseStyleName}</span>
              </p>
            </div>
          );
        },
      },
      {
        title: '阶段',
        dataIndex: 'gongdiStageName',
        render: (t, r) => {
          return t || '/';
        },
      },
      {
        title: '状态',
        dataIndex: 'gongdiStatus',
        render: (t, r) => {
          return t === 1 ? '停用' : '正常';
        },
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        render: (t, r) => {
          return (
            <div>
              <p>{t}</p>
              <p>{r.operatorName || '/'}</p>
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
                onClick={() =>
                  this.setState({ record: r }, () => {
                    this.setState({ visible: true });
                  })
                }
              >
                创建动态
              </span>
              <span className="operateLine" />
              <span
                className="operateBtn"
                onClick={() => {
                  router.push(`/portal/contentmanagement/sitelibrary/edit?uid=${r.gongdiUid}`);
                }}
              >
                编辑{' '}
              </span>
              <span className="operateLine" />
              <span className="operateBtn" onClick={() => this.handleToggleStatus(r)}>
                {r.gongdiStatus === 1 ? '启用' : '停用'}{' '}
              </span>
              <span className="operateLine" />
              <span
                className="operateBtn"
                onClick={() => {
                  router.push(`/portal/contentmanagement/sitelibrary/dynamic?uid=${r.gongdiUid}&status=${r.gongdiStage}`);
                }}
              >
                工地动态
              </span>
            </div>
          );
        },
      },
    ];
    const menu = (
      <Menu>
        <Menu.Item>
          <p
            style={{ margin: 0 }}
            onClick={() => {
              router.push(`/portal/contentmanagement/sitelibrary/add`);
            }}
          >
            新工地
          </p>
        </Menu.Item>
        <Menu.Item>
          <p
            style={{ margin: 0,display:'none' }}
            onClick={() => {
              this.setState({ porjectVisible: true });
            }}
          >
            从已有工地选择
          </p>
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <PageHeaderWrapper>
          <Card bordered={false}>
            <Search
              placeholder="可通过工地标题 / 楼盘进行集联搜索"
              value={this.state.searchWord}
              onChange={e => this.setState({ searchWord: e.target.value })}
              onSearch={value => this.handleSrarch()}
              onPressEnter={() => this.handleSrarch()}
              onBlur={() => this.handleSrarch()}
              style={{ width: 600 }}
            />
            <Divider dashed />
            <p>
              状态：
              <span
                onClick={() => this.handleSrarchStatus(null)}
                className={`${styles.status} ${!status && styles.statusCur}`}
              >
                全部
              </span>
              <span
                onClick={() => this.handleSrarchStatus('0')}
                className={`${styles.status} ${status == '0' && styles.statusCur}`}
              >
                正常
              </span>
              <span
                onClick={() => this.handleSrarchStatus('1')}
                className={`${styles.status} ${status == '1' && styles.statusCur}`}
              >
                停用
              </span>
            </p>
          </Card>

          <Card bordered={false} style={{ marginTop: 20 }}>
            <Dropdown trigger={['click']} overlay={menu}>
              <Button type="primary">
                <Icon type="plus" />
                创建工地
              </Button>
            </Dropdown>
            <Table
              loading={false}
              style={{ marginTop: 20 }}
              rowKey={record => record.uid}
              dataSource={siteList && siteList.list}
              columns={columns}
              onChange={this.handleTableChange}
              pagination={(siteList && paginations(siteList)) || false}
            />
          </Card>
        </PageHeaderWrapper>
        {visible && (
          <DynamicAdd
            record={record}
            visible={visible}
            status={record.gongdiStage}
            handleOk={() => this.handleOk()}
            handleCancel={() => this.handleCancel()}
          />
        )}
        {porjectVisible && (
          <FromProjectModel visible={porjectVisible} handleCancel={() => this.handleFromCancel()} />
        )}
      </div>
    );
  }
  handleSrarchStatus = status => {
    this.setState({ status }, () => {
      this.getList({ gongdiStatus: status === '0' ? 0 : status === '1' ? 1 : null,pageNum:1 });
    });
  };
  handleSrarch = () => {
    const { searchWord } = this.state;
    this.getList({ searchText: searchWord ,pageNum:1});
  };
  // 分页
  handleTableChange = pagination => {
    this.getList({ pageNum: pagination.current, pageSize: pagination.pageSize });
  };
  getList = obj => {
    const {
      dispatch,
      SiteLibrary: { siteListQuery },
    } = this.props;
    dispatch({
      type: 'SiteLibrary/siteListModel',
      payload: { ...siteListQuery, ...obj },
    });
  };

  handleOk = () => {
    this.setState({ visible: false, record: null });
  };
  handleCancel = () => {
    this.setState({ visible: false, record: null });
  };

  // 停用启用
  handleToggleStatus = r => {
    const status = r.gongdiStatus;
    const { dispatch } = this.props;
    const that = this;
    console.log(status);
    console.log(r);
    confirm({
      title: status + '' === '0' ? '确认要停用当前工地吗？' : '确认要启用当前工地吗？',
      content:
        status + '' === '0'
          ? '停用后，将无法在工地模块显示当前案例！'
          : '启用后，将会在工地模块显示当前案例！',
      icon: status === '1' ? successIcon : waringInfo,
      onOk() {
        dispatch({
          type: 'SiteLibrary/siteDisableModel',
          payload: { gongdiUid: r.gongdiUid, gongdiStatus: r.gongdiStatus === 1 ? 0 : 1 },
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

  handleFromCancel = () => {
    this.setState({ porjectVisible: false });
  };
}

export default SiteLibrary;
