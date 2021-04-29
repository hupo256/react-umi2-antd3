/*
 * @Author: zqm 
 * @Date: 2021-04-29 17:47:52 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-04-29 18:07:31
 * 公有文章库列表
 */
import React, { Component } from 'react';
import { Modal, Table } from 'antd';

class ArticleListModel extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {}

  componentDidMount() {}

  render() {
    const dataSource = [
      {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号',
      },
    ];

    const columns = [
      {
        title: '文章标题',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '更新时间',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '操作',
        dataIndex: 'address',
        render: (t, r) => {
          return <span style={{ color: '#fe6a30', cursor: 'pointer' }}>预览</span>;
        },
      },
    ];
    return (
      <Modal
        title="公有文章库"
        visible={this.props.visible}
        onOk={() => this.handleOk()}
        onCancel={() => this.props.handleCancel()}
        width={600}
      >
        <div style={{ minHeight: 400 }}>
          <Table dataSource={dataSource} columns={columns} scroll={{ y: 400 }} />;
        </div>
      </Modal>
    );
  }
  handleOk = () => {
    this.props.handleOk();
  };
}

ArticleListModel.propTypes = {};

export default ArticleListModel;
