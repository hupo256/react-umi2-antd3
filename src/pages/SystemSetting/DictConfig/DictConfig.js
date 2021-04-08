/*
 * @Author: zqm 
 * @Date: 2021-02-17 10:30:18 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-04-08 14:17:27
 * 字典配置
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, Tabs, Table, Input, message, Modal, Tooltip } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DragableBodyRow } from '../common/DragableBodyRow';
import update from 'immutability-helper';
import styles from './DictConfig.less';
import CreateDict from './CreateDict';
import { getauth } from '@/utils/authority';
import { successIcon, waringInfo } from '@/utils/utils';
const { confirm } = Modal;
const { Search } = Input;
const { TabPane } = Tabs;
@connect(({ DictConfig, loading }) => ({
  DictConfig,
  DicModuleLoading: loading.effects['DictConfig/queryDicModuleListModel'],
}))
class DictConfig extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: null,
      activeKeyindex: 0,
      searchWord: null,
      record: null,
      visible: false,
      width: 1980,
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: 'DictConfig/queryDicModuleListModel' }).then(res => {
      if (res && res.code === 200) {
        this.setState({ activeKey: res.data[0].dicModuleCode });
        this.queryList({ dicModuleCode: res.data[0].dicModuleCode, pageNum: 1, pageSize: 100 });
      }
    });
    this.setState({ width: document.body.clientWidth });
  }
  components = {
    body: {
      row: DragableBodyRow,
    },
  };
  render() {
    const { activeKey, visible, searchWord, width } = this.state;
    const {
      DictConfig: { DicQuery, DicModuleList, DicList },
    } = this.props;
    const permissionsBtn = getauth().permissions || [];
    const columns = [
      {
        title: '',
        dataIndex: 'drag',
        width: 60,
        render: (t, r) => {
          return <Icon type="drag" style={{ fontSize: 18 }} />;
        },
      },
      {
        title: '字段名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '扩充描述1',
        dataIndex: 'extDescOne',
        render: text => {
          return (
            <div
              style={{
                width: '100%',
                maxWidth: width < 1400 ? 100 : width < 1650 ? 200 : 300,
                overflow: 'hidden',
              }}
            >
              <div className={styles.remark}>
                <p
                  style={{
                    width: '100%',
                    maxWidth: width < 1400 ? 100 : width < 1650 ? 200 : 300,
                    marginBottom: 0,
                    maxHeight: 42,
                    overflow: 'hidden',
                  }}
                >
                  <Tooltip title={text}>
                    <span className={styles.remarkspan} style={{ WebkitBoxOrient: 'vertical' }}>
                      {text}
                    </span>
                  </Tooltip>
                </p>
              </div>
            </div>
          );
        },
      },
      {
        title: '扩充描述2',
        dataIndex: 'extDescTwo',
        render: text => {
          return (
            <div
              style={{
                width: '100%',
                maxWidth: width < 1400 ? 100 : width < 1650 ? 200 : 300,
                overflow: 'hidden',
              }}
            >
              <div className={styles.remark}>
                <p
                  style={{
                    width: '100%',
                    maxWidth: width < 1400 ? 100 : width < 1650 ? 200 : 300,
                    marginBottom: 0,
                    maxHeight: 42,
                    overflow: 'hidden',
                  }}
                >
                  <Tooltip title={text}>
                    <span className={styles.remarkspan} style={{ WebkitBoxOrient: 'vertical' }}>
                      {text}
                    </span>
                  </Tooltip>
                </p>
              </div>
            </div>
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: t => {
          return t === '1' ? (
            <span>
              <span
                style={{
                  border: '3px solid #5dc829',
                  display: 'inline-block',
                  marginRight: 5,
                  borderRadius: 3,
                  width: 0,
                  height: 0,
                }}
              />
              正常
            </span>
          ) : (
            <span>
              <span
                style={{
                  border: '3px solid #cccccc',
                  display: 'inline-block',
                  marginRight: 5,
                  borderRadius: 3,
                  width: 0,
                  height: 0,
                }}
              />
              停用
            </span>
          );
        },
      },
      {
        title: '更新时间',
        dataIndex: 'operateTime',
        width: 200,
        render: (t, r) => {
          return (
            <div>
              <p style={{ margin: 0 }}>{t}</p>
              <p style={{ margin: 0 }}>{r.operatorName}</p>
            </div>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        width: 140,
        render: (t, r) => {
          return (
            <div className="operateWrap">
              {permissionsBtn.includes('BTN210326000026') && (
                <span className="operateBtn" onClick={() => this.handleEdit(r)}>
                  编辑
                </span>
              )}
              {permissionsBtn.includes('BTN210326000026') &&
                permissionsBtn.includes('BTN210326000027') && <span className="operateLine" />}
              {permissionsBtn.includes('BTN210326000027') && (
                <span className="operateBtn" onClick={() => this.handleChangeStatus(r)}>
                  {r.status === '1' ? '停用' : '启用'}{' '}
                </span>
              )}
            </div>
          );
        },
      },
    ];
    return (
      <div className={styles.dict}>
        <PageHeaderWrapper>
          <Card border="false">
            <div className={styles.dictWrap}>
              <div className={styles.dictLeft}>
                <Tabs
                  tabPosition="left"
                  className={styles.dictTabs}
                  activeKey={activeKey}
                  onChange={activeKey => this.handleChangeTab(activeKey)}
                >
                  {DicModuleList.map(item => {
                    return <TabPane tab={item.name} key={item.dicModuleCode} />;
                  })}
                </Tabs>
              </div>
              <div className={styles.dictRight}>
                <div className={styles.dictHeader}>
                  {permissionsBtn.includes('BTN210326000025') && (
                    <Button type="primary" onClick={() => this.setState({ visible: true })}>
                      <Icon type="plus" />
                      创建字段
                    </Button>
                  )}
                  <Search
                    value={searchWord}
                    placeholder="可通过字段名称 / 扩充描述进行搜索"
                    onChange={e => this.setState({ searchWord: e.target.value })}
                    onSearch={value => this.handleSrarch()}
                    onPressEnter={() => this.handleSrarch()}
                    // onBlur={() => this.handleSrarch()}
                    style={{ width: 500 }}
                  />
                </div>
                {DicQuery.searchWord &&
                  DicQuery.searchWord.length > 0 && (
                    <Table
                      columns={columns}
                      dataSource={DicList.list}
                      onChange={this.handleTableChange}
                      pagination={{
                        pageSize: 100,
                        hideOnSinglePage: true,
                        current: DicList && DicList.curPage,
                        total: DicList && DicList.recordTotal,
                        showTotal: () => `共${DicList && DicList.recordTotal}条`,
                      }}
                    />
                  )}
                {!DicQuery.searchWord && (
                  <DndProvider backend={HTML5Backend}>
                    <Table
                      columns={columns}
                      rowKey={(r, i) => i}
                      dataSource={DicList.list}
                      components={this.components}
                      onRow={(record, index) => {
                        return {
                          index,
                          moveRow: this.moveRow,
                        };
                      }}
                      onChange={this.handleTableChange}
                      pagination={{
                        pageSize: 100,
                        hideOnSinglePage: true,
                        current: DicList && DicList.curPage,
                        total: DicList && DicList.recordTotal,
                        showTotal: () => `共${DicList && DicList.recordTotal}条`,
                      }}
                    />
                  </DndProvider>
                )}
              </div>
            </div>
          </Card>
        </PageHeaderWrapper>
        {visible && (
          <CreateDict
            visible={visible}
            record={this.state.record}
            title={this.state.record ? '编辑字段' : '创建字段'}
            handleOk={value => this.handleCreateOk(value)}
            handleCancel={() => this.handleCancel()}
          />
        )}
      </div>
    );
  }
  // 分页
  handleTableChange = pagination => {
    this.queryList({ pageNum: pagination.current });
  };
  // 搜索
  handleSrarch = () => {
    const { searchWord } = this.state;
    this.queryList({ searchWord: searchWord && searchWord.substring(0, 30), pageNum: 1 });
  };
  // 字段模块切换
  handleChangeTab = activeKey => {
    this.setState({ activeKey, searchWord: null });
    // 重置搜索数据
    const { dispatch } = this.props;
    dispatch({
      type: 'DictConfig/resetModel',
      payload: {
        DicList: {},
        DicQuery: {},
      },
    }).then(res => {
      this.queryList({ dicModuleCode: activeKey, pageNum: 1, pageSize: 100 });
    });
  };
  // 拖拽排序
  moveRow = (dragIndex, hoverIndex) => {
    const {
      dispatch,
      DictConfig: { DicList },
    } = this.props;
    let data = [...DicList.list];
    const dragRow = data[dragIndex];
    const hoverRow = data[hoverIndex];
    const dicUiz = dragRow.uid;
    const targetSeq = hoverRow.seq;
    dispatch({ type: 'DictConfig/sortDicModel', payload: { dicUiz, targetSeq } }).then(res => {
      if (res.code === 200) {
        this.queryList({});
      }
    });
  };

  // 编辑字典
  handleEdit = record => {
    this.setState({ record, visible: true });
  };
  // 新建关闭model
  handleCancel = () => {
    this.setState({ visible: false, record: null });
  };
  // 新建编辑确认
  handleCreateOk = value => {
    const { activeKey, record } = this.state;
    const dicModuleCode = activeKey;
    this.props
      .dispatch({
        type: 'DictConfig/createDicModel',
        payload: { dicModuleCode, ...value, dicUid: (record && record.uid) || null },
      })
      .then(res => {
        if (res.code === 200) {
          message.success(`${record ? '编辑' : '创建'}成功`);
          this.handleCancel();
          this.queryList({});
        }
      });
  };
  // 查询字段列表
  queryList = obj => {
    const {
      dispatch,
      DictConfig: { DicQuery },
    } = this.props;
    dispatch({ type: 'DictConfig/queryDicListModel', payload: { ...DicQuery, ...obj } });
  };
  // 修改字典状态
  handleChangeStatus = r => {
    const status = r.status;
    const {
      DictConfig: { DicModuleList },
      dispatch,
    } = this.props;
    const { activeKey } = this.state;
    const that = this;
    const name = DicModuleList.filter(item => item.dicModuleCode === activeKey)[0].name;
    confirm({
      title: status === '1' ? '确认要停用当前字段吗？' : '确认要启用当前字段吗？',
      content:
        status === '1'
          ? `停用后，无法在案例、工地等功能【${name}】中选择当前字段（已选择不受影响）`
          : `启用后，将可以在案例、工地等功能【${name}】中选择当前字段`,
      icon: status === '2' ? successIcon : waringInfo,
      onOk() {
        dispatch({
          type: 'DictConfig/updateDicStatusModel',
          payload: { dicUid: r.uid, status: status == '1' ? '2' : '1' },
        }).then(res => {
          if (res.code === 200) {
            message.success('状态更改成功');
            that.queryList({});
          }
        });
      },
      onCancel() {},
    });
  };
}

export default DictConfig;
