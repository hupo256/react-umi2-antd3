/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:50:21 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-05-10 17:12:53
 * 文章库
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, Divider, Table, Input, message, Modal, Tabs } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ArticleListModel from './ArticleListModel';
import { paginations, fixedTitle, successIcon, waringInfo, MyIcon } from '@/utils/utils';
import styles from './ArticleLibrary.less';
const { confirm } = Modal;
const { Search } = Input;
const { TabPane } = Tabs;

@connect(({ DictConfig, ArticleLibrary, loading }) => ({
  ArticleLibrary,
  DictConfig,
  Loading: loading.effects['ArticleLibrary/getArticleListModel'],
}))
class ArticleLibrary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchWord: null,
      status: null,
      step: null,
      dictionaries: [],

      CreateModeVisible: false,
      ArticleListVisible: false,
    };
  }

  componentDidMount() {
    // 获取字典数据 queryDicModel
    const {
      dispatch,
      ArticleLibrary: { ArticleListQuery },
    } = this.props;
    if (ArticleListQuery) {
      this.setState({
        searchWord: ArticleListQuery.searchText || null,
        status: ArticleListQuery.articleStatus || null,
      });
    }
    dispatch({
      type: 'DictConfig/queryDicModel',
      payload: { dicModuleCodes: 'DM006' },
    }).then(res => {
      if (res && res.code === 200) {
        const dictionaries = res.data['DM006'].filter(item => item.status !== '2');
        this.setState({
          dictionaries,
          step: ArticleListQuery.articleDicCode || dictionaries[0].code,
        });
        this.getList({
          articleDicCode: ArticleListQuery.articleDicCode || dictionaries[0].code,
          ...ArticleListQuery,
          // pageNum: 1,
        });
      }
    });
  }
  render() {
    const {
      Loading,
      ArticleLibrary: { ArticleList, ArticleListQuery },
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
                  color: t + '' === '1' ? '#52c41a' : '#bfbfbf',
                }}
              >
                ·
              </span>
              {t + '' === '1' ? '正常' : '停用'}
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
              <span className="operateBtn" onClick={() => this.handleEdit(r)}>
                编辑
              </span>
              <span className="operateLine" />
              <span className="operateBtn" onClick={() => this.handleChangeStatus(r)}>
                {r.articleStatus + '' === '1' ? '停用' : '启用'}{' '}
              </span>
            </div>
          );
        },
      },
    ];
    const { status, step, dictionaries, ArticleListVisible } = this.state;
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
              return <TabPane tab={item.name} key={item.code} />;
            })}
          </Tabs>
        </div>
        <PageHeaderWrapper fixedTitle={fixedTitle()}>
          <Card bordered={false} style={{ marginTop: 108 }} className={styles.search}>
            <Search
              placeholder="可通过文章标题 / 内容进行搜索"
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
                onClick={() => this.handleSrarchStatus('0')}
                className={`tagstatus ${status == '0' && 'tagstatusCur'}`}
              >
                停用
              </span>
            </p>
          </Card>

          <Card bordered={false} style={{ marginTop: 20 }}>
            <Button
              type="primary"
              onClick={
                () => this.handleAddArticle()
                //   {
                //   const { step } = this.state;
                //   router.push(`/portal/contentmanagement/articlelibrary/add?step=${step}`);
                // }
              }
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

        <Modal
          title="选择创建方式"
          visible={this.state.CreateModeVisible}
          onCancel={this.handleCancel}
          footer={null}
          width={600}
        >
          <div className={styles.CreateMode}>
            <div onClick={() => this.setState({ ArticleListVisible: true })}>
              <div className={styles.createImg} />
              <p>公有文章库</p>
              <p>
                海量文章库，选完直接用
                {'  '}
                <MyIcon type="icon-jiayouaoligei" />
              </p>
              <span className={styles.recommend}>推荐</span>
            </div>
            <div
              onClick={() => {
                const { step } = this.state;
                router.push(`/portal/contentmanagement/articlelibrary/add?step=${step}`);
              }}
            >
              <div className={styles.createImg} />
              <p>去原创文章</p>
              <p>
                喜欢自己原创，满满干活
                {'  '}
                <MyIcon type="icon-xiaolian" style={{ color: '#f4b058' }} />
              </p>
            </div>
          </div>
        </Modal>
        {ArticleListVisible && (
          <ArticleListModel
            handleCancel={() => this.handleArticleCancel()}
            handleOk={uid => this.handleArticleOk(uid)}
            visible={ArticleListVisible}
          />
        )}
      </div>
    );
  }
  handleEdit = r => {
    router.push(`/portal/contentmanagement/articlelibrary/edit?uid=${r.articleUid}`);
  };
  callback = step => {
    this.setState({ step, status: null, searchWord: null }, () => {
      this.getList({ articleDicCode: step, articleStatus: null, searchText: null, pageNum: 1 });
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });
  };

  handleSrarchStatus = status => {
    this.setState({ status }, () => {
      this.getList({ articleStatus: status, pageNum: 1 });
    });
  };
  handleSrarch = () => {
    const { searchWord } = this.state;
    this.getList({ searchText: searchWord && searchWord.substring(0, 30), pageNum: 1 });
  };

  // 修改设计师状态
  handleChangeStatus = r => {
    const articleStatus = r.articleStatus + '';
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
    const { step } = this.state;
    const {
      dispatch,
      ArticleLibrary: { ArticleListQuery },
    } = this.props;
    dispatch({
      type: 'ArticleLibrary/getArticleListModel',
      payload: { ...ArticleListQuery, ...obj },
    });
  };
  // 新建文章
  handleAddArticle = () => {
    this.setState({ CreateModeVisible: true });
  };
  handleCancel = () => {
    this.setState({ CreateModeVisible: false });
  };

  handleArticleOk = uid => {
    this.setState({ CreateModeVisible: false });
    const { step } = this.state;
    router.push(`/portal/contentmanagement/articlelibrary/add?step=${step}&uid=${uid}`);
  };
  handleArticleCancel = () => {
    this.setState({ ArticleListVisible: false });
  };
}

export default ArticleLibrary;
