// 公共弹层下拉选择
/**
  visible： 控制弹层显示隐藏
  title：  弹层标题
  tabledata：弹层表格数据
  columns：弹层表格表头
  loading：弹层表格loding
  handleTableChange：弹层表格翻页
  selectedRowKeys： 弹层表格默认选中项
  onRowChange 选中
  onDrawerReset  重置
  onDrawerSearch 搜索
  单选侧推窗
 */
import React, { Component } from 'react';
import { Drawer, Table, Button, Row, Col, Input } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
@connect(({ ContractModel, customerManagement }) => ({ ContractModel, customerManagement }))
export default class ClassifyDrawerRadio extends Component {
  state = {
    inputVal: '',
  };
  onClose = () => {
    this.props.close(false);
  };
  ongetCheckboxProps = record => {
    return {
      disabled: false,
    };
  };
  render() {
    const {
      visible,
      title,
      tabledata,
      columns,
      loading,
      handleTableChange,
      selectedRowKeys,
      onDrawerSearch,
      onRowChange,
      rowKey,
      width,
      onSubmit,
      AddButton,
      onAddClick,
    } = this.props;
    const { inputVal } = this.state;
    const rowSelection = {
      selectedRowKeys,
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        onRowChange(selectedRows[0]);
      },
      getCheckboxProps: this.ongetCheckboxProps,
    };
    return (
      <Drawer
        width={width}
        zIndex={9995}
        title={title}
        placement="right"
        closable={true}
        onClose={() => {
          this.setState({ inputVal: '' }, () => this.onClose());
        }}
        visible={visible}
      >
        <Row className={styles.labelRow}>
          <Col span={12}>
            <Input
              placeholder="请输入"
              autoFocus
              className={styles.inputClass}
              value={inputVal}
              onChange={this.inputChange}
            />
          </Col>
          <Col span={12}>
            <Button
              onClick={() => {
                this.setState({ inputVal: '' }, () => onDrawerSearch(''));
              }}
              style={{ marginLeft: 16 }}
            >
              重置
            </Button>
            {AddButton && <Button type="link" onClick={onAddClick}> + 添加楼宇 </Button>}
          </Col>
        </Row>
        <Table
          dataSource={tabledata ? tabledata.list || [] : []}
          columns={columns}
          rowSelection={rowSelection}
          rowKey={(r, i) => i}
          loading={loading}
          onRow={record => {
            return {
              onClick: () => {
                this.props.onRowChange ? this.props.onRowChange(record) : null;
              },
            };
          }}
          pagination={{
            pageSize: 10,
            hideOnSinglePage: true,
            current: tabledata && tabledata.curPage,
            total: tabledata && tabledata.recordTotal,
          }}
          onChange={pagination => handleTableChange(pagination, inputVal)}
        />
        {_.isFunction(onSubmit) && (
          <footer style={{ marginTop: 30 }}>
            <Button type="primary" style={{ marginRight: 12 }} onClick={() => onSubmit()}>
              确定
            </Button>
            <Button
              onClick={() => {
                this.setState({ inputVal: '' }, () => this.onClose());
              }}
            >
              取消
            </Button>
          </footer>
        )}
      </Drawer>
    );
  }
  inputChange = e => {
    this.props.onDrawerSearch(e.target.value);
    this.setState({ inputVal: e.target.value });
  };
}
