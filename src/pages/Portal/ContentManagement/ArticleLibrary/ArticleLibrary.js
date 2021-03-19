/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:50:21 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-19 11:40:13
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

@connect(({ DictConfig,ArticleLibrary, loading }) => ({
  ArticleLibrary,DictConfig,
  Loading: loading.effects['ArticleLibrary/getArticleListModel'],
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
    // 获取字典数据 queryDicModel
    const { dispatch } = this.props;
    dispatch({
      type: 'DictConfig/queryDicModel',
      payload: { dicModuleCodes: 'DM006' },
    }).then(res => {
      if (res && res.code === 200) {
        const dictionaries = res.data['DM006'].filter(item => item.status !== '2');
        this.setState({ dictionaries,step: dictionaries[0].code});
        this.getList({ articleDicCode:dictionaries[0].code ,pageNum: 1 });
      }
    });
  }
  render() {
    const {
      Loading,
      ArticleLibrary: { ArticleList },
    } = this.props;

    const columns = [
     
      {
        title: '文章标题',
        dataIndex: 'articleTitle',
      },
      {
        title: '状态',
        dataIndex: 'articleStatus',
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
                  color: t +''=== '1' ? '#52c41a' : '#bfbfbf',
                }}
              >
                ·
              </span>
              {t+'' === '1' ? '正常' : '停用'}
            </span>
          );
        },
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
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
                  router.push(`/portal/contentmanagement/articlelibrary/edit?uid=${r.articleUid}`)
                }
              >
                编辑
              </span>
              <span className="operateLine" />
              <span className="operateBtn" onClick={() => this.handleChangeStatus(r)}>
                {r.articleStatus+'' === '1' ? '停用' : '启用'}{' '}
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
              dataSource={ArticleList.list}
              columns={columns}
              onChange={this.handleTableChange}
              pagination={(ArticleList && paginations(ArticleList)) || false}
            />
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
  callback = step => {
    this.setState({ step }, () => {
      this.getList({ articleDicCode:step ,pageNum:1});
    });
  };

  handleSrarchStatus = status => {
    this.setState({ status }, () => {
      this.getList({ articleStatus:status ,pageNum:1});
    });
  };
  handleSrarch = () => {
    const { searchWord } = this.state;
    this.getList({searchText: searchWord,pageNum:1 });
  };

  // 修改设计师状态
  handleChangeStatus = r => {
    const articleStatus = r.articleStatus+'';
    const { dispatch } = this.props;
    const that = this;

    confirm({
      title: articleStatus === '1' ? '确认要停用当前文章吗？' : '确认要启用当前文章吗？',
      content:
        articleStatus === '1'
          ? '停用后，将无法在文章模块显示当前文章！'
          : '启用后，将在文章模块显示当前文章！',
      icon: articleStatus !== '1' ? successIcon : waringInfo,
      onOk() {
        dispatch({
          type: 'ArticleLibrary/updateStatusModel',
          payload: { articleUid: r.articleUid, articleStatus: r.articleStatus == '1' ? '0' : '1' },
        }).then(res => {
          if (res.code === 200) {
            message.success(`${r.articleStatus == '1' ? '停用' : '启用'}成功`);
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
    const {step}=this.state
    const {
      dispatch,
      ArticleLibrary: { ArticleListQuery },
    } = this.props;
    dispatch({
      type: 'ArticleLibrary/getArticleListModel',
      payload: { ...ArticleListQuery, ...obj },
    });
  };
}

export default ArticleLibrary;
