import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, Tabs, Table, Input, Modal } from 'antd';
import styles from './RelateNode.less';
import RelateNodeModal from './RelateNodeModal';
import { getauth } from '@/utils/authority';
const { TabPane } = Tabs;
@connect(({ DictConfig, loading }) => ({
  DictConfig,
  DicModuleLoading: loading.effects['Advertising/queryDicModuleListModel'],
}))
class Advertising extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '',
      companyName: '',
      record: null,
      visible: false,
      width: 1980,
    };
  }

  componentDidMount() {
    const {
      DictConfig: { dicData },
      type,
    } = this.props;
    if (type === 'add') {
      if (dicData && dicData['DM001']) {
        const result = dicData['DM001'].find((item, index) => {
          return item.status === '1';
        });
        if (result) {
          this.setState({ activeKey: result.uid });
        }
      }
    }

    // this.props
    //   .dispatch({
    //     type: "operate/queryPositionModel",
    //     payload: {
    //       companyName: "",
    //       type: 1, //1装修广告位 2:材料广告位
    //     },
    //   })
    //   .then((res) => {
    //     if (res && res.code === 200) {
    //     }
    //   });
    this.setState({ width: document.body.clientWidth });
  }
  render() {
    const { activeKey, visible } = this.state;
    const {
      DictConfig: { dicData },
      projectUid
    } = this.props;
    const permissionsBtn = getauth().permissions || [];
    const columns = [
      {
        title: '工程节点名称',
        dataIndex: 'companyName',
        width: 200,
      },
      {
        title: '操作',
        dataIndex: 'operate',
        width: 140,
        render: (t, record) => {
          return (
            <div className="operateWrap">
              <span className="operateBtn" onClick={() => {}}>
                移除
              </span>
            </div>
          );
        },
      },
    ];
    return (
      <div className={styles.dict}>
        <Card bordered={false}>
          <div className={styles.dictWrap}>
            <div className={styles.dictLeft}>
              <Tabs
                tabPosition="left"
                className={styles.dictTabs}
                activeKey={activeKey}
                onChange={activeKey => this.handleChangeTab(activeKey)}
              >
                {dicData &&
                  dicData['DM001'] &&
                  dicData['DM001'].map((item, index) => {
                    if (item.status === '1') {
                      return <TabPane tab={item.name} key={item.uid} />;
                    } else {
                      return null;
                    }
                  })}
              </Tabs>
            </div>
            <div className={styles.dictRight}>
              <div className={styles.dictHeader}>
                <Button type="primary" onClick={() => this.setState({ visible: true })}>
                  <Icon type="link" />
                  关联工程节点
                </Button>
              </div>
              <Table
                columns={columns}
                dataSource={[]}
                onChange={this.handleTableChange}
                pagination={false}
              />
            </div>
          </div>
        </Card>
        {visible && (
          <RelateNodeModal
            visible={visible}
            title="关联工程节点"
            projectUid={projectUid}
            type={+this.state.activeKey}
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
    this.queryList({
      searchWord: searchWord && searchWord.substring(0, 30),
      pageNum: 1,
    });
  };
  // 字段模块切换
  handleChangeTab = activeKey => {
    this.setState({ activeKey, searchWord: null });
    // 重置搜索数据
    const { dispatch } = this.props;
    // dispatch({
    //   type: "Advertising/resetModel",
    //   payload: {
    //     DicList: {},
    //     DicQuery: {},
    //   },
    // }).then((res) => {
    this.queryList({ type: +activeKey, pageNum: 1, pageSize: 10 });
    // });
  };
  // 拖拽排序
  moveRow = (dragIndex, hoverIndex) => {
    const {
      dispatch,
      operate: { positionListData },
    } = this.props;
    let data = [...positionListData];
    const dragRow = data[dragIndex];
    const hoverRow = data[hoverIndex];
    const uid = dragRow.uid;
    const targetSeq = hoverRow.seq;
    dispatch({
      type: 'operate/moveShopBusinessModel',
      payload: { uid, targetSeq },
    }).then(res => {
      if (res && res.code === 200) {
        this.queryList({});
      }
    });
  };
  handleDeleteShop = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'operate/deleteShopBusinessModel',
      payload: {
        uid: e.uid,
      },
    }).then(r => {
      if (r && r.code === 200) {
        this.queryList();
      }
    });
  };
  // 编辑字典
  handleEdit = record => {
    this.setState({ record, visible: true });
  };
  // 新建关闭model
  handleCancel = () => {
    this.setState({ visible: false });
  };
  // 新建
  handleCreateOk = value => {
    this.handleCancel();
    this.queryList({});
  };
  // 查询字段列表
  queryList = obj => {
    const { activeKey, companyName } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'operate/queryPositionModel',
      payload: {
        companyName,
        type: +activeKey,
        ...obj,
      },
    });
  };
}

export default Advertising;
