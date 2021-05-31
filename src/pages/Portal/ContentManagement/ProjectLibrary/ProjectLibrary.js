/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:51:19 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-05-31 17:41:52
 * 专题库
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, Input, message, Table, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { paginations, successIcon, waringInfo, errorIcon } from '@/utils/utils';
import styles from './index.less';
import { getauth } from '@/utils/authority';
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
      searchWord: '',
    };
  }

  componentDidMount() {
    this.getList();
  }
  render() {
    const permissionsBtn = getauth();
    return (
      <div>
        <PageHeaderWrapper>
          <Card bordered={false}>{this.renderSearch()}</Card>
          <Card bordered={false} style={{ marginTop: 16 }}>
            {permissionsBtn.permissions.includes('BTN210326000044') ? (
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
                  dispatch({
                    type: 'ProjectLibrary/saveDataModel',
                    payload: {
                      key: 'collocationDetail',
                      value: {},
                    },
                  });
                  router.push('/portal/contentmanagement/ProjectLibrary/add?type=1');
                }}
              >
                创建专题
              </Button>
            ) : (
              ''
            )}
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
    let value = [''];
    if (fromData.specialStatus && fromData.specialStatus !== '') {
      value = [fromData.specialStatus];
    }

    return (
      <div className={styles.wrap}>
        <Search
          onSearch={() => this.thSearch()}
          placeholder={'可通过专题标题/专题链接进行搜索'}
          className={styles.ser}
          onChange={e => this.setState({ searchWord: e.target.value })}
          defaultValue={fromData.searchText}
          onPressEnter={() => {
            this.thSearch();
          }}
          // onBlur={() => {
          //   this.thSearch();
          // }}
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
        width: 300,
        render: (t, r) => {
          return (
            <div style={{ display: 'flex' }}>
              <img
                src={
                  r.specialCoverImg ||
                  'https://test.img.inbase.in-deco.com/crm_saas/dev/20210409/7178b96d368c444a93c444a10e438a2a/imgAefault.png'
                }
                style={{
                  width: 100,
                  height: 70,
                  marginRight: 12,
                  objectFit: 'cover',
                }}
              />
              <div style={{ flex: 1 }}>
                <p>{t}</p>
                {r.specialHasApplets === 1 ? (
                  <span className={`${styles.siteTag} ${styles.siteTag1}`}>小程序</span>
                ) : null}
                {r.specialHasPc === 1 ? (
                  <span className={`${styles.siteTag} ${styles.siteTag1}`}>网站</span>
                ) : null}
              </div>
            </div>
          );
        },
      },
      {
        title: '小程序链接',
        dataIndex: 'specialUrl',
        width: 250,
        render: (t, r) => {
          return (
            <div
              className={styles.copy}
              onClick={() => {
                this.handleCopy(t);
              }}
            >
              <p id="text">{t}</p>
              <textarea id="input" className={styles.ipt} />
              {t ? (
                <div>
                  <Icon type="copy" />
                  <span style={{ marginLeft: 5 }}>复制链接</span>
                </div>
              ) : (
                ''
              )}
            </div>
          );
        },
      },
      {
        title: 'PC端链接',
        dataIndex: 'specialUrlPc',
        width: 250,
        render: (t, r) => {
          return (
            <div
              className={styles.copy}
              onClick={() => {
                this.handleCopy(t, 'inputv');
              }}
            >
              <p id="text">{t}</p>
              <textarea id="inputv" className={styles.ipt} />
              {t ? (
                <div>
                  <Icon type="copy" />
                  <span style={{ marginLeft: 5 }}>复制链接</span>
                </div>
              ) : (
                ''
              )}
            </div>
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'specialStatus',
        with: 100,
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
        with: 100,
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
        with: 200,
        render: (t, r) => {
          const permissionsBtn = getauth();
          return (
            <div className="operateWrap">
              {permissionsBtn.permissions.includes('BTN210326000045') ? (
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
                    router.push(
                      `/portal/contentmanagement/ProjectLibrary/edit?uid=${r.specialUid}`
                    );
                  }}
                >
                  编辑
                </span>
              ) : null}
              {permissionsBtn.permissions.includes('BTN210326000045') &&
                permissionsBtn.permissions.includes('BTN210326000046') &&
                r.specialStatus !== 0 && <span className="operateLine" />}
              {permissionsBtn.permissions.includes('BTN210326000046') && r.specialStatus !== 0 ? (
                <span>
                  <span className="operateBtn" onClick={() => this.handleToggleStatus(r)}>
                    {r.specialStatus === 0 || r.specialStatus === 2 ? '启用' : '停用'}
                  </span>
                </span>
              ) : null}
              {permissionsBtn.permissions.includes('BTN210326000046') &&
                permissionsBtn.permissions.includes('BTN210326000047') &&
                r.specialStatus === 0 && <span className="operateLine" />}
              {permissionsBtn.permissions.includes('BTN210326000047') && r.specialStatus === 0 ? (
                <span>
                  <span className="operateBtn" onClick={() => this.handleDelete(r)}>
                    删除
                  </span>
                </span>
              ) : null}
              {permissionsBtn.permissions.includes('BTN210326000047') &&
                r.specialStatus === 0 &&
                permissionsBtn.permissions.includes('MU90000001000100040001') && (
                  <span className="operateLine" />
                )}
              {permissionsBtn.permissions.includes('MU90000001000100040001') &&
              r.specialStatus === 0 ? (
                <span>
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
                </span>
              ) : null}
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
    fromData.pageNum = 1;
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
      title: status + '' == '1' ? '确认要停用当前专题吗？' : '确认要启用当前专题吗？',
      content:
        status + '' == '1' ? '停用后，将无法看到当前专题界面' : '启用后，将可以查看到当前专题界面',
      icon: status == '1' ? waringInfo : successIcon,
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
  thSearch() {
    const {
      dispatch,
      ProjectLibrary: { fromData },
    } = this.props;
    const { searchWord } = this.state;
    fromData.searchText = (searchWord && searchWord.substring(0, 30)) || '';
    fromData.pageNum = 1;
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
  handleCopy(t, id) {
    let input = document.getElementById(id);
    input.value = t; // 修改文本框的内容
    input.select(); // 选中文本
    document.execCommand('copy'); // 执行浏览器复制命令
    message.success('复制成功');
  }
}

export default ProjectLibrary;
