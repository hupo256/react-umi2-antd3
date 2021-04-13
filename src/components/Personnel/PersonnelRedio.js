/*
 * @Author: zqm 
 * @Date: 2020-03-11 18:11:56 
 * @Last Modified by: zqm
 * @Last Modified time: 2020-03-27 15:54:36
 * 人员单选
 */
import React, { Component } from 'react';
import { Checkbox, Modal, Tree, message, Spin, Input, Icon } from 'antd';
import styles from './Personnel.less';
import { connect } from 'dva';
import { arrReduce } from '@/utils/utils';
const { Search } = Input;
const { TreeNode } = Tree;
@connect(({ Task }) => ({
  Task,
}))
class PersonnelRedio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: true,
      treeDataRight: [], //右侧数据
      treeData: [], //树结构数据
      CheckedRight: false,
      CheckedLeft: false,
      deptData: [], //已选组织数据
      userData: [], //已选用户

      SearchShow: false, //搜索model
      filterData: [], //过滤数据
      searchVal: '', //搜索输入值
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    // const personnelTreeData = sessionStorage.personnelTreeData;
    // // session中存在组织架构数据不用再次请求
    // if (personnelTreeData) {
    //   this.setState({
    //     confirmLoading: false,
    //     treeData: JSON.parse(personnelTreeData),
    //   });
    // } else {
    dispatch({ type: 'Task/ueryDeptAndUser', payload: {} }).then(res => {
      if (res && res.code === 200) {
        let invalidData = [];
        const maps = data => {
          // 初始化数据
          return data.map(item => {
            item.title = item.name;
            item.key = item[this.props.id] + '';
            // item.code = item.zid + '';
            if (item.type === 'dept') {
              item.zid = item.zid + 'zm';
              item.key = item[this.props.id] + 'zm';
            }
            // 筛选无效组织
            item.type === 'dept' && !item.children && invalidData.push(item[this.props.id]);
            if (item.children && item.children.length > 0) {
              item.children = maps(item.children);
            } else {
              item.children = [];
            }
            return item;
          });
        };
        const treeData = maps(res.data);
        // 过滤无效组织架构（组织下无人员）
        function filter(data, id) {
          var newData = data.filter(x => !id.includes(x[this.props.id]));
          newData.forEach(x => x.children && (x.children = filter(x.children, id)));
          return newData;
        }
        this.setState(
          {
            confirmLoading: false,
            // treeData: filter(treeData, invalidData),
            treeData: treeData,
          },
          () => {
            // const { treeData } = this.state;
            // sessionStorage.setItem('personnelTreeData', JSON.stringify(treeData));
          }
        );
      } else {
        this.setState({
          confirmLoading: false,
        });
        message.error(res.message, 3);
      }
    });
    // }
  }
  render() {
    const {
      confirmLoading,
      treeData,
      treeDataRight,
      SearchShow,
      searchVal,
      filterData,
    } = this.state;
    return (
      <Modal
        title="人员选择"
        width={500}
        visible={this.props.visible}
        className={styles.PersonnelModel}
        footer={null}
        onCancel={() => {
          this.setState(
            {
              deptData: [], //已选组织数据
              userData: [],
              treeDataRight: [], //右侧数据
              SearchShow: false,
              searchVal: '',
            },
            () => {
              this.props.handleCancel();
            }
          );
        }}
      >
        <Spin size="large" tip="Loading..." spinning={confirmLoading}>
          <div className={styles.personnelWrop}>
            <div className={styles.treeLeft}>
              <div className={`${styles.treeBorder} ${styles.treeSearch}`}>
                <div className={styles.treeInput}>
                  <Input
                    className={styles.treeInputs}
                    placeholder="搜索人员 / 职位"
                    onClick={this.handleSearchShow}
                    value={searchVal}
                    onChange={e => {
                      this.handleSearch(e.target.value);
                    }}
                  />
                  <Icon type="search" className={styles.treeInputSearch} />
                  {SearchShow && (
                    <Icon
                      type="close-circle"
                      className={styles.treeSearchClose}
                      onClick={this.handleCloseModel}
                    />
                  )}
                </div>
                {this.props.visible && (
                  <Tree showIcon onSelect={this.onSelect}>
                    {generateTree(treeData)}
                  </Tree>
                )}
                {SearchShow && (
                  <div className={styles.leftMask}>
                    {filterData &&
                      filterData.map(item => {
                        return (
                          <div key={index} className={styles.filterItem}>
                            <Checkbox
                              className={styles.checkWrap}
                              checked={item.checked}
                              onChange={e => this.handleChoice(item, e)}
                            >
                              <div className={styles.checkboxs}>
                                <p>{item.name}</p>
                                <p style={{ color: '#ccc', fontSize: '12px' }}>{item.url}</p>
                              </div>
                            </Checkbox>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Spin>
      </Modal>
    );
  }
  //  树选择
  onSelect = (selectedKeys, info) => {
    const { deptData, userData } = this.state;
    let selectedData = info.selectedNodes[0] && info.selectedNodes[0].props.dataRef;
    if (selectedData && selectedData.type === 'user') {
      // 选择的用户
      let datas = [...userData];
      datas.push(selectedData);
      this.setState(
        {
          userData: datas,
          treeDataRight: [...deptData, ...datas],
        },
        () => {
          this.handleSave();
        }
      );
    }
  };

  // 保存
  handleSave = () => {
    const { treeDataRight } = this.state;
    // 去重
    const data = arrReduce(treeDataFilter(treeDataRight), 'id');
    this.props.handleOk(data);
    this.setState({
      deptData: [],
      userData: [],
      treeDataRight: [],
      SearchShow: false,
      searchVal: '',
    });
  };
  // 搜索框显示
  handleSearchShow = () => {
    this.setState({ SearchShow: true });
  };
  // 搜索框关闭
  handleCloseModel = () => {
    this.setState({
      filterData: [], //过滤数据
      searchVal: '',
      SearchShow: false,
    });
  };
  // 搜索
  handleSearch = v => {
    const { treeData } = this.state;
    this.setState({ searchVal: v }, () => {
      const data = this.fuzzyQuery(v, treeData);
      this.setState({
        filterData: data,
      });
    });
  };
  // 模糊查询
  fuzzyQuery = (v, data) => {
    let filterArr = [];
    if (v) {
      const filterData = (v, data) => {
        data.forEach(item => {
          if (item && item.type === 'dept') {
            filterData(v, item.children);
          } else {
            if (item.name.indexOf(v) != -1) {
              filterArr.push(item);
            }
            if (item.url.indexOf(v) != -1) {
              filterArr.push(item);
            }
          }
        });
      };
      filterData(v, data);
    } else {
      filterArr = [];
    }

    return filterArr;
  };
  // 查询选择
  handleChoice = item => {
    const { deptData, userData } = this.state;
    // 选择的用户
    let datas = [...userData];
    datas.push(item);
    this.setState(
      {
        userData: datas,
        treeDataRight: [...deptData, ...datas],
      },
      () => {
        this.handleSave();
      }
    );
  };
}

// 展开部门数据
const treeDataFilter = treeData => {
  let datarights = [];
  const treeDataRightFilter = treeData => {
    treeData.forEach(item => {
      if (item.type === 'dept' && item.children) {
        treeDataRightFilter(item.children);
      } else if (item.type === 'user') {
        datarights.push({ id: item.key, name: item.name });
      }
    });
  };
  treeDataRightFilter(treeData);
  return datarights;
};

// 渲染树结构
const generateTree = (treeNodes = []) => {
  return treeNodes.map(item => (
    <TreeNode
      icon={
        item.type === 'dept' && <Icon type="folder" style={{ color: '#aee4f9' }} theme="filled" />
      }
      title={item.title}
      key={item.key}
      dataRef={item}
    >
      {generateTree(item.children)}
    </TreeNode>
  ));
};

export default PersonnelRedio;
