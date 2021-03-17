/*
 * @Author: zqm 
 * @Date: 2021-02-17 10:30:18 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-16 14:44:28
 * 字典配置
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, Tabs, Table, Input, message, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DragableBodyRow } from '../common/DragableBodyRow';
import update from 'immutability-helper';
import styles from './DictConfig.less';
import CreateDict from './CreateDict';
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
      searchWord: null,
      record: null,
      visible: false,
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: 'DictConfig/queryDicModuleListModel' }).then(res => {
      if (res && res.code === 200) {
        this.setState({ activeKey: res.data[0].dicModuleCode });
        this.queryList({ dicModuleCode: res.data[0].dicModuleCode, pageNum: 1, pageSize: 100 });
      }
    });
  }
  components = {
    body: {
      row: DragableBodyRow,
    },
  };
  render() {
    const { activeKey, visible, searchWord } = this.state;
    const {
      DictConfig: { DicModuleList, DicList },
    } = this.props;
    const columns = [
      {
        title: '',
        dataIndex: 'drag',
        width:60,
        render:(t,r)=>{
          return <Icon type="drag" style={{fontSize:18}} />
        }
      },
      {
        title: '字段名称',
        dataIndex: 'name',
      },
      {
        title: '扩充描述1',
        dataIndex: 'extDescOne',
        render: text => {
          return <div style={{ maxWidth: 300, overflow: 'hidden' }}>{text || '/'}</div>;
        },
      },
      {
        title: '扩充描述2',
        dataIndex: 'extDescTwo',
        render: text => {
          return <div style={{ maxWidth: 300, overflow: 'hidden' }}>{text || '/'}</div>;
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: t => {
          return t === '1' ? '启用' : '停用';
        },
      },
      {
        title: '更新时间',
        dataIndex: 'operateTime',
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
        render: (t, r) => {
          return (
            <div className="operateWrap">
              <span className="operateBtn" onClick={() => this.handleEdit(r)}>
                编辑
              </span>
              <span className="operateLine" />
              <span className="operateBtn" onClick={() => this.handleChangeStatus(r)}>
                {r.status === '1' ? '停用' : '启用'}{' '}
              </span>
            </div>
          );
        },
      },
    ];

    console.log(successIcon);
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
                  <Button type="primary" onClick={() => this.setState({ visible: true })}>
                    <Icon type="plus" />
                    创建字段
                  </Button>
                  <Search
                    value={searchWord}
                    placeholder="可通过字段名称 / 扩充描述进行搜索"
                    onChange={e => this.setState({ searchWord: e.target.value })}
                    onSearch={value => this.handleSrarch()}
                    onPressEnter={() => this.handleSrarch()}
                    onBlur={() => this.handleSrarch()}
                    style={{ width: 500 }}
                  />
                </div>
                <DndProvider backend={HTML5Backend}>
                  <Table
                    columns={columns}
                    dataSource={DicList.list}
                    components={this.components}
                    onRow={(record, index) => {
                      return {
                        index,
                        moveRow: this.moveRow,
                      };
                    }}
                    pagination={{
                      pageSize: 100,
                      hideOnSinglePage: true,
                      current: DicList && DicList.curPage,
                      total: DicList && DicList.recordTotal,
                      showTotal: () => `共${DicList && DicList.recordTotal}条`,
                    }}
                  />
                </DndProvider>
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
  // 搜索
  handleSrarch = () => {
    const { searchWord } = this.state;
    this.queryList({ searchWord });
  };
  // 字段模块切换
  handleChangeTab = activeKey => {
    this.setState({ activeKey });
    // 重置搜索数据
    const { dispatch } = this.props;
    // resetModel
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
    const { dispatch } = this.props;
    const that = this;
    confirm({
      title: status === '1' ? '确认要停用当前字段吗？' : '确认要启用当前字段吗？',
      content:
        status === '1'
          ? '无法在案例、工地等功能【$字典名称】中选择当前字段（已选择不受影响）'
          : '启用后，将可以在案例、工地等功能【字典名称】中选择当前字段',
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
      onCancel() {
        console.log('Cancel');
      },
    });
  };
}

export default DictConfig;
