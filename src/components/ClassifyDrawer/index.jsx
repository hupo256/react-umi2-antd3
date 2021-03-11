// 公共弹层下拉选择
/**
  visible： 控制弹层显示隐藏
  title：  弹层标题
  tabledata：弹层表格数据
  columns：弹层表格表头
  loading：弹层表格loding
  btnClick:  搜索不到数据的添加数据方法
  keyChange： 输入框搜索变化
  keyValue：  输入框绑定参数
  handleTableChange：弹层表格翻页
  onSelectChange： 弹层表格选中
  selectedRowKeys： 弹层表格默认选中项
 */
import React, { Component } from 'react';
import { Drawer, Button, Table, Row, Col, Form, Input, message } from 'antd';
import { PropTypes } from 'prop-types';
import styles from './index.less';
export default class ClassifyDrawer extends Component {
  onClose = () => {
    this.props.close(false);
  };
  render() {
    const {
      visible,
      title,
      tabledata,
      loading,
      btnClick,
      keyChange,
      keyValue,
      handleTableChange,
      onSelectChange,
      selectedRowKeys,
    } = this.props;
    const rowSelection = {
      selectedRowKeys,
      type: 'radio',
      onChange: onSelectChange,
    };
    let columnsg = [
      {
        title: '名称',
        dataIndex: 'project_name',
      },
    ];

    return (
      <Drawer
        width="550"
        title={title}
        placement="right"
        closable={true}
        onClose={this.onClose}
        visible={visible}
        zIndex={10000}
      >
        <Row className={styles.labelRow}>
          <span className={styles.labelName}> 项目名称:</span>
          <Input
            placeholder="请输入关键字"
            autoFocus
            className={styles.inputClass}
            value={keyValue}
            onChange={keyChange}
          />
          <Button type="primary" className={styles.addBtn} onClick={btnClick}>
            查询
          </Button>
        </Row>
        <Table
          dataSource={tabledata.list}
          columns={columnsg}
          rowSelection={rowSelection}
          rowKey={record => record.uid}
          loading={loading}
          pagination={{
            pageSize: 10,
            hideOnSinglePage: true,
            current: tabledata.curPage,
            total: tabledata.recordTotal,
          }}
          onChange={handleTableChange}
        />
      </Drawer>
    );
  }
}
