/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:50:21 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-06-02 21:54:41
 * 文章库
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, Divider, Table, Input, message, Modal, Tabs } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ArticleListModel from './ArticleListModel';
import { paginations, fixedTitle, successIcon, waringInfo, MyIcon } from '@/utils/utils';
import imgl from '../../../../assets/banner_left@2x.png';
import imgr from '../../../../assets/banner_right@2x.png';
import imgtj from '../../../../assets/tj.png';
import ic_smile from '../../../../assets/ic_smile.png';
import ic_arm from '../../../../assets/ic_arm.png';
import styles from './ArticleLibrary.less';
import { getauth } from '@/utils/authority';
import Applets from '../components/Applets';
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
          step:
            ArticleListQuery.articleDicCode ||
            (dictionaries.length > 0 ? dictionaries[0].code : null),
        });
        this.getList({
          articleDicCode:
            ArticleListQuery.articleDicCode ||
            (dictionaries.length > 0 ? dictionaries[0].code : null),
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
    const permissionsBtn = getauth().permissions || [];
    const isCompanyAuthWechatMini = JSON.parse(localStorage.getItem('isCompanyAuthWechatMini'));

    const columns = [
      {
        title: '文章标题',
        dataIndex: 'articleTitle',
      },
      {
        title: '文章链接',
        dataIndex: 'link',
        render: (t, r) => {
          const txt = `page/ArticleDetail/ArticleDetail?id=${r.articleUid}`;
          return (
            <div className={styles.copy}>
              <p id="text" style={{ display: 'block' }}>
                {txt}
              </p>
              <textarea id="input" className={styles.ipt} />
              {txt ? (
                <span
                  style={{ marginLeft: 0 }}
                  onClick={() => {
                    this.handleCopy(txt);
                  }}
                >
                  <Icon type="copy" />
                  <span style={{ marginLeft: 5 }}>复制链接</span>
                </span>
              ) : (
                ''
              )}
            </div>
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'articleStatus',
        width: 100,
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
        width: 260,
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
        width: 260,
        render: (t, r) => {
          return (
            <div className="operateWrap">
              {permissionsBtn.includes('BTN210602000009') && (
                <span className="operateBtn" onClick={() => this.handleEdit(r)}>
                  编辑
                </span>
              )}
              {permissionsBtn.includes('BTN210602000009') &&
                permissionsBtn.includes('BTN210602000010') && <span className="operateLine" />}
              {permissionsBtn.includes('BTN210602000010') && (
                <span className="operateBtn" onClick={() => this.handleChangeStatus(r)}>
                  {r.articleStatus + '' === '1' ? '停用' : '启用'}{' '}
                </span>
              )}
              {permissionsBtn.includes('BTN210623000005') &&  r.articleStatus === 1 && 
              isCompanyAuthWechatMini &&
              <span className="operateLine" />}
              {permissionsBtn.includes('BTN210623000005') && 
              r.articleStatus === 1 && 
              isCompanyAuthWechatMini &&
              <span className="operateBtn" onClick={() => this.getWechatCode(r)}>
                 小程序码
              </span>}
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
              onChange={e => this.handleChanges(e)}
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
            {permissionsBtn.includes('BTN210602000008') && (
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
            )}
            <Table
              loading={Loading}
              style={{ marginTop: 20 }}
              rowKey={(r, i) => i}
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
          width={730}
        >
          <div className={styles.CreateMode}>
            <div className={styles.createItem}>
              <img src={imgl} style={{ width: 312, height: 157 }} />
              <img src={imgtj} className={styles.imgtj} />
              <p className={styles.subTitle}>公有文章库</p>
              <p className={styles.subText}>
                海量文章库，选完直接用
                {'  '}
                <img src={ic_arm} style={{ width: 17, height: 18 }} />
              </p>
              <p
                onClick={() => this.setState({ ArticleListVisible: true })}
                className={styles.directuse}
              >
                直接使用
              </p>
            </div>
            <div className={styles.createItem}>
              <img src={imgr} style={{ width: 312, height: 157 }} />
              <p className={styles.subTitle}>原创文章库</p>
              <p className={styles.subText}>
                喜欢自己原创，满满干货
                {'  '}
                <img src={ic_smile} style={{ width: 18, height: 18 }} />
              </p>
              <p
                onClick={() => {
                  const { step } = this.state;
                  router.push(`/portal/contentmanagement/articlelibrary/add?step=${step}`);
                }}
                className={styles.original}
              >
                自己原创
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
        <Applets />
      </div>
    );
  }

   // 获取小程序码
   getWechatCode = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ContentManage/getAppletsCode',
      payload: {
        qrCodePage: 'article',
        uid: record.articleUid
      }
    })
  }
  handleChanges = e => {
    this.setState({ searchWord: e.target.value }, () => {
      const { searchWord } = this.state;
      !searchWord && this.getList({ searchText: null, pageNum: 1 });
    });
  };
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
    this.handleArticleCancel();
    const { step } = this.state;
    router.push(`/portal/contentmanagement/articlelibrary/add?step=${step}&uid=${uid}`);
  };
  handleArticleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ArticleLibrary/resetPublicModel',
      payload: {},
    });
    this.setState({ ArticleListVisible: false });
  };

  handleCopy(t) {
    let input = document.getElementById('input');
    input.value = t; // 修改文本框的内容
    input.select(); // 选中文本
    document.execCommand('copy'); // 执行浏览器复制命令
    message.success('复制成功');
  }
}

export default ArticleLibrary;
