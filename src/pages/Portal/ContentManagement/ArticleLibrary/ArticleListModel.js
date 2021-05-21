/*
 * @Author: zqm 
 * @Date: 2021-04-29 17:47:52 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-05-20 15:14:29
 * 公有文章库列表
 */
import React, { Component } from 'react';
import { Modal, Table, Input, Radio, Button } from 'antd';
import { connect } from 'dva';
import ArticlePreviewModel from './ArticlePreviewModel';
const { Search } = Input;

@connect(({ ArticleLibrary, loading }) => ({
  ArticleLibrary,
  Loading: loading.effects['ArticleLibrary/getPublicListModel'],
}))
class ArticleListModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchWord: null,
      uid: null,
      previewVisible: false,
      status: null,
    };
  }
  componentWillMount() {}

  componentDidMount() {
    this.getList({ pageNum: 1, articleStatus: 0 });
    // 获取公有文章栏目
    // queryDicModuleList
    const { dispatch } = this.props;
    dispatch({ type: 'ArticleLibrary/queryDicModuleList', payload: { dicModuleCodes: 'DM006' } });
  }

  render() {
    const { previewVisible, status } = this.state;

    const columns = [
      {
        title: '',
        dataIndex: 'radio',
        width: 50,
        render: (t, r) => {
          return <Radio checked={r.articleUid === this.state.uid} />;
        },
      },
      {
        title: '文章标题',
        dataIndex: 'articleTitle',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        width: 160,
      },
      {
        title: '操作',
        dataIndex: 'operate',
        width: 80,
        render: (t, r) => {
          return (
            <span
              style={{ color: '#fe6a30', cursor: 'pointer' }}
              onClick={e => {
                e.stopPropagation();
                this.setState({ record: r }, () => {
                  this.setState({ previewVisible: true });
                });
              }}
            >
              预览
            </span>
          );
        },
      },
    ];
    const {
      Loading,
      ArticleLibrary: { publicList, DicModuleList },
    } = this.props;
    return (
      <Modal
        title="公有文章库"
        visible={this.props.visible}
        onOk={() => this.handleOk()}
        onCancel={() => this.props.handleCancel()}
        width={600}
      >
        <div style={{ minHeight: 500 }}>
          <Search
            placeholder="可通过文章标题 / 内容进行搜索"
            value={this.state.searchWord}
            onChange={e => this.handleChange(e)}
            onSearch={value => this.handleSrarch()}
            onPressEnter={() => this.handleSrarch()}
            // onBlur={() => this.handleSrarch()}
            style={{ width: 300 }}
          />
          <div style={{ marginTop: 16 }}>
            状态：
            <span
              onClick={() => this.handleSrarchStatus(null)}
              className={`tagstatus ${!status && 'tagstatusCur'}`}
              style={{ display: 'inline-block', marginBottom: 12 }}
            >
              全部
            </span>
            {DicModuleList.map(item => {
              return (
                <span
                  onClick={() => this.handleSrarchStatus(item.code)}
                  className={`tagstatus ${status == item.code && 'tagstatusCur'}`}
                  style={{ display: 'inline-block', marginBottom: 12 }}
                >
                  {item.name}
                </span>
              );
            })}
          </div>
          <Table
            rowKey={(r, i) => i}
            loading={Loading}
            dataSource={publicList?.list}
            columns={columns}
            scroll={{ y: 400 }}
            onChange={this.handleTableChange}
            pagination={{
              pageSize: 10,
              hideOnSinglePage: true,
              // size: 'small',
              current: publicList && publicList.curPage,
              total: publicList && publicList.recordTotal,
            }}
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ uid: record.articleUid });
                }, // 点击行
              };
            }}
          />
        </div>
        {previewVisible && (
          <ArticlePreviewModel
            visible={previewVisible}
            record={this.state.record}
            handleUseArticle={uid => {
              this.props.handleOk(uid);
              // this.setState({ uid, previewVisible: false })
            }}
            handleCancel={() => this.setState({ previewVisible: false })}
          />
        )}
      </Modal>
    );
  }
  handleTableChange = pagination => {
    this.getList({ pageNum: pagination.current });
  };
  handleChange = e => {
    this.setState({ searchWord: e.target.value }, () => {
      const { searchWord } = this.state;
      !searchWord &&
        this.getList({ searchText: searchWord && searchWord.substring(0, 30), pageNum: 1 });
    });
  };
  handleOk = () => {
    const { uid } = this.state;
    if (!uid) {
      message.warning('请选择公有文章');
    } else {
      this.props.handleOk(uid);
    }
  };

  handleSrarchStatus = statu => {
    this.setState({ status: statu }, () => {
      this.getList({ articleDicCode: statu, pageNum: 1 });
    });
  };
  handleSrarch = () => {
    const { searchWord } = this.state;
    this.getList({ searchText: searchWord && searchWord.substring(0, 30), pageNum: 1 });
  };
  getList = obj => {
    const {
      dispatch,
      ArticleLibrary: { publicListQuery },
    } = this.props;
    dispatch({
      type: 'ArticleLibrary/getPublicListModel',
      payload: { ...publicListQuery, ...obj },
    });
  };
}

export default ArticleListModel;
