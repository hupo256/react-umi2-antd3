/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:50:21 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-18 14:25:44
 * 文章库
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, Divider, Table, Input, message, Modal ,Tabs} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { paginations, fixedTitle, successIcon, waringInfo } from '@/utils/utils';
import styles from './ArticleLibrary.less';
const { confirm } = Modal;
const { Search } = Input;
const { TabPane } = Tabs;

@connect(({ DictConfig,DesignerLibrary, loading }) => ({
  DesignerLibrary,DictConfig,
  Loading: loading.effects['DesignerLibrary/queryDesignerListModel'],
}))
class ArticleLibrary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchWord: null,
      status: null,
      step: null,
      dictionaries:[]
    };
  }

  componentDidMount() {
    this.getList({ pageNum: 1 });
    // 获取字典数据 queryDicModel
    const { dispatch } = this.props;
    dispatch({
      type: 'DictConfig/queryDicModel',
      payload: { dicModuleCodes: 'DM006' },
    }).then(res => {
      if (res && res.code === 200) {
        const dictionaries = res.data['DM006'].filter(item => item.status !== '2');
        this.setState({ dictionaries,step: dictionaries[0].code});
      }
    });
  }
  render() {
    const {
      Loading,
      DesignerLibrary: { DesignerList },
    } = this.props;

    const columns = [
     
      {
        title: '文章标题',
        dataIndex: 'name',
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
              <span
                className="operateBtn"
                onClick={() =>
                  router.push(`/portal/contentmanagement/designerlibrary/edit?uid=${r.uid}`)
                }
              >
                编辑
              </span>
              <span className="operateLine" />
              <span className="operateBtn" onClick={() => this.handleChangeStatus(r)}>
                {r.status === '1' ? '停用' : '启用'}{' '}
              </span>
            </div>
          );
        },
      },
    ];
    const { status,step,dictionaries } = this.state;
    return (
      <div>
      <div
          className={styles.caseTab}
          style={{ paddingLeft: sessionStorage.collapsed == 'false' ? '256px' : '110px' }}
        >
          <Tabs
            style={{ marginTop: 20, marginBottom: '-6px' }}
            activeKey={step}
            onChange={key => this.callback(key)}
          >
          {dictionaries.map(item => {
              return (
                <TabPane tab={item.name} key={item.code} />
              );
          })}
          </Tabs>
        </div>
        <PageHeaderWrapper fixedTitle={fixedTitle()}>
        <Card bordered={false} style={{ marginTop: 108 }}>
            <Search
              placeholder="可通过文章标题 / 内容进行搜索"
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
            <Button
              type="primary"
              onClick={() => {
                router.push(`/portal/contentmanagement/articlelibrary/add`);
              }}
            >
              <Icon type="plus" />
              创建文章
            </Button>
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
        </PageHeaderWrapper>
      </div>
    );
  }
  callback = step => {
    this.setState({ step });
  };

  handleSrarchStatus = status => {
    this.setState({ status }, () => {
      this.getList({ status });
    });
  };
  handleSrarch = () => {
    const { searchWord } = this.state;
    this.getList({ searchWord });
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
          if (res.code === 200) {
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

export default ArticleLibrary;
