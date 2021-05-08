/*
 * @Author: zqm 
 * @Date: 2021-04-29 17:47:52 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-05-08 18:01:24
 * 公有文章库列表
 */
import React, { Component } from 'react';
import { Modal, Table, Input, Icon, Button } from 'antd';
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

      previewVisible: true,
    };
  }
  componentWillMount() {}

  componentDidMount() {
    this.getList({ pageNum: 1, articleStatus: 0 });
  }

  render() {
    const { previewVisible } = this.state;

    const columns = [
      {
        title: '文章标题',
        dataIndex: 'articleTitle',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        render: (t, r) => {
          return <span style={{ color: '#fe6a30', cursor: 'pointer' }}>预览</span>;
        },
      },
    ];
    const {
      Loading,
      ArticleLibrary: { publicList },
    } = this.props;
    console.log('====================================');
    console.log(publicList);
    console.log('====================================');
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
            onChange={e => this.setState({ searchWord: e.target.value })}
            onSearch={value => this.handleSrarch()}
            onPressEnter={() => this.handleSrarch()}
            // onBlur={() => this.handleSrarch()}
            style={{ width: 300 }}
          />
          <p style={{ marginTop: 16 }}>
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
          <Table
            loading={Loading}
            dataSource={publicList?.list}
            columns={columns}
            scroll={{ y: 400 }}
          />
        </div>
        {previewVisible && (
          <ArticlePreviewModel
            visible={previewVisible}
            handleCancel={() => this.setState({ previewVisible: false })}
          />
        )}
      </Modal>
    );
  }
  handleOk = () => {
    this.props.handleOk();
  };

  handleSrarchStatus = status => {
    this.setState({ status }, () => {
      // this.getList({ articleStatus: status, pageNum: 1 });
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
