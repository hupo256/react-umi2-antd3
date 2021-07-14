/*
 * @Author: zqm
 * @Date: 2021-02-23 09:52:19
 * @Last Modified by: zqm
 * @Last Modified time: 2021-02-24 18:36:21
 * 从已有工地选择
 */
import React, { Component } from 'react';
import { Modal, Button, Table, ConfigProvider, Empty, Input, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import empty from '../../../../assets/empty.png';
import styles from './SiteLibrary.less';

@connect(({ SiteLibrary, loading }) => ({
  SiteLibrary,
  Loading: loading.effects['SiteLibrary/queryFromProjectModel'],
}))
class FromProjectModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVal: '',
      projectUids: []
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'SiteLibrary/queryProjectUidsModel',
    }).then(e => {
      if (e && e.code === 200) {
        this.setState({projectUids: e.data.projectUids}, () => {
          this.loadQuery({ pageNum: 1 });
        })
      }
    });

  }

  render() {
    const columns = [
      {
        title: '工地',
        dataIndex: 'projectName',
      },
      {
        title: '工地信息',
        dataIndex: 'detail',
        render: (t, r) => {
          return (
            <div>
              <p style={{ margin: 0 }}>{r.addr}</p>
              {r.buildingArea && (
                <p>
                  <span className={`${styles.siteTag} ${styles.siteTag2}`}>
                    {r.buildingArea}
                    m²
                  </span>
                </p>
              )}
            </div>
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'statusName',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
      },
    ];
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({ selectedRowKeys, selectedRows });
      },
      getCheckboxProps: (record) => {
        return {
          disabled: record.isSelected === 1,
        };
      }
    };
    const {
      Loading,
      SiteLibrary: { FromProjectList },
    } = this.props;
    const { searchText } = this.state;
    const customizeRenderEmpty = () => {
      return (
        <Empty
          image={empty}
          imageStyle={{
            height: 80,
          }}
          description={<span>{!this.state.inputVal ? '暂无项目' : '未查询到项目'}</span>}
        />
      );
    };
    return (
      <Modal
        title="从已有工地选择"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={() => this.props.handleCancel()}
        width={780}
        maskClosable={false}
      >
        <Input.Search
          onChange={e => {
            this.setState({ searchText: e.target.value }, () => {
              if (this.state.searchText === '') {
                this.loadQuery({ searchText: '' });
              }
            });
          }}
          onBlur={() => this.loadQuery({ searchText })}
          onPressEnter={() => this.loadQuery({ searchText })}
          value={searchText}
          placeholder="可通过工地标题 / 业主姓名 / 联系电话进行搜索"
          style={{
            width: 410,
            float: 'right',
            marginTop: -10,
            marginBottom: 13,
            zIndex: 2,
          }}
        />
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={FromProjectList && FromProjectList.list}
            loading={Loading}
            pagination={{
              pageSize: 10,
              hideOnSinglePage: true,
              current: FromProjectList && FromProjectList.curPage,
              total: FromProjectList && FromProjectList.recordTotal,
            }}
            scroll={{ y: 430 }}
            onChange={this.handleTableChange}
          />
        </ConfigProvider>
      </Modal>
    );
  }
  // 分页
  handleTableChange = pagination => {
    this.loadQuery({ pageNum: pagination.current, pageSize: pagination.pageSize });
  };
  loadQuery = obj => {
    const { searchText, projectUids } = this.state;
    const {
      dispatch,
      SiteLibrary: { FromProjectQuery },
    } = this.props;
    dispatch({
      type: 'SiteLibrary/queryProjectOtherSysModel',
      payload: { ...FromProjectQuery, ...obj, searchText, projectUids },
    });
  };

  handleOk = () => {
    const { selectedRowKeys, selectedRows } = this.state;
    console.log(selectedRows);
    console.log(selectedRowKeys);
    if (!selectedRowKeys) {
      message.warning('请先选择项目');
    } else {
      const { dispatch } = this.props;
      dispatch({
        type: 'SiteLibrary/setSiteDetailModel',
        payload: { ...selectedRows[0] },
      }).then(res => {
        router.push(`/portal/contentmanagement/sitelibrary/add?isMap=${selectedRows[0].isMap}&projectUid=${selectedRows[0].uid}`);
      });
    }
  };
}

export default FromProjectModel;
