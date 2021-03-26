/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:47:49 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-26 17:12:00
 * 案例库
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, Divider, Table, Input, message, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { paginations, getUrl, successIcon, waringInfo } from '@/utils/utils';
import styles from './CaseLibrary.less';
import { getauth } from "@/utils/authority";
const { confirm } = Modal;
const { Search } = Input;

@connect(({ CaseLibrary, loading }) => ({
  CaseLibrary,
  Loading: loading.effects['CaseLibrary/queryDesignerListModel'],
}))
class CaseLibrary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchWord: null,
      status: null,
    };
  }

  componentDidMount() {
    this.getList({ pageNum: 1 });
  }

  render() {
    const {
      Loading,
      CaseLibrary: { CaseList },
    } = this.props;
    const permissionsBtn = getauth().permissions||[];
    const columns = [
      {
        title: '案例',
        dataIndex: 'title',
        render: (t, r) => {
          return (
            <div style={{ display: 'flex' }}>
              <img
                src={r.coverPicUrl}
                style={{
                  width: 100,
                  height: 70,
                  marginRight: 12,
                  objectFit: 'cover',
                }}
              />
              <div style={{ flex: 1 }}>
                <p>{t}</p>
                <p>
                  {(r.bedroom && (
                    <span className={`${styles.siteTag} ${styles.siteTag1}`}>
                      {r.bedroom && `${r.bedroom}居室 `}
                    </span>
                  )) ||
                    null}
                  {(r.acreage && (
                    <span className={`${styles.siteTag} ${styles.siteTag2}`}>
                      {r.acreage}
                      m²
                    </span>
                  )) ||
                    null}
                  {(r.decorationCost && (
                    <span className={`${styles.siteTag} ${styles.siteTag3}`}>
                      {r.decorationCost}万
                    </span>
                  )) ||
                    null}
                  {r.styleDic && (
                    <span className={`${styles.siteTag} ${styles.siteTag4}`}>
                      {r.styleDic.name}
                    </span>
                  )}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        title: '设计师',
        dataIndex: 'designerName',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (t, r) => {
          return (
            <span style={{ position: 'relative', paddingLeft: 20 }}>
              <span
                style={{
                  fontSize: 48,
                  position: 'absolute',
                  left: 0,
                  top: -20,
                  lineHeight: 1,
                  color: t === '1' ? '#52c41a' : '#bfbfbf',
                }}
              >
                ·
              </span>
              {t === '1' ? '正常' : '停用'}
            </span>
          );
        },
      },
      {
        title: '更新时间',
        dataIndex: 'operateTime',
        render: (t, r) => {
          return (
            <div>
              <p style={{ marginBottom: 0 }}>{t}</p>
              <p style={{ marginBottom: 0 }}>{r.operatorName}</p>
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
              {permissionsBtn.includes('BTN210324000012')&&<span
                className="operateBtn"
                onClick={() => {
                  router.push(`/portal/contentmanagement/caselibrary/edit?uid=${r.uid}`);
                }}
              >
                编辑
              </span>}
              {permissionsBtn.includes('BTN210324000012')&&permissionsBtn.includes('BTN210324000013')&&<span className="operateLine" />}
              {permissionsBtn.includes('BTN210324000013')&&<span className="operateBtn" onClick={() => this.handleChangeStatus(r)}>
                {r.status === '1' ? '停用' : '启用'}{' '}
              </span>}
            </div>
          );
        },
      },
    ];
    const { status } = this.state;
    return (
      <div>
        <PageHeaderWrapper>
          <Card bordered={false}>
            <Search
              placeholder="可通过案例标题进行搜索"
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
                className={`tagstatus ${!status && 'tagstatusCur'}`}
              >
                全部
              </span>
              <span
                onClick={() => this.handleSrarchStatus('1')}
                className={`tagstatus ${status == '1' && 'tagstatusCur'}`}
              >
                正常
              </span>
              <span
                onClick={() => this.handleSrarchStatus('2')}
                className={`tagstatus ${status == '2' && 'tagstatusCur'}`}
              >
                停用
              </span>
            </p>
          </Card>
          <Card bordered={false} style={{ marginTop: 20 }}>
          {permissionsBtn.includes('BTN210324000011')&&<Button
              type="primary"
              onClick={() => {
                this.props.dispatch({
                  type: 'CaseLibrary/resetDataModel',
                  payload: { caseRes: {}, stepOne: {}, stepTwo: {} },
                });
                router.push(`/portal/contentmanagement/caselibrary/add`);
              }}
            >
              <Icon type="plus" />
              创建案例
            </Button>}
            <Table
              loading={Loading}
              style={{ marginTop: 20 }}
              rowKey={record => record.uid}
              dataSource={CaseList.list}
              columns={columns}
              onChange={this.handleTableChange}
              pagination={(CaseList && paginations(CaseList)) || false}
            />
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
  handleSrarchStatus = status => {
    this.setState({ status }, () => {
      this.getList({ status ,pageNum:1});
    });
  };
  handleSrarch = () => {
    const { searchWord } = this.state;
    this.getList({ searchWord ,pageNum:1});
  };

  // 分页
  handleTableChange = pagination => {
    this.getList({ pageNum: pagination.current, pageSize: pagination.pageSize });
  };
  getList = obj => {
    const {
      dispatch,
      CaseLibrary: { CaseListQuery },
    } = this.props;
    dispatch({
      type: 'CaseLibrary/queryCaseListModel',
      payload: { ...CaseListQuery, ...obj },
    });
  };
  // 切换状态
  handleChangeStatus = r => {
    const status = r.status;
    const { dispatch } = this.props;
    const that = this;
    confirm({
      title: status === '1' ? '确认要停用当前案例吗？' : '确认要启用当前案例吗？',
      content:
        status === '1'
          ? '停用后，将无法在案例模块和设计师模块显示当前案例！'
          : '启用后，将会在案例模块和设计师模块显示当前案例！',
      icon: status === '2' ? successIcon : waringInfo,
      onOk() {
        dispatch({
          type: 'CaseLibrary/updateCaseStatusModel',
          payload: { uid: r.uid, status: r.status === '1' ? '2' : '1' },
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
}

export default CaseLibrary;
