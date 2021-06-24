/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:49:12 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-04-08 11:17:23
 * 设计师库
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, Divider, Table, Input, message, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { paginations, getUrl, successIcon, waringInfo } from '@/utils/utils';
import styles from './DesignerLibrary.less';
import { getauth } from '@/utils/authority';
import Applets from '../components/Applets';
const { confirm } = Modal;
const { Search } = Input;

@connect(({ DesignerLibrary, loading }) => ({
  DesignerLibrary,
  Loading: loading.effects['DesignerLibrary/queryDesignerListModel'],
}))
class DesignerLibrary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchWord: null,
      status: null,
    };
  }

  componentDidMount() {
    const {
      DesignerLibrary: { DesignerListQuery },
    } = this.props;
    this.setState({
      searchWord: DesignerListQuery.searchWord,
      status: DesignerListQuery.status,
    });
    this.getList({ pageNum: 1, ...DesignerListQuery });
  }

  render() {
    const {
      Loading,
      DesignerLibrary: { DesignerList },
    } = this.props;
    const permissionsBtn = getauth().permissions || [];
    const columns = [
      {
        title: '设计师',
        dataIndex: 'name',
        render: (t, r) => {
          return (
            <div>
              <span>{r.headPicUrl && <img className={styles.headPic} src={r.headPicUrl} />}</span>
              <span>{t}</span>
            </div>
          );
        },
      },
      {
        title: '职级',
        dataIndex: 'position',
      },
      {
        title: '擅长风格',
        dataIndex: 'styles',
        width: 125,
        render: (t, r) => {
          return t.map((item, i) => {
            return (
              <span key={item.uid}>
                {item.name}
                {t.length - 1 == i ? '' : ','}
              </span>
            );
          });
        },
      },
      {
        title: '从业年限',
        dataIndex: 'workingTime',
      },
      {
        title: '案例数',
        dataIndex: 'caseNum',
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
              {permissionsBtn.includes('BTN210326000042') && (
                <span
                  className="operateBtn"
                  onClick={() =>
                    router.push(`/portal/contentmanagement/designerlibrary/edit?uid=${r.uid}`)
                  }
                  style={{ padding: '6px 0 6px 10px' }}
                >
                  编辑
                </span>
              )}
              {permissionsBtn.includes('BTN210326000042') &&
                permissionsBtn.includes('BTN210326000043') && <span className="operateLine" />}
              {permissionsBtn.includes('BTN210326000043') && (
                <span className="operateBtn" onClick={() => this.handleChangeStatus(r)}>
                  {r.status === '1' ? '停用' : '启用'}{' '}
                </span>
              )}
              {permissionsBtn.includes('BTN210623000004') && r.status === '1' && <span className="operateLine" />}
              {permissionsBtn.includes('BTN210623000004') && r.status === '1' && <span className="operateBtn" onClick={() => this.getWechatCode(r)}>
                 小程序码
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
              placeholder="可通过设计师姓名 / 联系电话进行搜索"
              value={this.state.searchWord}
              onChange={e => this.setState({ searchWord: e.target.value })}
              onSearch={value => this.handleSrarch()}
              onPressEnter={() => this.handleSrarch()}
              // onBlur={() => this.handleSrarch()}
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
            {permissionsBtn.includes('BTN210326000041') && (
              <Button
                type="primary"
                onClick={() => {
                  router.push(`/portal/contentmanagement/designerlibrary/add`);
                }}
              >
                <Icon type="plus" />
                创建设计师
              </Button>
            )}
            <Table
              loading={Loading}
              style={{ marginTop: 20 }}
              rowKey={record => record.uid}
              dataSource={DesignerList.list}
              columns={columns}
              onChange={this.handleTableChange}
              pagination={(DesignerList && paginations(DesignerList)) || false}
            />
          </Card>
          <Applets />
        </PageHeaderWrapper>
      </div>
    );
  }

    // 获取小程序码
    getWechatCode = record => {
      const { dispatch } = this.props;
      dispatch({
        type: 'ContentManage/getAppletsCode',
        payload: {
          qrCodePage: 'designer',
          uid: record.uid
        }
      })
    }

  handleSrarchStatus = status => {
    this.setState({ status }, () => {
      this.getList({ status, pageNum: 1 });
    });
  };
  handleSrarch = () => {
    const { searchWord } = this.state;
    this.getList({ searchWord: (searchWord && searchWord.substring(0, 30)) || '', pageNum: 1 });
  };
  // 修改设计师状态
  handleChangeStatus = r => {
    const status = r.status;
    const { dispatch } = this.props;
    const that = this;

    confirm({
      title: status === '1' ? '确认要停用当前设计师吗？' : '确认要启用当前设计师吗？',
      content:
        status === '1'
          ? '停用后，将无法在设计师模块显示当前设计师，也无法在创建案例时选择当前设计师！'
          : '启用后，将在设计师模块显示当前设计师，也可以在创建案例时选择当前设计师！',
      icon: status === '2' ? successIcon : waringInfo,
      onOk() {
        dispatch({
          type: 'DesignerLibrary/updateStatusModel',
          payload: { uid: r.uid, status: r.status == '1' ? '2' : '1' },
        }).then(res => {
          if (res && res.code === 200) {
            message.success(`${r.status == '1' ? '停用' : '启用'}成功`);
            that.getList({});
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  // 分页
  handleTableChange = pagination => {
    this.getList({ pageNum: pagination.current, pageSize: pagination.pageSize });
  };
  getList = obj => {
    const {
      dispatch,
      DesignerLibrary: { DesignerListQuery },
    } = this.props;
    dispatch({
      type: 'DesignerLibrary/queryDesignerListModel',
      payload: { ...DesignerListQuery, ...obj },
    });
  };
}

export default DesignerLibrary;
