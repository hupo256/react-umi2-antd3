import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, Tabs, Table, Input, Modal, Tag } from 'antd';
import styles from './RelateNode.less';
import RelateNodeModal from './RelateNodeModal';
import { getauth } from '@/utils/authority';
const { TabPane } = Tabs;
@connect(({ DictConfig, loading, SiteLibrary }) => ({
  DictConfig,
  SiteLibrary,
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
      dataSource: [],
    };
  }

  componentDidMount() {
    const {
      DictConfig: { dicData },
      SiteLibrary: { engineeringMapData },
      type,
      dispatch,
    } = this.props;

    if (type === 'add') {
      if (dicData && dicData['DM001']) {
        const result = dicData['DM001'].find((item, index) => {
          return item.status === '1';
        });
        if (result) {
          this.setState({ activeKey: result.code });
        }
        dispatch({
          type: 'SiteLibrary/initEngineeringMapModel',
          payload: {
            baseData: dicData['DM001'],
          },
        }).then(e => console.log(e));
      } else {
        dispatch({
          type: 'DictConfig/queryDicModel',
          payload: { dicModuleCodes: 'DM001,DM002,DM007' },
        }).then(res => {
          if (res && res.code === 200) {
            const result = res.data['DM001'].find(item => {
              return item.status === '1';
            });
            if (result) {
              this.setState({ activeKey: result.code });
            }
            dispatch({
              type: 'SiteLibrary/initEngineeringMapModel',
              payload: {
                baseData: res.data['DM001'],
              },
            }).then(e => console.log(e));
          }
        });
      }
    } else if (type === 'edit') {
      dispatch({
        type: 'DictConfig/queryDicModel',
        payload: { dicModuleCodes: 'DM001' },
      }).then(res => {
        if (res && res.code === 200) {
          const result = res.data['DM001'].find(item => {
            return item.status === '1';
          });
          const r = engineeringMapData.find(item => {
            return item.dicCode === result.code;
          });
          console.log(r);
          if (result) {
            this.setState({ activeKey: result.code, dataSource: r.taskNodes });
          }
        }
      });
    }

    this.setState({ width: document.body.clientWidth });
  }
  render() {
    const { activeKey, visible, dataSource } = this.state;
    const {
      DictConfig: { dicData },
      projectUid,
    } = this.props;
    const permissionsBtn = getauth().permissions || [];
    const columns = [
      {
        title: '工程节点名称',
        dataIndex: 'taskName',
        width: 300,
        render: (t, r) => {
          return (
            <div className="operateWrap">
              {t}
              &nbsp;&nbsp;&nbsp;
              {r.isEffective === '0' && <Tag color="volcano">已失效</Tag>}
            </div>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        width: 140,
        align: 'center',
        render: (t, record) => {
          return (
            <div className="operateWrap">
              <span className="operateBtn" onClick={() => this.handleDelete(record)}>
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
                      return <TabPane tab={item.name} key={item.code} />;
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
                dataSource={dataSource}
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
            dicCode={activeKey}
            selectedNodes={dataSource}
            type={+this.state.activeKey}
            handleOk={value => this.handleOk(value)}
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

  // 左侧阶段切换
  handleChangeTab = activeKey => {
    const {
      DictConfig: { dicData },
      SiteLibrary: { engineeringMapData },
      type,
    } = this.props;
    // 重置搜索数据
    const result = dicData['DM001'].find(item => {
      return item.code === activeKey;
    });
    const r = engineeringMapData.find(item => item.dicCode === result.code);
    this.setState({ activeKey, dataSource: r.taskNodes });
  };
  // 移除
  handleDelete = record => {
    const {
      SiteLibrary: { engineeringMapData },
      dispatch,
    } = this.props;
    const { activeKey, dataSource } = this.state;
    const selectedTreeNodes = [];
    dataSource.map(e => {
      if (record.code !== e.code) {
        selectedTreeNodes.push(e);
      }
    });
    dispatch({
      type: 'SiteLibrary/setEngineeringMapModel',
      payload: {
        selectedTreeNodes,
        dicCode: activeKey,
        engineeringMapData,
      },
    }).then(r => {
      this.updateDataSource(r);
    });
  };
  // 新建关闭model
  handleCancel = () => {
    this.setState({ visible: false });
  };
  // 新建
  handleOk = engineeringMapData => {
    this.handleCancel();
    this.updateDataSource(engineeringMapData);
  };
  updateDataSource = engineeringMapData => {
    const { activeKey } = this.state;
    const r = engineeringMapData.find(item => {
      return item.dicCode === activeKey;
    });
    console.log(r);
    this.setState({ dataSource: r.taskNodes });
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
